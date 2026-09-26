import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { fetchApi } from '../utils/api';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const TournamentContext = createContext();

export const TournamentProvider = ({ children }) => {
  const { user, refreshUser } = useAuth();
  const { addToast } = useToast();

  const [tournaments, setTournaments] = useState([]);
  const [myTournaments, setMyTournaments] = useState([]);
  const [wallet, setWallet] = useState({ balance: 0, transactions: [], deposits: [], withdrawals: [] });
  const [loading, setLoading] = useState(false);

  const fetchTournaments = useCallback(async () => {
    try {
      const data = await fetchApi('/tournaments');
      setTournaments(data);
    } catch (err) {
      console.log('Error fetching tournaments:', err.message);
    }
  }, []);

  const fetchMyTournaments = useCallback(async () => {
    if (!user) return;
    try {
      const data = await fetchApi('/tournaments/mine');
      setMyTournaments(data);
    } catch (err) {
      console.log('Error fetching my tournaments:', err.message);
    }
  }, [user]);

  const fetchWallet = useCallback(async () => {
    if (!user) return;
    try {
      const data = await fetchApi('/wallet');
      setWallet(data);
    } catch (err) {
      console.log('Error fetching wallet:', err.message);
    }
  }, [user]);

  useEffect(() => {
    fetchTournaments();
  }, [fetchTournaments]);

  useEffect(() => {
    if (user) {
      fetchMyTournaments();
      fetchWallet();
    } else {
      setMyTournaments([]);
      setWallet({ balance: 0, transactions: [], deposits: [], withdrawals: [] });
    }
  }, [user, fetchMyTournaments, fetchWallet]);

  const registerForTournament = async (tournamentId, teamData) => {
    try {
      const res = await fetchApi(`/tournaments/${tournamentId}/register`, {
        method: 'POST',
        body: JSON.stringify(teamData),
      });
      addToast(res.message || 'রেজিস্ট্রেশন সফল হয়েছে!', 'success');
      await Promise.all([fetchTournaments(), fetchMyTournaments(), fetchWallet(), refreshUser()]);
      return res;
    } catch (err) {
      addToast(err.message, 'error');
      throw err;
    }
  };

  const submitDeposit = async (depositData) => {
    try {
      const res = await fetchApi('/deposits', {
        method: 'POST',
        body: JSON.stringify(depositData),
      });
      addToast(res.message || 'ডিপোজিট রিকোয়েস্ট সফল হয়েছে!', 'success');
      await fetchWallet();
      return res;
    } catch (err) {
      addToast(err.message, 'error');
      throw err;
    }
  };

  const submitWithdrawal = async (withdrawData) => {
    try {
      const res = await fetchApi('/withdrawals', {
        method: 'POST',
        body: JSON.stringify(withdrawData),
      });
      addToast(res.message || 'উইথড্র রিকোয়েস্ট জমা হয়েছে!', 'success');
      await Promise.all([fetchWallet(), refreshUser()]);
      return res;
    } catch (err) {
      addToast(err.message, 'error');
      throw err;
    }
  };

  const refreshAll = async () => {
    setLoading(true);
    await Promise.all([fetchTournaments(), fetchMyTournaments(), fetchWallet(), refreshUser()]);
    setLoading(false);
  };

  return (
    <TournamentContext.Provider
      value={{
        tournaments,
        myTournaments,
        wallet,
        loading,
        fetchTournaments,
        fetchMyTournaments,
        fetchWallet,
        registerForTournament,
        submitDeposit,
        submitWithdrawal,
        refreshAll,
      }}
    >
      {children}
    </TournamentContext.Provider>
  );
};

export const useTournaments = () => useContext(TournamentContext);
