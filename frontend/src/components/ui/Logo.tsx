import React from 'react';
import { Sprout } from 'lucide-react';

interface LogoProps {
  className?: string;
  showTagline?: boolean;
  inverted?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ showTagline = false, inverted = false }) => {
  return (
    <div className="flex items-center gap-2.5 select-none">
      {/* Emerald sprout badge matching the hero brand icon */}
      <div
        className={`w-8 h-8 rounded-lg flex items-center justify-center shadow-sm shrink-0 transition-colors ${
          inverted
            ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-400'
            : 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 dark:bg-emerald-500/20'
        }`}
      >
        <Sprout className="w-5 h-5" />
      </div>

      <div>
        <span
          className={`block font-extrabold tracking-tight text-lg sm:text-xl leading-none ${
            inverted ? 'text-white' : 'text-gray-900 dark:text-white'
          }`}
        >
          AI Crop <span className="text-emerald-500 dark:text-emerald-400">Disease Detection</span>
        </span>
        {showTagline && (
          <span
            className={`block text-xs font-medium mt-1 tracking-normal ${
              inverted ? 'text-emerald-100/70' : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            Detect crop diseases early. Protect your harvest smarter.
          </span>
        )}
      </div>
    </div>
  );
};

export default Logo;
