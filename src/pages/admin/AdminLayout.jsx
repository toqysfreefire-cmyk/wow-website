import React from 'react';
import { NavLink, Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Shield,
  Trophy,
  Users,
  Wallet,
  ArrowUpRight,
  Settings as SettingsIcon,
  Headphones,
  LayoutDashboard,
  FileCheck
} from 'lucide-react';

export const AdminLayout = () => {
  const { user, isAdmin } = useAuth();

  if (!user || !isAdmin) {
    return <Navigate to="/signin" replace />;
  }

  const navItems = [
    { label: 'সারসংক্ষেপ', path: '/admin', icon: LayoutDashboard, end: true },
    { label: 'টুর্নামেন্ট', path: '/admin/tournaments', icon: Trophy },
    { label: 'রেজিস্ট্রেশন', path: '/admin/registrations', icon: FileCheck },
    { label: 'ডিপোজিট', path: '/admin/deposits', icon: Wallet },
    { label: 'উইথড্র', path: '/admin/withdrawals', icon: ArrowUpRight },
    { label: 'ইউজার', path: '/admin/users', icon: Users },
    { label: 'সেটিংস', path: '/admin/settings', icon: SettingsIcon },
  ];

  return (
    <div className="space-y-6 pb-12 max-w-7xl mx-auto">
      
      {/* Admin Title Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-500/20 via-[#0D1117] to-yellow-500/20 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black shadow-lg">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-black text-white">Zero Exception অ্যাডমিন প্যানেল</h1>
            <p className="text-xs text-slate-400">
              টুর্নামেন্ট, ডিপোজিট, উইথড্র ও প্লেয়ার রেজিস্ট্রেশন পরিচালনা করুন।
            </p>
          </div>
        </div>
      </div>

      {/* Admin Tabs Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#21262D]">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20'
                    : 'bg-[#0D1117] text-slate-400 border-[#21262D] hover:text-white hover:border-slate-600'
                }`
              }
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </div>

      {/* Subpage Content Outlet */}
      <div>
        <Outlet />
      </div>
    </div>
  );
};
