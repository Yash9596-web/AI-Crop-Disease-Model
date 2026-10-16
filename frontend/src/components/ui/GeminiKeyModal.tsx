import React, { useState, useEffect } from 'react';
import { Key, CheckCircle2, AlertTriangle, ExternalLink, X, Eye, EyeOff, Sparkles, RefreshCw } from 'lucide-react';
import { api } from '../../services/api';

interface GeminiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GeminiKeyModal: React.FC<GeminiKeyModalProps> = ({ isOpen, onClose }) => {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [edgeHealth, setEdgeHealth] = useState<{
    gemini_key_detected?: boolean;
    gemini_key_preview?: string;
  } | null>(null);
  const [checkingHealth, setCheckingHealth] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const stored = localStorage.getItem('crop_gemini_api_key') || '';
      setApiKey(stored);
      checkCloudflareStatus();
    }
  }, [isOpen]);

  const checkCloudflareStatus = async () => {
    setCheckingHealth(true);
    try {
      const data = await api.predict.checkHealth();
      setEdgeHealth(data);
    } catch {
      setEdgeHealth(null);
    } finally {
      setCheckingHealth(false);
    }
  };

  const handleSave = () => {
    const clean = apiKey.trim().replace(/^["']|["']$/g, '');
    if (clean) {
      localStorage.setItem('crop_gemini_api_key', clean);
    } else {
      localStorage.removeItem('crop_gemini_api_key');
    }
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  const handleClear = () => {
    localStorage.removeItem('crop_gemini_api_key');
    setApiKey('');
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 1200);
  };

  if (!isOpen) return null;

  const hasLocalKey = Boolean(localStorage.getItem('crop_gemini_api_key'));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-[#0A1612] border border-emerald-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-white">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold tracking-tight">Gemini AI Model Key</h2>
              <p className="text-xs text-agri-400">Agricultural multimodal vision settings</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cloudflare Edge Status Card */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-agri-400">
            <span>Cloudflare Edge Worker Status</span>
            <button
              onClick={checkCloudflareStatus}
              disabled={checkingHealth}
              className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 disabled:opacity-50"
            >
              <RefreshCw className={`w-3 h-3 ${checkingHealth ? 'animate-spin' : ''}`} />
              Check Status
            </button>
          </div>
          
          {edgeHealth ? (
            <div className="flex items-center gap-2 text-sm">
              {edgeHealth.gemini_key_detected ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-emerald-200">
                    Cloudflare Worker has key bound ({edgeHealth.gemini_key_preview || 'Active'})
                  </span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="text-amber-200">
                    No GEMINI_API_KEY detected in Cloudflare Worker runtime
                  </span>
                </>
              )}
            </div>
          ) : (
            <p className="text-xs text-gray-400">Could not retrieve edge status.</p>
          )}

          {!edgeHealth?.gemini_key_detected && (
            <p className="text-xs text-agri-300 pt-1 border-t border-white/5">
              💡 You can connect your key below directly in your browser. It bypasses Cloudflare environment setup and activates Gemini Vision instantly!
            </p>
          )}
        </div>

        {/* Local Key Input */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider">
            Your Google Gemini API Key
          </label>
          <div className="relative">
            <input
              type={showKey ? 'text' : 'password'}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full px-4 py-3 pr-12 rounded-xl bg-black/40 border border-white/15 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm font-mono text-white placeholder-gray-500 outline-none transition-all"
            />
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white p-1"
            >
              {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 underline underline-offset-2"
            >
              Get free key at Google AI Studio
              <ExternalLink className="w-3 h-3" />
            </a>
            {hasLocalKey && (
              <button
                type="button"
                onClick={handleClear}
                className="text-rose-400 hover:text-rose-300 underline"
              >
                Clear Saved Key
              </button>
            )}
          </div>
        </div>

        {savedSuccess && (
          <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            Gemini API Key saved successfully! All scans will now use this key.
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-300 hover:text-white hover:bg-white/5 transition-all"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-6 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white shadow-lg shadow-emerald-950/40 transition-all flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            Save & Activate
          </button>
        </div>
      </div>
    </div>
  );
};
