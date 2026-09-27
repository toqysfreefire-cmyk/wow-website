import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import multer from 'multer';
import { randomUUID } from 'crypto';
import { db } from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isVercel = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
const app = express();
const PORT = process.env.PORT || 5000;
const uploadsDir = isVercel ? path.join('/tmp', 'uploads') : path.join(__dirname, 'uploads');
try {
  fs.mkdirSync(uploadsDir, { recursive: true });
} catch (e) {}

const uploadTournamentBanner = multer({
  storage: multer.diskStorage({
    destination: uploadsDir,
    filename: (req, file, callback) => {
      const extensionByType = {
        'image/jpeg': '.jpg',
        'image/png': '.png',
        'image/webp': '.webp',
        'image/gif': '.gif'
      };
      callback(null, `tournament-${randomUUID()}${extensionByType[file.mimetype] || '.jpg'}`);
    }
  }),
  fileFilter: (req, file, callback) => {
    if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.mimetype)) {
      return callback(new Error('শুধুমাত্র JPG, PNG, WEBP বা GIF ছবি আপলোড করুন'));
    }
    callback(null, true);
  },
  limits: { fileSize: 5 * 1024 * 1024 }
});

app.use(cors());
app.use(express.json());

// Normalize URL prefix for both local and serverless environments
app.use((req, res, next) => {
  if (req.url && !req.url.startsWith('/api') && !req.url.startsWith('/favicon') && !req.url.startsWith('/assets')) {
    req.url = '/api' + req.url;
  }
  next();
});

app.use('/api/uploads', express.static(uploadsDir));

// Helper middleware / Auth check
const getAuthUser = (req) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const userId = authHeader.split(' ')[1];
    return db.getUserById(userId);
  }
  return null;
};

// --- AUTH ENDPOINTS ---
app.post('/api/auth/signup', (req, res) => {
  const { name, phone, email, password, ign, uid } = req.body;
  
  if (!name || !phone || !password) {
    return res.status(400).json({ error: 'নাম, মোবাইল নম্বর এবং পাসওয়ার্ড প্রয়োজন' });
  }

  const existing = db.getUserByPhoneOrEmail(phone);
  if (existing) {
    return res.status(400).json({ error: 'এই নম্বর দিয়ে ইতিমধ্যেই একটি অ্যাকাউন্ট রয়েছে' });
  }

  const user = db.createUser({
    name,
    phone,
    email: email || `${phone}@bdff.com`,
    password,
    ign: ign || 'PLAYER_' + Math.floor(Math.random() * 10000),
    uid: uid || '100' + Math.floor(Math.random() * 100000)
  });

  const { password: _, ...userWithoutPassword } = user;
  res.json({ user: userWithoutPassword, token: user.id });
});

app.post('/api/auth/signin', (req, res) => {
  const { identifier, password } = req.body;
  if (!identifier || !password) {
    return res.status(400).json({ error: 'মোবাইল নম্বর/ইমেইল এবং পাসওয়ার্ড দিন' });
  }

  const user = db.getUserByPhoneOrEmail(identifier);
  if (!user || user.password !== password) {
    return res.status(401).json({ error: 'ভুল তথ্য! নম্বর/ইমেইল বা পাসওয়ার্ড সঠিক নয়।' });
  }

  const { password: _, ...userWithoutPassword } = user;
  res.json({ user: userWithoutPassword, token: user.id });
});

app.get('/api/auth/me', (req, res) => {
  const user = getAuthUser(req);
  if (!user) {
    return res.status(401).json({ error: 'অননুমোদিত' });
  }
  const { password: _, ...userWithoutPassword } = user;
  res.json({ user: userWithoutPassword });
});

app.post('/api/auth/password', (req, res) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ error: 'অননুমোদিত' });

  const { currentPassword, newPassword } = req.body;
  if (user.password !== currentPassword) {
    return res.status(400).json({ error: 'বর্তমান পাসওয়ার্ড ভুল' });
  }

  db.updateUser(user.id, { password: newPassword });
  res.json({ success: true, message: 'পাসওয়ার্ড সফলভাবে আপডেট হয়েছে' });
});

// --- PROFILE & USER ---
app.get('/api/profile', (req, res) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ error: 'অননুমোদিত' });

  const myRegs = db.getRegistrations({ userId: user.id });
  const myWins = myRegs.filter(r => r.isWinner).length;

  const { password: _, ...userClean } = user;
  res.json({
    user: userClean,
    stats: {
      matchesPlayed: myRegs.length,
      matchesWon: myWins,
      totalKills: myWins * 5 + Math.floor(Math.random() * 10)
    }
  });
});

app.patch('/api/profile', (req, res) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ error: 'অননুমোদিত' });

  const { name, ign, uid } = req.body;
  const updated = db.updateUser(user.id, { name, ign, uid });
  const { password: _, ...userClean } = updated;
  res.json({ user: userClean });
});

// --- APP BOOTSTRAP & SETTINGS ---
app.get('/api/app/bootstrap', (req, res) => {
  const settings = db.getSettings();
  const user = getAuthUser(req);
  let userClean = null;
  if (user) {
    const { password: _, ...rest } = user;
    userClean = rest;
  }

  res.json({
    settings,
    user: userClean
  });
});

app.get('/api/app/settings/payment', (req, res) => {
  const settings = db.getSettings();
  res.json({
    bKash: settings.bKashNumber,
    minDeposit: settings.minDeposit,
    maxDeposit: settings.maxDeposit,
    minWithdraw: settings.minWithdraw,
    maxWithdraw: settings.maxWithdraw,
    notice: settings.noticeBanner
  });
});

// --- TOURNAMENTS ---
app.get('/api/tournaments', (req, res) => {
  const tournaments = db.getTournaments();
  res.json(tournaments);
});

app.get('/api/tournaments/mine', (req, res) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ error: 'অননুমোদিত' });

  const regs = db.getRegistrations({ userId: user.id });
  const tournIds = regs.map(r => r.tournamentId);
  const allTournaments = db.getTournaments();
  
  const myTournaments = allTournaments
    .filter(t => tournIds.includes(t.id))
    .map(t => {
      const reg = regs.find(r => r.tournamentId === t.id);
      return {
        ...t,
        registration: reg
      };
    });

  res.json(myTournaments);
});

app.get('/api/tournaments/:id', (req, res) => {
  const t = db.getTournamentByIdOrSlug(req.params.id);
  if (!t) return res.status(404).json({ error: 'টুর্নামেন্ট পাওয়া যায়নি' });

  const user = getAuthUser(req);
  let registration = null;
  if (user) {
    const regs = db.getRegistrations({ userId: user.id, tournamentId: t.id });
    if (regs.length > 0) registration = regs[0];
  }

  res.json({
    tournament: t,
    registration
  });
});

app.post('/api/tournaments/:id/register', (req, res) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ error: 'রেজিস্ট্রেশনের জন্য আগে সাইন ইন করুন' });

  const tournament = db.getTournamentByIdOrSlug(req.params.id);
  if (!tournament) return res.status(404).json({ error: 'টুর্নামেন্ট পাওয়া যায়নি' });

  if (tournament.status !== 'open') {
    return res.status(400).json({ error: 'এই টুর্নামেন্টে এখন রেজিস্ট্রেশন নেওয়া হচ্ছে না।' });
  }

  if (tournament.slotsFilled >= tournament.slotsTotal) {
    return res.status(400).json({ error: 'দুঃখিত! টুর্নামেন্টের সমস্ত স্লট পূরণ হয়ে গেছে।' });
  }

  // Check if already registered
  const existing = db.getRegistrations({ userId: user.id, tournamentId: tournament.id });
  if (existing.length > 0) {
    return res.status(400).json({ error: 'আপনি ইতিমধ্যেই এই টুর্নামেন্টে রেজিস্টার করেছেন।' });
  }

  // Check entry fee balance
  if (user.balance < tournament.entryFee) {
    return res.status(400).json({
      error: `আপনার ওয়ালেটে পর্যাপ্ত ব্যালেন্স নেই। রেজিস্ট্রেশন ফি ৳${tournament.entryFee}, আপনার ব্যালেন্স ৳${user.balance}। অনুগ্রহ করে ডিপোজিট করুন।`
    });
  }

  const { teamName, players } = req.body;

  // Deduct entry fee
  if (tournament.entryFee > 0) {
    db.adjustBalance(user.id, -tournament.entryFee, `টুর্নামেন্ট এন্ট্রি ফি — ${tournament.title}`, 'entry_fee');
  }

  const registration = db.createRegistration({
    tournamentId: tournament.id,
    userId: user.id,
    userName: user.name,
    userPhone: user.phone,
    teamName: teamName || user.ign,
    mode: tournament.mode,
    players: players || [{ ign: user.ign, uid: user.uid }],
    feePaid: tournament.entryFee,
    status: 'approved'
  });

  res.json({
    success: true,
    message: 'রেজিস্ট্রেশন সফল হয়েছে!',
    registration
  });
});

app.get('/api/tournaments/:id/room-credentials', (req, res) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ error: 'অননুমোদিত' });

  const tournament = db.getTournamentByIdOrSlug(req.params.id);
  if (!tournament) return res.status(404).json({ error: 'টুর্নামেন্ট পাওয়া যায়নি' });

  // Check if registered
  const regs = db.getRegistrations({ userId: user.id, tournamentId: tournament.id });
  if (regs.length === 0 && user.role !== 'admin') {
    return res.status(403).json({ error: 'রুম তথ্য দেখতে আগে রেজিস্টার করুন' });
  }

  res.json({
    roomId: tournament.roomId,
    roomPassword: tournament.roomPassword,
    status: tournament.status
  });
});

// --- WALLET, DEPOSITS & WITHDRAWALS ---
app.get('/api/wallet', (req, res) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ error: 'অননুমোদিত' });

  const transactions = db.getTransactions(user.id);
  const deposits = db.getDeposits(user.id);
  const withdrawals = db.getWithdrawals(user.id);

  res.json({
    balance: user.balance,
    transactions,
    deposits,
    withdrawals
  });
});

app.post('/api/deposits', (req, res) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ error: 'অননুমোদিত' });

  const { method, amount, senderPhone, trxId } = req.body;
  if (!method || !amount || !senderPhone || !trxId) {
    return res.status(400).json({ error: 'সবগুলো ঘর পূরণ করা আবশ্যক' });
  }
  if (method !== 'bKash') {
    return res.status(400).json({ error: 'শুধুমাত্র bKash পেমেন্ট গ্রহণ করা হয়' });
  }

  const settings = db.getSettings();
  if (amount < settings.minDeposit || amount > settings.maxDeposit) {
    return res.status(400).json({
      error: `সর্বনিম্ন ডিপোজিট ৳${settings.minDeposit} এবং সর্বোচ্চ ৳${settings.maxDeposit}`
    });
  }

  const deposit = db.createDeposit({
    userId: user.id,
    userName: user.name,
    userPhone: user.phone,
    method,
    amount: Number(amount),
    senderPhone,
    trxId
  });

  res.json({
    success: true,
    message: 'ডিপোজিট জমা দেওয়ার কিছুক্ষনের মধ্যেই স্বয়ংক্রিয়ভাবে আপনার অ্যাকাউন্টে ব্যালান্স যোগ হবে।',
    deposit
  });
});

app.get('/api/deposits/:id', (req, res) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ error: 'অননুমোদিত' });

  const deposits = db.getDeposits(user.id);
  const dep = deposits.find(d => d.id === req.params.id);
  if (!dep) return res.status(404).json({ error: 'ডিপোজিট অনুরোধ পাওয়া যায়নি' });

  res.json(dep);
});

app.post('/api/withdrawals', (req, res) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ error: 'অননুমোদিত' });

  const { method, accountNumber, amount } = req.body;
  if (!method || !accountNumber || !amount) {
    return res.status(400).json({ error: 'সব তথ্য দিন' });
  }
  if (method !== 'bKash') {
    return res.status(400).json({ error: 'শুধুমাত্র bKash-এ উইথড্র করা যায়' });
  }

  const settings = db.getSettings();
  const numAmount = Number(amount);
  if (numAmount < settings.minWithdraw || numAmount > settings.maxWithdraw) {
    return res.status(400).json({
      error: `সর্বনিম্ন উইথড্র ৳${settings.minWithdraw} এবং সর্বোচ্চ ৳${settings.maxWithdraw}`
    });
  }

  if (user.balance < numAmount) {
    return res.status(400).json({ error: 'আপনার ওয়ালেটে পর্যাপ্ত ব্যালেন্স নেই' });
  }

  const withdrawal = db.createWithdrawal({
    userId: user.id,
    userName: user.name,
    method,
    accountNumber,
    amount: numAmount
  });

  res.json({
    success: true,
    message: 'উইথড্র রিকোয়েস্ট সফলভাবে পাঠানো হয়েছে।',
    withdrawal
  });
});

// --- SUPPORT TICKETS ---
app.get('/api/support', (req, res) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ error: 'অননুমোদিত' });

  const tickets = db.getTickets(user.id);
  res.json(tickets);
});

app.post('/api/support', (req, res) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ error: 'অননুমোদিত' });

  const { category, subject, message } = req.body;
  if (!category || !subject || !message) {
    return res.status(400).json({ error: 'সবগুলো ফিল্ড পূরণ করুন' });
  }

  const ticket = db.createTicket({
    userId: user.id,
    userName: user.name,
    category,
    subject,
    message
  });

  res.json({ success: true, ticket });
});

app.get('/api/support/:id', (req, res) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ error: 'অননুমোদিত' });

  const ticket = db.getTicketById(req.params.id);
  if (!ticket) return res.status(404).json({ error: 'টিকিট পাওয়া যায়নি' });

  if (ticket.userId !== user.id && user.role !== 'admin') {
    return res.status(403).json({ error: 'অননুমোদিত' });
  }

  res.json(ticket);
});

app.post('/api/messages/:id', (req, res) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ error: 'অননুমোদিত' });

  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'মেসেজ লিখুন' });

  const senderType = user.role === 'admin' ? 'admin' : 'user';
  const updated = db.addTicketMessage(req.params.id, senderType, user.name, text);

  res.json(updated);
});

// --- PUSH / NOTIFICATION STUBS ---
app.get('/api/push/config', (req, res) => {
  res.json({ enabled: true, vapidKey: 'BDFF_MOCK_VAPID_KEY' });
});

app.get('/api/push/status', (req, res) => {
  res.json({ subscribed: false });
});

// --- ADMIN ENDPOINTS ---
const adminMiddleware = (req, res, next) => {
  const user = getAuthUser(req);
  if (!user || user.role !== 'admin') {
    return res.status(403).json({ error: 'অ্যাডমিন সুবিধা প্রয়োজন' });
  }
  req.adminUser = user;
  next();
};

app.get('/api/admin/dashboard', adminMiddleware, (req, res) => {
  const users = db.getUsers();
  const deposits = db.getDeposits();
  const withdrawals = db.getWithdrawals();
  const tournaments = db.getTournaments();

  const pendingDeposits = deposits.filter(d => d.status === 'pending');
  const pendingWithdrawals = withdrawals.filter(w => w.status === 'pending');

  const totalUserBalance = users.reduce((acc, u) => acc + (u.balance || 0), 0);

  res.json({
    totalUsers: users.length,
    totalUserBalance,
    pendingDepositsCount: pendingDeposits.length,
    pendingWithdrawalsCount: pendingWithdrawals.length,
    totalTournaments: tournaments.length,
    recentDeposits: deposits.slice(0, 5),
    recentWithdrawals: withdrawals.slice(0, 5)
  });
});

app.post('/api/admin/tournaments', adminMiddleware, (req, res) => {
  uploadTournamentBanner.single('banner')(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.code === 'LIMIT_FILE_SIZE' ? 'ছবির আকার সর্বোচ্চ ৫ MB হতে পারে' : err.message });
    }

    let prizeBreakdown = [];
    try {
      prizeBreakdown = typeof req.body.prizeBreakdown === 'string'
        ? JSON.parse(req.body.prizeBreakdown)
        : req.body.prizeBreakdown || [];
    } catch {
      return res.status(400).json({ error: 'প্রাইজ ব্রেকডাউন সঠিক নয়' });
    }

    const tournament = db.createTournament({
      ...req.body,
      entryFee: Number(req.body.entryFee),
      prizePool: Number(req.body.prizePool),
      slotsTotal: Number(req.body.slotsTotal),
      prizeBreakdown,
      banner: req.file
        ? `/api/uploads/${req.file.filename}`
        : req.body.banner || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80'
    });
    res.json(tournament);
  });
});

app.delete('/api/admin/tournaments/:id', adminMiddleware, (req, res) => {
  const deleted = db.deleteTournament(req.params.id);
  if (!deleted) return res.status(404).json({ error: 'টুর্নামেন্ট পাওয়া যায়নি' });
  res.json({ success: true });
});

app.patch('/api/admin/tournaments/:id', adminMiddleware, (req, res) => {
  const updated = db.updateTournament(req.params.id, req.body);
  res.json(updated);
});

app.post('/api/admin/tournaments/:id/room-credentials', adminMiddleware, (req, res) => {
  const { roomId, roomPassword } = req.body;
  const updated = db.updateTournament(req.params.id, {
    roomId,
    roomPassword,
    status: 'room_released'
  });
  res.json(updated);
});

app.post('/api/admin/tournaments/:id/winners', adminMiddleware, (req, res) => {
  const { winner } = req.body;
  const updated = db.updateTournament(req.params.id, {
    winner,
    status: 'completed'
  });

  res.json({ success: true, tournament: updated });
});

app.get('/api/admin/registrations', adminMiddleware, (req, res) => {
  const regs = db.getRegistrations();
  res.json(regs);
});

app.post('/api/admin/registrations/:id/review', adminMiddleware, (req, res) => {
  const { status, note } = req.body;
  const updated = db.updateRegistrationStatus(req.params.id, status, note);
  res.json(updated);
});

app.post('/api/admin/deposits/:id/approve', adminMiddleware, (req, res) => {
  const approved = db.approveDeposit(req.params.id);
  if (!approved) return res.status(400).json({ error: 'ডিপোজিট প্রক্রিয়া করা সম্ভব হয়নি' });
  res.json(approved);
});

app.post('/api/admin/deposits/:id/reject', adminMiddleware, (req, res) => {
  const rejected = db.rejectDeposit(req.params.id, req.body.note);
  if (!rejected) return res.status(400).json({ error: 'ডিপোজিট প্রক্রিয়া করা সম্ভব হয়নি' });
  res.json(rejected);
});

app.post('/api/admin/withdrawals/:id/approve', adminMiddleware, (req, res) => {
  const approved = db.approveWithdrawal(req.params.id);
  if (!approved) return res.status(400).json({ error: 'উইথড্র প্রক্রিয়া করা সম্ভব হয়নি' });
  res.json(approved);
});

app.post('/api/admin/withdrawals/:id/reject', adminMiddleware, (req, res) => {
  const rejected = db.rejectWithdrawal(req.params.id, req.body.note);
  if (!rejected) return res.status(400).json({ error: 'উইথড্র প্রক্রিয়া করা সম্ভব হয়নি' });
  res.json(rejected);
});

app.get('/api/admin/users', adminMiddleware, (req, res) => {
  const users = db.getUsers().map(({ password, ...u }) => u);
  res.json(users);
});

app.post('/api/admin/users/:id/wallet', adminMiddleware, (req, res) => {
  const { amount, description } = req.body;
  const numAmount = Number(amount);
  if (isNaN(numAmount)) return res.status(400).json({ error: 'সঠিক পরিমাণ দিন' });

  const updated = db.adjustBalance(req.params.id, numAmount, description || 'অ্যাডমিন অ্যাডজাস্টমেন্ট', 'admin_adjustment');
  res.json(updated);
});

app.patch('/api/admin/users/:id', adminMiddleware, (req, res) => {
  const updated = db.updateUser(req.params.id, req.body);
  const { password: _, ...clean } = updated;
  res.json(clean);
});

app.get('/api/admin/settings', adminMiddleware, (req, res) => {
  res.json(db.getSettings());
});

app.patch('/api/admin/settings', adminMiddleware, (req, res) => {
  const updated = db.updateSettings(req.body);
  res.json(updated);
});

app.post('/api/admin/tickets/:id/status', adminMiddleware, (req, res) => {
  const { status } = req.body;
  const updated = db.updateTicketStatus(req.params.id, status);
  res.json(updated);
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve frontend build static files if dist folder exists and not on Vercel
const distPath = path.join(__dirname, '..', 'dist');
if (!isVercel && fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

if (!isVercel) {
  app.listen(PORT, () => {
    console.log(`BD FF Tournament Server listening on port ${PORT}`);
  });
}

export default app;
