const API_BASE = '/api';

export const fetchApi = async (endpoint, options = {}) => {
  const token = localStorage.getItem('bdff_token');
  const isFormData = options.body instanceof FormData;
  
  const headers = {
    ...(!isFormData ? { 'Content-Type': 'application/json' } : {}),
    ...(options.headers || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'অনাকাঙ্ক্ষিত ত্রুটি ঘটেছে। আবার চেষ্টা করুন।');
  }

  return data;
};
