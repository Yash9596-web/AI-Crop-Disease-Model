import React from 'react';
import { PredictResponse } from '../types';
import { ConfidenceMeter } from '../components/ui/ConfidenceMeter';
import { SeverityBadge, ConfidenceBadge } from '../components/ui/Badge';
import { useAuth } from '../context/AuthContext';
import {
  AlertTriangle,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Sprout,
  Droplets,
  RotateCcw,
  Printer,
  ChevronRight,
  Info,
  Calendar,
  Layers,
  Leaf,
  Sparkles
} from 'lucide-react';

interface ResultPageProps {
  result: PredictResponse;
  onScanAnother: () => void;
  onViewHistory: () => void;
}

export const ResultPage: React.FC<ResultPageProps> = ({
  result,
  onScanAnother,
  onViewHistory,
}) => {
  const { t } = useAuth();

  const handlePrint = () => {
    window.print();
  };

  // Safe Date handling
  const scanDate = result.created_at ? new Date(result.created_at) : new Date();
  const dateStr = isNaN(scanDate.getTime()) ? new Date().toLocaleDateString() : scanDate.toLocaleDateString();
  const timeStr = isNaN(scanDate.getTime()) ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : scanDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // Safe Treatment Normalization (handles array or string or missing)
  const treatmentObj = result.treatment || {} as any;
  const immediateActions: string[] = Array.isArray(treatmentObj.immediate_actions) && treatmentObj.immediate_actions.length > 0
    ? treatmentObj.immediate_actions
    : treatmentObj.immediate_action
    ? [treatmentObj.immediate_action]
    : [
        "Isolate or prune visibly infected lower leaves to minimize spore dispersion.",
        "Sanitize pruning tools between cuts with 70% rubbing alcohol.",
        "Avoid overhead irrigation to keep leaf surfaces dry."
      ];

  const biologicalTreatments: string[] = Array.isArray(treatmentObj.biological_treatments) && treatmentObj.biological_treatments.length > 0
    ? treatmentObj.biological_treatments
    : treatmentObj.biological_ipm
    ? [treatmentObj.biological_ipm]
    : [
        "Apply bio-fungicide Bacillus subtilis (QST 713 strain) or Trichoderma harzianum at 2.5 g/L weekly.",
        "Spray cold-pressed neem oil (1500 ppm) at 3 ml/L as an organic curative."
      ];

  const chemicalTreatments: string[] = Array.isArray(treatmentObj.chemical_treatments) && treatmentObj.chemical_treatments.length > 0
    ? treatmentObj.chemical_treatments
    : treatmentObj.chemical
    ? [treatmentObj.chemical]
    : [
        "Apply Chlorothalonil 75% WP (2 g/L) or Mancozeb 75% WP (2.5 g/L) preventively.",
        "Rotate mode-of-action with Azoxystrobin (1 ml/L) or Difenoconazole (0.5 ml/L) for active infection."
      ];

  const chemicalDisclaimer = treatmentObj.chemical_disclaimer || "Always verify approved chemical active ingredients with your local agricultural extension service.";
  const safetyDisclaimer = result.safety_disclaimer || "This AI prediction is intended as an initial screening and educational aid. For significant crop damage or uncertain results, consult a qualified agricultural expert.";

  // Safe Symptoms Normalization
  const symptomsList: string[] = Array.isArray(result.symptoms) && result.symptoms.length > 0
    ? result.symptoms
    : [
        "Foliar discoloration or necrotic lesions observed on leaf blade",
        "Chlorotic yellow halos or edge browning",
        "Irregular textural changes on foliage"
      ];

  // Safe Prevention Normalization
  const getPreventionItems = () => {
    if (Array.isArray(result.prevention) && result.prevention.length > 0) {
      return result.prevention.map((text, i) => ({ title: `Agronomic Protocol ${i + 1}`, text }));
    }
    if (result.prevention && typeof result.prevention === 'object') {
      const items = [
        result.prevention.spacing && { title: "Canopy Spacing", text: result.prevention.spacing },
        result.prevention.sanitation && { title: "Field Sanitation", text: result.prevention.sanitation },
        result.prevention.irrigation && { title: "Irrigation Hygiene", text: result.prevention.irrigation },
        result.prevention.rotation && { title: "Crop Rotation", text: result.prevention.rotation },
        result.prevention.resistant_varieties && { title: "Resistant Cultivars", text: result.prevention.resistant_varieties },
        result.prevention.monitoring && { title: "Scouting Routine", text: result.prevention.monitoring },
      ].filter(Boolean) as { title: string; text: string }[];
      if (items.length > 0) return items;
    }
    return [
      { title: "Canopy Spacing", text: "Ensure recommended row spacing (45–60 cm) for adequate sunlight and airflow." },
      { title: "Field Sanitation", text: "Clear weed hosts and remove previous crop residues post-harvest." },
      { title: "Irrigation Hygiene", text: "Adopt drip irrigation to prevent water splashing onto foliage." },
      { title: "Crop Rotation", text: "Rotate non-host crop families for at least 2–3 growing seasons." },
      { title: "Resistant Cultivars", text: "Choose certified disease-resistant hybrid seed and seedling stocks." },
      { title: "Scouting Routine", text: "Scout fields at least twice weekly during high-humidity periods." }
    ];
  };

  const preventionItems = getPreventionItems();
  const topCandidates = Array.isArray(result.top_candidates) ? result.top_candidates : [];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Banner / Actions Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-agri-100 dark:border-white/10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-agri-950 dark:text-white">
            Analysis Result
          </h1>
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mt-1">
            <Calendar className="w-3.5 h-3.5" />
            <span>Scanned on {dateStr} at {timeStr}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={handlePrint}
            className="flex-1 sm:flex-initial px-4 py-2.5 bg-white dark:bg-white/5 hover:bg-gray-50 dark:hover:bg-white/10 text-gray-700 dark:text-gray-200 font-bold text-xs rounded-xl border border-gray-200 dark:border-white/10 shadow-xs flex items-center justify-center gap-1.5 transition-all btn-tactile"
          >
            <Printer className="w-4 h-4 text-gray-500" />
            {t.printReport}
          </button>

          <button
            onClick={onScanAnother}
            className="flex-1 sm:flex-initial px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-600/25 flex items-center justify-center gap-1.5 transition-all btn-tactile btn-shimmer"
          >
            <RotateCcw className="w-4 h-4" />
            {t.scanAnother}
          </button>
        </div>
      </div>

      {/* Main Dual-Column Diagnosis Card */}
      <div className="bg-white dark:bg-[#0E1E17] rounded-3xl p-6 sm:p-8 border border-agri-100 dark:border-white/10 shadow-card">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          
          {/* Column 1: Uploaded Leaf Photo */}
          <div className="md:col-span-5 space-y-3">
            <div className="relative rounded-2xl overflow-hidden aspect-square bg-gray-900 border-2 border-agri-100 dark:border-white/10 shadow-inner group">
              {result.image_url ? (
                <img
                  src={result.image_url}
                  alt={`${result.crop} affected leaf`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-gray-800 text-gray-400 p-4 text-center">
                  <Leaf className="w-12 h-12 text-emerald-500 mb-2" />
                  <span className="text-xs">Foliage Analyzed</span>
                </div>
              )}
              <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-bold text-white flex items-center gap-1.5">
                <Leaf className="w-3.5 h-3.5 text-emerald-400" />
                <span>{result.crop} Foliage (AI Detected)</span>
              </div>
              <div className="absolute bottom-3 right-3">
                <SeverityBadge severity={result.severity} />
              </div>
            </div>
            <div className="text-center">
              <span className="text-xs text-gray-500 dark:text-gray-400 italic">Analyzed Foliage Specimen</span>
            </div>
          </div>

          {/* Column 2: Diagnosis, Confidence, and Certainty */}
          <div className="md:col-span-7 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="text-xs font-bold text-agri-600 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-agri-600 dark:text-emerald-400" />
                  Target Crop (AI Identified)
                </span>
                <span className="text-xl font-bold text-gray-900 dark:text-white">{result.crop}</span>
              </div>
              <SeverityBadge severity={result.severity} className="text-sm px-4 py-1.5" />
            </div>

            <div>
              <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider block">
                {result.confidence_level === 'Low' ? 'Preliminary Finding (Low Certainty)' : 'Identified Condition'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-agri-950 dark:text-white mt-0.5">
                {result.confidence_level === 'Low' ? `Suspected: ${result.disease}` : result.disease}
              </h2>
            </div>

            {/* Confidence Threshold Evaluation Banner */}
            <div className={`p-4 rounded-2xl flex items-center justify-between gap-4 ${
              result.confidence_level === 'Low'
                ? 'bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-800/40'
                : result.confidence_level === 'Medium'
                ? 'bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/30'
                : 'bg-agri-50 dark:bg-emerald-950/20 border border-agri-200/80 dark:border-emerald-800/30'
            }`}>
              <div className="space-y-1">
                <span className={`text-xs font-bold uppercase tracking-wider block ${
                  result.confidence_level === 'Low' ? 'text-amber-800 dark:text-amber-300' : 'text-agri-800 dark:text-emerald-300'
                }`}>
                  Certainty Assessment
                </span>
                <p className={`text-sm font-semibold ${
                  result.confidence_level === 'Low' ? 'text-amber-900 dark:text-amber-200' : 'text-agri-950 dark:text-emerald-100'
                }`}>
                  {result.confidence_message || (result.is_healthy ? "Crop Foliage Appears Healthy" : "Disease Pattern Identified")}
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <ConfidenceBadge confidence={result.confidence} level={result.confidence_level} />
                </div>
              </div>
              <div className="shrink-0">
                <ConfidenceMeter
                  confidence={result.confidence}
                  level={result.confidence_level}
                  size="md"
                  variant="circular"
                />
              </div>
            </div>

            {/* Top Candidate Distribution */}
            {topCandidates.length > 1 && (
              <div className="pt-2">
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 block mb-2">Neural Probability Breakdown:</span>
                <div className="space-y-1.5">
                  {topCandidates.map((cand, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs py-1 px-2.5 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10">
                      <span className="font-semibold text-gray-800 dark:text-gray-200">{cand.display_name}</span>
                      <span className="font-bold text-agri-700 dark:text-emerald-400">{(cand.confidence * 100).toFixed(1)}%</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Symptoms Section */}
      <div className="bg-white dark:bg-[#0E1E17] rounded-3xl p-6 sm:p-8 border border-agri-100 dark:border-white/10 shadow-card space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 flex items-center justify-center">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{t.symptoms}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">Visual indicators associated with {result.disease}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {symptomsList.map((symptom, idx) => (
            <div key={idx} className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 text-sm text-gray-800 dark:text-gray-200 hover:border-emerald-300 dark:hover:border-emerald-500/50 hover:bg-emerald-50/40 dark:hover:bg-white/10 hover:shadow-xs transition-all duration-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <span>{symptom}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Treatment Guidance Section */}
      <div className="bg-white dark:bg-[#0E1E17] rounded-3xl p-6 sm:p-8 border border-agri-100 dark:border-white/10 shadow-card space-y-6">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 flex items-center justify-center">
            <Sprout className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Treatment & Management Guidance</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">Integrated Pest Management (IPM) containment protocols</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Immediate Actions */}
          <div className="space-y-3 bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/70 dark:border-amber-800/40 rounded-2xl p-5 hover:shadow-md hover:border-amber-300 transition-all duration-300">
            <h4 className="text-sm font-bold text-amber-950 dark:text-amber-200 uppercase tracking-wider flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              {t.immediateActions}
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-amber-900 dark:text-amber-200/90 leading-relaxed">
              {immediateActions.map((action, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="font-bold text-amber-700 dark:text-amber-400">•</span>
                  <span>{action}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Biological / Non-Chemical */}
          <div className="space-y-3 bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/70 dark:border-emerald-800/40 rounded-2xl p-5 hover:shadow-md hover:border-emerald-300 transition-all duration-300">
            <h4 className="text-sm font-bold text-emerald-950 dark:text-emerald-200 uppercase tracking-wider flex items-center gap-2">
              <Leaf className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              {t.biologicalTreatment}
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-emerald-900 dark:text-emerald-200/90 leading-relaxed">
              {biologicalTreatments.map((bio, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="font-bold text-emerald-700 dark:text-emerald-400">•</span>
                  <span>{bio}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Chemical Guidance with Regulatory Disclaimer */}
        <div className="bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-5 space-y-3 hover:shadow-sm transition-all">
          <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <Droplets className="w-4 h-4 text-gray-700 dark:text-gray-300" />
            {t.chemicalGuidance}
          </h4>
          <ul className="space-y-1.5 text-xs sm:text-sm text-gray-700 dark:text-gray-300">
            {chemicalTreatments.map((chem, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="font-bold text-gray-400 dark:text-gray-500">•</span>
                <span>{chem}</span>
              </li>
            ))}
          </ul>
          <div className="pt-2 text-[11px] text-gray-600 dark:text-gray-400 italic border-t border-gray-200 dark:border-white/10 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
            <span>{chemicalDisclaimer}</span>
          </div>
        </div>
      </div>

      {/* Prevention Section */}
      <div className="bg-white dark:bg-[#0E1E17] rounded-3xl p-6 sm:p-8 border border-agri-100 dark:border-white/10 shadow-card space-y-6">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{t.preventionGuide}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">Long-term preventative agronomic practices to avoid reinfection</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {preventionItems.map((item, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 space-y-1 interactive-card group">
              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider block group-hover:text-emerald-600 transition-colors">
                {item.title}
              </span>
              <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Important Safety Banner */}
      <div className="rounded-2xl p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/40 text-amber-950 dark:text-amber-200 text-xs sm:text-sm flex items-start gap-3">
        <Info className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          {safetyDisclaimer}
        </p>
      </div>

      {/* Bottom Navigation CTAs */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
        <button
          onClick={onViewHistory}
          className="w-full sm:w-auto px-6 py-3 bg-white dark:bg-white/10 hover:bg-gray-50 dark:hover:bg-white/15 text-agri-900 dark:text-white font-bold text-sm rounded-2xl border border-gray-200 dark:border-white/15 transition-all text-center btn-tactile"
        >
          View Scan History
        </button>

        <button
          onClick={onScanAnother}
          className="w-full sm:w-auto px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-2xl shadow-card transition-all flex items-center justify-center gap-2 btn-tactile btn-shimmer group"
        >
          <span>{t.scanAnother}</span>
          <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </button>
      </div>

    </div>
  );
};
