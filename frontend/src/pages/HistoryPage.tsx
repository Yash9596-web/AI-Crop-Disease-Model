import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Detection } from '../types';
import { SeverityBadge, ConfidenceBadge } from '../components/ui/Badge';
import {
  Search,
  Filter,
  Trash2,
  Eye,
  Calendar,
  RefreshCw,
  X,
  AlertTriangle,
  Leaf,
  Layers,
  ChevronDown
} from 'lucide-react';

interface HistoryPageProps {
  onSelectDetection: (id: number) => void;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({ onSelectDetection }) => {
  const { t } = useAuth();
  const [detections, setDetections] = useState<Detection[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [cropFilter, setCropFilter] = useState('All');
  const [severityFilter, setSeverityFilter] = useState('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const crops = ["All", "Tomato", "Potato", "Corn", "Rice", "Wheat", "Apple", "Grape", "Cotton"];
  const severities = ["All", "Healthy", "Mild", "Moderate", "Severe"];

  const loadDetections = async () => {
    setLoading(true);
    try {
      const data = await api.detections.getAll({
        crop: cropFilter !== 'All' ? cropFilter : undefined,
        severity: severityFilter !== 'All' ? severityFilter : undefined,
        search: search.trim() || undefined,
        start_date: startDate || undefined,
        end_date: endDate || undefined,
      });
      setDetections(data);
    } catch (err) {
      console.error("Failed to load history:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDetections();
  }, [cropFilter, severityFilter, startDate, endDate]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadDetections();
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this detection record from your history?")) {
      return;
    }
    setDeletingId(id);
    try {
      await api.detections.delete(id);
      setDetections((prev) => prev.filter((d) => d.id !== id));
    } catch (err: any) {
      alert(err.message || "Failed to delete record.");
    } finally {
      setDeletingId(null);
    }
  };

  const resetFilters = () => {
    setSearch('');
    setCropFilter('All');
    setSeverityFilter('All');
    setStartDate('');
    setEndDate('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-agri-100 dark:border-white/10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-agri-950 dark:text-white">
            {t.historyTitle}
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
            {t.historySubtitle}
          </p>
        </div>

        <button
          onClick={loadDetections}
          disabled={loading}
          className="px-4 py-2.5 bg-white dark:bg-white/10 hover:bg-gray-50 dark:hover:bg-white/15 text-gray-700 dark:text-gray-200 font-bold text-xs rounded-xl border border-gray-200 dark:border-white/15 shadow-xs flex items-center gap-2 transition-all btn-tactile"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-emerald-600 dark:text-emerald-400' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Filter & Search Bar Controls (Section 17) */}
      <div className="bg-white dark:bg-[#0E1E17] rounded-3xl p-6 border border-agri-100 dark:border-white/10 shadow-card space-y-4">
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          
          {/* Search Box */}
          <div className="relative lg:col-span-2">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-xs sm:text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white dark:focus:bg-[#07130E] transition-all"
            />
          </div>

          {/* Crop Filter */}
          <div>
            <select
              value={cropFilter}
              onChange={(e) => setCropFilter(e.target.value)}
              className="w-full py-2 px-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white dark:focus:bg-[#07130E] transition-all"
            >
              {crops.map((c) => (
                <option key={c} value={c} className="bg-white dark:bg-[#0E1E17] text-gray-900 dark:text-white">
                  Crop: {c}
                </option>
              ))}
            </select>
          </div>

          {/* Severity Filter */}
          <div>
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="w-full py-2 px-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white dark:focus:bg-[#07130E] transition-all"
            >
              {severities.map((s) => (
                <option key={s} value={s} className="bg-white dark:bg-[#0E1E17] text-gray-900 dark:text-white">
                  Severity: {s}
                </option>
              ))}
            </select>
          </div>

          {/* Search & Reset Buttons */}
          <div className="flex items-center gap-2">
            <button
              type="submit"
              className="flex-1 py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all btn-tactile btn-shimmer"
            >
              Filter
            </button>
            <button
              type="button"
              onClick={resetFilters}
              className="py-2 px-3 bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/15 text-gray-600 dark:text-gray-300 font-bold text-xs rounded-xl transition-all btn-tactile"
              title="Reset Filters"
            >
              Reset
            </button>
          </div>

        </form>

        {/* Date Filters Row */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-gray-100 dark:border-white/10 text-xs text-gray-500 dark:text-gray-400">
          <span className="font-semibold flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            Date Range:
          </span>
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="py-1 px-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg text-xs text-gray-800 dark:text-gray-200"
            />
            <span>to</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="py-1 px-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg text-xs text-gray-800 dark:text-gray-200"
            />
          </div>
          {(cropFilter !== 'All' || severityFilter !== 'All' || search || startDate || endDate) && (
            <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 ml-auto">
              Filtered: {detections.length} result(s)
            </span>
          )}
        </div>
      </div>

      {/* Detections Grid / Table View */}
      {loading ? (
        <div className="p-16 text-center text-gray-400 bg-white rounded-3xl border border-agri-100 shadow-soft flex flex-col items-center gap-2">
          <RefreshCw className="w-8 h-8 animate-spin text-agri-600" />
          <span className="text-sm font-semibold">Retrieving scan history...</span>
        </div>
      ) : detections.length === 0 ? (
        <div className="p-16 text-center text-gray-500 bg-white rounded-3xl border border-agri-100 shadow-soft space-y-3">
          <Leaf className="w-12 h-12 mx-auto text-agri-300" />
          <h3 className="text-lg font-bold text-gray-900">{t.noScansFound}</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            Try adjusting your search filters or scan an affected plant leaf.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {detections.map((d) => (
            <div
              key={d.id}
              className="bg-white dark:bg-[#0E1E17] rounded-3xl border border-agri-100 dark:border-white/10 shadow-soft interactive-card overflow-hidden flex flex-col justify-between group"
            >
              <div>
                {/* Image and Header */}
                <div className="relative aspect-video bg-gray-900 overflow-hidden">
                  <img
                    src={d.thumbnail_url || d.image_url}
                    alt={d.crop_name}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-bold text-white flex items-center gap-1 border border-white/10">
                    <Leaf className="w-3 h-3 text-emerald-400" />
                    <span>{d.crop_name}</span>
                  </div>
                  <div className="absolute bottom-3 right-3">
                    <SeverityBadge severity={d.severity} />
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 space-y-3">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-snug group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                      {d.disease_name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <ConfidenceBadge confidence={d.confidence} level={d.confidence_level} />
                      <span className="text-[11px] text-gray-400 dark:text-gray-400">
                        {new Date(d.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {d.notes && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 bg-gray-50 dark:bg-white/5 p-2 rounded-xl border border-gray-100 dark:border-white/10 italic">
                      "{d.notes}"
                    </p>
                  )}
                </div>
              </div>

              {/* Actions Footer */}
              <div className="p-5 pt-0 border-t border-gray-50 dark:border-white/10 mt-2 flex items-center justify-between gap-2">
                <button
                  onClick={() => onSelectDetection(d.id)}
                  className="flex-1 py-2 px-3 bg-emerald-50 dark:bg-white/10 hover:bg-emerald-100 dark:hover:bg-white/20 text-emerald-800 dark:text-emerald-300 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 btn-tactile btn-shimmer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  {t.viewDetails}
                </button>

                <button
                  onClick={() => handleDelete(d.id)}
                  disabled={deletingId === d.id}
                  className="p-2 text-gray-400 hover:text-danger-600 dark:hover:text-rose-400 hover:bg-danger-50 dark:hover:bg-rose-950/40 rounded-xl transition-all disabled:opacity-50 btn-tactile"
                  title={t.deleteBtn}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};
