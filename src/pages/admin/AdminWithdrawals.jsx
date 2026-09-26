import React, { useState, useEffect } from 'react';
import { fetchApi } from '../../utils/api';
import { useToast } from '../../context/ToastContext';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { Check, X, ArrowUpRight } from 'lucide-react';

export const AdminWithdrawals = () => {
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  const loadWithdrawals = async () => {
    try {
      setLoading(true);
      const adminDash = await fetchApi('/admin/dashboard');
      if (adminDash.recentWithdrawals) {
        setWithdrawals(adminDash.recentWithdrawals);
      }
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWithdrawals();
  }, []);

  const handleApprove = async (id) => {
    try {
      await fetchApi(`/admin/withdrawals/${id}/approve`, { method: 'POST' });
      addToast('উইথড্র রিকোয়েস্ট সফলভাবে সম্পন্ন হয়েছে!', 'success');
      await loadWithdrawals();
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const handleReject = async (id) => {
    try {
      await fetchApi(`/admin/withdrawals/${id}/reject`, {
        method: 'POST',
        body: JSON.stringify({ note: 'উইথড্র বাতিল — ব্যালেন্স ফেরত দেওয়া হয়েছে' }),
      });
      addToast('উইথড্র বাতিল ও ব্যালেন্স ইউজারকে ফেরত দেওয়া হয়েছে', 'info');
      await loadWithdrawals();
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">উইথড্র অনুরোধ রিভিউ</h2>
        <p className="text-xs text-slate-400">উইথড্র টাকা পাঠিয়ে অনুমোদন করুন অথবা বাতিল (অটো রিফান্ড) করুন।</p>
      </div>

      <div className="space-y-3">
        {withdrawals.length > 0 ? (
          withdrawals.map((w) => (
            <div
              key={w.id}
              className="p-5 bg-[#0D1117] border border-[#21262D] rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-white text-base">{w.userName}</span>
                  <span className="px-2.5 py-0.5 bg-amber-500/20 text-amber-400 text-xs font-bold rounded">
                    {w.method}
                  </span>
                </div>

                <p className="text-xs text-slate-300 mt-1">
                  উইথড্র নম্বর: <span className="font-mono font-bold text-white">{w.accountNumber}</span>
                </p>

                <p className="text-[11px] text-slate-400 mt-0.5">
                  সময়: {formatDate(w.createdAt)}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-lg font-black text-slate-200 mr-2">
                  {formatCurrency(w.amount)}
                </span>

                {w.status === 'approved' ? (
                  <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-lg text-xs font-bold">
                    অনুমোদিত
                  </span>
                ) : w.status === 'rejected' ? (
                  <span className="px-3 py-1 bg-red-500/10 text-red-400 border border-red-500/30 rounded-lg text-xs font-bold">
                    বাতিল (ফেরতকৃত)
                  </span>
                ) : (
                  <>
                    <button
                      onClick={() => handleApprove(w.id)}
                      className="px-3.5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow flex items-center gap-1"
                    >
                      <Check className="w-4 h-4" />
                      <span>অনুমোদন</span>
                    </button>
                    <button
                      onClick={() => handleReject(w.id)}
                      className="px-3 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 font-bold text-xs rounded-xl flex items-center gap-1"
                    >
                      <X className="w-4 h-4" />
                      <span>বাতিল (রিফান্ড)</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="py-12 text-center text-xs text-slate-500">কোনো উইথড্র অনুরোধ পাওয়া যায়নি।</div>
        )}
      </div>
    </div>
  );
};
