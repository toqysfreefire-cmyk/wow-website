import React, { useState, useEffect } from 'react';
import { fetchApi } from '../../utils/api';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { Settings as SettingsIcon, Save, AlertTriangle } from 'lucide-react';

export const AdminSettings = () => {
  const { settings: initialSettings } = useAuth();
  const { addToast } = useToast();

  const [bKashNumber, setBKashNumber] = useState(initialSettings.bKashNumber || '');
  
  const [minDeposit, setMinDeposit] = useState(initialSettings.minDeposit || 50);
  const [maxDeposit, setMaxDeposit] = useState(initialSettings.maxDeposit || 10000);
  
  const [minWithdraw, setMinWithdraw] = useState(initialSettings.minWithdraw || 50);
  const [maxWithdraw, setMaxWithdraw] = useState(initialSettings.maxWithdraw || 5000);

  const [noticeBanner, setNoticeBanner] = useState(initialSettings.noticeBanner || '');
  const [maintenanceMode, setMaintenanceMode] = useState(initialSettings.maintenanceMode || false);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchApi('/admin/settings')
      .then((data) => {
        if (data) {
          setBKashNumber(data.bKashNumber || '');
          setMinDeposit(data.minDeposit || 50);
          setMaxDeposit(data.maxDeposit || 10000);
          setMinWithdraw(data.minWithdraw || 50);
          setMaxWithdraw(data.maxWithdraw || 5000);
          setNoticeBanner(data.noticeBanner || '');
          setMaintenanceMode(data.maintenanceMode || false);
        }
      })
      .catch(() => {});
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await fetchApi('/admin/settings', {
        method: 'PATCH',
        body: JSON.stringify({
          bKashNumber,
          minDeposit: Number(minDeposit),
          maxDeposit: Number(maxDeposit),
          minWithdraw: Number(minWithdraw),
          maxWithdraw: Number(maxWithdraw),
          noticeBanner,
          maintenanceMode
        }),
      });
      addToast('প্লাটফর্ম সেটিংস সফলভাবে আপডেট হয়েছে!', 'success');
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-6 max-w-3xl">
      <div>
        <h2 className="text-xl font-bold text-white">প্লাটফর্ম ও পেমেন্ট সেটিংস</h2>
        <p className="text-xs text-slate-400">ডিপোজিট/উইথড্র সীমা, পেমেন্ট নম্বর ও ঘোষণা ব্যানার পরিবর্তন করুন।</p>
      </div>

      {/* Payment Numbers */}
      <div className="p-6 bg-[#0D1117] border border-[#21262D] rounded-2xl space-y-4">
        <h3 className="text-sm font-bold text-white">পেমেন্ট নম্বরসমূহ</h3>

        <div>
          <div>
            <label className="block text-xs font-semibold text-pink-400 mb-1">bKash (বিকাশ) নম্বর</label>
            <input
              type="text"
              required
              value={bKashNumber}
              onChange={(e) => setBKashNumber(e.target.value)}
              className="w-full bg-[#161B22] border border-[#21262D] rounded-xl px-3.5 py-2.5 text-xs text-white"
            />
          </div>

        </div>
      </div>

      {/* Limits */}
      <div className="p-6 bg-[#0D1117] border border-[#21262D] rounded-2xl space-y-4">
        <h3 className="text-sm font-bold text-white">ডিপোজিট ও উইথড্র সীমা (BDT)</h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">সর্বনিম্ন ডিপোজিট</label>
            <input
              type="number"
              required
              value={minDeposit}
              onChange={(e) => setMinDeposit(e.target.value)}
              className="w-full bg-[#161B22] border border-[#21262D] rounded-xl px-3.5 py-2.5 text-xs text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">সর্বোচ্চ ডিপোজিট</label>
            <input
              type="number"
              required
              value={maxDeposit}
              onChange={(e) => setMaxDeposit(e.target.value)}
              className="w-full bg-[#161B22] border border-[#21262D] rounded-xl px-3.5 py-2.5 text-xs text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">সর্বনিম্ন উইথড্র</label>
            <input
              type="number"
              required
              value={minWithdraw}
              onChange={(e) => setMinWithdraw(e.target.value)}
              className="w-full bg-[#161B22] border border-[#21262D] rounded-xl px-3.5 py-2.5 text-xs text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">সর্বোচ্চ উইথড্র</label>
            <input
              type="number"
              required
              value={maxWithdraw}
              onChange={(e) => setMaxWithdraw(e.target.value)}
              className="w-full bg-[#161B22] border border-[#21262D] rounded-xl px-3.5 py-2.5 text-xs text-white"
            />
          </div>
        </div>
      </div>

      {/* Notice Banner */}
      <div className="p-6 bg-[#0D1117] border border-[#21262D] rounded-2xl space-y-4">
        <h3 className="text-sm font-bold text-white">ঘোষণা ব্যানার নোটিশ (Ticker Notice)</h3>
        <div>
          <input
            type="text"
            value={noticeBanner}
            onChange={(e) => setNoticeBanner(e.target.value)}
            className="w-full bg-[#161B22] border border-[#21262D] rounded-xl px-3.5 py-2.5 text-xs text-white"
            placeholder="হোম পেজে চলমান নোটিশ টেক্সট লিখুন..."
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow transition-all flex items-center gap-2"
      >
        <Save className="w-4 h-4" />
        <span>{loading ? 'সংরক্ষণ হচ্ছে...' : 'সেটিংস সংরক্ষণ করুন'}</span>
      </button>
    </form>
  );
};
