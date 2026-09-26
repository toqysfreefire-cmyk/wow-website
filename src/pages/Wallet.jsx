import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTournaments } from '../context/TournamentContext';
import { StatusBadge } from '../components/StatusBadge';
import { formatCurrency, formatDate } from '../utils/formatters';
import {
  Wallet as WalletIcon,
  Plus,
  ArrowDownLeft,
  ArrowUpRight,
  History,
  Trophy,
  CreditCard,
  RefreshCw
} from 'lucide-react';

export const Wallet = () => {
  const { wallet, refreshAll, loading } = useTournaments();
  const [filter, setFilter] = useState('all');

  const filteredTx = (wallet.transactions || []).filter((tx) => {
    if (filter === 'deposit') return tx.type === 'deposit';
    if (filter === 'withdrawal') return tx.type === 'withdrawal';
    if (filter === 'entry_fee') return tx.type === 'entry_fee';
    if (filter === 'prize') return tx.type === 'prize';
    return true;
  });

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      
      {/* Page Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <WalletIcon className="w-6 h-6 text-emerald-400" />
            <span>মাই ওয়ালেট (My Wallet)</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            ব্যালেন্স চেক করুন, টাকা ডিপোজিট ও উইথড্র করুন।
          </p>
        </div>

        <button
          onClick={refreshAll}
          className="p-2 rounded-xl bg-[#0D1117] border border-[#21262D] text-slate-300 hover:text-white transition-colors"
          title="রিফ্রেশ করুন"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Balance Card */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#0D1117] via-[#161B22] to-[#0D1117] border border-[#21262D] p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <p className="text-xs text-slate-400 font-medium">বর্তমান ওয়ালেট ব্যালেন্স</p>
            <h2 className="text-3xl sm:text-5xl font-black text-emerald-400 mt-1">
              {formatCurrency(wallet.balance)}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/deposit"
              className="flex-1 sm:flex-initial px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-emerald-500/20 transition-all hover:scale-105 flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>ডিপোজিট করুন</span>
            </Link>

            <Link
              to="/withdraw"
              className="flex-1 sm:flex-initial px-5 py-3 rounded-xl bg-[#161B22] hover:bg-[#21262D] text-white font-extrabold text-xs border border-[#21262D] transition-all flex items-center justify-center gap-2"
            >
              <ArrowUpRight className="w-4 h-4 text-amber-400" />
              <span>উইথড্র রিকোয়েস্ট</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Transactions Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#21262D] pb-3">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <History className="w-4 h-4 text-amber-400" />
            <span>লেনদেন হিস্ট্রি (Transaction History)</span>
          </h3>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {[
              { id: 'all', label: 'সব' },
              { id: 'deposit', label: 'ডিপোজিট' },
              { id: 'withdrawal', label: 'উইথড্র' },
              { id: 'entry_fee', label: 'এন্ট্রি ফি' },
              { id: 'prize', label: 'প্রাইজ প্রফিট' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all border ${
                  filter === tab.id
                    ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold'
                    : 'bg-[#0D1117] text-slate-400 border-[#21262D] hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {filteredTx.length > 0 ? (
          <div className="bg-[#0D1117] border border-[#21262D] rounded-2xl overflow-hidden divide-y divide-[#21262D]">
            {filteredTx.map((tx) => {
              const isPositive = tx.amount > 0;
              return (
                <div
                  key={tx.id}
                  className="p-4 hover:bg-[#161B22]/50 transition-colors flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2.5 rounded-xl shrink-0 ${
                        isPositive
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : 'bg-red-500/10 text-red-400'
                      }`}
                    >
                      {isPositive ? (
                        <ArrowDownLeft className="w-4 h-4" />
                      ) : (
                        <ArrowUpRight className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">{tx.description}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">{formatDate(tx.createdAt)}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p
                      className={`text-sm font-extrabold ${
                        isPositive ? 'text-emerald-400' : 'text-slate-300'
                      }`}
                    >
                      {isPositive ? '+' : ''}
                      {formatCurrency(tx.amount)}
                    </p>
                    <span className="inline-block text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded font-semibold mt-0.5">
                      সফল
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 bg-[#0D1117] border border-[#21262D] rounded-2xl p-6 space-y-2">
            <CreditCard className="w-10 h-10 text-slate-600 mx-auto" />
            <h4 className="text-sm font-bold text-white">কোনো লেনদেন পাওয়া যায়নি</h4>
            <p className="text-xs text-slate-400">
              ডিপোজিট বা টুর্নামেন্ট রেজিস্ট্রেশনের পর আপনার হিস্ট্রি এখানে দেখা যাবে।
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
