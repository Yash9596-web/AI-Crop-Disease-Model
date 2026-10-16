import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface ThemeToggleProps {
  className?: string;
  variant?: 'button' | 'pill' | 'switch';
  showLabel?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  className = '',
  variant = 'button',
  showLabel = false,
}) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  if (variant === 'pill') {
    return (
      <button
        type="button"
        onClick={toggleTheme}
        role="switch"
        aria-checked={isDark}
        aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
        title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
        className={`relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all border shadow-xs ${
          isDark
            ? 'bg-gray-800 text-amber-300 border-gray-700 hover:bg-gray-700'
            : 'bg-white text-agri-800 border-gray-200 hover:bg-gray-50'
        } ${className}`}
      >
        <div className="relative w-4 h-4 flex items-center justify-center">
          {isDark ? (
            <Moon className="w-3.5 h-3.5 text-indigo-300 transition-transform rotate-0" />
          ) : (
            <Sun className="w-3.5 h-3.5 text-amber-500 transition-transform rotate-0" />
          )}
        </div>
        {showLabel && <span>{isDark ? 'Dark' : 'Light'}</span>}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      role="switch"
      aria-checked={isDark}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      className={`relative p-2.5 rounded-2xl border transition-all duration-300 flex items-center justify-center group focus:outline-none focus:ring-2 focus:ring-agri-500/50 btn-tactile ${
        isDark
          ? 'bg-[#0E1E17]/90 text-amber-300 border-emerald-500/30 hover:border-emerald-400/60 shadow-lg shadow-black/40 hover:shadow-emerald-900/30'
          : 'bg-white/95 text-gray-700 border-agri-100 hover:bg-agri-50/80 hover:text-agri-800 hover:border-agri-200 shadow-md shadow-agri-900/5'
      } ${className}`}
    >
      <div className="relative w-5 h-5 flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300">
        <Sun
          className={`w-4 h-4 text-amber-500 transition-all duration-300 absolute ${
            isDark
              ? 'opacity-0 rotate-90 scale-50 pointer-events-none'
              : 'opacity-100 rotate-0 scale-100'
          }`}
        />
        <Moon
          className={`w-4 h-4 text-indigo-300 transition-all duration-300 absolute ${
            isDark
              ? 'opacity-100 rotate-0 scale-100'
              : 'opacity-0 -rotate-90 scale-50 pointer-events-none'
          }`}
        />
      </div>
      {showLabel && (
        <span className="ml-2 text-xs font-semibold">
          {isDark ? 'Dark' : 'Light'}
        </span>
      )}
    </button>
  );
};
