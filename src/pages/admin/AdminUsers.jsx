import React, { useState, useEffect } from 'react';
import { fetchApi } from '../../utils/api';
import { useToast } from '../../context/ToastContext';
import { Modal } from '../../components/Modal';
import { formatCurrency } from '../../utils/formatters';
import { Users, Search, Plus, Minus, Shield } from 'lucide-react';

export const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  
  const [selectedUser, setSelectedUser] = useState(null);
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
  const [adjustAmount, setAdjustAmount] = useState('');
  const [adjustNote, setAdjustNote] = useState('');

  const { addToast } = useToast();

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await fetchApi('/admin/users');
      setUsers(data);
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleAdjustSubmit = async (e) => {
    e.preventDefault();
    if (!selectedUser || !adjustAmount) return;

    try {
      await fetchApi(`/admin/users/${selectedUser.id}/wallet`, {
        method: 'POST',
        body: JSON.stringify({
          amount: Number(adjustAmount),
          description: adjustNote || 'অ্যাডমিন ওয়ালেট অ্যাডজাস্টমেন্ট'
        }),
      });
      addToast('ব্যালেন্স অ্যাডজাস্টমেন্ট সম্পন্ন হয়েছে!', 'success');
      setIsAdjustModalOpen(false);
      setAdjustAmount('');
      setAdjustNote('');
      await loadUsers();
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const filteredUsers = users.filter((u) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      u.name.toLowerCase().includes(q) ||
      u.phone.includes(q) ||
      (u.ign && u.ign.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">ইউজার ব্যবস্থাপনা</h2>
          <p className="text-xs text-slate-400">ইউজার খুঁজুন, ওয়ালেট ব্যালেন্স সংশোধন করুন বা ভূমিকা পরিবর্তন করুন।</p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="ইউজারনেম, ফোন বা IGN..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#0D1117] border border-[#21262D] rounded-xl pl-9 pr-4 py-2 text-xs text-white"
          />
        </div>
      </div>

      <div className="space-y-3">
        {filteredUsers.map((u) => (
          <div
            key={u.id}
            className="p-5 bg-[#0D1117] border border-[#21262D] rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center border border-amber-500/30">
                {u.name.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-white text-sm">{u.name}</span>
                  {u.role === 'admin' && (
                    <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 text-[10px] font-bold rounded">
                      অ্যাডমিন
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  ফোন: {u.phone} • IGN: {u.ign || 'N/A'} (UID: {u.uid || 'N/A'})
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div>
                <p className="text-[10px] text-slate-400">ব্যালেন্স</p>
                <p className="font-extrabold text-emerald-400 text-sm">{formatCurrency(u.balance)}</p>
              </div>

              <button
                onClick={() => {
                  setSelectedUser(u);
                  setIsAdjustModalOpen(true);
                }}
                className="px-3.5 py-2 bg-[#161B22] hover:bg-amber-500 hover:text-slate-950 text-amber-400 font-bold text-xs rounded-xl border border-amber-500/30 transition-all"
              >
                ব্যালেন্স অ্যাডজাস্ট (+/-)
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* BALANCE ADJUSTMENT MODAL */}
      <Modal
        isOpen={isAdjustModalOpen}
        onClose={() => setIsAdjustModalOpen(false)}
        title={`ব্যালেন্স অ্যাডজাস্টমেন্ট — ${selectedUser?.name}`}
      >
        <form onSubmit={handleAdjustSubmit} className="space-y-4">
          <div className="p-3 bg-[#161B22] border border-[#21262D] rounded-xl text-xs">
            <p className="text-slate-400">বর্তমান ওয়ালেট ব্যালেন্স</p>
            <p className="font-bold text-emerald-400 text-base">{formatCurrency(selectedUser?.balance)}</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              যোগ/বিয়োগ করার পরিমাণ (BDT)
            </label>
            <input
              type="number"
              required
              placeholder="যেমন: 100 অথবা -50"
              value={adjustAmount}
              onChange={(e) => setAdjustAmount(e.target.value)}
              className="w-full bg-[#161B22] border border-[#21262D] rounded-xl px-3.5 py-2.5 text-xs text-white"
            />
            <p className="text-[10px] text-slate-500 mt-1">* বিয়োগ করতে মাইনাস (-) চিহ্ন দিন</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">বিবরণ / কারণ</label>
            <input
              type="text"
              placeholder="যেমন: টুর্নামেন্ট রিওয়ার্ড বোনাস"
              value={adjustNote}
              onChange={(e) => setAdjustNote(e.target.value)}
              className="w-full bg-[#161B22] border border-[#21262D] rounded-xl px-3.5 py-2.5 text-xs text-white"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow"
          >
            অ্যাডজাস্টমেন্ট জমা দিন
          </button>
        </form>
      </Modal>
    </div>
  );
};
