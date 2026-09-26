import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Gamepad2, Trophy, Wallet, User, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const BottomNav = () => {
  const location = useLocation();
  const { user, isAdmin } = useAuth();

  const items = [
    { label: 'ম্যাচ', path: '/', icon: Gamepad2 },
    { label: 'আমার টুর্নামেন্ট', path: '/my-tournaments', icon: Trophy, auth: true },
    { label: 'ওয়ালেট', path: '/wallet', icon: Wallet, auth: true },
    {
      label: isAdmin ? 'অ্যাডমিন' : 'প্রোফাইল',
      path: isAdmin ? '/admin' : '/profile',
      icon: isAdmin ? Shield : User,
      auth: true,
    },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0D1117]/95 backdrop-blur-lg border-t border-[#21262D] px-2 py-1 shadow-2xl">
      <div className="flex items-center justify-around">
        {items.map((item) => {
          if (item.auth && !user) {
            return (
              <Link
                key={item.path}
                to="/signin"
                className="flex flex-col items-center py-1 px-3 text-slate-400 hover:text-slate-200 text-xs"
              >
                <item.icon className="w-5 h-5 mb-0.5 opacity-60" />
                <span>{item.label}</span>
              </Link>
            );
          }

          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center py-1 px-3 text-xs font-medium transition-all ${
                isActive
                  ? 'text-amber-400 scale-105 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="relative">
                <item.icon className={`w-5 h-5 mb-0.5 ${isActive ? 'text-amber-400' : ''}`} />
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-amber-400 rounded-full"></span>
                )}
              </div>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
