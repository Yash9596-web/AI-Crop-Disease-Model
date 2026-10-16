import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { DashboardStats, Detection } from '../types';
import { SeverityBadge, ConfidenceBadge } from '../components/ui/Badge';
import {
  Activity,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Plus,
  ArrowRight,
  RefreshCw,
  Eye,
  Calendar,
  Layers,
  Leaf
} from 'lucide-react';

interface DashboardPageProps {
  onNavigate: (tab: string) => void;
  onSelectDetection: (id: number) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate, onSelectDetection }) => {
  const { user, t } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const data = await api.detections.getDashboardStats();
      setStats(data);
    } catch (err) {
      console.error("Failed to load dashboard stats:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Welcome & Primary CTA Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-agri-100 dark:border-white/10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-agri-950 dark:text-white">
            {t.dashboardTitle}
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
            {user ? `Logged in as ${user.name}` : 'Field Diagnostic Overview'} — {t.dashboardSubtitle}
          </p>
        </div>

        <button
          onClick={() => onNavigate('analyze')}
          className="w-full sm:w-auto px-6 py-3.5 bg-agri-700 hover:bg-agri-800 text-white font-bold text-sm rounded-2xl shadow-card transition-all flex items-center justify-center gap-2 group btn-tactile btn-shimmer"
        >
          <Plus className="w-5 h-5 transition-transform group-hover:rotate-90 duration-300" />
          <span>{t.analyzeNewLeaf}</span>
        </button>
      </div>

      {/* KPI Statistic Cards (Section 6) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Total Scans */}
        <div className="bg-white rounded-3xl p-6 border border-agri-100 shadow-soft interactive-card group">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
              {t.totalScans}
            </span>
            <div className="w-10 h-10 rounded-xl bg-agri-50 text-agri-700 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
              <Activity className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold text-agri-950">
            {loading ? '...' : (stats?.total_scans ?? 0)}
          </div>
          <span className="text-xs text-gray-500 mt-1 block">Completed field leaf evaluations</span>
        </div>

        {/* Healthy Crops */}
        <div className="bg-white rounded-3xl p-6 border border-agri-100 shadow-soft interactive-card group">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              {t.healthyCrops}
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold text-emerald-800">
            {loading ? '...' : (stats?.healthy_scans ?? 0)}
          </div>
          <span className="text-xs text-emerald-600 mt-1 block">Healthy, disease-free foliage</span>
        </div>

        {/* Diseased Crops */}
        <div className="bg-white rounded-3xl p-6 border border-agri-100 shadow-soft interactive-card group">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
              {t.diseasedCrops}
            </span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold text-amber-900">
            {loading ? '...' : (stats?.diseased_scans ?? 0)}
          </div>
          <span className="text-xs text-amber-600 mt-1 block">Pathogens flagged for intervention</span>
        </div>

        {/* Most Frequent Disease */}
        <div className="bg-white rounded-3xl p-6 border border-agri-100 shadow-soft interactive-card group">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-red-700">
              {t.mostCommonThreat}
            </span>
            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-700 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
              <Flame className="w-5 h-5" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-gray-900 truncate" title={stats?.most_common_disease}>
            {loading ? '...' : (stats?.most_common_disease || 'None')}
          </div>
          <span className="text-xs text-gray-500 mt-1 block">Highest recurring pathogen pattern</span>
        </div>

      </div>

      {/* Recent Crop Scans Table / List (Section 6) */}
      <div className="bg-white dark:bg-[#0E1E17] rounded-3xl border border-agri-100 dark:border-white/10 shadow-card overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-white/10 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-agri-950 dark:text-white">{t.recentScans}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">Live feed of leaf analysis results</p>
          </div>
          <button
            onClick={() => onNavigate('history')}
            className="text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:text-emerald-900 dark:hover:text-emerald-300 flex items-center gap-1 hover:underline btn-tactile"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {loading ? (
          <div className="p-12 text-center text-gray-400 flex flex-col items-center gap-2">
            <RefreshCw className="w-6 h-6 animate-spin text-agri-600 dark:text-emerald-400" />
            <span className="text-xs">Loading recent field scans...</span>
          </div>
        ) : !stats?.recent_detections || stats.recent_detections.length === 0 ? (
          <div className="p-12 text-center text-gray-500 dark:text-gray-400 space-y-3">
            <Leaf className="w-10 h-10 mx-auto text-agri-300 dark:text-emerald-600/40" />
            <p className="text-sm font-semibold">{t.noScansFound}</p>
            <button
              onClick={() => onNavigate('analyze')}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm btn-tactile btn-shimmer"
            >
              Analyze Your First Leaf
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-agri-50/50 dark:bg-white/5 text-[11px] uppercase tracking-wider font-bold text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-white/10">
                <tr>
                  <th className="py-3.5 px-6">Leaf Photo</th>
                  <th className="py-3.5 px-6">Crop</th>
                  <th className="py-3.5 px-6">Condition</th>
                  <th className="py-3.5 px-6">Confidence</th>
                  <th className="py-3.5 px-6">Severity</th>
                  <th className="py-3.5 px-6">Scanned On</th>
                  <th className="py-3.5 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-white/10">
                {stats.recent_detections.map((detection) => (
                  <tr
                    key={detection.id}
                    className="hover:bg-agri-50/40 dark:hover:bg-white/5 transition-colors"
                  >
                    <td className="py-3.5 px-6">
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 dark:bg-white/10 border border-gray-200 dark:border-white/10">
                        <img
                          src={detection.thumbnail_url || detection.image_url}
                          alt={detection.crop_name}
                          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                        />
                      </div>
                    </td>
                    <td className="py-3.5 px-6 font-bold text-gray-900 dark:text-white">
                      {detection.crop_name}
                    </td>
                    <td className="py-3.5 px-6 font-semibold text-gray-800 dark:text-gray-200">
                      {detection.disease_name}
                    </td>
                    <td className="py-3.5 px-6">
                      <ConfidenceBadge confidence={detection.confidence} level={detection.confidence_level} />
                    </td>
                    <td className="py-3.5 px-6">
                      <SeverityBadge severity={detection.severity} />
                    </td>
                    <td className="py-3.5 px-6 text-xs text-gray-500 dark:text-gray-400">
                      {new Date(detection.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-6 text-right">
                      <button
                        onClick={() => onSelectDetection(detection.id)}
                        className="py-1.5 px-3 rounded-xl bg-gray-100 dark:bg-white/10 hover:bg-agri-100 dark:hover:bg-white/20 text-gray-700 dark:text-gray-200 hover:text-agri-900 dark:hover:text-white text-xs font-bold transition-all inline-flex items-center gap-1 btn-tactile"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};
