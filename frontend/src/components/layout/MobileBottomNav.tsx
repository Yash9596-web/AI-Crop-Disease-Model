import React from 'react';
import { Home, Camera, History, LayoutDashboard, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface MobileBottomNavProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ currentTab, onNavigate }) => {
  const { user, openAuthModal } = useAuth();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#07130E]/95 backdrop-blur-md border-t border-agri-100 dark:border-white/10 shadow-elevated px-2 py-1 safe-area-bottom">
      <div className="flex items-center justify-around">
        <button
          onClick={() => onNavigate('home')}
          className={`flex flex-col items-center py-1.5 px-3 rounded-xl transition-all btn-tactile ${
            currentTab === 'home' ? 'text-emerald-700 dark:text-emerald-400 font-bold' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[11px] mt-0.5">Home</span>
        </button>

        <button
          onClick={() => onNavigate('analyze')}
          className="relative -top-3 flex flex-col items-center group focus:outline-none btn-tactile"
        >
          <div className="w-13 h-13 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-700/30 group-active:scale-95 transition-all p-3 border-4 border-white dark:border-[#07130E]">
            <Camera className="w-6 h-6 transition-transform group-hover:rotate-12" />
          </div>
          <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 mt-0.5">Scan</span>
        </button>

        <button
          onClick={() => onNavigate('dashboard')}
          className={`flex flex-col items-center py-1.5 px-3 rounded-xl transition-all btn-tactile ${
            currentTab === 'dashboard' ? 'text-emerald-700 dark:text-emerald-400 font-bold' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="text-[11px] mt-0.5">Dashboard</span>
        </button>

        <button
          onClick={() => onNavigate('history')}
          className={`flex flex-col items-center py-1.5 px-3 rounded-xl transition-all btn-tactile ${
            currentTab === 'history' ? 'text-emerald-700 dark:text-emerald-400 font-bold' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
          }`}
        >
          <History className="w-5 h-5" />
          <span className="text-[11px] mt-0.5">History</span>
        </button>

        <button
          onClick={() => user ? onNavigate('dashboard') : openAuthModal('login')}
          className={`flex flex-col items-center py-1.5 px-3 rounded-xl transition-all btn-tactile ${
            currentTab === 'profile' ? 'text-emerald-700 dark:text-emerald-400 font-bold' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
          }`}
        >
          <User className="w-5 h-5" />
          <span className="text-[11px] mt-0.5">{user ? 'Profile' : 'Sign In'}</span>
        </button>
      </div>
    </nav>
  );
};
