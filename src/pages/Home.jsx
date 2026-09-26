import React, { useState } from 'react';
import { useTournaments } from '../context/TournamentContext';
import { useAuth } from '../context/AuthContext';
import { TournamentCard } from '../components/TournamentCard';
import {
  Gamepad2,
  Trophy,
  Users,
  Search,
  Zap,
  Flame,
  Volume2,
  ShieldCheck,
  Wallet,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const Home = () => {
  const { tournaments, myTournaments, loading } = useTournaments();
  const { settings } = useAuth();
  
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const joinedIds = new Set(myTournaments.map(t => t.id));

  // Category filters
  const filteredTournaments = tournaments.filter((t) => {
    // Mode filter
    if (selectedCategory === 'solo' && t.mode !== 'Solo') return false;
    if (selectedCategory === 'duo' && t.mode !== 'Duo') return false;
    if (selectedCategory === 'squad' && t.mode !== 'Squad') return false;
    if (selectedCategory === 'room_released' && t.status !== 'room_released') return false;

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const titleMatch = t.title.toLowerCase().includes(q);
      const mapMatch = t.map.toLowerCase().includes(q);
      const modeMatch = t.mode.toLowerCase().includes(q);
      return titleMatch || mapMatch || modeMatch;
    }
    return true;
  });

  return (
    <div className="space-y-8 pb-12">
      
      {/* Ticker Notice Banner */}
      {settings.noticeBanner && (
        <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/20 to-amber-500/10 border-y border-amber-500/30 px-4 py-2.5 text-xs text-amber-300 flex items-center gap-3 shadow-inner">
          <div className="flex items-center gap-1.5 font-bold text-amber-400 shrink-0 bg-amber-500/20 px-2.5 py-1 rounded-lg border border-amber-500/30">
            <Volume2 className="w-3.5 h-3.5 animate-pulse" />
            <span>ঘোষণা</span>
          </div>
          <marquee className="font-medium">{settings.noticeBanner}</marquee>
        </div>
      )}

      {/* Hero Banner Section */}
      <div className="relative rounded-3xl overflow-hidden border border-[#21262D] bg-gradient-to-br from-[#0D1117] via-[#161B22] to-[#080A10] p-6 sm:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold">
            <Flame className="w-4 h-4" />
            <span>বাংলাদেশের এক নম্বর ফ্রি ফায়ার টুর্নামেন্ট হাব</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            খেলুন। জিতুন। <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500">
              চ্যাম্পিয়ন হোন!
            </span>
          </h1>

          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            Solo, Duo ও Squad টুর্নামেন্টে অংশ নিন। bKash দিয়ে তাৎক্ষণিক ডিপোজিট করুন এবং আপনার প্রিয় ফ্রি ফায়ার ম্যাচে প্রাইজ পুল জিতে নিন।
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <a
              href="#tournaments-list"
              className="px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-amber-500/20 transition-all hover:scale-105 flex items-center gap-2"
            >
              <Gamepad2 className="w-4 h-4" />
              <span>টুর্নামেন্ট দেখুন</span>
            </a>

            <Link
              to="/deposit"
              className="px-5 py-3 rounded-xl bg-[#161B22] hover:bg-[#21262D] text-white font-bold text-xs sm:text-sm border border-[#21262D] transition-all flex items-center gap-2"
            >
              <Wallet className="w-4 h-4 text-emerald-400" />
              <span>ডিপোজিট করুন</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div id="tournaments-list" className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
            {[
              { id: 'all', label: 'সব টুর্নামেন্ট', icon: Trophy },
              { id: 'solo', label: 'Solo (১ জন)', icon: Gamepad2 },
              { id: 'duo', label: 'Duo (২ জন)', icon: Users },
              { id: 'squad', label: 'Squad (৪ জন)', icon: Users },
              { id: 'room_released', label: 'রুম কোড প্রস্তুত', icon: Zap },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = selectedCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedCategory(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20'
                      : 'bg-[#0D1117] text-slate-400 border-[#21262D] hover:text-white hover:border-slate-600'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="টুর্নামেন্ট বা ম্যাপ খুঁজুন..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0D1117] border border-[#21262D] rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>
        </div>

        {/* Tournament Grid */}
        {filteredTournaments.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTournaments.map((t) => (
              <TournamentCard
                key={t.id}
                tournament={t}
                isJoined={joinedIds.has(t.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-[#0D1117] border border-[#21262D] rounded-2xl p-8 space-y-3">
            <Trophy className="w-12 h-12 text-slate-600 mx-auto" />
            <h3 className="text-base font-bold text-white">কোনো টুর্নামেন্ট পাওয়া যায়নি</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              আপনার ফিল্টার অনুযায়ী বর্তমানে কোনো টুর্নামেন্ট নেই। অন্য ক্যাটাগরি বেছে নিন অথবা নতুন টুর্নামেন্টের জন্য অপেক্ষা করুন।
            </p>
          </div>
        )}
      </div>

      {/* Platform Features Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-[#21262D]">
        <div className="p-5 bg-[#0D1117] border border-[#21262D] rounded-2xl flex items-start gap-4">
          <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">১০০% ফেয়ার প্লে</h4>
            <p className="text-xs text-slate-400 mt-1">
              হ্যাকার ফ্রি ফেয়ার এনভায়রনমেন্ট ও ম্যানুয়াল রেজাল্ট ভেরিফিকেশন।
            </p>
          </div>
        </div>

        <div className="p-5 bg-[#0D1117] border border-[#21262D] rounded-2xl flex items-start gap-4">
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl shrink-0">
            <Wallet className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">দ্রুত পেমেন্ট উইথড্র</h4>
            <p className="text-xs text-slate-400 mt-1">
              bKash এর মাধ্যমে দ্রুত ডিপোজিট ও ইনস্ট্যান্ট উইথড্র সুবিধা।
            </p>
          </div>
        </div>

        <div className="p-5 bg-[#0D1117] border border-[#21262D] rounded-2xl flex items-start gap-4">
          <div className="p-3 bg-sky-500/10 text-sky-400 rounded-xl shrink-0">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">স্বয়ংক্রিয় রুম পাসওয়ার্ড</h4>
            <p className="text-xs text-slate-400 mt-1">
              ম্যাচ শুরু হওয়ার নির্দিষ্ট সময়ে সরাসরি অ্যাপেই রুম আইডি ও পাসওয়ার্ড দৃশ্যমান।
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
