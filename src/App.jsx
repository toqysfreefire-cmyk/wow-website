import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { TournamentProvider } from './context/TournamentContext';

import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { Footer } from './components/Footer';

import { Home } from './pages/Home';
import { TournamentDetails } from './pages/TournamentDetails';
import { MyTournaments } from './pages/MyTournaments';
import { Wallet } from './pages/Wallet';
import { Deposit } from './pages/Deposit';
import { Withdraw } from './pages/Withdraw';
import { Support } from './pages/Support';
import { Profile } from './pages/Profile';
import { SignIn } from './pages/SignIn';
import { SignUp } from './pages/SignUp';

import { AdminLayout } from './pages/admin/AdminLayout';
import { Dashboard as AdminDashboard } from './pages/admin/Dashboard';
import { AdminTournaments } from './pages/admin/AdminTournaments';
import { AdminRegistrations } from './pages/admin/AdminRegistrations';
import { AdminDeposits } from './pages/admin/AdminDeposits';
import { AdminWithdrawals } from './pages/admin/AdminWithdrawals';
import { AdminUsers } from './pages/admin/AdminUsers';
import { AdminSettings } from './pages/admin/AdminSettings';

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <TournamentProvider>
          <BrowserRouter>
            <div className="min-h-screen bg-[#080A10] text-[#9AA4B2] flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-300">
              <Navbar />

              <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <Routes>
                  {/* Public & Player Routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/tournaments" element={<Home />} />
                  <Route path="/tournament/:id" element={<TournamentDetails />} />
                  <Route path="/my-tournaments" element={<MyTournaments />} />
                  <Route path="/wallet" element={<Wallet />} />
                  <Route path="/deposit" element={<Deposit />} />
                  <Route path="/withdraw" element={<Withdraw />} />
                  <Route path="/support" element={<Support />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/signin" element={<SignIn />} />
                  <Route path="/signup" element={<SignUp />} />

                  {/* Admin Routes */}
                  <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<AdminDashboard />} />
                    <Route path="tournaments" element={<AdminTournaments />} />
                    <Route path="registrations" element={<AdminRegistrations />} />
                    <Route path="deposits" element={<AdminDeposits />} />
                    <Route path="withdrawals" element={<AdminWithdrawals />} />
                    <Route path="users" element={<AdminUsers />} />
                    <Route path="settings" element={<AdminSettings />} />
                  </Route>
                </Routes>
              </main>

              <Footer />
              <BottomNav />
            </div>
          </BrowserRouter>
        </TournamentProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
