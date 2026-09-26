import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { fetchApi } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { useTournaments } from '../context/TournamentContext';
import { useToast } from '../context/ToastContext';
import { StatusBadge } from '../components/StatusBadge';
import { Modal } from '../components/Modal';
import {
  Trophy,
  Users,
  Clock,
  MapPin,
  ShieldCheck,
  Key,
  Copy,
  Check,
  DollarSign,
  AlertCircle,
  Gamepad2,
  ChevronLeft,
  Share2
} from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

export const TournamentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { registerForTournament } = useTournaments();
  const { addToast } = useToast();

  const [tournament, setTournament] = useState(null);
  const [registration, setRegistration] = useState(null);
  const [loading, setLoading] = useState(true);

  // Registration modal & state
  const [isRegModalOpen, setIsRegModalOpen] = useState(false);
  const [teamName, setTeamName] = useState('');
  const [player1Ign, setPlayer1Ign] = useState(user?.ign || '');
  const [player1Uid, setPlayer1Uid] = useState(user?.uid || '');
  const [player2Ign, setPlayer2Ign] = useState('');
  const [player2Uid, setPlayer2Uid] = useState('');
  const [player3Ign, setPlayer3Ign] = useState('');
  const [player3Uid, setPlayer3Uid] = useState('');
  const [player4Ign, setPlayer4Ign] = useState('');
  const [player4Uid, setPlayer4Uid] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Copy state
  const [copiedRoom, setCopiedRoom] = useState(false);
  const [copiedPass, setCopiedPass] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await fetchApi(`/tournaments/${id}`);
      setTournament(data.tournament);
      setRegistration(data.registration);
      if (user) {
        setPlayer1Ign(user.ign || '');
        setPlayer1Uid(user.uid || '');
      }
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id, user]);

  const handleCopy = (text, type) => {
    navigator.clipboard.writeText(text);
    if (type === 'room') {
      setCopiedRoom(true);
      setTimeout(() => setCopiedRoom(false), 2000);
    } else {
      setCopiedPass(true);
      setTimeout(() => setCopiedPass(false), 2000);
    }
    addToast('কপি করা হয়েছে!', 'success');
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/signin');
      return;
    }

    if (!player1Ign || !player1Uid) {
      addToast('অনুগ্রহ করে প্লেয়ার ১ এর IGN এবং UID প্রদান করুন', 'error');
      return;
    }

    const players = [{ ign: player1Ign, uid: player1Uid }];
    if (tournament.mode === 'Duo' || tournament.mode === 'Squad') {
      if (player2Ign && player2Uid) players.push({ ign: player2Ign, uid: player2Uid });
    }
    if (tournament.mode === 'Squad') {
      if (player3Ign && player3Uid) players.push({ ign: player3Ign, uid: player3Uid });
      if (player4Ign && player4Uid) players.push({ ign: player4Ign, uid: player4Uid });
    }

    try {
      setIsSubmitting(true);
      await registerForTournament(tournament.id, {
        teamName: teamName || user.ign || user.name,
        players
      });
      setIsRegModalOpen(false);
      await loadData();
    } catch (err) {
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-slate-400">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs">লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  if (!tournament) {
    return (
      <div className="text-center py-16">
        <h3 className="text-lg font-bold text-white">টুর্নামেন্ট পাওয়া যায়নি</h3>
        <Link to="/" className="text-xs text-amber-400 mt-2 inline-block">
          হোম পেজে ফিরুন
        </Link>
      </div>
    );
  }

  const isFull = tournament.slotsFilled >= tournament.slotsTotal;
  const isRegistered = !!registration;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        <span>পেছনে যান</span>
      </button>

      {/* Banner & Header Info */}
      <div className="relative rounded-3xl overflow-hidden border border-[#21262D] bg-[#0D1117] shadow-2xl">
        <div className="relative h-64 w-full bg-slate-900">
          <img
            src={tournament.banner || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80'}
            alt={tournament.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0D1117] via-[#0D1117]/60 to-transparent"></div>

          <div className="absolute top-4 right-4">
            <StatusBadge status={tournament.status} />
          </div>

          <div className="absolute top-4 left-4 flex items-center gap-2">
            <span className="px-3 py-1 bg-amber-500 text-slate-950 font-black text-xs rounded-lg uppercase">
              {tournament.mode}
            </span>
            <span className="px-3 py-1 bg-black/60 backdrop-blur-md text-slate-200 text-xs font-medium rounded-lg border border-white/10 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              {tournament.map}
            </span>
          </div>

          <div className="absolute bottom-4 left-4 right-4 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-3xl font-extrabold text-white">
                {tournament.title}
              </h1>
              <p className="text-xs text-slate-300 mt-1 flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>স্টার্ট টাইম: {tournament.startTime}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="p-6 grid grid-cols-2 sm:grid-cols-4 gap-4 bg-[#161B22]/50 border-t border-[#21262D]">
          <div>
            <p className="text-xs text-slate-400">প্রাইজ পুল</p>
            <p className="text-base font-extrabold text-amber-400 mt-0.5">
              {formatCurrency(tournament.prizePool)}
            </p>
          </div>

          <div>
            <p className="text-xs text-slate-400">এন্ট্রি ফি</p>
            <p className="text-base font-extrabold text-emerald-400 mt-0.5">
              {tournament.entryFee === 0 ? 'ফ্রি' : formatCurrency(tournament.entryFee)}
            </p>
          </div>

          <div>
            <p className="text-xs text-slate-400">স্লট তথ্য</p>
            <p className="text-base font-extrabold text-slate-200 mt-0.5">
              {tournament.slotsFilled} / {tournament.slotsTotal}
            </p>
          </div>

          <div>
            <p className="text-xs text-slate-400">ম্যাপ</p>
            <p className="text-base font-extrabold text-slate-200 mt-0.5">
              {tournament.map}
            </p>
          </div>
        </div>
      </div>

      {/* Room ID & Password Banner (If user registered & Room released) */}
      {isRegistered && (tournament.status === 'room_released' || tournament.roomId) && (
        <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-500/20 via-amber-500/10 to-yellow-500/20 border-2 border-amber-500/40 shadow-xl space-y-4">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
            <Key className="w-5 h-5 animate-bounce" />
            <span>রুম আইডি ও পাসওয়ার্ড প্রকাশিত হয়েছে!</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Room ID */}
            <div className="p-4 bg-[#0D1117] border border-amber-500/30 rounded-xl flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400">রুম আইডি (Room ID)</p>
                <p className="text-lg font-mono font-extrabold text-white mt-1">
                  {tournament.roomId || 'অপেক্ষমাণ...'}
                </p>
              </div>
              {tournament.roomId && (
                <button
                  onClick={() => handleCopy(tournament.roomId, 'room')}
                  className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-1.5 transition-all"
                >
                  {copiedRoom ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedRoom ? 'কপিড!' : 'কপি করুন'}</span>
                </button>
              )}
            </div>

            {/* Room Password */}
            <div className="p-4 bg-[#0D1117] border border-amber-500/30 rounded-xl flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400">পাসওয়ার্ড (Password)</p>
                <p className="text-lg font-mono font-extrabold text-white mt-1">
                  {tournament.roomPassword || 'অপেক্ষমাণ...'}
                </p>
              </div>
              {tournament.roomPassword && (
                <button
                  onClick={() => handleCopy(tournament.roomPassword, 'pass')}
                  className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-1.5 transition-all"
                >
                  {copiedPass ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedPass ? 'কপিড!' : 'কপি করুন'}</span>
                </button>
              )}
            </div>
          </div>
          <p className="text-xs text-slate-400">
            * সময়মত গেমের Custom Room অপশনে গিয়ে আইডি ও পাসওয়ার্ড বসিয়ে যোগ দিন।
          </p>
        </div>
      )}

      {/* Main Registration / Status Action Box */}
      <div className="p-6 bg-[#0D1117] border border-[#21262D] rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-white">রেজিস্ট্রেশন অবস্থা</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            {isRegistered
              ? 'আপনি এই টুর্নামেন্টে স্লট নিশ্চিত করেছেন।'
              : isFull
              ? 'সমস্ত স্লট পূর্ণ হয়ে গিয়েছে।'
              : 'স্লট খালি থাকতে এখনই আপনার এন্ট্রি নিশ্চিত করুন।'}
          </p>
        </div>

        <div>
          {isRegistered ? (
            <div className="px-4 py-2 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold text-xs rounded-xl flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              <span>রেজিস্ট্রেশন সম্পন্ন</span>
            </div>
          ) : isFull ? (
            <button
              disabled
              className="px-5 py-2.5 bg-slate-800 text-slate-500 font-bold text-xs rounded-xl cursor-not-allowed border border-slate-700"
            >
              স্লট পূর্ণ
            </button>
          ) : (
            <button
              onClick={() => {
                if (!user) {
                  navigate('/signin');
                } else {
                  setIsRegModalOpen(true);
                }
              }}
              className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg shadow-amber-500/20 transition-all hover:scale-105"
            >
              রেজিস্ট্রেশন করুন ({tournament.entryFee === 0 ? 'ফ্রি' : formatCurrency(tournament.entryFee)})
            </button>
          )}
        </div>
      </div>

      {/* Prize Breakdown & Rules Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Prize Table */}
        <div className="p-6 bg-[#0D1117] border border-[#21262D] rounded-2xl space-y-4">
          <div className="flex items-center gap-2 font-bold text-white text-sm">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>প্রাইজ ব্রেকডাউন</span>
          </div>

          <div className="divide-y divide-[#21262D]">
            {tournament.prizeBreakdown && tournament.prizeBreakdown.length > 0 ? (
              tournament.prizeBreakdown.map((item, idx) => (
                <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-medium">{item.rank}</span>
                  <span className="font-extrabold text-amber-400">{item.prize}</span>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500 py-2">প্রাইজ তথ্য উপলব্ধ</p>
            )}
          </div>
        </div>

        {/* Rules */}
        <div className="p-6 bg-[#0D1117] border border-[#21262D] rounded-2xl space-y-4">
          <div className="flex items-center gap-2 font-bold text-white text-sm">
            <AlertCircle className="w-4 h-4 text-amber-400" />
            <span>ম্যাচ নিয়মাবলী</span>
          </div>

          <ul className="space-y-2 text-xs text-slate-300 list-disc list-inside leading-relaxed">
            {tournament.rules && tournament.rules.length > 0 ? (
              tournament.rules.map((rule, idx) => <li key={idx}>{rule}</li>)
            ) : (
              <li>সময়মত রুমে যোগ দিন। আনফেয়ার গেমপ্লে নিষিদ্ধ।</li>
            )}
          </ul>
        </div>
      </div>

      {/* REGISTRATION MODAL */}
      <Modal
        isOpen={isRegModalOpen}
        onClose={() => setIsRegModalOpen(false)}
        title={`রেজিস্ট্রেশন — ${tournament.title}`}
      >
        <form onSubmit={handleRegisterSubmit} className="space-y-4">
          
          {/* Balance info card */}
          <div className="p-3.5 bg-[#161B22] border border-[#21262D] rounded-xl flex items-center justify-between text-xs">
            <div>
              <p className="text-slate-400">আপনার ওয়ালেট ব্যালেন্স</p>
              <p className="font-bold text-emerald-400 text-sm">{formatCurrency(user?.balance)}</p>
            </div>
            <div>
              <p className="text-slate-400">রেজিস্ট্রেশন ফি</p>
              <p className="font-bold text-amber-400 text-sm">
                {tournament.entryFee === 0 ? 'ফ্রি' : formatCurrency(tournament.entryFee)}
              </p>
            </div>
          </div>

          {user?.balance < tournament.entryFee && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-300 text-xs flex items-center justify-between">
              <span>পর্যাপ্ত ব্যালেন্স নেই!</span>
              <Link to="/deposit" className="underline font-bold text-amber-400">
                ডিপোজিট করুন
              </Link>
            </div>
          )}

          {/* Team Name for Duo/Squad */}
          {(tournament.mode === 'Duo' || tournament.mode === 'Squad') && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                টিমের নাম (Team Name)
              </label>
              <input
                type="text"
                required
                placeholder="যেমন: BD FF WARRIORS"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                className="w-full bg-[#161B22] border border-[#21262D] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>
          )}

          {/* Player 1 (Leader) */}
          <div className="p-3.5 bg-[#161B22]/60 border border-[#21262D] rounded-xl space-y-2">
            <p className="text-xs font-bold text-amber-400">প্লেয়ার ১ (টিম লিডার / Solo)</p>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                required
                placeholder="In-Game Name (IGN)"
                value={player1Ign}
                onChange={(e) => setPlayer1Ign(e.target.value)}
                className="bg-[#0D1117] border border-[#21262D] rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500"
              />
              <input
                type="text"
                required
                placeholder="Free Fire UID"
                value={player1Uid}
                onChange={(e) => setPlayer1Uid(e.target.value)}
                className="bg-[#0D1117] border border-[#21262D] rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500"
              />
            </div>
          </div>

          {/* Player 2 for Duo/Squad */}
          {(tournament.mode === 'Duo' || tournament.mode === 'Squad') && (
            <div className="p-3.5 bg-[#161B22]/60 border border-[#21262D] rounded-xl space-y-2">
              <p className="text-xs font-bold text-slate-300">প্লেয়ার ২ (Player 2)</p>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  required
                  placeholder="In-Game Name (IGN)"
                  value={player2Ign}
                  onChange={(e) => setPlayer2Ign(e.target.value)}
                  className="bg-[#0D1117] border border-[#21262D] rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500"
                />
                <input
                  type="text"
                  required
                  placeholder="Free Fire UID"
                  value={player2Uid}
                  onChange={(e) => setPlayer2Uid(e.target.value)}
                  className="bg-[#0D1117] border border-[#21262D] rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500"
                />
              </div>
            </div>
          )}

          {/* Player 3 & 4 for Squad */}
          {tournament.mode === 'Squad' && (
            <>
              <div className="p-3.5 bg-[#161B22]/60 border border-[#21262D] rounded-xl space-y-2">
                <p className="text-xs font-bold text-slate-300">প্লেয়ার ৩ (Player 3)</p>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    required
                    placeholder="In-Game Name (IGN)"
                    value={player3Ign}
                    onChange={(e) => setPlayer3Ign(e.target.value)}
                    className="bg-[#0D1117] border border-[#21262D] rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Free Fire UID"
                    value={player3Uid}
                    onChange={(e) => setPlayer3Uid(e.target.value)}
                    className="bg-[#0D1117] border border-[#21262D] rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500"
                  />
                </div>
              </div>

              <div className="p-3.5 bg-[#161B22]/60 border border-[#21262D] rounded-xl space-y-2">
                <p className="text-xs font-bold text-slate-300">প্লেয়ার ৪ (Player 4)</p>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    required
                    placeholder="In-Game Name (IGN)"
                    value={player4Ign}
                    onChange={(e) => setPlayer4Ign(e.target.value)}
                    className="bg-[#0D1117] border border-[#21262D] rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Free Fire UID"
                    value={player4Uid}
                    onChange={(e) => setPlayer4Uid(e.target.value)}
                    className="bg-[#0D1117] border border-[#21262D] rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500"
                  />
                </div>
              </div>
            </>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting || (user?.balance < tournament.entryFee && tournament.entryFee > 0)}
              className="w-full py-3 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-extrabold text-xs rounded-xl transition-all shadow-lg shadow-amber-500/20"
            >
              {isSubmitting ? 'প্রসেসিং হচ্ছে...' : 'রেজিস্ট্রেশন নিশ্চিত করুন'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
