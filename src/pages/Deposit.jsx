import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTournaments } from '../context/TournamentContext';
import { useToast } from '../context/ToastContext';
import {
  Wallet,
  Copy,
  Check,
  ArrowRight,
  ShieldAlert,
  Info,
  ChevronLeft
} from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

export const Deposit = () => {
  const { settings } = useAuth();
  const { submitDeposit } = useTournaments();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [amount, setAmount] = useState('');
  const [senderPhone, setSenderPhone] = useState('');
  const [trxId, setTrxId] = useState('');
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const method = 'bKash';
  const selectedNumber = settings.bKashNumber || '01956541650';

  const handleCopyNumber = () => {
    navigator.clipboard.writeText(selectedNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    addToast('নম্বর কপি হয়েছে!', 'success');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const numAmount = Number(amount);

    if (numAmount < settings.minDeposit || numAmount > settings.maxDeposit) {
      addToast(
        `সর্বনিম্ন ডিপোজিট ${formatCurrency(settings.minDeposit)} এবং সর্বোচ্চ ${formatCurrency(
          settings.maxDeposit
        )}`,
        'error'
      );
      return;
    }

    if (!senderPhone || !trxId) {
      addToast('সবগুলো ঘর সঠিকভাবে পূরণ করুন', 'error');
      return;
    }

    try {
      setIsSubmitting(true);
      await submitDeposit({
        method,
        amount: numAmount,
        senderPhone,
        trxId
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

      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
          <Wallet className="w-6 h-6 text-emerald-400" />
          <span>ডিপোজিট করুন (Deposit Money)</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          bKash এর মাধ্যমে আপনার ওয়ালেটে ব্যালেন্স জমা দিন।
        </p>
      </div>

      {/* Step 2: Send Money Instructions */}
      <div className="p-6 bg-[#0D1117] border border-[#21262D] rounded-2xl space-y-4">
        <h3 className="text-sm font-bold text-white">১. নিচের bKash নম্বরে টাকা পাঠান:</h3>

        {/* Copyable Number Box */}
        <div className="p-4 bg-[#161B22] border border-[#21262D] rounded-xl flex items-center justify-between">
          <div>
            <p className="text-[11px] text-slate-400 font-medium">
              {method} Personal / Agent Number:
            </p>
            <p className="text-lg font-mono font-extrabold text-white mt-0.5">
              {selectedNumber}
            </p>
          </div>

          <button
            onClick={handleCopyNumber}
            className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold rounded-lg text-xs flex items-center gap-1.5 transition-all shadow"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'কপিড!' : 'নম্বর কপি'}</span>
          </button>
        </div>

        {/* Instructions */}
        <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl space-y-2 text-xs text-amber-300">
          <div className="flex items-center gap-2 font-bold text-amber-400">
            <Info className="w-4 h-4" />
            <span>নির্দেশনা:</span>
          </div>
          <ol className="list-decimal list-inside space-y-1 text-slate-300 leading-relaxed">
            <li>আপনার {method} অ্যাপ থেকে ওপরের নম্বরে Send Money বা Cash Out করুন।</li>
            <li>সর্বনিম্ন ডিপোজিট ৳{settings.minDeposit} এবং সর্বোচ্চ ৳{settings.maxDeposit}।</li>
            <li>টাকা পাঠানো সফল হলে এসএমএস থেকে <b>TrxID</b> কপি করুন।</li>
          </ol>
        </div>
      </div>

      {/* Step 3: Deposit Form */}
      <form onSubmit={handleSubmit} className="p-6 bg-[#0D1117] border border-[#21262D] rounded-2xl space-y-4">
        <h3 className="text-sm font-bold text-white">২. আপনার পেমেন্টের তথ্য দিন:</h3>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            টাকার পরিমাণ (BDT)
          </label>
          <input
            type="number"
            required
            placeholder={`যেমন: 500 (সর্বনিম্ন ৳${settings.minDeposit})`}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full bg-[#161B22] border border-[#21262D] rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            যে {method} নম্বর থেকে টাকা পাঠিয়েছেন
          </label>
          <input
            type="text"
            required
            placeholder="018XXXXXXXX"
            value={senderPhone}
            onChange={(e) => setSenderPhone(e.target.value)}
            className="w-full bg-[#161B22] border border-[#21262D] rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            ট্রানজেকশন আইডি (TrxID)
          </label>
          <input
            type="text"
            required
            placeholder="যেমন: BKH9928172"
            value={trxId}
            onChange={(e) => setTrxId(e.target.value)}
            className="w-full bg-[#161B22] border border-[#21262D] rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 font-mono uppercase"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm rounded-xl transition-all shadow-lg shadow-emerald-500/20"
        >
          {isSubmitting ? 'জমা হচ্ছে...' : 'ডিপোজিট রিকোয়েস্ট নিশ্চিত করুন'}
        </button>
      </form>
    </div>
  );
};
