import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Trophy, DollarSign, Clock, MapPin, ArrowRight, ShieldCheck, Key } from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import { formatCurrency } from '../utils/formatters';

export const TournamentCard = ({ tournament, isJoined = false }) => {
  const percentage = Math.round((tournament.slotsFilled / tournament.slotsTotal) * 100);
  const isFull = tournament.slotsFilled >= tournament.slotsTotal;

  return (
    <div className="group bg-[#0D1117] border border-[#21262D] hover:border-amber-500/40 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/5 flex flex-col">
      
      {/* Banner & Badges Header */}
      <div className="relative h-44 w-full overflow-hidden bg-slate-900">
        <img
          src={tournament.banner || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80'}
          alt={tournament.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D1117] via-[#0D1117]/40 to-transparent"></div>

        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          <StatusBadge status={tournament.status} />
        </div>

        {/* Mode & Map Badges */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <span className="px-2.5 py-1 bg-amber-500/90 text-slate-950 text-xs font-black rounded-lg shadow uppercase">
            {tournament.mode}
          </span>
          <span className="px-2.5 py-1 bg-black/60 backdrop-blur-md text-slate-200 text-xs font-medium rounded-lg border border-white/10 flex items-center gap-1">
            <MapPin className="w-3 h-3 text-amber-400" />
            {tournament.map}
          </span>
        </div>

        {/* Joined Indicator */}
        {isJoined && (
          <div className="absolute bottom-3 left-3 bg-emerald-500/90 text-slate-950 px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 shadow">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>রেজিস্টার্ড</span>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors line-clamp-1">
            {tournament.title}
          </h3>

          <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
            
            {/* Prize Pool */}
            <div className="p-2.5 bg-[#161B22] border border-[#21262D] rounded-xl flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
                <Trophy className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-medium">প্রাইজ পুল</p>
                <p className="text-xs font-bold text-amber-400">
                  {formatCurrency(tournament.prizePool)}
                </p>
              </div>
            </div>

            {/* Entry Fee */}
            <div className="p-2.5 bg-[#161B22] border border-[#21262D] rounded-xl flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
                <DollarSign className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-medium">এন্ট্রি ফি</p>
                <p className="text-xs font-bold text-emerald-400">
                  {tournament.entryFee === 0 ? 'ফ্রি' : formatCurrency(tournament.entryFee)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Slots & Schedule */}
        <div className="space-y-2 pt-1 border-t border-[#21262D]">
          
          {/* Slots Progress */}
          <div>
            <div className="flex justify-between items-center text-xs font-semibold mb-1">
              <span className="text-slate-400 flex items-center gap-1">
                <Users className="w-3.5 h-3.5" />
                স্লট বুকিং
              </span>
              <span className={isFull ? 'text-red-400 font-bold' : 'text-slate-200'}>
                {tournament.slotsFilled} / {tournament.slotsTotal}
              </span>
            </div>
            <div className="w-full h-2 bg-[#161B22] rounded-full overflow-hidden p-0.5 border border-[#21262D]">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  isFull ? 'bg-red-500' : 'bg-gradient-to-r from-amber-500 to-yellow-400'
                }`}
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
          </div>

          {/* Schedule */}
          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              {tournament.startTime}
            </span>
            {tournament.status === 'room_released' && (
              <span className="text-amber-400 font-bold flex items-center gap-1">
                <Key className="w-3 h-3 animate-bounce" />
                রুম কোড প্রস্তুত
              </span>
            )}
          </div>
        </div>

        {/* Action Button */}
        <Link
          to={`/tournament/${tournament.slug || tournament.id}`}
          className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
            tournament.status === 'room_released'
              ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/20'
              : tournament.status === 'open' && !isFull
              ? 'bg-[#161B22] hover:bg-amber-500 hover:text-slate-950 text-white border border-[#21262D] hover:border-amber-500'
              : 'bg-[#161B22] text-slate-400 border border-[#21262D]'
          }`}
        >
          <span>
            {tournament.status === 'room_released'
              ? 'রুম কোড ও পাসওয়ার্ড দেখুন'
              : isFull
              ? 'স্লট পূর্ণ (বিস্তারিত দেখুন)'
              : 'টুর্নামেন্টে অংশ নিন'}
          </span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
