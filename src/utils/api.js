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

  let data;
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    data = await response.json();
  } else {
    const rawText = await response.text();
    try {
      data = JSON.parse(rawText);
    } catch {
      data = { error: `সার্ভার রেসপন্স ত্রুটি (${response.status})` };
    }
  }

  if (!response.ok) {
    throw new Error(data?.error || 'অনাকাঙ্ক্ষিত ত্রুটি ঘটেছে। আবার চেষ্টা করুন।');
  }

  return data;
};
