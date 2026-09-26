import React, { useState } from 'react';
import { useTournaments } from '../context/TournamentContext';
import { StatusBadge } from '../components/StatusBadge';
import { TournamentCard } from '../components/TournamentCard';
import { Trophy, Key, Copy, Check, Clock, ShieldCheck, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '../context/ToastContext';

export const MyTournaments = () => {
  const { myTournaments } = useTournaments();
  const { addToast } = useToast();

  const [filter, setFilter] = useState('all');
  const [copiedId, setCopiedId] = useState(null);

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    addToast('কপি করা হয়েছে!', 'success');
  };

  const filtered = myTournaments.filter(t => {
    if (filter === 'room_released') return t.status === 'room_released' || t.roomId;
    if (filter === 'completed') return t.status === 'completed';
    return true;
  });

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#21262D] pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Trophy className="w-6 h-6 text-amber-400" />
            <span>আমার টুর্নামেন্ট (My Tournaments)</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            আপনার নিবন্ধিত ম্যাচ, সময়সূচি ও রুম কোড তথ্য এক জায়গায়।
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-2">
          {[
            { id: 'all', label: 'সব ম্যাচ' },
            { id: 'room_released', label: 'রুম কোড প্রস্তুত' },
            { id: 'completed', label: 'সম্পন্ন' },
          ].map((btn) => (
            <button
              key={btn.id}
              onClick={() => setFilter(btn.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                filter === btn.id
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow'
                  : 'bg-[#0D1117] text-slate-400 border-[#21262D] hover:text-white'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      {filtered.length > 0 ? (
        <div className="space-y-4">
          {filtered.map((t) => {
            const hasRoomInfo = t.status === 'room_released' || t.roomId;

            return (
              <div
                key={t.id}
                className="bg-[#0D1117] border border-[#21262D] hover:border-amber-500/30 rounded-2xl p-5 shadow-xl transition-all space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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
                      <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-3">
                        <span>ম্যাপ: {t.map}</span>
                        <span>•</span>
                        <span>সময়: {t.startTime}</span>
                      </p>
                    </div>
                  </div>

                  <Link
                    to={`/tournament/${t.slug || t.id}`}
                    className="px-4 py-2 bg-[#161B22] hover:bg-amber-500 hover:text-slate-950 text-white font-bold text-xs rounded-xl border border-[#21262D] hover:border-amber-500 transition-all self-start sm:self-center flex items-center gap-1.5"
                  >
                    <span>ডিটেইলস</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                {/* Active Room ID & Password Card */}
                {hasRoomInfo && (
                  <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <Key className="w-5 h-5 text-amber-400 shrink-0 animate-bounce" />
                      <div>
                        <p className="text-xs font-bold text-white">রুম আইডি ও পাসওয়ার্ড প্রকাশ করা হয়েছে!</p>
                        <p className="text-[11px] text-slate-400">গেমের কাস্টম রুমে দ্রুত পাসওয়ার্ড বসিয়ে যোগ দিন</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="px-3 py-1.5 bg-[#0D1117] border border-[#21262D] rounded-lg text-xs font-mono">
                        <span className="text-slate-400">ID:</span>{' '}
                        <span className="font-bold text-amber-400">{t.roomId || '---'}</span>
                      </div>
                      <button
                        onClick={() => handleCopy(t.roomId, `id_${t.id}`)}
                        className="p-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs"
                        title="রুম আইডি কপি করুন"
                      >
                        {copiedId === `id_${t.id}` ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </button>

                      <div className="px-3 py-1.5 bg-[#0D1117] border border-[#21262D] rounded-lg text-xs font-mono ml-2">
                        <span className="text-slate-400">Pass:</span>{' '}
                        <span className="font-bold text-amber-400">{t.roomPassword || '---'}</span>
                      </div>
                      <button
                        onClick={() => handleCopy(t.roomPassword, `pass_${t.id}`)}
                        className="p-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs"
                        title="পাসওয়ার্ড কপি করুন"
                      >
                        {copiedId === `pass_${t.id}` ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 bg-[#0D1117] border border-[#21262D] rounded-2xl p-8 space-y-3">
          <Trophy className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-white">এখনো কোনো টুর্নামেন্টে রেজিস্টার করেননি</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            টুর্নামেন্ট তালিকা থেকে আপনার পছন্দের ম্যাচ বেছে নিয়ে স্লট নিশ্চিত করুন।
          </p>
          <Link
            to="/"
            className="inline-block px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow mt-2"
          >
            টুর্নামেন্ট তালিকা দেখুন
          </Link>
        </div>
      )}
    </div>
  );
};
