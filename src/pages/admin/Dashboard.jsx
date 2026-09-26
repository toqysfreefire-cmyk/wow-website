import React, { useState, useEffect } from 'react';
import { fetchApi } from '../../utils/api';
import { formatCurrency, formatDate } from '../../utils/formatters';
import {
  Users,
  Wallet,
  ArrowUpRight,
  Trophy,
  AlertCircle,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadStats = async () => {
    try {
      setLoading(true);
      const res = await fetchApi('/admin/dashboard');
      setData(res);
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  if (loading) {
    return <div className="py-12 text-center text-slate-400 text-xs">অ্যাডমিন ড্যাশবোর্ড লোড হচ্ছে...</div>;
  }

  return (
    <div className="space-y-6">
      
      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Users */}
        <div className="p-5 bg-[#0D1117] border border-[#21262D] rounded-2xl">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-400 font-semibold">মোট রেজিস্টার্ড ইউজার</p>
            <div className="p-2 bg-amber-500/10 text-amber-400 rounded-xl">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-white mt-3">{data?.totalUsers || 0}</p>
        </div>

        {/* User Balance */}
        <div className="p-5 bg-[#0D1117] border border-[#21262D] rounded-2xl">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-400 font-semibold">ইউজার ব্যালেন্স মোট</p>
            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-emerald-400 mt-3">
            {formatCurrency(data?.totalUserBalance || 0)}
          </p>
        </div>

        {/* Pending Deposits */}
        <Link
          to="/admin/deposits"
          className="p-5 bg-[#0D1117] border border-[#21262D] hover:border-amber-500/50 rounded-2xl transition-all block"
        >
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-400 font-semibold">অপেক্ষমাণ ডিপোজিট</p>
            <div className="p-2 bg-amber-500/10 text-amber-400 rounded-xl">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mt-3">
            <p className="text-3xl font-black text-amber-400">{data?.pendingDepositsCount || 0}</p>
            <span className="text-[11px] text-slate-400">রিভিউ প্রয়োজন</span>
          </div>
        </Link>

        {/* Pending Withdrawals */}
        <Link
          to="/admin/withdrawals"
          className="p-5 bg-[#0D1117] border border-[#21262D] hover:border-red-500/50 rounded-2xl transition-all block"
        >
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-400 font-semibold">অপেক্ষমাণ উইথড্র</p>
            <div className="p-2 bg-red-500/10 text-red-400 rounded-xl">
              <ArrowUpRight className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mt-3">
            <p className="text-3xl font-black text-red-400">{data?.pendingWithdrawalsCount || 0}</p>
            <span className="text-[11px] text-slate-400">প্রসেস করুন</span>
          </div>
        </Link>
      </div>

      {/* Recent Deposits & Withdrawals Tables */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Recent Deposits */}
        <div className="p-5 bg-[#0D1117] border border-[#21262D] rounded-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-[#21262D] pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Wallet className="w-4 h-4 text-emerald-400" />
              <span>সাম্প্রতিক ডিপোজিট রিকোয়েস্ট</span>
            </h3>
            <Link to="/admin/deposits" className="text-xs text-amber-400 font-bold hover:underline">
              সব দেখুন
            </Link>
          </div>

          <div className="divide-y divide-[#21262D]">
            {data?.recentDeposits?.length > 0 ? (
              data.recentDeposits.map((dep) => (
                <div key={dep.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-white">{dep.userName} ({dep.method})</p>
                    <p className="text-[11px] text-slate-400">TrxID: {dep.trxId}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-extrabold text-emerald-400">{formatCurrency(dep.amount)}</p>
                    <span className={`text-[10px] ${dep.status === 'pending' ? 'text-amber-400' : 'text-emerald-400'}`}>
                      {dep.status === 'pending' ? 'অপেক্ষমাণ' : 'অনুমোদিত'}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500 py-3">কোনো ডিপোজিট রিকোয়েস্ট নেই</p>
            )}
          </div>
        </div>

        {/* Recent Withdrawals */}
        <div className="p-5 bg-[#0D1117] border border-[#21262D] rounded-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-[#21262D] pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ArrowUpRight className="w-4 h-4 text-amber-400" />
              <span>সাম্প্রতিক উইথড্র রিকোয়েস্ট</span>
            </h3>
            <Link to="/admin/withdrawals" className="text-xs text-amber-400 font-bold hover:underline">
              সব দেখুন
            </Link>
          </div>

          <div className="divide-y divide-[#21262D]">
            {data?.recentWithdrawals?.length > 0 ? (
              data.recentWithdrawals.map((w) => (
                <div key={w.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-white">{w.userName} ({w.method})</p>
                    <p className="text-[11px] text-slate-400">নম্বর: {w.accountNumber}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-extrabold text-slate-200">{formatCurrency(w.amount)}</p>
                    <span className={`text-[10px] ${w.status === 'pending' ? 'text-amber-400' : 'text-emerald-400'}`}>
                      {w.status === 'pending' ? 'অপেক্ষমাণ' : 'অনুমোদিত'}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500 py-3">কোনো উইথড্র রিকোয়েস্ট নেই</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
