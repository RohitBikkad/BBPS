import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { School, Lock, User, AlertCircle, ArrowRight, ShieldCheck, Users, UserCheck, KeyRound, CheckCircle2 } from 'lucide-react';
import api from '../api/client';
import { Role } from '../types';

export const LoginPage: React.FC = () => {
  const { login, quickLoginAs } = useAuth();
  const [username, setUsername] = useState<string>('principal@bbps.edu');
  const [password, setPassword] = useState<string>('admin123');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Forgot password modal state
  const [showForgot, setShowForgot] = useState<boolean>(false);
  const [forgotIdentifier, setForgotIdentifier] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [forgotLoading, setForgotLoading] = useState<boolean>(false);
  const [forgotMessage, setForgotMessage] = useState<string | null>(null);
  const [forgotError, setForgotError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login(username.trim(), password);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (role: Role) => {
    setLoading(true);
    setError(null);
    try {
      await quickLoginAs(role);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Quick login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotLoading(true);
    setForgotError(null);
    setForgotMessage(null);
    try {
      const res = await api.post('/auth/forgot-password', {
        identifier: forgotIdentifier.trim(),
        newPassword: newPassword.trim(),
      });
      setForgotMessage(res.data.message || 'Password reset successfully');
      setTimeout(() => {
        setShowForgot(false);
        setPassword(newPassword);
        setUsername(forgotIdentifier);
      }, 1500);
    } catch (err: any) {
      setForgotError(err.response?.data?.message || 'Password reset failed');
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-900 via-slate-900 to-slate-950 flex flex-col justify-center px-4 sm:px-6 lg:px-8 py-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        
        {/* School Crest & Header */}
        <div className="text-center">
          <div className="inline-flex w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-green-600 items-center justify-center text-white shadow-xl shadow-emerald-500/30 mb-4 ring-4 ring-emerald-500/20">
            <School className="w-9 h-9" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Bal Bharati Public School
          </h1>
          <p className="mt-1 text-sm text-emerald-300 font-medium">
            Staff Attendance & Leave Management Portal
          </p>
        </div>

        {/* Card */}
        <div className="mt-8 bg-white/95 backdrop-blur-xl py-8 px-6 sm:px-10 shadow-2xl rounded-3xl border border-white/20">
          
          {error && (
            <div className="mb-5 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 flex items-start space-x-2.5 text-xs text-rose-800 font-medium">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Employee ID / Email */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Employee ID or Email
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. EMP001 or principal@bbps.edu"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-slate-50/50"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgot(true)}
                  className="text-xs text-emerald-600 hover:text-emerald-700 font-semibold"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-slate-50/50"
                />
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-bold text-sm shadow-lg shadow-emerald-700/25 active:scale-[0.99] transition-all flex items-center justify-center space-x-2 disabled:opacity-60"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

          </form>

          {/* Quick Demo Login Section */}
          <div className="mt-8 pt-6 border-t border-slate-100">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block text-center mb-3">
              Fast Demo Sign-In (1 Click)
            </span>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('ROLE_PRINCIPAL')}
                className="w-full flex items-center justify-between p-2.5 rounded-xl border border-amber-200 bg-amber-50/60 hover:bg-amber-100/70 text-left transition-colors"
              >
                <div className="flex items-center space-x-2.5">
                  <div className="w-7 h-7 rounded-lg bg-amber-500 text-white flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-amber-900">Principal / Admin</div>
                    <div className="text-[10px] text-amber-700">Dr. Ananya Sharma</div>
                  </div>
                </div>
                <span className="text-[10px] bg-white px-2 py-0.5 rounded-md text-amber-800 font-semibold border border-amber-200">
                  EMP001
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('ROLE_SUPERVISOR')}
                className="w-full flex items-center justify-between p-2.5 rounded-xl border border-blue-200 bg-blue-50/60 hover:bg-blue-100/70 text-left transition-colors"
              >
                <div className="flex items-center space-x-2.5">
                  <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-blue-900">Supervisor (Dept Head)</div>
                    <div className="text-[10px] text-blue-700">Prof. Rajesh Verma</div>
                  </div>
                </div>
                <span className="text-[10px] bg-white px-2 py-0.5 rounded-md text-blue-800 font-semibold border border-blue-200">
                  EMP002
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('ROLE_STAFF')}
                className="w-full flex items-center justify-between p-2.5 rounded-xl border border-emerald-200 bg-emerald-50/60 hover:bg-emerald-100/70 text-left transition-colors"
              >
                <div className="flex items-center space-x-2.5">
                  <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
                    <UserCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-emerald-900">Teaching Staff</div>
                    <div className="text-[10px] text-emerald-700">Pooja Malhotra (Physics)</div>
                  </div>
                </div>
                <span className="text-[10px] bg-white px-2 py-0.5 rounded-md text-emerald-800 font-semibold border border-emerald-200">
                  EMP004
                </span>
              </button>
            </div>
          </div>

        </div>

        {/* Footer info */}
        <p className="text-center text-xs text-slate-400 mt-6">
          © 2026 Bal Bharati Public School. Production-ready staff portal.
        </p>

      </div>

      {/* Forgot Password Modal */}
      {showForgot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center space-x-2 text-slate-800 font-bold text-base mb-1">
              <KeyRound className="w-5 h-5 text-emerald-600" />
              <span>Reset Password</span>
            </div>
            <p className="text-xs text-slate-500 mb-4">Enter your employee ID or registered email along with your new password.</p>

            {forgotMessage && (
              <div className="mb-3 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>{forgotMessage}</span>
              </div>
            )}

            {forgotError && (
              <div className="mb-3 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium">
                {forgotError}
              </div>
            )}

            <form onSubmit={handleForgotSubmit} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Employee ID or Email</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. staff1@bbps.edu or EMP004"
                  value={forgotIdentifier}
                  onChange={(e) => setForgotIdentifier(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">New Password</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder="Min 6 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForgot(false)}
                  className="flex-1 py-2 text-xs font-semibold rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="flex-1 py-2 text-xs font-bold rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-60"
                >
                  {forgotLoading ? 'Updating...' : 'Reset'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
