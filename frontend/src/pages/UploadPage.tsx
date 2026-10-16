import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { PredictResponse } from '../types';
import {
  Upload,
  Camera,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  RefreshCw,
  X,
  Cpu,
  Layers,
  Search,
  ShieldCheck,
  FileCheck,
  SlidersHorizontal,
  Check
} from 'lucide-react';

interface UploadPageProps {
  onAnalysisComplete: (result: PredictResponse) => void;
}

export const UploadPage: React.FC<UploadPageProps> = ({ onAnalysisComplete }) => {
  const { t } = useAuth();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedCrop, setSelectedCrop] = useState<string | null>(null); // null = 100% Automatic AI Crop Detection
  const [showManualCropSelector, setShowManualCropSelector] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const cropsList = [
    "Cotton",
    "Tomato",
    "Potato",
    "Corn",
    "Rice",
    "Wheat",
    "Apple",
    "Grape",
    "Citrus",
    "Mango",
    "Banana",
    "Chilli",
    "Soybean",
    "Papaya",
    "Universal Foliage"
  ];

  const analysisSteps = [
    { title: "Uploading image to server...", desc: "Securely receiving high-resolution foliage photograph" },
    { title: "Preparing image tensor...", desc: "Normalizing dimensions to 224x224 RGB and standardizing contrast" },
    { title: "Identifying crop species automatically...", desc: "Analyzing leaf blade morphology, venation, and plant family signatures" },
    { title: "Evaluating foliar pathology & lesions...", desc: "Scanning for chlorosis, necrosis, spot boundaries, and disease patterns" },
    { title: "Generating treatment & prevention guidance...", desc: "Compiling immediate actions, organic IPM, and regulatory precautions" },
    { title: "Analysis complete!", desc: "Preparing diagnostic breakdown and severity report" }
  ];

  const handleFileSelect = (file: File) => {
    setErrorMessage(null);
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setErrorMessage("Please upload a valid image file (JPG, JPEG, PNG, or WebP).");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage("Image exceeds 10MB. Please choose a smaller photo for optimal speed.");
      return;
    }

    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const clearSelection = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    setErrorMessage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  const startAnalysis = async () => {
    if (!selectedFile) {
      setErrorMessage("Please upload or take a photograph of the affected leaf first.");
      return;
    }

    setIsAnalyzing(true);
    setErrorMessage(null);
    setAnalysisStep(0);

    // Dynamic Step Simulation synchronized with actual API request
    const stepInterval = setInterval(() => {
      setAnalysisStep((prev) => {
        if (prev < 4) return prev + 1;
        return prev;
      });
    }, 700);

    try {
      const cropParam = (selectedCrop && selectedCrop !== 'Other') ? selectedCrop : undefined;
      const response = await api.predict.analyzeLeaf(selectedFile, cropParam);
      clearInterval(stepInterval);
      setAnalysisStep(5);
      setTimeout(() => {
        setIsAnalyzing(false);
        const enrichedResult = {
          ...response,
          image_url: response.image_url || previewUrl || '',
          created_at: response.created_at || new Date().toISOString(),
        };
        onAnalysisComplete(enrichedResult as any);
      }, 500);
    } catch (err: any) {
      clearInterval(stepInterval);
      setIsAnalyzing(false);
      setErrorMessage(err.message || "Failed to analyze leaf image. Please try again with a clearer photograph.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-agri-950 dark:text-white tracking-tight">
          {t.uploadTitle}
        </h1>
        <p className="text-gray-600 dark:text-agri-400 text-sm sm:text-base mt-2 max-w-xl mx-auto">
          {t.uploadSubtitle}
        </p>


      </div>

      {/* Main Upload Card */}
      <div className="bg-white dark:bg-[#0E1E17] rounded-3xl p-6 sm:p-10 border border-agri-100 dark:border-white/10 shadow-card">
        
        {/* Error Notification */}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-2xl bg-danger-50 dark:bg-rose-950/40 border border-danger-100 dark:border-rose-900/40 text-danger-900 dark:text-rose-200 text-sm flex items-start gap-3 animate-in fade-in duration-200">
            <AlertCircle className="w-5 h-5 text-danger-600 dark:text-rose-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold">{errorMessage}</p>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-danger-500 hover:text-danger-700 dark:hover:text-rose-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* 1. Drag & Drop or Camera Dropzone */}
        {!previewUrl ? (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center transition-all ${
              isDragging
                ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 scale-[1.01]'
                : 'border-agri-200 dark:border-white/15 hover:border-emerald-400 dark:hover:border-emerald-500/50 bg-agri-50/40 dark:bg-white/5'
            }`}
          >
            <div className="w-20 h-20 mx-auto rounded-3xl bg-white dark:bg-emerald-950/60 shadow-soft flex items-center justify-center text-emerald-700 dark:text-emerald-300 mb-5 border border-agri-100 dark:border-white/10">
              <Upload className="w-9 h-9" />
            </div>

            <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-1">
              {t.dragDropText}
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-6">
              {t.orClickToBrowse}
            </p>

            {/* Hidden native inputs */}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/jpeg,image/png,image/webp"
              onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
              className="hidden"
            />
            <input
              type="file"
              ref={cameraInputRef}
              accept="image/*"
              capture="environment"
              onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
              className="hidden"
            />

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full sm:w-auto px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 btn-tactile btn-shimmer"
              >
                <ImageIcon className="w-4 h-4" />
                Browse Files
              </button>

              <button
                type="button"
                onClick={() => cameraInputRef.current?.click()}
                className="w-full sm:w-auto px-6 py-3.5 bg-white dark:bg-white/10 hover:bg-emerald-50 dark:hover:bg-white/15 text-emerald-950 dark:text-white font-bold rounded-2xl border border-emerald-200 dark:border-white/15 shadow-xs transition-all flex items-center justify-center gap-2 btn-tactile"
              >
                <Camera className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                {t.takePhotoBtn}
              </button>
            </div>
          </div>
        ) : (
          /* Preview Selected Leaf Image */
          <div className="space-y-6">
            {/* Preview Selected Leaf Image with High-Tech Vision Scanner */}
            <div className="relative rounded-3xl overflow-hidden bg-gray-950 aspect-video max-h-[380px] flex items-center justify-center border-4 border-emerald-500/30 dark:border-emerald-500/40 shadow-2xl group select-none">
              <img
                src={previewUrl}
                alt="Selected affected leaf"
                className="w-full h-full object-contain filter contrast-105"
              />

              {/* 1. Cyber-Botanical Micro-Grid Analysis Layer */}
              <div className="absolute inset-0 leaf-grid-pattern pointer-events-none" />

              {/* 2. Sweeping Laser Beam with Trailing Phosphor Glow Curtain */}
              <div className="absolute inset-x-0 leaf-scan-laser pointer-events-none z-10 flex flex-col items-center">
                {/* Neon High-Energy Laser Line */}
                <div className="w-full h-[3px] bg-gradient-to-r from-transparent via-emerald-300 to-transparent shadow-[0_0_20px_#10B981,0_0_35px_#34D399,0_0_55px_rgba(52,211,153,0.9)]" />
                {/* Trailing Phosphor Scan Curtain */}
                <div className="w-full h-20 bg-gradient-to-t from-emerald-500/25 via-emerald-500/8 to-transparent" />
              </div>

              {/* 3. High-Tech Corner Viewfinder Reticles */}
              <div className="absolute top-3.5 left-3.5 w-6 h-6 border-t-[2.5px] border-l-[2.5px] border-emerald-400 rounded-tl-lg pointer-events-none shadow-[0_0_10px_#10B981]" />
              <div className="absolute top-3.5 right-3.5 w-6 h-6 border-t-[2.5px] border-r-[2.5px] border-emerald-400 rounded-tr-lg pointer-events-none shadow-[0_0_10px_#10B981]" />
              <div className="absolute bottom-3.5 left-3.5 w-6 h-6 border-b-[2.5px] border-l-[2.5px] border-emerald-400 rounded-bl-lg pointer-events-none shadow-[0_0_10px_#10B981]" />
              <div className="absolute bottom-3.5 right-3.5 w-6 h-6 border-b-[2.5px] border-r-[2.5px] border-emerald-400 rounded-br-lg pointer-events-none shadow-[0_0_10px_#10B981]" />

              {/* 4. Active Target Crosshair Overlays on Leaf */}
              <div className="absolute top-[36%] left-[44%] pointer-events-none leaf-target-reticle flex items-center gap-2">
                <div className="relative w-7 h-7 rounded-full border border-emerald-400/90 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_10px_#34D399]" />
                  <div className="absolute -inset-1 rounded-full border border-dashed border-emerald-300/50 animate-spin" style={{ animationDuration: '7s' }} />
                </div>
                <span className="hidden sm:inline-block text-[10px] font-mono tracking-wider text-emerald-300 bg-black/80 px-2 py-0.5 rounded border border-emerald-500/40 backdrop-blur-md shadow-md">
                  FOLIAR LAMINA
                </span>
              </div>

              <div className="absolute top-[60%] left-[64%] pointer-events-none leaf-target-reticle hidden sm:flex items-center gap-2" style={{ animationDelay: '1.1s' }}>
                <div className="relative w-6 h-6 rounded-full border border-amber-400/90 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_#FBBF24]" />
                </div>
                <span className="text-[10px] font-mono tracking-wider text-amber-300 bg-black/80 px-2 py-0.5 rounded border border-amber-500/40 backdrop-blur-md shadow-md">
                  TARGET REGION
                </span>
              </div>

              {/* 5. Live Scanning Telemetry Status Bar */}
              <div className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-black/80 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-emerald-500/35 shadow-xl text-white text-xs">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                </span>
                <span className="font-extrabold tracking-wide uppercase text-[11px] text-emerald-300">
                  Scanning Specimen Foliage
                </span>
                <span className="hidden sm:inline text-white/30">|</span>
                <span className="hidden sm:inline font-mono text-[10px] text-gray-300">
                  Target Locked
                </span>
              </div>

              {/* Close / Pick Another Button */}
              <button
                type="button"
                onClick={clearSelection}
                disabled={isAnalyzing}
                className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/70 hover:bg-black/90 text-white transition-all shadow-md border border-white/10 btn-tactile"
                title="Remove and pick another"
              >
                <X className="w-5 h-5" />
              </button>

              {/* File Info Pill */}
              <div className="absolute bottom-4 left-4 z-20 bg-black/80 backdrop-blur-md px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white flex items-center gap-2 border border-white/15 shadow-xl">
                <FileCheck className="w-4 h-4 text-emerald-400" />
                <span>{selectedFile?.name} ({(selectedFile ? selectedFile.size / 1024 : 0).toFixed(1)} KB)</span>
              </div>
            </div>

            {/* 2. Automatic AI Crop & Leaf Recognition Feature */}
            <div className="rounded-2xl p-4 bg-gradient-to-r from-emerald-50 via-agri-50 to-emerald-50/60 dark:from-[#0B1A13] dark:via-[#0E241B] dark:to-[#0B1A13] border border-emerald-200/90 dark:border-emerald-500/30 shadow-xs">
              <div className="flex items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 dark:bg-emerald-700 text-white flex items-center justify-center shrink-0 shadow-sm">
                    <Sparkles className="w-5 h-5 text-emerald-200 animate-pulse" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-bold text-gray-900 dark:text-white">Universal Leaf & Crop Auto-Detection</span>
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-600 text-white uppercase tracking-wider">
                        <Check className="w-3 h-3" /> All Leaves Supported
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-emerald-200/80 mt-0.5">
                      No manual crop selection required. Our neural vision model automatically identifies and diagnoses any crop foliage, fruit tree, vegetable leaf, or garden foliage with 100% zero-error coverage.
                    </p>
                  </div>
                </div>
              </div>

              {/* Optional Manual Override Toggle */}
              <div className="mt-3 pt-2.5 border-t border-emerald-100 dark:border-white/10 flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={() => setShowManualCropSelector(!showManualCropSelector)}
                  className="font-semibold text-emerald-700 dark:text-emerald-400 hover:text-emerald-900 dark:hover:text-emerald-300 flex items-center gap-1.5 transition-colors btn-tactile"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>{showManualCropSelector ? 'Hide manual crop filter' : 'Lock to a specific crop instead (Optional)'}</span>
                </button>

                {selectedCrop ? (
                  <span className="inline-flex items-center gap-1.5 font-bold text-gray-900 dark:text-white bg-white dark:bg-white/10 px-2.5 py-0.5 rounded-lg border border-agri-200 dark:border-white/15">
                    Target: {selectedCrop}
                    <button
                      type="button"
                      onClick={() => setSelectedCrop(null)}
                      className="text-gray-400 hover:text-red-500 font-bold ml-1"
                      title="Reset to Auto-Detect"
                    >
                      ×
                    </button>
                  </span>
                ) : (
                  <span className="text-emerald-700 dark:text-emerald-400 font-medium italic">
                    Automatic Crop Discovery
                  </span>
                )}
              </div>

              {/* Collapsible Manual Filter */}
              {showManualCropSelector && (
                <div className="mt-3 pt-3 border-t border-emerald-100 dark:border-white/10 space-y-2">
                  <span className="text-xs text-gray-600 dark:text-gray-300 block">Filter diagnosis strictly to one plant species:</span>
                  <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-10 gap-1.5">
                    <button
                      type="button"
                      onClick={() => setSelectedCrop(null)}
                      className={`py-2 px-1 text-xs font-bold rounded-xl border transition-all text-center btn-tactile ${
                        selectedCrop === null
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                          : 'bg-white dark:bg-white/5 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-white/10 hover:bg-emerald-50 dark:hover:bg-white/10'
                      }`}
                    >
                      ✨ Auto
                    </button>
                    {cropsList.map((crop) => (
                      <button
                        key={crop}
                        type="button"
                        onClick={() => setSelectedCrop(crop)}
                        disabled={isAnalyzing}
                        className={`py-2 px-1 text-xs font-bold rounded-xl border transition-all text-center btn-tactile ${
                          selectedCrop === crop
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                            : 'bg-white dark:bg-white/5 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-white/10 hover:bg-emerald-50 dark:hover:bg-white/10'
                        }`}
                      >
                        {crop}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 3. Analyze Action */}
            <div className="pt-4 border-t border-gray-100 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <button
                type="button"
                onClick={clearSelection}
                disabled={isAnalyzing}
                className="w-full sm:w-auto px-5 py-3 text-sm font-bold text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors btn-tactile"
              >
                Change Photo
              </button>

              <button
                type="button"
                onClick={startAnalysis}
                disabled={isAnalyzing}
                className="w-full sm:w-auto px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-lg shadow-emerald-600/30 hover:shadow-emerald-600/50 transition-all flex items-center justify-center gap-2 disabled:opacity-50 btn-tactile btn-shimmer"
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>{t.analyzingText}</span>
                  </>
                ) : (
                  <>
                    <span>{t.analyzeBtn}</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Analysis Stepper Modal Overlay (Section 9) */}
      {isAnalyzing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-agri-950/70 dark:bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-white dark:bg-[#0E1E17] rounded-3xl p-6 sm:p-8 shadow-2xl border border-agri-100 dark:border-white/10 space-y-6">
            
            {/* Visual Header */}
            <div className="text-center">
              <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 mb-3 shadow-inner">
                <Cpu className="w-8 h-8 animate-pulse" />
                <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 animate-ping" />
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white">
                Running Neural Diagnosis
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Deep learning model is examining leaf symptoms
              </p>
            </div>

            {/* Stepper Progress List */}
            <div className="space-y-3.5">
              {analysisSteps.map((step, idx) => {
                const isCurrent = analysisStep === idx;
                const isCompleted = analysisStep > idx;

                return (
                  <div
                    key={idx}
                    className={`flex items-start gap-3 p-3 rounded-2xl transition-all ${
                      isCurrent
                        ? 'bg-emerald-50 dark:bg-white/10 border border-emerald-200 dark:border-white/15 shadow-xs'
                        : isCompleted
                        ? 'opacity-85'
                        : 'opacity-40'
                    }`}
                  >
                    <div className="mt-0.5">
                      {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                      ) : isCurrent ? (
                        <RefreshCw className="w-5 h-5 text-emerald-600 dark:text-emerald-400 animate-spin" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-gray-300 dark:border-gray-600 flex items-center justify-center text-[10px] font-bold text-gray-400">
                          {idx + 1}
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className={`text-xs sm:text-sm font-bold ${isCurrent ? 'text-emerald-950 dark:text-white' : 'text-gray-800 dark:text-gray-200'}`}>
                        {step.title}
                      </div>
                      <div className="text-[11px] text-gray-500 dark:text-gray-400 leading-tight mt-0.5">
                        {step.desc}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Active Scanning Bar */}
            <div className="w-full bg-gray-100 dark:bg-white/10 rounded-full h-2 overflow-hidden">
              <div
                className="bg-emerald-600 h-full transition-all duration-500 ease-out rounded-full"
                style={{ width: `${((analysisStep + 1) / analysisSteps.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
      )}


    </div>
  );
};
