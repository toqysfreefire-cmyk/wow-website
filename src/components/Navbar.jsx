import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTournaments } from '../context/TournamentContext';
import {
  Wallet,
  Plus,
  User,
  Shield,
  LogOut,
  Headphones,
  Trophy,
  Menu,
  X,
  ChevronDown
} from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

export const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const { wallet } = useTournaments();
  const navigate = useNavigate();
  const location = useLocation();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'টুর্নামেন্ট', path: '/' },
    { label: 'আমার টুর্নামেন্ট', path: '/my-tournaments', auth: true },
    { label: 'ওয়ালেট', path: '/wallet', auth: true },
    { label: 'সাপোর্ট', path: '/support' },
  ];

  return (
    <nav className="sticky top-0 z-40 bg-[#080A10]/95 backdrop-blur-md border-b border-[#21262D]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <img
              src="/zero-exception-logo.jpg"
              alt="Zero Exception logo"
              className="h-11 w-[78px] object-contain group-hover:scale-105 transition-transform duration-300"
            />
            <div>
              <span className="font-extrabold text-lg text-white font-sans">Zero Exception</span>
              <p className="text-[10px] text-slate-400 font-medium hidden sm:block">
                Gaming · Coding · Chill · Community
              </p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map(
              (link) =>
                (!link.auth || user) && (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`text-sm font-semibold transition-colors duration-200 ${
                      location.pathname === link.path
                        ? 'text-amber-400'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    {link.label}
                  </Link>
                )
            )}
          </div>

          {/* User Controls & Actions */}
          <div className="flex items-center gap-3">
            
            {user ? (
              <div className="flex items-center gap-3">
                {/* Balance Badge */}
                <div className="flex items-center bg-[#161B22] border border-[#21262D] rounded-xl p-1 pl-3 shadow-inner">
                  <div className="flex items-center gap-2 mr-2">
                    <Wallet className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs text-slate-400 hidden sm:inline">ব্যালেন্স:</span>
                    <span className="text-sm font-bold text-emerald-400">
                      {formatCurrency(user.balance)}
                    </span>
                  </div>
                  <Link
                    to="/deposit"
                    className="p-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold rounded-lg transition-transform hover:scale-105 shadow"
                    title="ডিপোজিট করুন"
                  >
                    <Plus className="w-4 h-4 stroke-[3]" />
                  </Link>
                </div>

                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-[#161B22] transition-colors border border-transparent hover:border-[#21262D]"
                  >
                    <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold text-sm">
                      {user.name.charAt(0)}
                    </div>
                    <ChevronDown className="w-4 h-4 text-slate-400 hidden sm:block" />
                  </button>

                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-[#0D1117] border border-[#21262D] rounded-xl shadow-2xl py-2 z-50">
                      <div className="px-4 py-2 border-b border-[#21262D]">
                        <p className="text-sm font-bold text-white truncate">{user.name}</p>
                        <p className="text-xs text-slate-400 truncate">{user.phone}</p>
                        {user.ign && (
                          <p className="text-[11px] text-amber-400 mt-0.5">IGN: {user.ign}</p>
                        )}
                      </div>

                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-amber-400 hover:bg-[#161B22] transition-colors font-semibold"
                        >
                          <Shield className="w-4 h-4 text-amber-400" />
                          অ্যাডমিন প্যানেল
                        </Link>
                      )}

                      <Link
                        to="/profile"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-300 hover:bg-[#161B22] hover:text-white transition-colors"
                      >
                        <User className="w-4 h-4" />
                        প্রোফাইল
                      </Link>

                      <Link
                        to="/my-tournaments"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-300 hover:bg-[#161B22] hover:text-white transition-colors"
                      >
                        <Trophy className="w-4 h-4" />
                        আমার টুর্নামেন্ট
                      </Link>

                      <Link
                        to="/support"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-300 hover:bg-[#161B22] hover:text-white transition-colors"
                      >
                        <Headphones className="w-4 h-4" />
                        সাপোর্ট
                      </Link>

                      <div className="border-t border-[#21262D] mt-2 pt-1">
                        <button
                          onClick={() => {
                            setUserMenuOpen(false);
                            logout();
                          }}
                          className="flex items-center gap-2.5 w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          লগ আউট
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/signin"
                  className="px-4 py-2 text-sm font-semibold text-slate-300 hover:text-white transition-colors"
                >
                  সাইন ইন
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 text-sm font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl shadow-lg shadow-amber-500/20 transition-all hover:scale-105"
                >
                  রেজিস্ট্রেশন
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
