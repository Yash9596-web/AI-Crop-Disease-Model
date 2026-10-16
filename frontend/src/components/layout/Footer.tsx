import React from 'react';
import { Logo } from '../ui/Logo';
import { ShieldCheck, Info, Leaf, Heart } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Footer: React.FC = () => {
  const { t } = useAuth();

  return (
    <footer className="bg-agri-950 text-white pt-14 pb-24 md:pb-12 border-t border-agri-900 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Agricultural Safety Disclaimer Notice (Section 28) */}
        <div className="bg-agri-900/90 border border-agri-700/60 rounded-2xl p-5 mb-12 shadow-inner">
          <div className="flex items-start gap-3.5">
            <Info className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-amber-200 uppercase tracking-wider mb-1">
                Agricultural Health & Safety Notice
              </h4>
              <p className="text-xs sm:text-sm text-agri-100 leading-relaxed">
                {t.safetyNotice}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Col 1: Brand & Tagline */}
          <div className="md:col-span-2 space-y-4">
            <Logo showTagline={true} inverted={true} />
            <p className="text-sm text-agri-200 max-w-md leading-relaxed">
              Empowering farmers, growers, and agronomists with deep-learning computer vision for instant leaf pathogen identification, sustainable integrated pest management, and harvest security.
            </p>
            <div className="flex items-center gap-2 text-xs text-agri-300">
              <ShieldCheck className="w-4 h-4 text-agri-400" />
              <span>Calibrated against agricultural university leaf image standards</span>
            </div>
          </div>

          {/* Col 2: Universal Crop & Leaf Coverage */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-agri-300">
              Universal Leaf Coverage
            </h4>
            <p className="text-xs text-agri-200/80 leading-relaxed">
              Auto-detects and diagnoses all agricultural crops, horticulture varieties, and field plant foliage:
            </p>
            <div className="flex flex-wrap gap-1.5 text-xs">
              {['Tomato', 'Potato', 'Corn', 'Rice', 'Wheat', 'Cotton', 'Apple', 'Grape', 'Citrus', 'Mango', 'Banana', 'Chilli', 'Soybean', 'Papaya'].map((crop) => (
                <span key={crop} className="px-2 py-0.5 rounded-md bg-agri-900/90 border border-agri-700/50 text-agri-200">
                  {crop}
                </span>
              ))}
              <span className="px-2.5 py-0.5 rounded-md bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 font-bold">
                + Any Plant Leaf
              </span>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-agri-900/80 flex flex-col sm:flex-row items-center justify-between text-xs text-agri-300 gap-4">
          <p>© {new Date().getFullYear()} AI Crop Disease Detection. Built with farmer-first precision.</p>
          <div className="flex items-center gap-4">
            <span>English / हिन्दी</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
