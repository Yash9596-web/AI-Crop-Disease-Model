import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  ArrowRight,
  Camera,
  Compass,
  Sprout,
  ShieldCheck,
  Eye,
  CheckCircle2,
  ExternalLink,
  Volume2,
  VolumeX
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Logo } from './ui/Logo';

interface NatureHeroShowcaseProps {
  onNavigate: (tab: string) => void;
}

export const NatureHeroShowcase: React.FC<NatureHeroShowcaseProps> = ({ onNavigate }) => {
  const { openAuthModal } = useAuth();
  
  // Progress between 0 (Full Hero) and 1 (Contracted Letterbox + 4 Cards)
  const [progress, setProgress] = useState<number>(0);
  const [selectedCardIndex, setSelectedCardIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll listener for smooth transition
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const containerHeight = containerRef.current.offsetHeight;
      const windowHeight = window.innerHeight;
      
      // Calculate how far we've scrolled inside the container
      const scrolled = -rect.top;
      const maxScroll = containerHeight - windowHeight;
      
      if (maxScroll > 0) {
        const rawProgress = Math.max(0, Math.min(1, scrolled / maxScroll));
        setProgress(rawProgress);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Card dataset for C · R · O · P (Real photorealistic leaf pathology)
  const cropCards = [
    {
      letter: 'C',
      title: 'Corn (Maize)',
      subtitle: 'Common Rust & Blight',
      image: '/assets/crop_card_c.jpg',
      cropAlt: 'Puccinia sorghi',
      tag: 'Cereal Pathology'
    },
    {
      letter: 'R',
      title: 'Rice Paddy',
      subtitle: 'Leaf Blast & Brown Spot',
      image: '/assets/crop_card_r.jpg',
      cropAlt: 'Helminthosporium oryzae',
      tag: 'Grain Foliage'
    },
    {
      letter: 'O',
      title: 'Orchard Fruits',
      subtitle: 'Apple Cedar Rust & Scab',
      image: '/assets/crop_card_o.jpg',
      cropAlt: 'Gymnosporangium juniperi',
      tag: 'Fruit Foliage'
    },
    {
      letter: 'P',
      title: 'Potato & Tomato',
      subtitle: 'Early & Late Blight',
      image: '/assets/crop_card_p.jpg',
      cropAlt: 'Alternaria solani',
      tag: 'Solanaceae Family'
    }
  ];

  const currentCards = cropCards;

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-[180vh] sm:h-[200vh] md:h-[220vh] bg-[#070B09] text-white select-none font-sans"
    >
      {/* Sticky viewport frame that animates based on scroll progress */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-between p-3 sm:p-6 md:p-8 bg-[#070B09]">
        
        {/* ================= BACKGROUND CONTAINER (TRANSITIONS FROM FULLSCREEN TO TOP LETTERBOX) ================= */}
        <div 
          className="absolute inset-0 transition-all duration-300 ease-out origin-top pointer-events-none"
          style={{
            transform: `translateY(${progress * 24}px) scale(${1 - progress * 0.12})`,
            height: progress > 0.1 ? `${Math.max(22, 100 - progress * 76)}%` : '100%',
            width: progress > 0.1 ? `${Math.max(86, 100 - progress * 12)}%` : '100%',
            left: progress > 0.1 ? `${progress * 6}%` : '0%',
            borderRadius: `${progress * 28}px`,
            overflow: 'hidden',
            boxShadow: progress > 0.2 ? '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.12)' : 'none',
            zIndex: 1
          }}
        >
          {/* Main 4K Nature Background Image */}
          <img 
            src="/assets/nature-hero-bg.jpg"
            alt="Cinematic Nature Landscape"
            className="w-full h-full object-cover object-center transform transition-transform duration-700 ease-out scale-105"
            style={{
              filter: `brightness(${1 - progress * 0.25}) saturate(${1 + progress * 0.1})`
            }}
          />

          {/* Cinematic Vignette Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/40" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/60" />

          {/* Centered Large "Nature." Typography (Fades out smoothly as user scrolls) */}
          <div 
            className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 transition-all duration-300 pointer-events-none"
            style={{
              opacity: Math.max(0, 1 - progress * 2.8),
              transform: `translateY(-${progress * 60}px) scale(${1 - progress * 0.1})`
            }}
          >
            <h1 className="text-5xl sm:text-7xl md:text-9xl lg:text-[11rem] font-bold tracking-tight text-white drop-shadow-[0_10px_35px_rgba(0,0,0,0.8)] font-sans">
              Nature.
            </h1>
            <p className="mt-2 text-xs sm:text-base md:text-lg text-emerald-100/90 font-medium tracking-wide drop-shadow-md px-2">
              AI Crop Foliar Diagnostics & Sustainable Harvest Protection
            </p>
          </div>
        </div>

        {/* ================= TOP NAVIGATION BAR (ADAPTS TO VIDEO HEADER AESTHETICS) ================= */}
        <header className="relative z-20 flex items-center justify-between w-full max-w-7xl mx-auto pt-2 px-2 sm:px-4">
          {/* Brand Logo: AI Crop Disease Detection */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => onNavigate('home')} 
              className="hover:opacity-85 transition-opacity focus:outline-none"
            >
              <Logo inverted={true} showTagline={false} />
            </button>
          </div>


          {/* Right: Quick Action Pill */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('analyze')}
              className="hidden md:inline-flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/15 backdrop-blur-md transition-all btn-tactile btn-shimmer"
            >
              <Camera className="w-3.5 h-3.5 text-emerald-400" />
              <span>Scan Leaf</span>
            </button>
            <button
              onClick={() => openAuthModal('login')}
              className="px-5 py-2 text-xs sm:text-sm font-semibold rounded-full bg-white text-black hover:bg-gray-100 transition-all shadow-md btn-tactile"
            >
              Sign in
            </button>
          </div>
        </header>

        {/* ================= MIDDLE SHOWCASE: 4 VERTICAL CARDS (FADES AND SLIDES IN ON SCROLL) ================= */}
        <div 
          className="relative z-10 w-full max-w-5xl mx-auto flex flex-col items-center justify-center my-auto transition-all duration-500"
          style={{
            opacity: Math.max(0, (progress - 0.25) * 1.8),
            transform: `translateY(${Math.max(0, (1 - progress) * 80)}px)`,
            pointerEvents: progress > 0.35 ? 'auto' : 'none'
          }}
        >
          {/* 4 Vertical Cards Row */}
          <div className="grid grid-cols-4 gap-2 sm:gap-5 md:gap-8 w-full px-1 sm:px-6">
            {currentCards.map((card, idx) => (
              <div
                key={card.letter}
                onClick={() => {
                  setSelectedCardIndex(idx);
                  const target = document.getElementById('crop-catalog-section');
                  if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="group flex flex-col items-center cursor-pointer transition-transform duration-300"
                title={`Click to explore ${card.title} foliar diseases`}
              >
                {/* Vertical Portrait Photo Card */}
                <div 
                  className={`relative w-full aspect-[9/16] sm:aspect-[3/5] rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl transition-all duration-500 ease-out border ${
                    selectedCardIndex === idx
                      ? 'border-emerald-400 ring-2 ring-emerald-400/50 scale-105'
                      : 'border-white/15 group-hover:border-emerald-400/60 group-hover:scale-105 group-hover:-translate-y-2'
                  } bg-black/50`}
                >
                  <img
                    src={card.image}
                    alt={card.title}
                    className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-out"
                  />
                  {/* Subtle inner gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/20" />
                  
                  {/* Top pill tag on card hover */}
                  <div className="absolute top-1.5 sm:top-2 left-1 sm:left-2 right-1 sm:right-2 opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300">
                    <span className="inline-block text-[8px] sm:text-[10px] uppercase font-bold tracking-wider px-1.5 sm:px-2 py-0.5 rounded-full bg-black/70 text-emerald-300 backdrop-blur-md border border-emerald-500/30 truncate max-w-full">
                      {card.tag}
                    </span>
                  </div>

                  {/* Bottom info on hover / selected */}
                  <div className={`absolute bottom-1.5 sm:bottom-2 left-1 sm:left-2 right-1 sm:right-2 ${selectedCardIndex === idx ? 'opacity-100' : 'opacity-0 sm:group-hover:opacity-100'} transition-opacity duration-300 text-left`}>
                    <p className="text-[9px] sm:text-xs font-bold text-white truncate drop-shadow">
                      {card.title}
                    </p>
                    <p className="hidden sm:block text-[8px] sm:text-[10px] text-gray-300 truncate">
                      {card.subtitle}
                    </p>
                  </div>
                </div>

                {/* The Big Letter Underneath (C, R, O, P) */}
                <div className="mt-2 sm:mt-4 text-center">
                  <span className={`text-lg sm:text-2xl md:text-3xl font-extrabold tracking-widest transition-colors duration-300 ${
                    selectedCardIndex === idx 
                      ? 'text-emerald-400' 
                      : 'text-gray-400 group-hover:text-white'
                  }`}>
                    {card.letter}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Editorial Paragraph Below the Cards */}
          <div className="mt-4 sm:mt-8 max-w-2xl text-center px-3 sm:px-4 space-y-3 sm:space-y-4">
            <p className="text-[11px] sm:text-sm md:text-base text-gray-300/90 leading-relaxed font-light">
              <strong className="font-semibold text-white">Precision Foliar Diagnostics</strong> represent a vital breakthrough for safeguarding family farms and agricultural harvests. Early pathogen diagnosis halts disease progression and curbs crop loss across 32+ varieties.
            </p>

            {/* Quick Action CTAs (Stacked on mobile, row on tablet/desktop) */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-3 pt-1 sm:pt-2 w-full max-w-md mx-auto sm:max-w-none">
              <button
                onClick={() => onNavigate('analyze')}
                className="w-full sm:w-auto px-6 py-2.5 sm:py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs sm:text-sm rounded-full shadow-lg hover:shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 group btn-tactile btn-shimmer"
              >
                <Camera className="w-4 h-4 transition-transform group-hover:rotate-12" />
                <span>Instant Leaf Diagnosis</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                onClick={() => {
                  const target = document.getElementById('crop-catalog-section');
                  if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                  } else {
                    onNavigate('home');
                  }
                }}
                className="w-full sm:w-auto px-5 py-2.5 sm:py-3 bg-white/10 hover:bg-white/20 text-white font-medium text-xs sm:text-sm rounded-full border border-white/20 backdrop-blur-md transition-all btn-tactile text-center"
              >
                Explore 32+ Diseases
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default NatureHeroShowcase;
