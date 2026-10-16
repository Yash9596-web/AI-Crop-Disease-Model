import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { api } from '../services/api';
import { Language, Translations, translations } from '../i18n/translations';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
  login: (creds: { email: string; password: string }) => Promise<void>;
  register: (data: { name: string; email: string; password: string; phone?: string; preferred_language?: string }) => Promise<void>;
  demoLogin: (role: 'farmer' | 'admin') => Promise<void>;
  logout: () => void;
  updateProfile: (data: { name?: string; phone?: string; preferred_language?: string }) => Promise<void>;
  isAuthModalOpen: boolean;
  authModalMode: 'login' | 'register';
  openAuthModal: (mode?: 'login' | 'register') => void;
  closeAuthModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [language, setLanguageState] = useState<Language>('en');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');

  useEffect(() => {
    const savedLang = localStorage.getItem('crop_lang') as Language;
    if (savedLang && (savedLang === 'en' || savedLang === 'hi')) {
      setLanguageState(savedLang);
    }

    const checkSession = async () => {
      const token = localStorage.getItem('crop_auth_token');
      if (token) {
        try {
          const profile = await api.auth.getProfile();
          setUser(profile);
          if (profile.preferred_language === 'hi' || profile.preferred_language === 'en') {
            setLanguageState(profile.preferred_language as Language);
          }
        } catch (err) {
          console.warn('Session expired or invalid:', err);
          api.auth.logout();
          setUser(null);
        }
      }
      setLoading(false);
    };

    checkSession();
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('crop_lang', lang);
    if (user) {
      api.auth.updateProfile({ preferred_language: lang }).catch(() => {});
    }
  };

  const login = async (creds: { email: string; password: string }) => {
    const res = await api.auth.login(creds);
    setUser(res.user);
    if (res.user.preferred_language === 'hi' || res.user.preferred_language === 'en') {
      setLanguage(res.user.preferred_language as Language);
    }
    closeAuthModal();
  };

  const register = async (data: { name: string; email: string; password: string; phone?: string; preferred_language?: string }) => {
    const res = await api.auth.register({ ...data, preferred_language: language });
    setUser(res.user);
    closeAuthModal();
  };

  const demoLogin = async (role: 'farmer' | 'admin') => {
    const res = await api.auth.demoLogin(role);
    setUser(res.user);
    closeAuthModal();
  };

  const logout = () => {
    api.auth.logout();
    setUser(null);
  };

  const updateProfile = async (data: { name?: string; phone?: string; preferred_language?: string }) => {
    const updated = await api.auth.updateProfile(data);
    setUser(updated);
  };

  const openAuthModal = (mode: 'login' | 'register' = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        language,
        setLanguage,
        t: translations[language],
        login,
        register,
        demoLogin,
        logout,
        updateProfile,
        isAuthModalOpen,
        authModalMode,
        openAuthModal,
        closeAuthModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
