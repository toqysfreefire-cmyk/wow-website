export const formatCurrency = (amount) => {
  if (amount === undefined || amount === null) return '৳০';
  const num = Number(amount);
  if (num === 0) return 'ফ্রি';
  return `৳${num.toLocaleString('bn-BD')}`;
};

export const formatStatus = (status) => {
  switch (status) {
    case 'open':
      return { label: 'রেজিস্ট্রেশন চলছে', bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20' };
    case 'room_released':
      return { label: 'রুম আইডি প্রস্তুত', bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20' };
    case 'ongoing':
      return { label: 'ম্যাচ চলছে', bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/20' };
    case 'completed':
      return { label: 'সম্পন্ন হয়েছে', bg: 'bg-slate-500/10', text: 'text-slate-400', border: 'border-slate-500/20' };
    case 'approved':
      return { label: 'অনুমোদিত', bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20' };
    case 'pending':
      return { label: 'অপেক্ষমাণ', bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20' };
    case 'rejected':
      return { label: 'বাতিল', bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/20' };
    default:
      return { label: status, bg: 'bg-slate-500/10', text: 'text-slate-400', border: 'border-slate-500/20' };
  }
};

export const formatDate = (isoString) => {
  if (!isoString) return '';
  try {
    const d = new Date(isoString);
    return d.toLocaleString('bn-BD', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (e) {
    return isoString;
  }
};
