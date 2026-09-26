import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { fetchApi } from '../utils/api';
import {
  User,
  Shield,
  Key,
  Gamepad2,
  Trophy,
  Award,
  Wallet,
  LogOut,
  Save
} from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

export const Profile = () => {
  const { user, logout, refreshUser } = useAuth();
  const { addToast } = useToast();

  const [name, setName] = useState(user?.name || '');
  const [ign, setIgn] = useState(user?.ign || '');
  const [uid, setUid] = useState(user?.uid || '');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const [stats, setStats] = useState({ matchesPlayed: 0, matchesWon: 0, totalKills: 0 });
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isUpdatingPass, setIsUpdatingPass] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setIgn(user.ign || '');
      setUid(user.uid || '');
      fetchApi('/profile')
        .then((res) => {
          if (res.stats) setStats(res.stats);
        })
        .catch(() => {});
    }
  }, [user]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      setIsUpdatingProfile(true);
      await fetchApi('/profile', {
        method: 'PATCH',
        body: JSON.stringify({ name, ign, uid }),
      });
      addToast('প্রোফাইল তথ্য আপডেট হয়েছে!', 'success');
      await refreshUser();
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) return;

    try {
      setIsUpdatingPass(true);
      await fetchApi('/auth/password', {
        method: 'POST',
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      addToast('পাসওয়ার্ড পরিবর্তিত হয়েছে!', 'success');
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setIsUpdatingPass(false);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      
      {/* User Info Header Card */}
      <div className="p-6 bg-[#0D1117] border border-[#21262D] rounded-3xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border-2 border-amber-500/40 flex items-center justify-center text-amber-400 font-extrabold text-2xl shadow">
            {user.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold text-white">{user.name}</h2>
              {user.role === 'admin' && (
                <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded text-[10px] font-bold">
                  অ্যাডমিন
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">{user.phone} • {user.email}</p>
            <p className="text-xs font-semibold text-amber-400 mt-1">
              FF IGN: {user.ign || 'Not Set'} (UID: {user.uid || 'Not Set'})
            </p>
          </div>
        </div>

        <button
          onClick={logout}
          className="px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 font-bold text-xs flex items-center gap-2 transition-all"
        >
          <LogOut className="w-4 h-4" />
          <span>লগ আউট</span>
        </button>
      </div>

      {/* Stats Summary Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-[#0D1117] border border-[#21262D] rounded-2xl">
          <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg w-max mb-2">
            <Wallet className="w-4 h-4" />
          </div>
          <p className="text-xs text-slate-400">ব্যালেন্স</p>
          <p className="text-lg font-extrabold text-emerald-400 mt-0.5">
            {formatCurrency(user.balance)}
          </p>
        </div>

        <div className="p-4 bg-[#0D1117] border border-[#21262D] rounded-2xl">
          <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg w-max mb-2">
            <Gamepad2 className="w-4 h-4" />
          </div>
          <p className="text-xs text-slate-400">মোট খেলা ম্যাচ</p>
          <p className="text-lg font-extrabold text-white mt-0.5">{stats.matchesPlayed}</p>
        </div>

        <div className="p-4 bg-[#0D1117] border border-[#21262D] rounded-2xl">
          <div className="p-2 bg-purple-500/10 text-purple-400 rounded-lg w-max mb-2">
            <Trophy className="w-4 h-4" />
          </div>
          <p className="text-xs text-slate-400">মোট বিজয় (Wins)</p>
          <p className="text-lg font-extrabold text-white mt-0.5">{stats.matchesWon}</p>
        </div>

        <div className="p-4 bg-[#0D1117] border border-[#21262D] rounded-2xl">
          <div className="p-2 bg-red-500/10 text-red-400 rounded-lg w-max mb-2">
            <Award className="w-4 h-4" />
          </div>
          <p className="text-xs text-slate-400">মোট কিলস (Kills)</p>
          <p className="text-lg font-extrabold text-white mt-0.5">{stats.totalKills}</p>
        </div>
      </div>

      {/* Profile Form & Security */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Profile Details Edit */}
        <form onSubmit={handleUpdateProfile} className="p-6 bg-[#0D1117] border border-[#21262D] rounded-2xl space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <User className="w-4 h-4 text-amber-400" />
            <span>প্রোফাইল ও গেম আইডি পরিবর্তন</span>
          </h3>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">আপনার নাম</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#161B22] border border-[#21262D] rounded-xl px-3.5 py-2.5 text-xs text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Free Fire In-Game Name (IGN)
            </label>
            <input
              type="text"
              required
              value={ign}
              onChange={(e) => setIgn(e.target.value)}
              className="w-full bg-[#161B22] border border-[#21262D] rounded-xl px-3.5 py-2.5 text-xs text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Free Fire User ID (UID)
            </label>
            <input
              type="text"
              required
              value={uid}
              onChange={(e) => setUid(e.target.value)}
              className="w-full bg-[#161B22] border border-[#21262D] rounded-xl px-3.5 py-2.5 text-xs text-white"
            />
          </div>

          <button
            type="submit"
            disabled={isUpdatingProfile}
            className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-all shadow"
          >
            {isUpdatingProfile ? 'আপডেট হচ্ছে...' : 'পরিবর্তন সংরক্ষণ করুন'}
          </button>
        </form>

        {/* Change Password */}
        <form onSubmit={handleChangePassword} className="p-6 bg-[#0D1117] border border-[#21262D] rounded-2xl space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Key className="w-4 h-4 text-amber-400" />
            <span>পাসওয়ার্ড পরিবর্তন</span>
          </h3>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">বর্তমান পাসওয়ার্ড</label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full bg-[#161B22] border border-[#21262D] rounded-xl px-3.5 py-2.5 text-xs text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">নতুন পাসওয়ার্ড</label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full bg-[#161B22] border border-[#21262D] rounded-xl px-3.5 py-2.5 text-xs text-white"
            />
          </div>

          <button
            type="submit"
            disabled={isUpdatingPass}
            className="w-full py-2.5 bg-[#161B22] hover:bg-[#21262D] border border-[#21262D] text-white font-bold text-xs rounded-xl transition-all"
          >
            {isUpdatingPass ? 'আপডেট হচ্ছে...' : 'পাসওয়ার্ড আপডেট করুন'}
          </button>
        </form>
      </div>
    </div>
  );
};
