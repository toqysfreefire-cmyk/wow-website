import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchApi } from '../utils/api';
import { useToast } from './ToastContext';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [settings, setSettings] = useState({
    bKashNumber: '01956541650',
    minDeposit: 50,
    maxDeposit: 10000,
    minWithdraw: 50,
    maxWithdraw: 5000,
    maintenanceMode: false,
    noticeBanner: 'ডিপোজিট জমা দেওয়ার কিছুক্ষনের মধ্যেই স্বয়ংক্রিয়ভাবে আপনার অ্যাকাউন্টে ব্যালান্স যোগ হবে।',
    telegramUrl: 'https://t.me/+nE1pT80-i6oyOGU1',
    whatsappUrl: 'https://wa.me/8801727400370'
  });
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  const loadBootstrap = async () => {
    try {
      const data = await fetchApi('/app/bootstrap');
      if (data.settings) setSettings(data.settings);
      if (data.user) setUser(data.user);
    } catch (err) {
      console.log('Bootstrap load notice:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBootstrap();
  }, []);

  const login = async (identifier, password) => {
    try {
      const data = await fetchApi('/auth/signin', {
        method: 'POST',
        body: JSON.stringify({ identifier, password }),
      });
      localStorage.setItem('bdff_token', data.token);
      setUser(data.user);
      addToast(`স্বাগতম, ${data.user.name}!`, 'success');
      return data.user;
    } catch (err) {
      addToast(err.message, 'error');
      throw err;
    }
  };

  const signup = async (userData) => {
    try {
      const data = await fetchApi('/auth/signup', {
        method: 'POST',
        body: JSON.stringify(userData),
      });
      localStorage.setItem('bdff_token', data.token);
      setUser(data.user);
      addToast('অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে!', 'success');
      return data.user;
    } catch (err) {
      addToast(err.message, 'error');
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('bdff_token');
    setUser(null);
    addToast('লগ আউট সম্পন্ন হয়েছে', 'info');
  };

  const refreshUser = async () => {
    try {
      const data = await fetchApi('/auth/me');
      if (data.user) setUser(data.user);
    } catch (e) {}
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        settings,
        loading,
        login,
        signup,
        logout,
        refreshUser,
        isAdmin: user?.role === 'admin',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
