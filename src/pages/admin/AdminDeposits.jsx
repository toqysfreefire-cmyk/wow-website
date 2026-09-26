import React, { useState, useEffect } from 'react';
import { fetchApi } from '../../utils/api';
import { useToast } from '../../context/ToastContext';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { Check, X, Wallet, Clock } from 'lucide-react';

export const AdminDeposits = () => {
  const [deposits, setDeposits] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  const loadDeposits = async () => {
    try {
      setLoading(true);
      const data = await fetchApi('/wallet');
      // For admin view, fetch from backend via admin stats or wallet
      const bootstrap = await fetchApi('/app/bootstrap');
      // Let's call admin stats / deposits endpoint if available
      const adminDash = await fetchApi('/admin/dashboard');
      if (adminDash.recentDeposits) {
        setDeposits(adminDash.recentDeposits);
      }
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDeposits();
  }, []);

  const handleApprove = async (id) => {
    try {
      await fetchApi(`/admin/deposits/${id}/approve`, { method: 'POST' });
      addToast('ডিপোজিট অনুমোদিত — ইউজার ব্যালেন্স যোগ হয়েছে!', 'success');
      await loadDeposits();
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const handleReject = async (id) => {
    try {
      await fetchApi(`/admin/deposits/${id}/reject`, {
        method: 'POST',
        body: JSON.stringify({ note: 'TrxID অমিল অথবা ভুল তথ্য' }),
      });
      addToast('ডিপোজিট বাতিল করা হয়েছে', 'info');
      await loadDeposits();
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">ডিপোজিট অনুরোধ রিভিউ</h2>
        <p className="text-xs text-slate-400">TrxID যাচাই করে ডিপোজিট অনুমোদন করুন। সাথে সাথে ইউজার অ্যাকাউন্টে ব্যালেন্স যুক্ত হবে।</p>
      </div>

      <div className="space-y-3">
        {deposits.length > 0 ? (
          deposits.map((dep) => (
            <div
              key={dep.id}
              className="p-5 bg-[#0D1117] border border-[#21262D] rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-white text-base">{dep.userName}</span>
                  <span className="px-2.5 py-0.5 bg-pink-500/20 text-pink-400 text-xs font-bold rounded">
                    {dep.method}
                  </span>
                </div>

                <p className="text-xs text-slate-300 mt-1">
                  প্রেরিত নম্বর: <span className="font-bold text-white">{dep.senderPhone}</span> • TrxID:{' '}
                  <span className="font-mono font-bold text-amber-400">{dep.trxId}</span>
                </p>

                <p className="text-[11px] text-slate-400 mt-0.5">
                  সময়: {formatDate(dep.createdAt)}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-lg font-black text-emerald-400 mr-2">
                  {formatCurrency(dep.amount)}
                </span>

                {dep.status === 'approved' ? (
                  <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-lg text-xs font-bold">
                    অনুমোদিত
                  </span>
                ) : dep.status === 'rejected' ? (
                  <span className="px-3 py-1 bg-red-500/10 text-red-400 border border-red-500/30 rounded-lg text-xs font-bold">
                    বাতিলকৃত
                  </span>
                ) : (
                  <>
                    <button
                      onClick={() => handleApprove(dep.id)}
                      className="px-3.5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow flex items-center gap-1"
                    >
                      <Check className="w-4 h-4" />
                      <span>অনুমোদন</span>
                    </button>
                    <button
                      onClick={() => handleReject(dep.id)}
                      className="px-3 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 font-bold text-xs rounded-xl flex items-center gap-1"
                    >
                      <X className="w-4 h-4" />
                      <span>বাতিল</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="py-12 text-center text-xs text-slate-500">কোনো ডিপোজিট অনুরোধ পাওয়া যায়নি।</div>
        )}
      </div>
    </div>
  );
};
