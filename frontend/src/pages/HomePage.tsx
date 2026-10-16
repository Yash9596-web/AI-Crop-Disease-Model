import React from 'react';
import { useAuth } from '../context/AuthContext';
import { NatureHeroShowcase } from '../components/NatureHeroShowcase';
import {
  Sparkles,
  ArrowRight,
  Upload,
  Cpu,
  Search,
  CheckCircle2,
  ShieldCheck,
  Activity,
  Layers,
  FileText,
  AlertTriangle,
  History,
  Sprout
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (tab: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const { t } = useAuth();

  const crops = [
    {
      name: "Tomato",
      scientific: "Solanum lycopersicum",
      classes: "4 Classes",
      badgeColor: "bg-rose-50 text-rose-500 border-rose-200/60 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-900/40",
      pathogens: ["Early Blight", "Late Blight", "Yellow Leaf Curl"],
      icon: "/crops/tomato.png"
    },
    {
      name: "Potato",
      scientific: "Solanum tuberosum",
      classes: "3 Classes",
      badgeColor: "bg-amber-50 text-amber-600 border-amber-200/60 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900/40",
      pathogens: ["Early Blight", "Late Blight", "Healthy"],
      icon: "/crops/potato.png"
    },
    {
      name: "Corn",
      scientific: "Zea mays",
      classes: "3 Classes",
      badgeColor: "bg-emerald-50 text-emerald-600 border-emerald-200/60 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/40",
      pathogens: ["Common Rust", "Northern Leaf Blight", "Cercospora Spot"],
      icon: "/crops/corn.png"
    },
    {
      name: "Rice",
      scientific: "Oryza sativa",
      classes: "3 Classes",
      badgeColor: "bg-cyan-50 text-cyan-600 border-cyan-200/60 dark:bg-cyan-950/30 dark:text-cyan-400 dark:border-cyan-900/40",
      pathogens: ["Leaf Blast", "Brown Spot", "Bacterial Blight"],
      icon: "/crops/rice.png"
    },
    {
      name: "Wheat",
      scientific: "Triticum aestivum",
      classes: "3 Classes",
      badgeColor: "bg-amber-50 text-amber-600 border-amber-200/60 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900/40",
      pathogens: ["Leaf Rust", "Stripe Rust", "Powdery Mildew"],
      icon: "/crops/wheat.png"
    },
    {
      name: "Apple",
      scientific: "Malus domestica",
      classes: "3 Classes",
      badgeColor: "bg-rose-50 text-rose-500 border-rose-200/60 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-900/40",
      pathogens: ["Apple Scab", "Black Rot", "Canker Blight"],
      icon: "/crops/apple.png"
    },
    {
      name: "Grape",
      scientific: "Vitis vinifera",
      classes: "3 Classes",
      badgeColor: "bg-purple-50 text-purple-600 border-purple-200/60 dark:bg-purple-950/30 dark:text-purple-400 dark:border-purple-900/40",
      pathogens: ["Black Rot", "Esca (Black Measles)", "Leaf Blight"],
      icon: "/crops/grape.png"
    },
    {
      name: "Cotton",
      scientific: "Gossypium hirsutum",
      classes: "3 Classes",
      badgeColor: "bg-cyan-50 text-cyan-600 border-cyan-200/60 dark:bg-cyan-950/30 dark:text-cyan-400 dark:border-cyan-900/40",
      pathogens: ["Bacterial Blight", "Target Spot", "Healthy"],
      icon: "/crops/cotton.png"
    }
  ];

  return (
    <div>
      {/* ================= CINEMATIC NATURE / WEST HERO SHOWCASE ================= */}
      <NatureHeroShowcase onNavigate={onNavigate} />

      {/* ================= MAIN APPLICATION CONTENT ================= */}
      <div className="space-y-24 pt-10">

      {/* ================= HOW IT WORKS (SECTION 4) ================= */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-agri-950 tracking-tight">
            {t.howItWorksHeading}
          </h2>
          <p className="text-gray-600 mt-2 text-base">
            {t.howItWorksSubheading}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Step 1 */}
          <div className="bg-white dark:bg-[#0E1E17] rounded-3xl p-7 border border-agri-100/90 dark:border-white/10 shadow-soft interactive-card relative group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold text-lg mb-5 group-hover:bg-emerald-600 group-hover:text-white group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-sm">
              <Upload className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-agri-950 dark:text-white mb-2">{t.step1Title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{t.step1Desc}</p>
          </div>

          {/* Step 2 */}
          <div className="bg-white dark:bg-[#0E1E17] rounded-3xl p-7 border border-agri-100/90 dark:border-white/10 shadow-soft interactive-card relative group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold text-lg mb-5 group-hover:bg-emerald-600 group-hover:text-white group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-sm">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-agri-950 dark:text-white mb-2">{t.step2Title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{t.step2Desc}</p>
          </div>

          {/* Step 3 */}
          <div className="bg-white dark:bg-[#0E1E17] rounded-3xl p-7 border border-agri-100/90 dark:border-white/10 shadow-soft interactive-card relative group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold text-lg mb-5 group-hover:bg-emerald-600 group-hover:text-white group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-sm">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-agri-950 dark:text-white mb-2">{t.step3Title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{t.step3Desc}</p>
          </div>

          {/* Step 4 */}
          <div className="bg-white dark:bg-[#0E1E17] rounded-3xl p-7 border border-agri-100/90 dark:border-white/10 shadow-soft interactive-card relative group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold text-lg mb-5 group-hover:bg-emerald-600 group-hover:text-white group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-sm">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-agri-950 dark:text-white mb-2">{t.step4Title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{t.step4Desc}</p>
          </div>
        </div>
      </section>

      {/* ================= SUPPORTED CROPS (SECTION 4) ================= */}
      <section id="crop-catalog-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-agri-950 mt-3 tracking-tight">
            {t.supportedCropsHeading}
          </h2>
          <p className="text-gray-600 mt-2 text-base">
            {t.supportedCropsSubheading}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {crops.map((crop) => (
            <div
              key={crop.name}
              className="bg-white dark:bg-[#0E1E17] rounded-3xl p-6 border border-gray-100/90 dark:border-white/10 shadow-soft interactive-card flex flex-col justify-between group"
            >
              <div>
                {/* Top Row: Illustrated Crop Icon & Classes Badge */}
                <div className="flex items-start justify-between mb-3 min-h-[70px]">
                  <div className="relative flex items-center justify-start">
                    <img
                      src={crop.icon}
                      alt={crop.name}
                      className="h-16 w-auto max-w-[120px] object-contain transform group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-500 filter drop-shadow-md"
                      loading="lazy"
                    />
                  </div>
                  <span className={`text-[11px] font-bold px-3 py-1 rounded-full border shadow-2xs whitespace-nowrap transition-transform duration-300 group-hover:scale-105 ${crop.badgeColor}`}>
                    {crop.classes}
                  </span>
                </div>

                {/* Crop Name & Botanical Name */}
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-1 mb-0.5">{crop.name}</h3>
                <p className="text-xs italic text-gray-400 dark:text-gray-400 font-medium mb-4">{crop.scientific}</p>

                {/* Key Pathogens Section */}
                <div className="space-y-2 border-t border-gray-100 dark:border-white/10 pt-3">
                  <span className="text-[10px] font-bold text-gray-400 dark:text-gray-400 uppercase tracking-wider block">KEY PATHOGENS</span>
                  {crop.pathogens.map((p) => (
                    <div key={p} className="flex items-center gap-2 text-xs font-medium text-gray-700 dark:text-gray-200">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 group-hover:scale-125 transition-transform" />
                      <span>{p}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => onNavigate('analyze')}
                className="mt-6 w-full py-2.5 px-4 bg-[#EDF6F1] hover:bg-[#E2F0E8] dark:bg-[#1A3326] dark:hover:bg-[#234232] text-[#1E5C3B] dark:text-[#8FD8A0] font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 group/btn btn-tactile btn-shimmer"
              >
                <span>Scan {crop.name}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1.5 transition-transform" />
              </button>
            </div>
          ))}
        </div>

        {/* Universal Plant Leaf & Additional Crops Banner */}
        <div className="mt-10 rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-emerald-50 via-agri-50 to-emerald-100/50 dark:from-[#0B1A13] dark:via-[#0E241B] dark:to-[#0B1A13] border border-emerald-200/80 dark:border-emerald-500/20 shadow-soft flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden group">
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-emerald-600 dark:bg-emerald-700 text-white flex items-center justify-center shrink-0 shadow-lg shadow-emerald-700/30 animate-float-slow">
              <Sparkles className="w-7 h-7 text-emerald-200" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <h4 className="text-lg font-extrabold text-agri-950 dark:text-white">
                  Universal Leaf Coverage for Any Plant Species
                </h4>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-600 text-white uppercase tracking-wider shadow-sm animate-pulse">
                  All Plants Supported
                </span>
              </div>
              <p className="text-xs sm:text-sm text-agri-900/80 dark:text-emerald-200/80 max-w-2xl leading-relaxed">
                Have a different crop or garden foliage? Mango, Banana, Citrus, Papaya, Chilli, Soybean, Guava, or ornamental plants — our adaptive multi-spectral engine automatically identifies and diagnoses any leaf with zero crop-restriction errors.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('analyze')}
            className="w-full md:w-auto px-6 py-3.5 bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-bold text-sm rounded-2xl shadow-card transition-all flex items-center justify-center gap-2 shrink-0 group btn-tactile btn-shimmer relative z-10"
          >
            <span>Scan Any Leaf Photo</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
          </button>
        </div>
      </section>

      {/* ================= AI DETECTION FEATURES (SECTION 4) ================= */}
      <section className="bg-white dark:bg-[#07130E] py-16 border-y border-agri-100 dark:border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-agri-950 dark:text-white tracking-tight">
              {t.featuresHeading}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mt-2 text-base">
              {t.featuresSubheading}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="p-6 rounded-3xl bg-emerald-50/30 dark:bg-white/5 border border-emerald-100/60 dark:border-white/10 interactive-card space-y-3 group">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100/80 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-sm">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">{t.feature1Title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{t.feature1Desc}</p>
            </div>

            <div className="p-6 rounded-3xl bg-emerald-50/30 dark:bg-white/5 border border-emerald-100/60 dark:border-white/10 interactive-card space-y-3 group">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100/80 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-sm">
                <Activity className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">{t.feature2Title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{t.feature2Desc}</p>
            </div>

            <div className="p-6 rounded-3xl bg-emerald-50/30 dark:bg-white/5 border border-emerald-100/60 dark:border-white/10 interactive-card space-y-3 group">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100/80 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-sm">
                <Sprout className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">{t.feature3Title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{t.feature3Desc}</p>
            </div>

            <div className="p-6 rounded-3xl bg-emerald-50/30 dark:bg-white/5 border border-emerald-100/60 dark:border-white/10 interactive-card space-y-3 group">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100/80 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-sm">
                <History className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">{t.feature4Title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{t.feature4Desc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FINAL CALL TO ACTION (SECTION 4) ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-r from-emerald-900 via-agri-800 to-emerald-900 text-white p-8 sm:p-14 overflow-hidden shadow-2xl group">
          {/* Background animated ambient pattern */}
          <div className="absolute -right-10 -bottom-10 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl animate-glow-pulse pointer-events-none" />

          <div className="relative z-10 max-w-2xl space-y-4">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              {t.finalCtaHeading}
            </h2>
            <p className="text-emerald-100/90 text-base sm:text-lg leading-relaxed">
              {t.finalCtaSubheading}
            </p>
            <div className="pt-4">
              <button
                onClick={() => onNavigate('analyze')}
                className="px-8 py-4 bg-white text-emerald-950 hover:bg-emerald-50 font-bold rounded-2xl shadow-elevated transition-all flex items-center gap-2 group text-base btn-tactile btn-shimmer"
              >
                <span>{t.finalCtaBtn}</span>
                <ArrowRight className="w-5 h-5 text-emerald-700 group-hover:translate-x-1.5 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </section>

      </div>
    </div>
  );
};
