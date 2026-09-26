import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTournaments } from '../context/TournamentContext';
import { useToast } from '../context/ToastContext';
import { ArrowUpRight, Wallet, ChevronLeft, AlertCircle } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

export const Withdraw = () => {
  const { user, settings } = useAuth();
  const { submitWithdrawal } = useTournaments();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const method = 'bKash';
  const [accountNumber, setAccountNumber] = useState(user?.phone || '');
  const [amount, setAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const numAmount = Number(amount);

    if (numAmount < settings.minWithdraw || numAmount > settings.maxWithdraw) {
      addToast(
        `সর্বনিম্ন উইথড্র ${formatCurrency(settings.minWithdraw)} এবং সর্বোচ্চ ${formatCurrency(
          settings.maxWithdraw
        )}`,
        'error'
      );
      return;
    }

    if (user.balance < numAmount) {
      addToast('আপনার ওয়ালেটে পর্যাপ্ত ব্যালেন্স নেই!', 'error');
      return;
    }

    try {
      setIsSubmitting(true);
      await submitWithdrawal({
        method,
        accountNumber,
        amount: numAmount
      });
      navigate('/wallet');
    } catch (err) {
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12">
      
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        <span>ওয়ালেটে ফিরুন</span>
      </button>

      {/* Title */}
      <div>
        <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
          <ArrowUpRight className="w-6 h-6 text-amber-400" />
          <span>টাকা উত্তোলন (Withdraw Money)</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          আপনার অর্জিত প্রাইজ ও ব্যালেন্স সরাসরি bKash এ উত্তোলন করুন।
        </p>
      </div>

      {/* Balance Card */}
      <div className="p-5 bg-[#0D1117] border border-[#21262D] rounded-2xl flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-400">আপনার বর্তমান ব্যালেন্স</p>
          <p className="text-2xl font-extrabold text-emerald-400 mt-0.5">
            {formatCurrency(user?.balance)}
          </p>
        </div>
        <div className="text-right text-xs text-slate-400">
          <p>সীমা: {formatCurrency(settings.minWithdraw)} - {formatCurrency(settings.maxWithdraw)}</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-6 bg-[#0D1117] border border-[#21262D] rounded-2xl space-y-4">
        
        {/* Account Number */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            bKash মোবাইল নম্বর
          </label>
          <input
            type="text"
            required
            placeholder="018XXXXXXXX"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
            className="w-full bg-[#161B22] border border-[#21262D] rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        {/* Amount */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            উইথড্র পরিমাণ (BDT)
          </label>
          <input
            type="number"
            required
            placeholder={`সর্বনিম্ন ৳${settings.minWithdraw}`}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full bg-[#161B22] border border-[#21262D] rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm rounded-xl transition-all shadow-lg shadow-amber-500/20"
        >
          {isSubmitting ? 'প্রসেস হচ্ছে...' : 'উইথড্র রিকোয়েস্ট পাঠান'}
        </button>
      </form>
    </div>
  );
};
