import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, Lock, Mail, User, Phone, Sparkles, Shield, AlertCircle } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, authModalMode, login, register, demoLogin, openAuthModal } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (authModalMode === 'login') {
        await login({ email, password });
      } else {
        await register({ name, email, password, phone });
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = async (role: 'farmer' | 'admin') => {
    setError(null);
    setLoading(true);
    try {
      await demoLogin(role);
    } catch (err: any) {
      setError(err.message || 'Demo login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-agri-950/70 dark:bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white dark:bg-[#0E1E17] rounded-3xl shadow-card p-6 sm:p-8 border border-agri-100 dark:border-white/10 overflow-hidden">
        
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-5 right-5 p-2 rounded-full text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-all btn-tactile"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-agri-100 dark:bg-emerald-950/60 text-agri-800 dark:text-emerald-300 mb-3 shadow-inner">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
            {authModalMode === 'login' ? 'Farmer Sign In' : 'Create Farmer Account'}
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-1">
            {authModalMode === 'login'
              ? 'Access your personal scan history and farm crop records'
              : 'Join fellow farmers to maintain continuous crop health tracking'}
          </p>
        </div>

        {/* Demo Quick Logins */}
        <div className="bg-agri-50 dark:bg-white/5 border border-agri-200/80 dark:border-white/10 rounded-2xl p-3.5 mb-6">
          <div className="text-[11px] font-bold uppercase tracking-wider text-agri-800 dark:text-emerald-300 mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-agri-600 dark:text-emerald-400" />
            1-Click Instant Evaluation
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleDemo('farmer')}
              disabled={loading}
              className="py-2 px-3 text-xs font-bold text-agri-800 dark:text-white bg-white dark:bg-white/10 hover:bg-agri-100 dark:hover:bg-white/15 border border-agri-200 dark:border-white/10 rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5 btn-tactile"
            >
              <User className="w-3.5 h-3.5 text-agri-600 dark:text-emerald-400" />
              Farmer Demo
            </button>
            <button
              type="button"
              onClick={() => handleDemo('admin')}
              disabled={loading}
              className="py-2 px-3 text-xs font-bold text-amber-900 dark:text-amber-200 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-950/60 border border-amber-200 dark:border-amber-800/40 rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5 btn-tactile"
            >
              <Shield className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              Admin Demo
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="flex items-start gap-2.5 p-3 mb-4 rounded-xl bg-danger-50 dark:bg-rose-950/40 border border-danger-100 dark:border-rose-900/40 text-danger-800 dark:text-rose-200 text-xs">
            <AlertCircle className="w-4 h-4 text-danger-600 dark:text-rose-400 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {authModalMode === 'register' && (
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-200 mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Patel"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white dark:focus:bg-[#07130E] transition-all"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-200 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                placeholder="farmer@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white dark:focus:bg-[#07130E] transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-200 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white dark:focus:bg-[#07130E] transition-all"
              />
            </div>
          </div>

          {authModalMode === 'register' && (
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-200 mb-1">Phone Number (Optional)</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white dark:focus:bg-[#07130E] transition-all"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition-all btn-tactile btn-shimmer disabled:opacity-50"
          >
            {loading ? 'Processing...' : (authModalMode === 'login' ? 'Sign In' : 'Create Account')}
          </button>
        </form>

        {/* Switch mode */}
        <div className="mt-6 text-center text-xs text-gray-600 dark:text-gray-400">
          {authModalMode === 'login' ? (
            <span>
              Don't have an account yet?{' '}
              <button
                type="button"
                onClick={() => openAuthModal('register')}
                className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline btn-tactile inline-block ml-1"
              >
                Register now
              </button>
            </span>
          ) : (
            <span>
              Already registered?{' '}
              <button
                type="button"
                onClick={() => openAuthModal('login')}
                className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline btn-tactile inline-block ml-1"
              >
                Sign In
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
