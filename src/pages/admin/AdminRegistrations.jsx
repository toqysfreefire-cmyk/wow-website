import React, { useState, useEffect } from 'react';
import { fetchApi } from '../../utils/api';
import { useToast } from '../../context/ToastContext';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { Check, X, ShieldCheck, User } from 'lucide-react';

export const AdminRegistrations = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  const loadRegistrations = async () => {
    try {
      setLoading(true);
      const data = await fetchApi('/admin/registrations');
      setRegistrations(data);
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRegistrations();
  }, []);

  const handleReview = async (id, status) => {
    try {
      await fetchApi(`/admin/registrations/${id}/review`, {
        method: 'POST',
        body: JSON.stringify({ status }),
      });
      addToast(
        status === 'approved' ? 'রেজিস্ট্রেশন অনুমোদিত হয়েছে!' : 'রেজিস্ট্রেশন বাতিল ও ফি ফেরত দেওয়া হয়েছে',
        'info'
      );
      await loadRegistrations();
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">রেজিস্ট্রেশন পর্যালোচনা</h2>
        <p className="text-xs text-slate-400">প্লেয়ারদের টিম রেজিস্ট্রেশন অনুমোদন করুন বা বাতিল (ফি রিফান্ড) করুন।</p>
      </div>

      <div className="space-y-3">
        {registrations.length > 0 ? (
          registrations.map((reg) => (
            <div
              key={reg.id}
              className="p-5 bg-[#0D1117] border border-[#21262D] rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-sm">{reg.teamName || reg.userName}</span>
                  <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 text-[10px] font-bold rounded">
                    {reg.mode}
                  </span>
                </div>

                <p className="text-xs text-slate-400 mt-1">
                  ইউজার: {reg.userName} ({reg.userPhone}) • পরিশোধিত ফি: {formatCurrency(reg.feePaid)}
                </p>

                {reg.players && reg.players.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {reg.players.map((p, idx) => (
                      <span key={idx} className="text-[11px] bg-[#161B22] border border-[#21262D] px-2 py-1 rounded text-slate-300">
                        IGN: {p.ign} (UID: {p.uid})
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                {reg.status === 'approved' ? (
                  <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-lg text-xs font-bold">
                    অনুমোদিত
                  </span>
                ) : reg.status === 'rejected' ? (
                  <span className="px-3 py-1 bg-red-500/10 text-red-400 border border-red-500/30 rounded-lg text-xs font-bold">
                    বাতিলকৃত
                  </span>
                ) : (
                  <>
                    <button
                      onClick={() => handleReview(reg.id, 'approved')}
                      className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg flex items-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>অনুমোদন</span>
                    </button>
                    <button
                      onClick={() => handleReview(reg.id, 'rejected')}
                      className="px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 font-bold text-xs rounded-lg flex items-center gap-1"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>বাতিল (রিফান্ড)</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="py-12 text-center text-xs text-slate-500">কোনো রেজিস্ট্রেশন পাওয়া যায়নি।</div>
        )}
      </div>
    </div>
  );
};
