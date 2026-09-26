import React, { useState } from 'react';
import { useTournaments } from '../../context/TournamentContext';
import { useToast } from '../../context/ToastContext';
import { fetchApi } from '../../utils/api';
import { Modal } from '../../components/Modal';
import { StatusBadge } from '../../components/StatusBadge';
import { formatCurrency } from '../../utils/formatters';
import {
  Plus,
  Trophy,
  Key,
  Edit,
  Award,
  Users,
  MapPin,
  Clock,
  Trash2
} from 'lucide-react';

export const AdminTournaments = () => {
  const { tournaments, fetchTournaments } = useTournaments();
  const { addToast } = useToast();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
  const [isWinnerModalOpen, setIsWinnerModalOpen] = useState(false);

  const [selectedTournament, setSelectedTournament] = useState(null);

  // New tournament form
  const [title, setTitle] = useState('');
  const [mode, setMode] = useState('Solo');
  const [map, setMap] = useState('Bermuda');
  const [entryFee, setEntryFee] = useState(30);
  const [prizePool, setPrizePool] = useState(1000);
  const [slotsTotal, setSlotsTotal] = useState(48);
  const [startTime, setStartTime] = useState('আজ রাত ৯:০০ টা');
  const [regDeadline, setRegDeadline] = useState('আজ রাত ৮:৩০ টা');
  const [banner, setBanner] = useState('');
  const [bannerFile, setBannerFile] = useState(null);

  // Room modal form
  const [roomId, setRoomId] = useState('');
  const [roomPassword, setRoomPassword] = useState('');

  // Winner modal form
  const [winnerName, setWinnerName] = useState('');

  const [loading, setLoading] = useState(false);

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const prizeBreakdown = [
        { rank: '1st Place', prize: `৳${Math.round(prizePool * 0.5)}` },
        { rank: '2nd Place', prize: `৳${Math.round(prizePool * 0.3)}` },
        { rank: '3rd Place', prize: `৳${Math.round(prizePool * 0.2)}` }
      ];
      const body = new FormData();
      body.append('title', title);
      body.append('mode', mode);
      body.append('map', map);
      body.append('entryFee', String(Number(entryFee)));
      body.append('prizePool', String(Number(prizePool)));
      body.append('slotsTotal', String(Number(slotsTotal)));
      body.append('startTime', startTime);
      body.append('regDeadline', regDeadline);
      body.append('prizeBreakdown', JSON.stringify(prizeBreakdown));
      if (bannerFile) body.append('banner', bannerFile);
      else if (banner) body.append('banner', banner);

      await fetchApi('/admin/tournaments', {
        method: 'POST',
        body
      });
      addToast('নতুন টুর্নামেন্ট সফলভাবে তৈরি হয়েছে!', 'success');
      setIsCreateModalOpen(false);
      setBannerFile(null);
      setBanner('');
      await fetchTournaments();
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTournament = async (tournament) => {
    if (!window.confirm(`আপনি কি "${tournament.title}" টুর্নামেন্টটি মুছে ফেলতে চান?`)) return;
    try {
      setLoading(true);
      await fetchApi(`/admin/tournaments/${tournament.id}`, { method: 'DELETE' });
      addToast('টুর্নামেন্ট মুছে ফেলা হয়েছে।', 'success');
      await fetchTournaments();
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleRoomPublishSubmit = async (e) => {
    e.preventDefault();
    if (!selectedTournament) return;
    try {
      setLoading(true);
      await fetchApi(`/admin/tournaments/${selectedTournament.id}/room-credentials`, {
        method: 'POST',
        body: JSON.stringify({ roomId, roomPassword }),
      });
      addToast('রুম আইডি ও পাসওয়ার্ড প্রকাশ করা হয়েছে!', 'success');
      setIsRoomModalOpen(false);
      await fetchTournaments();
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleWinnerSubmit = async (e) => {
    e.preventDefault();
    if (!selectedTournament) return;
    try {
      setLoading(true);
      await fetchApi(`/admin/tournaments/${selectedTournament.id}/winners`, {
        method: 'POST',
        body: JSON.stringify({ winner: winnerName }),
      });
      addToast('বিজয়ীর নাম প্রকাশিত হয়েছে!', 'success');
      setIsWinnerModalOpen(false);
      await fetchTournaments();
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">টুর্নামেন্ট ব্যবস্থাপনা</h2>
          <p className="text-xs text-slate-400">নতুন টুর্নামেন্ট শুরু করুন, রুম কোড দিন ও প্রাইজ বিতরণ করুন।</p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow flex items-center gap-2"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>নতুন টুর্নামেন্ট তৈরি করুন</span>
        </button>
      </div>

      {/* Tournament Cards List */}
      <div className="space-y-4">
        {tournaments.map((t) => (
          <div
            key={t.id}
            className="p-5 bg-[#0D1117] border border-[#21262D] rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div className="flex items-start gap-4">
              <img
                src={t.banner || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80'}
                alt={t.title}
                className="w-16 h-16 rounded-xl object-cover border border-[#21262D] shrink-0"
              />
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 text-[10px] font-bold rounded">
                    {t.mode}
                  </span>
                  <StatusBadge status={t.status} />
                </div>
                <h3 className="text-base font-bold text-white mt-1">{t.title}</h3>
                <p className="text-xs text-slate-400 mt-0.5 flex flex-wrap items-center gap-3">
                  <span>ফি: {formatCurrency(t.entryFee)}</span>
                  <span>•</span>
                  <span>প্রাইজ: {formatCurrency(t.prizePool)}</span>
                  <span>•</span>
                  <span>স্লট: {t.slotsFilled}/{t.slotsTotal}</span>
                </p>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center gap-2">
              
              {/* Set Room ID */}
              <button
                onClick={() => {
                  setSelectedTournament(t);
                  setRoomId(t.roomId || '');
                  setRoomPassword(t.roomPassword || '');
                  setIsRoomModalOpen(true);
                }}
                className="px-3.5 py-2 bg-[#161B22] hover:bg-amber-500 hover:text-slate-950 text-amber-400 font-bold text-xs rounded-xl border border-amber-500/30 transition-all flex items-center gap-1.5"
              >
                <Key className="w-3.5 h-3.5" />
                <span>রুম পাসওয়ার্ড দিন</span>
              </button>

              {/* Set Winners */}
              <button
                onClick={() => {
                  setSelectedTournament(t);
                  setWinnerName(t.winner || '');
                  setIsWinnerModalOpen(true);
                }}
                className="px-3.5 py-2 bg-[#161B22] hover:bg-emerald-500 hover:text-slate-950 text-emerald-400 font-bold text-xs rounded-xl border border-emerald-500/30 transition-all flex items-center gap-1.5"
              >
                <Award className="w-3.5 h-3.5" />
                <span>বিজয়ী প্রকাশ</span>
              </button>

              <button
                onClick={() => handleDeleteTournament(t)}
                disabled={loading}
                title="টুর্নামেন্ট মুছুন"
                aria-label={`${t.title} টুর্নামেন্ট মুছুন`}
                className="p-2 bg-[#161B22] hover:bg-rose-500 hover:text-white text-rose-400 rounded-xl border border-rose-500/30 transition-all disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* CREATE TOURNAMENT MODAL */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="নতুন টুর্নামেন্ট তৈরি করুন"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">টুর্নামেন্ট নাম</label>
            <input
              type="text"
              required
              placeholder="যেমন: Bermuda Rush Solo #102"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#161B22] border border-[#21262D] rounded-xl px-3.5 py-2.5 text-xs text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">টুর্নামেন্টের ছবি</label>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={(e) => setBannerFile(e.target.files?.[0] || null)}
              className="w-full bg-[#161B22] border border-[#21262D] rounded-xl px-3.5 py-2.5 text-xs text-white file:mr-3 file:rounded-md file:border-0 file:bg-amber-500 file:px-3 file:py-1.5 file:text-xs file:font-bold file:text-slate-950"
            />
            {bannerFile && <p className="mt-1 text-xs text-slate-400">{bannerFile.name}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">গেম মোড</label>
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value)}
                className="w-full bg-[#161B22] border border-[#21262D] rounded-xl px-3 py-2.5 text-xs text-white"
              >
                <option value="Solo">Solo (১ জন)</option>
                <option value="Duo">Duo (২ জন)</option>
                <option value="Squad">Squad (৪ জন)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">ম্যাপ</label>
              <select
                value={map}
                onChange={(e) => setMap(e.target.value)}
                className="w-full bg-[#161B22] border border-[#21262D] rounded-xl px-3 py-2.5 text-xs text-white"
              >
                <option value="Bermuda">Bermuda</option>
                <option value="Purgatory">Purgatory</option>
                <option value="Kalahari">Kalahari</option>
                <option value="Alpine">Alpine</option>
                <option value="Nexterra">Nexterra</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">এন্ট্রি ফি (BDT)</label>
              <input
                type="number"
                required
                value={entryFee}
                onChange={(e) => setEntryFee(e.target.value)}
                className="w-full bg-[#161B22] border border-[#21262D] rounded-xl px-3.5 py-2.5 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">প্রাইজ পুল (BDT)</label>
              <input
                type="number"
                required
                value={prizePool}
                onChange={(e) => setPrizePool(e.target.value)}
                className="w-full bg-[#161B22] border border-[#21262D] rounded-xl px-3.5 py-2.5 text-xs text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">সর্বমোট স্লট</label>
              <input
                type="number"
                required
                value={slotsTotal}
                onChange={(e) => setSlotsTotal(e.target.value)}
                className="w-full bg-[#161B22] border border-[#21262D] rounded-xl px-3.5 py-2.5 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">স্টার্ট টাইম</label>
              <input
                type="text"
                required
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full bg-[#161B22] border border-[#21262D] rounded-xl px-3.5 py-2.5 text-xs text-white"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow"
          >
            {loading ? 'তৈরি হচ্ছে...' : 'টুর্নামেন্ট পাবলিশ করুন'}
          </button>
        </form>
      </Modal>

      {/* ROOM ID MODAL */}
      <Modal
        isOpen={isRoomModalOpen}
        onClose={() => setIsRoomModalOpen(false)}
        title={`রুম পাসওয়ার্ড প্রদান — ${selectedTournament?.title}`}
      >
        <form onSubmit={handleRoomPublishSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">রুম আইডি (Room ID)</label>
            <input
              type="text"
              required
              placeholder="যেমন: BDFF-99120"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              className="w-full bg-[#161B22] border border-[#21262D] rounded-xl px-3.5 py-2.5 text-xs text-white font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">পাসওয়ার্ড (Password)</label>
            <input
              type="text"
              required
              placeholder="যেমন: 1234"
              value={roomPassword}
              onChange={(e) => setRoomPassword(e.target.value)}
              className="w-full bg-[#161B22] border border-[#21262D] rounded-xl px-3.5 py-2.5 text-xs text-white font-mono"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow"
          >
            {loading ? 'প্রকাশ হচ্ছে...' : 'রুম কোড প্লেয়ারদের জন্য উন্মুক্ত করুন'}
          </button>
        </form>
      </Modal>

      {/* WINNER MODAL */}
      <Modal
        isOpen={isWinnerModalOpen}
        onClose={() => setIsWinnerModalOpen(false)}
        title={`বিজয়ী প্রকাশ — ${selectedTournament?.title}`}
      >
        <form onSubmit={handleWinnerSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">বিজয়ীর নাম / টিম নাম</label>
            <input
              type="text"
              required
              placeholder="যেমন: OP_TANVIR"
              value={winnerName}
              onChange={(e) => setWinnerName(e.target.value)}
              className="w-full bg-[#161B22] border border-[#21262D] rounded-xl px-3.5 py-2.5 text-xs text-white"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow"
          >
            {loading ? 'প্রসেস হচ্ছে...' : 'বিজয়ী সাবমিট ও ম্যাচ সম্পন্ন করুন'}
          </button>
        </form>
      </Modal>
    </div>
  );
};
