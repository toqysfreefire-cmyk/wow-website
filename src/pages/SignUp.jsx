import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Gamepad2, User, Phone, Lock, Hash } from 'lucide-react';

export const SignUp = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [ign, setIgn] = useState('');
  const [uid, setUid] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await signup({ name, phone, password, ign, uid });
      navigate('/');
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-12 px-4">
      <div className="bg-[#0D1117] border border-[#21262D] rounded-3xl p-8 shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 mx-auto">
            <Gamepad2 className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-white">নতুন অ্যাকাউন্ট রেজিস্টার করুন</h2>
          <p className="text-xs text-slate-400">
            খেলুন ফ্রি ফায়ার টুর্নামেন্ট ও জিতুন ক্যাশ প্রাইজ!
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">আপনার নাম</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                placeholder="যেমন: Tanvir Ahmed"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#161B22] border border-[#21262D] rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">মোবাইল নম্বর</label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                placeholder="018XXXXXXXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-[#161B22] border border-[#21262D] rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">পাসওয়ার্ড</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="কমপক্ষে ৬ অক্ষরের পাসওয়ার্ড"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#161B22] border border-[#21262D] rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">FF In-Game Name</label>
              <input
                type="text"
                required
                placeholder="OP_TANVIR"
                value={ign}
                onChange={(e) => setIgn(e.target.value)}
                className="w-full bg-[#161B22] border border-[#21262D] rounded-xl px-3 py-3 text-xs text-white placeholder-slate-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Free Fire UID</label>
              <input
                type="text"
                required
                placeholder="987654321"
                value={uid}
                onChange={(e) => setUid(e.target.value)}
                className="w-full bg-[#161B22] border border-[#21262D] rounded-xl px-3 py-3 text-xs text-white placeholder-slate-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-amber-500/20 transition-all"
          >
            {loading ? 'অ্যাকাউন্ট তৈরি হচ্ছে...' : 'সাইন আপ সম্পন্ন করুন'}
          </button>
        </form>

        <p className="text-center text-xs text-slate-400">
          ইতিমধ্যেই অ্যাকাউন্ট রয়েছে?{' '}
          <Link to="/signin" className="text-amber-400 font-bold hover:underline">
            সাইন ইন করুন
          </Link>
        </p>
      </div>
    </div>
  );
};
