import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, 'data.json');

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
    },
    {
      id: 'usr_player1',
      name: 'Tanvir Ahmed',
      email: 'player@gmail.com',
      phone: '01899887766',
      role: 'user',
      password: 'player123',
      balance: 450,
      ign: 'OP_TANVIR',
      uid: '987654321',
      createdAt: new Date().toISOString()
    }
  ],
  tournaments: [
    {
      id: 'tourn_1',
      slug: 'bermuda-rush-solo-101',
      title: 'Bermuda Rush Solo #101',
      mode: 'Solo',
      map: 'Bermuda',
      entryFee: 30,
      prizePool: 1000,
      slotsTotal: 48,
      slotsFilled: 34,
      status: 'open',
      startTime: 'আজ রাত ৯:০০ টা',
      regDeadline: 'আজ রাত ৮:৩০ টা',
      banner: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',
      roomId: '',
      roomPassword: '',
      prizeBreakdown: [
        { rank: '1st Place (চ্যাম্পিয়ন)', prize: '৳500' },
        { rank: '2nd Place (২য় স্থান)', prize: '৳300' },
        { rank: '3rd Place (৩য় স্থান)', prize: '৳150' },
        { rank: 'Per Kill (প্রতি কিল)', prize: '৳10' }
      ],
      rules: [
        'ম্যাচ শুরু হওয়ার ১৫ মিনিট আগে রুম আইডি এবং পাসওয়ার্ড দেওয়া হবে।',
        'হ্যাক, গ্লিচ বা কোনো প্রকার আনফেয়ার গেমপ্লে পাওয়া গেলে স্লট বাতিল করা হবে এবং ওয়ালেট ব্যান করা হবে।',
        'অবশ্যই আপনার Free Fire UID এবং In-Game Name সঠিক প্রদান করতে হবে।'
      ],
      createdAt: new Date().toISOString()
    },
    {
      id: 'tourn_2',
      slug: 'championship-squad-battle-42',
      title: 'Championship Squad Battle #42',
      mode: 'Squad',
      map: 'Purgatory',
      entryFee: 120,
      prizePool: 3500,
      slotsTotal: 12,
      slotsFilled: 9,
      status: 'open',
      startTime: 'আগামীকাল সন্ধ্যা ৭:৩০ টা',
      regDeadline: 'আগামীকাল সন্ধ্যা ৬:৪৫ টা',
      banner: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=800&q=80',
      roomId: '',
      roomPassword: '',
      prizeBreakdown: [
        { rank: '1st Place (চ্যাম্পিয়ন Squad)', prize: '৳2000' },
        { rank: '2nd Place (২য় স্থান)', prize: '৳1000' },
        { rank: '3rd Place (৩য় স্থান)', prize: '৳500' }
      ],
      rules: [
        'স্কোয়াডের প্রতি মেম্বারকে তাদের সঠিক IGN ও UID নিশ্চিত করতে হবে।',
        'টুর্নামেন্ট শেষ হওয়ার পর রেজাল্ট স্ক্রিনশট সাপোর্ট টিকিটে জমা দিতে হতে পারে।'
      ],
      createdAt: new Date().toISOString()
    },
    {
      id: 'tourn_3',
      slug: 'duo-purgatory-cup-08',
      title: 'Duo Purgatory Cup #08',
      mode: 'Duo',
      map: 'Kalahari',
      entryFee: 60,
      prizePool: 1800,
      slotsTotal: 24,
      slotsFilled: 24,
      status: 'room_released',
      startTime: 'আজ রাত ১০:০০ টা',
      regDeadline: 'আজ রাত ৯:৩০ টা',
      banner: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80',
      roomId: 'BDFF-88492',
      roomPassword: '7741',
      prizeBreakdown: [
        { rank: '1st Place', prize: '৳1000' },
        { rank: '2nd Place', prize: '৳500' },
        { rank: '3rd Place', prize: '৳300' }
      ],
      rules: [
        'সময়মত রুমে জয়েন করুন। রুম সময় শেষ হলে সরাসরি ম্যাচ স্টার্ট করা হবে।'
      ],
      createdAt: new Date().toISOString()
    },
    {
      id: 'tourn_4',
      slug: 'weekly-solo-showdown-12',
      title: 'Free Fire Weekly Solo Showdown #12',
      mode: 'Solo',
      map: 'Bermuda',
      entryFee: 0,
      prizePool: 500,
      slotsTotal: 48,
      slotsFilled: 48,
      status: 'completed',
      winner: 'OP_TANVIR',
      startTime: 'গতকাল রাত ৮:০০ টা',
      regDeadline: 'গতকাল রাত ৭:৩০ টা',
      banner: 'https://images.unsplash.com/photo-1560253023-3ec5d502959f?auto=format&fit=crop&w=800&q=80',
      roomId: 'BDFF-99120',
      roomPassword: '1234',
      prizeBreakdown: [
        { rank: '1st Place', prize: '৳300' },
        { rank: '2nd Place', prize: '৳200' }
      ],
      rules: ['ফেয়ার প্লে আবশ্যক।'],
      createdAt: new Date().toISOString()
    }
  ],
  registrations: [
    {
      id: 'reg_101',
      tournamentId: 'tourn_3',
      userId: 'usr_player1',
      userName: 'Tanvir Ahmed',
      userPhone: '01899887766',
      teamName: 'Duo Masters',
      mode: 'Duo',
      players: [
        { ign: 'OP_TANVIR', uid: '987654321' },
        { ign: 'PRO_SAKIB', uid: '987654322' }
      ],
      feePaid: 60,
      status: 'approved',
      createdAt: new Date(Date.now() - 3600000 * 4).toISOString()
    }
  ],
  deposits: [
    {
      id: 'dep_1001',
      userId: 'usr_player1',
      userName: 'Tanvir Ahmed',
      userPhone: '01899887766',
      method: 'bKash',
      amount: 500,
      senderPhone: '01899887766',
      trxId: 'BKH9928172',
      status: 'approved',
      note: 'স্বয়ংক্রিয়ভাবে স্পট অ্যাপ্রুভড',
      createdAt: new Date(Date.now() - 3600000 * 24).toISOString()
    }
  ],
  withdrawals: [
    {
      id: 'wth_2001',
      userId: 'usr_player1',
      userName: 'Tanvir Ahmed',
      method: 'bKash',
      accountNumber: '01899887766',
      amount: 100,
      status: 'approved',
      createdAt: new Date(Date.now() - 3600000 * 12).toISOString()
    }
  ],
  transactions: [
    {
      id: 'tx_1',
      userId: 'usr_player1',
      type: 'deposit',
      amount: 500,
      description: 'bKash ডিপোজিট (TrxID: BKH9928172)',
      status: 'approved',
      createdAt: new Date(Date.now() - 3600000 * 24).toISOString()
    },
    {
      id: 'tx_2',
      userId: 'usr_player1',
      type: 'entry_fee',
      amount: -60,
      description: 'টুর্নামেন্ট রেজিস্ট্রেশন ফি — Duo Purgatory Cup #08',
      status: 'approved',
      createdAt: new Date(Date.now() - 3600000 * 4).toISOString()
    },
    {
      id: 'tx_3',
      userId: 'usr_player1',
      type: 'withdrawal',
      amount: -100,
      description: 'bKash উইথড্র রিকোয়েস্ট (01899887766)',
      status: 'approved',
      createdAt: new Date(Date.now() - 3600000 * 12).toISOString()
    },
    {
      id: 'tx_4',
      userId: 'usr_player1',
      type: 'prize',
      amount: 110,
      description: 'প্রাইজ রিওয়ার্ড — Free Fire Weekly Solo Showdown #12',
      status: 'approved',
      createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
    }
  ],
  tickets: [
    {
      id: 'tkt_301',
      userId: 'usr_player1',
      userName: 'Tanvir Ahmed',
      category: 'Payment Support',
      subject: 'ডিপোজিট সম্পর্কিত তথ্য',
      status: 'open',
      messages: [
        {
          id: 'msg_1',
          sender: 'user',
          senderName: 'Tanvir Ahmed',
          text: 'আমার বিকাশে টাকা ডিপোজিট করতে কত সময় লাগে?',
          time: new Date(Date.now() - 3600000 * 3).toISOString()
        },
        {
          id: 'msg_2',
          sender: 'admin',
          senderName: 'BD FF Support',
          text: 'সাধারণত ডিপোজিট রিকোয়েস্ট জমা দেওয়ার ২-১০ মিনিটের মধ্যে ওয়ালেটে যুক্ত হয়ে যায়।',
          time: new Date(Date.now() - 3600000 * 2).toISOString()
        }
      ],
      createdAt: new Date(Date.now() - 3600000 * 3).toISOString()
    }
  ]
};

class DB {
  constructor() {
    this.init();
  }

  init() {
    if (!fs.existsSync(DATA_FILE)) {
      this.data = defaultData;
      this.save();
    } else {
      try {
        const raw = fs.readFileSync(DATA_FILE, 'utf-8');
        this.data = JSON.parse(raw);
      } catch (err) {
        console.error('Error loading data.json, falling back to defaults:', err);
        this.data = defaultData;
        this.save();
      }
    }
  }

  save() {
    fs.writeFileSync(DATA_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
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
