import React, { useState } from 'react';
import { Logo } from '../ui/Logo';
import { ThemeToggle } from '../ui/ThemeToggle';
import { useAuth } from '../../context/AuthContext';
import {
  Menu,
  X,
  Camera,
  History,
  LayoutDashboard,
  Shield,
  User as UserIcon,
  LogOut,
  Globe,
  Plus,
  Key
} from 'lucide-react';
import { GeminiKeyModal } from '../ui/GeminiKeyModal';

interface NavbarProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onNavigate }) => {
  const { user, logout, openAuthModal, language, setLanguage, t } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showKeyModal, setShowKeyModal] = useState(false);

  const handleNav = (tab: string) => {
    onNavigate(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-agri-100 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo */}
          <button
            onClick={() => handleNav('home')}
            className="flex items-center focus:outline-none focus:ring-2 focus:ring-agri-500 rounded-lg p-1"
          >
            <Logo showTagline={false} />
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            <button
              onClick={() => handleNav('home')}
              className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all btn-tactile ${
                currentTab === 'home'
                  ? 'bg-agri-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 font-bold shadow-xs'
                  : 'text-gray-600 dark:text-gray-300 hover:text-emerald-800 dark:hover:text-emerald-300 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/30'
              }`}
            >
              Home
            </button>

            <button
              onClick={() => handleNav('analyze')}
              className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-1.5 btn-tactile group ${
                currentTab === 'analyze'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25 btn-shimmer font-bold'
                  : 'text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 font-bold'
              }`}
            >
              <Camera className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
              Analyze Leaf
            </button>

            <button
              onClick={() => handleNav('dashboard')}
              className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-1.5 btn-tactile ${
                currentTab === 'dashboard'
                  ? 'bg-agri-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 font-bold shadow-xs'
                  : 'text-gray-600 dark:text-gray-300 hover:text-emerald-800 dark:hover:text-emerald-300 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/30'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </button>

            <button
              onClick={() => handleNav('history')}
              className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-1.5 btn-tactile ${
                currentTab === 'history'
                  ? 'bg-agri-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 font-bold shadow-xs'
                  : 'text-gray-600 dark:text-gray-300 hover:text-emerald-800 dark:hover:text-emerald-300 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/30'
              }`}
            >
              <History className="w-4 h-4" />
              Scan History
            </button>

            {user?.role === 'admin' && (
              <button
                onClick={() => handleNav('admin')}
                className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-1.5 btn-tactile ${
                  currentTab === 'admin'
                    ? 'bg-emerald-900 text-white'
                    : 'text-amber-800 hover:bg-amber-50'
                }`}
              >
                <Shield className="w-4 h-4 text-amber-500" />
                Admin Panel
              </button>
            )}
          </nav>

          {/* Desktop Right Controls (Theme, Language & Auth) */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Dark / Light Theme Toggle */}
            {/* AI Vision Model Key */}
            <button
              onClick={() => setShowKeyModal(true)}
              className="p-2.5 rounded-xl text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 border border-emerald-500/20 transition-all btn-tactile"
              title="Configure Gemini AI Vision Key"
            >
              <Key className="w-4 h-4" />
            </button>

            <ThemeToggle />

            {/* Language Switcher */}
            <div className="flex items-center bg-gray-100 dark:bg-white/5 rounded-xl p-1 border border-gray-200 dark:border-white/10">
              <button
                onClick={() => setLanguage('en')}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all btn-tactile ${
                  language === 'en'
                    ? 'bg-white dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 shadow-xs'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
                title="English"
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('hi')}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all btn-tactile ${
                  language === 'hi'
                    ? 'bg-white dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 shadow-xs'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
                title="हिन्दी (Hindi)"
              >
                हिन्दी
              </button>
            </div>

            {/* Auth Actions */}
            {user ? (
              <div className="flex items-center space-x-2 pl-2 border-l border-gray-200 dark:border-white/10">
                <div className="text-right">
                  <span className="block text-xs font-bold text-gray-900 dark:text-white truncate max-w-[120px]">
                    {user.name}
                  </span>
                  <span className="block text-[10px] uppercase font-semibold text-emerald-600 dark:text-emerald-400 tracking-wider">
                    {user.role}
                  </span>
                </div>
                <button
                  onClick={logout}
                  className="p-2 text-gray-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition-all btn-tactile"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => openAuthModal('login')}
                  className="px-4 py-2 text-sm font-semibold text-emerald-800 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 rounded-xl transition-all btn-tactile"
                >
                  Sign In
                </button>
                <button
                  onClick={() => openAuthModal('register')}
                  className="px-4 py-2 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-500 rounded-xl shadow-xs transition-all btn-tactile btn-shimmer"
                >
                  Register
                </button>
              </div>
            )}
          </div>

          {/* Mobile Right Controls */}
          <div className="flex md:hidden items-center space-x-2">
            <ThemeToggle />
            <div className="flex items-center bg-gray-100 dark:bg-white/10 rounded-lg p-0.5 border border-gray-200 dark:border-white/15">
              <button
                onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
                className="px-2 py-0.5 text-xs font-bold text-agri-800 dark:text-emerald-300 btn-tactile"
              >
                {language === 'en' ? 'हिन्दी' : 'EN'}
              </button>
            </div>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:text-agri-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 focus:outline-none btn-tactile"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-[#0E1E17] border-b border-agri-100 dark:border-white/10 px-4 pt-3 pb-6 space-y-2 shadow-xl animate-in slide-in-from-top-2 duration-200">
          <button
            onClick={() => handleNav('home')}
            className={`w-full text-left px-4 py-3 rounded-xl text-base font-semibold flex items-center gap-3 btn-tactile ${
              currentTab === 'home' ? 'bg-agri-50 dark:bg-emerald-950/50 text-agri-800 dark:text-emerald-300 font-bold' : 'text-gray-700 dark:text-gray-200'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => handleNav('analyze')}
            className={`w-full text-left px-4 py-3 rounded-xl text-base font-semibold flex items-center gap-3 btn-tactile btn-shimmer ${
              currentTab === 'analyze' ? 'bg-emerald-600 text-white font-bold' : 'bg-agri-50 dark:bg-emerald-950/50 text-agri-800 dark:text-emerald-300 font-bold'
            }`}
          >
            <Camera className="w-5 h-5" />
            Analyze Leaf
          </button>
          <button
            onClick={() => handleNav('dashboard')}
            className={`w-full text-left px-4 py-3 rounded-xl text-base font-semibold flex items-center gap-3 btn-tactile ${
              currentTab === 'dashboard' ? 'bg-agri-50 dark:bg-emerald-950/50 text-agri-800 dark:text-emerald-300 font-bold' : 'text-gray-700 dark:text-gray-200'
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </button>
          <button
            onClick={() => handleNav('history')}
            className={`w-full text-left px-4 py-3 rounded-xl text-base font-semibold flex items-center gap-3 btn-tactile ${
              currentTab === 'history' ? 'bg-agri-50 dark:bg-emerald-950/50 text-agri-800 dark:text-emerald-300 font-bold' : 'text-gray-700 dark:text-gray-200'
            }`}
          >
            <History className="w-5 h-5" />
            Scan History
          </button>

          {user?.role === 'admin' && (
            <button
              onClick={() => handleNav('admin')}
              className={`w-full text-left px-4 py-3 rounded-xl text-base font-semibold flex items-center gap-3 btn-tactile ${
                currentTab === 'admin' ? 'bg-emerald-900 text-white' : 'text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/30'
              }`}
            >
              <Shield className="w-5 h-5 text-amber-500" />
              Admin Management
            </button>
          )}

          <div className="pt-3 border-t border-gray-100 dark:border-white/10 flex items-center justify-between px-2 py-2">
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">Theme Mode</span>
            <ThemeToggle variant="pill" showLabel />
          </div>

          <div className="pt-2 border-t border-gray-100 dark:border-white/10 flex flex-col gap-2">
            {user ? (
              <div className="flex items-center justify-between px-2 py-1">
                <div>
                  <div className="font-bold text-gray-900 dark:text-white text-sm">{user.name}</div>
                  <div className="text-xs text-agri-600 dark:text-emerald-400">{user.email}</div>
                </div>
                <button
                  onClick={() => { logout(); setMobileMenuOpen(false); }}
                  className="px-3 py-1.5 text-xs font-bold text-danger-600 bg-danger-50 dark:bg-rose-950/40 dark:text-rose-300 rounded-lg btn-tactile"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  onClick={() => { openAuthModal('login'); setMobileMenuOpen(false); }}
                  className="w-full py-2.5 text-center text-sm font-bold text-agri-800 dark:text-emerald-300 bg-agri-50 dark:bg-white/10 rounded-xl btn-tactile"
                >
                  Sign In
                </button>
                <button
                  onClick={() => { openAuthModal('register'); setMobileMenuOpen(false); }}
                  className="w-full py-2.5 text-center text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl btn-tactile btn-shimmer"
                >
                  Register
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Gemini AI Key Modal */}
      <GeminiKeyModal isOpen={showKeyModal} onClose={() => setShowKeyModal(false)} />
    </header>
  );
};
