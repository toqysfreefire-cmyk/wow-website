import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isVercel = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
const LOCAL_DATA_FILE = path.join(__dirname, 'data.json');
const DATA_FILE = isVercel ? path.join('/tmp', 'data.json') : LOCAL_DATA_FILE;

// Default initial state
const defaultData = {
  settings: {
    bKashNumber: '01956541650',
    minDeposit: 50,
    maxDeposit: 10000,
    minWithdraw: 50,
    maxWithdraw: 5000,
    maintenanceMode: false,
    noticeBanner: 'ডিপোজিট জমা দেওয়ার কিছুক্ষনের মধ্যেই স্বয়ংক্রিয়ভাবে আপানার এক্যাউন্টে ব্যালান্স যোগ হবে।',
    telegramUrl: 'https://t.me/your_channel',
    whatsappUrl: 'https://wa.me/8801727400370'
  },
  users: [
    {
      id: 'usr_admin',
      name: 'TGS Admin',
      email: 'tgsgaming2024@gmail.com',
      phone: 'tgsgaming2024@gmail.com',
      role: 'admin',
      password: 'toqy+ariyan+arif2026tour',
      balance: 10000,
      ign: 'TGS_ADMIN',
      uid: '100200300',
      createdAt: new Date().toISOString()
    }
  ],
  tournaments: [],
  registrations: [],
  deposits: [],
  withdrawals: [],
  transactions: [],
  tickets: []
};

class DB {
  constructor() {
    this.init();
  }

  init() {
    try {
      if (fs.existsSync(DATA_FILE)) {
        const raw = fs.readFileSync(DATA_FILE, 'utf-8');
        this.data = JSON.parse(raw);
        return;
      }
      if (isVercel && fs.existsSync(LOCAL_DATA_FILE)) {
        const raw = fs.readFileSync(LOCAL_DATA_FILE, 'utf-8');
        this.data = JSON.parse(raw);
        this.save();
        return;
      }
      this.data = defaultData;
      this.save();
    } catch (err) {
      console.error('Error in DB init, falling back to defaultData:', err);
      this.data = defaultData;
      this.save();
    }
  }

  save() {
    try {
      const dir = path.dirname(DATA_FILE);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(DATA_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Error saving data.json:', err.message);
    }
  }

  getSettings() {
    return this.data.settings;
  }

  updateSettings(newSettings) {
    this.data.settings = { ...this.data.settings, ...newSettings };
    this.save();
    return this.data.settings;
  }

  getUsers() {
    return this.data.users;
  }

  getUserById(id) {
    return this.data.users.find(u => u.id === id);
  }

  getUserByPhoneOrEmail(identifier) {
    return this.data.users.find(u => u.phone === identifier || u.email === identifier);
  }

  createUser(userData) {
    const newUser = {
      id: 'usr_' + Date.now(),
      balance: 0,
      role: 'user',
      createdAt: new Date().toISOString(),
      ...userData
    };
    this.data.users.push(newUser);
    this.save();
    return newUser;
  }

  updateUser(id, updates) {
    const index = this.data.users.findIndex(u => u.id === id);
    if (index !== -1) {
      this.data.users[index] = { ...this.data.users[index], ...updates };
      this.save();
      return this.data.users[index];
    }
    return null;
  }

  adjustBalance(userId, amount, description, type = 'adjustment') {
    const user = this.getUserById(userId);
    if (!user) return null;

    user.balance = Math.max(0, user.balance + amount);
    this.save();

    // Create transaction log
    const tx = {
      id: 'tx_' + Date.now() + Math.random().toString(36).substring(2, 5),
      userId,
      type,
      amount,
      description,
      status: 'approved',
      createdAt: new Date().toISOString()
    };
    this.data.transactions.unshift(tx);
    this.save();

    return user;
  }

  getTournaments() {
    return this.data.tournaments;
  }

  getTournamentByIdOrSlug(identifier) {
    return this.data.tournaments.find(t => t.id === identifier || t.slug === identifier);
  }

  createTournament(data) {
    const slug = (data.title || 'tournament')
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '') + '-' + Math.floor(Math.random() * 1000);

    const newT = {
      id: 'tourn_' + Date.now(),
      slug,
      slotsFilled: 0,
      status: 'open',
      banner: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',
      roomId: '',
      roomPassword: '',
      prizeBreakdown: data.prizeBreakdown || [],
      rules: data.rules || ['সময় মত রুমে যোগ দিন।', 'আনফেয়ার গেমপ্লে নিষিদ্ধ।'],
      createdAt: new Date().toISOString(),
      ...data
    };
    this.data.tournaments.unshift(newT);
    this.save();
    return newT;
  }

  updateTournament(id, updates) {
    const index = this.data.tournaments.findIndex(t => t.id === id);
    if (index !== -1) {
      this.data.tournaments[index] = { ...this.data.tournaments[index], ...updates };
      this.save();
      return this.data.tournaments[index];
    }
    return null;
  }

  deleteTournament(id) {
    const index = this.data.tournaments.findIndex(t => t.id === id);
    if (index === -1) return null;

    const tournament = this.data.tournaments[index];
    const tournamentIdentifiers = [id, tournament.id, tournament.slug];
    const registrations = this.data.registrations.filter(registration => tournamentIdentifiers.includes(registration.tournamentId));
    if (tournament.status !== 'completed') {
      registrations.forEach(registration => {
        if (registration.status !== 'rejected' && registration.feePaid > 0) {
          this.updateRegistrationStatus(registration.id, 'rejected', 'টুর্নামেন্ট মুছে ফেলা হয়েছে');
        }
      });
    }

    this.data.registrations = this.data.registrations.filter(registration => !tournamentIdentifiers.includes(registration.tournamentId));
    this.data.tournaments.splice(index, 1);
    this.save();
    return tournament;
  }

  getRegistrations(filters = {}) {
    let list = this.data.registrations;
    if (filters.userId) list = list.filter(r => r.userId === filters.userId);
    if (filters.tournamentId) list = list.filter(r => r.tournamentId === filters.tournamentId);
    return list;
  }

  createRegistration(regData) {
    const newReg = {
      id: 'reg_' + Date.now(),
      status: 'approved',
      createdAt: new Date().toISOString(),
      ...regData
    };
    this.data.registrations.unshift(newReg);
    
    // Update filled slots
    const tournament = this.getTournamentByIdOrSlug(regData.tournamentId);
    if (tournament) {
      tournament.slotsFilled = Math.min(tournament.slotsTotal, tournament.slotsFilled + 1);
    }
    
    this.save();
    return newReg;
  }

  updateRegistrationStatus(id, status, note = '') {
    const reg = this.data.registrations.find(r => r.id === id);
    if (!reg) return null;
    
    const prevStatus = reg.status;
    reg.status = status;
    if (note) reg.note = note;

    // If rejected, refund user fee
    if (status === 'rejected' && prevStatus !== 'rejected' && reg.feePaid > 0) {
      const tournament = this.getTournamentByIdOrSlug(reg.tournamentId);
      const title = tournament ? tournament.title : 'টুর্নামেন্ট';
      this.adjustBalance(reg.userId, reg.feePaid, `রেজিস্ট্রেশন বাতিল ও ফি ফেরত — ${title}`, 'refund');
      if (tournament && tournament.slotsFilled > 0) {
        tournament.slotsFilled -= 1;
      }
    }

    this.save();
    return reg;
  }

  getDeposits(userId = null) {
    if (userId) return this.data.deposits.filter(d => d.userId === userId);
    return this.data.deposits;
  }

  createDeposit(depositData) {
    const newDep = {
      id: 'dep_' + Date.now(),
      status: 'pending',
      createdAt: new Date().toISOString(),
      ...depositData
    };
    this.data.deposits.unshift(newDep);
    this.save();
    return newDep;
  }

  approveDeposit(id, note = 'অনুমোদিত') {
    const dep = this.data.deposits.find(d => d.id === id);
    if (!dep || dep.status !== 'pending') return null;

    dep.status = 'approved';
    dep.note = note;

    // Credit user balance
    this.adjustBalance(dep.userId, dep.amount, `${dep.method} ডিপোজিট (TrxID: ${dep.trxId})`, 'deposit');
    this.save();
    return dep;
  }

  rejectDeposit(id, note = 'বাতিল করা হয়েছে') {
    const dep = this.data.deposits.find(d => d.id === id);
    if (!dep || dep.status !== 'pending') return null;

    dep.status = 'rejected';
    dep.note = note;
    this.save();
    return dep;
  }

  getWithdrawals(userId = null) {
    if (userId) return this.data.withdrawals.filter(w => w.userId === userId);
    return this.data.withdrawals;
  }

  createWithdrawal(wData) {
    const newW = {
      id: 'wth_' + Date.now(),
      status: 'pending',
      createdAt: new Date().toISOString(),
      ...wData
    };

    // Deduct user balance immediately
    this.adjustBalance(wData.userId, -wData.amount, `${wData.method} উইথড্র রিকোয়েস্ট (${wData.accountNumber})`, 'withdrawal');
    this.data.withdrawals.unshift(newW);
    this.save();
    return newW;
  }

  approveWithdrawal(id) {
    const w = this.data.withdrawals.find(item => item.id === id);
    if (!w || w.status !== 'pending') return null;

    w.status = 'approved';
    this.save();
    return w;
  }

  rejectWithdrawal(id, note = 'উইথড্র বাতিল — ব্যালেন্স ফেরত দেওয়া হয়েছে') {
    const w = this.data.withdrawals.find(item => item.id === id);
    if (!w || w.status !== 'pending') return null;

    w.status = 'rejected';
    w.note = note;

    // Refund balance back to user
    this.adjustBalance(w.userId, w.amount, `উইথড্র বাতিল ফেরত (${w.method})`, 'refund');
    this.save();
    return w;
  }

  getTransactions(userId = null) {
    if (userId) return this.data.transactions.filter(t => t.userId === userId);
    return this.data.transactions;
  }

  getTickets(userId = null) {
    if (userId) return this.data.tickets.filter(t => t.userId === userId);
    return this.data.tickets;
  }

  getTicketById(id) {
    return this.data.tickets.find(t => t.id === id);
  }

  createTicket(ticketData) {
    const newTicket = {
      id: 'tkt_' + Date.now(),
      status: 'open',
      createdAt: new Date().toISOString(),
      messages: [
        {
          id: 'msg_1',
          sender: 'user',
          senderName: ticketData.userName,
          text: ticketData.message,
          time: new Date().toISOString()
        }
      ],
      ...ticketData
    };
    this.data.tickets.unshift(newTicket);
    this.save();
    return newTicket;
  }

  addTicketMessage(ticketId, sender, senderName, text) {
    const ticket = this.getTicketById(ticketId);
    if (!ticket) return null;

    ticket.messages.push({
      id: 'msg_' + Date.now(),
      sender,
      senderName,
      text,
      time: new Date().toISOString()
    });
    this.save();
    return ticket;
  }

  updateTicketStatus(ticketId, status) {
    const ticket = this.getTicketById(ticketId);
    if (!ticket) return null;

    ticket.status = status;
    this.save();
    return ticket;
  }
}

export const db = new DB();
