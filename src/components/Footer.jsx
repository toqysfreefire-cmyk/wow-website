import React from 'react';
import { Send, PhoneCall, ShieldCheck, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Footer = () => {
  const { settings } = useAuth();

  return (
    <footer className="bg-[#080A10] border-t border-[#21262D] text-slate-400 text-sm mt-16 pb-20 md:pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/zero-exception-logo.jpg"
                alt="Zero Exception logo"
                className="h-12 w-[88px] object-contain"
              />
              <span className="font-extrabold text-xl text-white">Zero Exception</span>
            </div>
            <p className="text-slate-400 leading-relaxed max-w-md text-xs sm:text-sm">
              Zero Exception — বাংলাদেশের Free Fire প্লেয়ারদের জন্য Solo, Duo ও Squad টুর্নামেন্ট। রেজিস্ট্রেশন করুন, ওয়ালেটে ডিপোজিট করুন এবং প্রাইজ পুল জিতে নিন।
            </p>
            
            {/* Payment methods badges */}
            <div className="pt-2">
              <p className="text-xs font-semibold text-slate-300 mb-2">পেমেন্ট মেথডসমূহ:</p>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-[#161B22] border border-[#21262D] rounded-lg text-xs font-bold text-pink-500">
                  bKash (বিকাশ)
                </span>
              </div>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-bold text-white mb-4 text-sm">গুরুত্বপূর্ণ লিংক</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="/" className="hover:text-amber-400 transition-colors">টুর্নামেন্ট তালিকা</a>
              </li>
              <li>
                <a href="/wallet" className="hover:text-amber-400 transition-colors">ওয়ালেট ও ডিপোজিট</a>
              </li>
              <li>
                <a href="/support" className="hover:text-amber-400 transition-colors">সাপোর্ট টিকিট</a>
              </li>
            </ul>
          </div>

          {/* Social / Support */}
          <div>
            <h4 className="font-bold text-white mb-4 text-sm">কমিউনিটি ও সাপোর্ট</h4>
            <div className="space-y-3">
              <a
                href={settings.telegramUrl || 'https://t.me/+nE1pT80-i6oyOGU1'}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 hover:bg-sky-500/20 transition-all text-xs font-semibold"
              >
                <Send className="w-4 h-4" />
                <span>অফিসিয়াল টেলিগ্রাম চ্যানেল</span>
              </a>

              <a
                href={settings.whatsappUrl || 'https://wa.me/8801727400370'}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 transition-all text-xs font-semibold"
              >
                <PhoneCall className="w-4 h-4" />
                <span>হোয়াটসঅ্যাপ সাপোর্ট</span>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-[#21262D] mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Zero Exception. সর্বস্বত্ব সংরক্ষিত।</p>
          <div className="flex items-center gap-1">
            <span>Made with</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
            <span>for Free Fire Bangladesh Gamers</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
