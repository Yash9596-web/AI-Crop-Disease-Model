import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { ThemeToggle } from './components/ui/ThemeToggle';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { MobileBottomNav } from './components/layout/MobileBottomNav';
import { AuthModal } from './pages/AuthModal';
import { HomePage } from './pages/HomePage';
import { UploadPage } from './pages/UploadPage';
import { ResultPage } from './pages/ResultPage';
import { DashboardPage } from './pages/DashboardPage';
import { HistoryPage } from './pages/HistoryPage';
import { AdminPage } from './pages/AdminPage';
import { PredictResponse, Detection } from './types';
import { api } from './services/api';

const AppContent: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [currentResult, setCurrentResult] = useState<PredictResponse | null>(null);
  const [scrolledPastHero, setScrolledPastHero] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolledPastHero(window.scrollY > 450);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAnalysisComplete = (result: PredictResponse) => {
    setCurrentResult(result);
    setCurrentTab('result');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectDetection = async (id: number) => {
    try {
      const detail = await api.detections.getById(id);
      // Map Detection to PredictResponse shape for detailed view
      const predictLike: PredictResponse = {
        success: true,
        detection_id: detail.id,
        crop: detail.crop_name,
        disease: detail.disease_name,
        confidence: detail.confidence,
        confidence_level: detail.confidence_level as any,
        confidence_message: detail.confidence_level === 'High' ? 'Likely Disease Detected' : 'Inspection Recommended',
        severity: detail.severity,
        is_healthy: detail.is_healthy,
        image_url: detail.image_url,
        thumbnail_url: detail.thumbnail_url,
        symptoms: detail.disease_details?.symptoms || [
          "Foliar discoloration observed in leaf blade",
          "Chlorotic margins or necrotic spotting",
          "Irregular textural changes on foliage"
        ],
        treatment: detail.disease_details?.treatment || {
          immediate_actions: [
            "Isolate or prune visibly infected leaves to minimize spore dispersion.",
            "Sanitize pruning tools between cuts with rubbing alcohol.",
            "Avoid overhead irrigation to keep leaf surfaces dry."
          ],
          biological_treatments: [
            "Apply organic neem oil spray (0.5% concentration) or copper soap bio-fungicide.",
            "Introduce beneficial soil bio-inoculants to boost root vigor."
          ],
          chemical_treatments: [
            "Apply locally approved protective contact fungicide according to product instructions."
          ],
          chemical_disclaimer: "Always verify approved chemical active ingredients with your local agricultural extension service.",
        },
        prevention: detail.disease_details?.prevention || {
          spacing: "Ensure recommended spacing between rows for adequate sunlight and airflow.",
          sanitation: "Clear weed hosts and remove previous crop residues post-harvest.",
          irrigation: "Adopt drip irrigation to prevent water splashing onto foliage.",
          rotation: "Rotate non-host crop families for at least 2–3 growing seasons.",
          resistant_varieties: "Choose certified disease-resistant hybrid seed stocks.",
          monitoring: "Scout fields at least twice weekly during high-humidity periods."
        },
        top_candidates: [
          {
            index: 0,
            crop: detail.crop_name,
            disease: detail.disease_name,
            display_name: `${detail.crop_name} ${detail.disease_name}`,
            confidence: detail.confidence,
            is_healthy: detail.is_healthy
          }
        ],
        safety_disclaimer: "This AI prediction is intended as an initial screening and educational aid. For significant crop damage or uncertain results, consult a qualified agricultural expert.",
        created_at: detail.created_at
      };

      setCurrentResult(predictLike);
      setCurrentTab('result');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error("Failed to fetch detection detail:", err);
    }
  };

  const renderContent = () => {
    switch (currentTab) {
      case 'home':
        return <HomePage onNavigate={setCurrentTab} />;
      case 'analyze':
        return <UploadPage onAnalysisComplete={handleAnalysisComplete} />;
      case 'result':
        return currentResult ? (
          <ResultPage
            result={currentResult}
            onScanAnother={() => setCurrentTab('analyze')}
            onViewHistory={() => setCurrentTab('history')}
          />
        ) : (
          <UploadPage onAnalysisComplete={handleAnalysisComplete} />
        );
      case 'dashboard':
        return (
          <DashboardPage
            onNavigate={setCurrentTab}
            onSelectDetection={handleSelectDetection}
          />
        );
      case 'history':
        return <HistoryPage onSelectDetection={handleSelectDetection} />;
      case 'admin':
        return <AdminPage />;
      default:
        return <HomePage onNavigate={setCurrentTab} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#F8FAF6] dark:bg-[#07130E] text-gray-900 dark:text-gray-100 transition-colors duration-200">
      <div>
        <div className={`transition-all duration-300 ${currentTab === 'home' && !scrolledPastHero ? 'hidden' : 'sticky top-0 z-40'}`}>
          <Navbar currentTab={currentTab} onNavigate={setCurrentTab} />
        </div>
        <main className="flex-1 pb-16 md:pb-0">
          {renderContent()}
        </main>
      </div>

      {/* Floating Theme Toggle in bottom-right corner for instant access */}
      <aside aria-label="Theme switcher" className="fixed bottom-20 md:bottom-6 right-5 z-40">
        <ThemeToggle
          className="shadow-xl bg-white/95 dark:bg-[#0E1E17]/95 backdrop-blur-md ring-1 ring-black/10 dark:ring-white/10 hover:scale-105 transition-transform"
        />
      </aside>

      <Footer />
      <MobileBottomNav currentTab={currentTab} onNavigate={setCurrentTab} />
      <AuthModal />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
