import React, { useState, useEffect } from 'react';
import { fetchApi } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  Headphones,
  Send,
  MessageSquare,
  Plus,
  SendHorizontal,
  Clock,
  CheckCircle2,
  PhoneCall
} from 'lucide-react';
import { Modal } from '../components/Modal';
import { formatDate } from '../utils/formatters';

export const Support = () => {
  const { user, settings } = useAuth();
  const { addToast } = useToast();

  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  
  // New ticket form
  const [category, setCategory] = useState('Payment Support');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  
  // Chat reply
  const [replyText, setReplyText] = useState('');
  const [loading, setLoading] = useState(false);

  const loadTickets = async () => {
    if (!user) return;
    try {
      const data = await fetchApi('/support');
      setTickets(data);
      if (selectedTicket) {
        const updated = data.find((t) => t.id === selectedTicket.id);
        if (updated) setSelectedTicket(updated);
      }
    } catch (e) {}
  };

  useEffect(() => {
    loadTickets();
  }, [user]);

  const handleCreateTicket = async (e) => {
    e.preventDefault();
    if (!subject || !message) {
      addToast('সব তথ্য দিন', 'error');
      return;
    }

    try {
      setLoading(true);
      const res = await fetchApi('/support', {
        method: 'POST',
        body: JSON.stringify({ category, subject, message }),
      });
      addToast('সাপোর্ট টিকিট সফলভাবে তৈরি হয়েছে!', 'success');
      setIsNewModalOpen(false);
      setSubject('');
      setMessage('');
      await loadTickets();
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedTicket) return;

    try {
      const updated = await fetchApi(`/messages/${selectedTicket.id}`, {
        method: 'POST',
        body: JSON.stringify({ text: replyText }),
      });
      setReplyText('');
      setSelectedTicket(updated);
      await loadTickets();
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#21262D] pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Headphones className="w-6 h-6 text-amber-400" />
            <span>Zero Exception সাপোর্ট হাব (Help & Support)</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            যেকোনো প্রশ্ন, ডিপোজিট হেল্প বা ইস্যু সমাধানের জন্য আমাদের সাপোর্ট টিম প্রস্তুত।
          </p>
        </div>

        {user && (
          <button
            onClick={() => setIsNewModalOpen(true)}
            className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>নতুন টিকিট তৈরি করুন</span>
          </button>
        )}
      </div>

      {/* Social Links Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <a
          href={settings.telegramUrl || 'https://t.me/your_channel'}
          target="_blank"
          rel="noreferrer"
          className="p-5 bg-[#0D1117] border border-sky-500/30 hover:border-sky-500 rounded-2xl flex items-center gap-4 transition-all hover:scale-[1.01] group shadow-xl"
        >
          <div className="p-3 bg-sky-500/10 text-sky-400 rounded-xl group-hover:bg-sky-500 group-hover:text-slate-950 transition-colors">
            <Send className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white group-hover:text-sky-400 transition-colors">
              অফিসিয়াল টেলিগ্রাম চ্যানেল
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              টুর্নামেন্ট আপডেট, প্রাইজ ঘোষণা ও নোটিশ পেতে জয়েন করুন।
            </p>
          </div>
        </a>

        <a
          href={settings.whatsappUrl || 'https://wa.me/8801727400370'}
          target="_blank"
          rel="noreferrer"
          className="p-5 bg-[#0D1117] border border-emerald-500/30 hover:border-emerald-500 rounded-2xl flex items-center gap-4 transition-all hover:scale-[1.01] group shadow-xl"
        >
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl group-hover:bg-emerald-500 group-hover:text-slate-950 transition-colors">
            <PhoneCall className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">
              হোয়াটসঅ্যাপ হেল্পডেস্ক
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              যেকোনো জরুরি সমস্যায় সরাসরি এডমিনের সাথে কথা বলুন।
            </p>
          </div>
        </a>
      </div>

      {/* Tickets List & Chat Interface */}
      {user ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Ticket Sidebar */}
          <div className="bg-[#0D1117] border border-[#21262D] rounded-2xl p-4 space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2">
              আমার সাপোর্ট টিকিট ({tickets.length})
            </h3>

            {tickets.length > 0 ? (
              <div className="space-y-2 max-h-[500px] overflow-y-auto">
                {tickets.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setSelectedTicket(t)}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                      selectedTicket?.id === t.id
                        ? 'bg-[#161B22] border-amber-500/50 text-white'
                        : 'bg-[#0D1117] border-[#21262D] hover:bg-[#161B22]/50 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-amber-400">
                        {t.category}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        {formatDate(t.createdAt)}
                      </span>
                    </div>
                    <p className="text-xs font-bold mt-1.5 truncate">{t.subject}</p>
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-xs text-slate-500">
                কোনো টিকিট নেই। সমস্যা থাকলে নতুন টিকিট খুলুন।
              </div>
            )}
          </div>

          {/* Chat Window */}
          <div className="lg:col-span-2 bg-[#0D1117] border border-[#21262D] rounded-2xl flex flex-col h-[500px] overflow-hidden">
            {selectedTicket ? (
              <>
                {/* Header */}
                <div className="p-4 bg-[#161B22] border-b border-[#21262D] flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white">{selectedTicket.subject}</h3>
                    <p className="text-xs text-slate-400">{selectedTicket.category}</p>
                  </div>
                  <span className="px-2.5 py-1 bg-amber-500/20 text-amber-400 text-xs font-bold rounded-lg border border-amber-500/30">
                    {selectedTicket.status === 'open' ? 'সক্রিয়' : 'বন্ধ'}
                  </span>
                </div>

                {/* Messages Body */}
                <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#080A10]/50">
                  {selectedTicket.messages?.map((msg) => {
                    const isAdminMsg = msg.sender === 'admin';
                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${
                          isAdminMsg ? 'items-start' : 'items-end'
                        }`}
                      >
                        <div
                          className={`max-w-xs sm:max-w-md p-3.5 rounded-2xl text-xs leading-relaxed ${
                            isAdminMsg
                              ? 'bg-[#161B22] border border-amber-500/30 text-white rounded-tl-none'
                              : 'bg-amber-500 text-slate-950 font-medium rounded-tr-none shadow'
                          }`}
                        >
                          <p className="text-[10px] font-bold opacity-75 mb-1">
                            {msg.senderName || (isAdminMsg ? 'Zero Exception Support' : 'আপনি')}
                          </p>
                          <p>{msg.text}</p>
                          <p className="text-[9px] opacity-60 text-right mt-1">
                            {formatDate(msg.time)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Input Area */}
                <form
                  onSubmit={handleSendReply}
                  className="p-3 bg-[#161B22] border-t border-[#21262D] flex items-center gap-2"
                >
                  <input
                    type="text"
                    placeholder="মেসেজ লিখুন..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className="flex-1 bg-[#0D1117] border border-[#21262D] rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                  <button
                    type="submit"
                    className="p-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl transition-all shadow"
                  >
                    <SendHorizontal className="w-4 h-4" />
                  </button>
                </form>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-500 space-y-2">
                <MessageSquare className="w-12 h-12 stroke-[1.5]" />
                <p className="text-xs">একটি সাপোর্ট টিকিট সিলেক্ট করুন অথবা নতুন টিকিট তৈরি করুন।</p>
              </div>
            )}
          </div>
        </div>
      ) : null}

      {/* NEW TICKET MODAL */}
      <Modal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        title="নতুন সাপোর্ট টিকিট"
      >
        <form onSubmit={handleCreateTicket} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              ক্যাটাগরি
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-[#161B22] border border-[#21262D] rounded-xl px-3 py-2.5 text-xs text-white"
            >
              <option value="Payment Support">পেমেন্ট সাপোর্ট (ডিপোজিট / উইথড্র)</option>
              <option value="Tournament Support">টুর্নামেন্ট ও রুম সংক্রান্ত</option>
              <option value="Account Support">অ্যাকাউন্ট সাপোর্ট</option>
              <option value="General Support">সাধারণ প্রশ্ন</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              বিষয় (Subject)
            </label>
            <input
              type="text"
              required
              placeholder="সংক্ষেপে বিষটি লিখুন..."
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full bg-[#161B22] border border-[#21262D] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              বিস্তারিত মেসেজ
            </label>
            <textarea
              required
              rows={4}
              placeholder="আপনার সমস্যাটি বিস্তারিত লিখুন..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full bg-[#161B22] border border-[#21262D] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow"
          >
            {loading ? 'জমা হচ্ছে...' : 'টিকিট জমা দিন'}
          </button>
        </form>
      </Modal>
    </div>
  );
};
