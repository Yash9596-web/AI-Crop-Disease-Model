import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { AdminStatistics, Disease } from '../types';
import {
  Shield,
  Activity,
  Cpu,
  Layers,
  Edit3,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  X,
  Save,
  Info
} from 'lucide-react';

export const AdminPage: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<AdminStatistics | null>(null);
  const [modelInfo, setModelInfo] = useState<any>(null);
  const [diseases, setDiseases] = useState<Disease[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDisease, setSelectedDisease] = useState<Disease | null>(null);
  const [editSuccess, setEditSuccess] = useState(false);

  // Form states for disease editing
  const [editImmediate, setEditImmediate] = useState<string>('');
  const [editBiological, setEditBiological] = useState<string>('');
  const [editChemical, setEditChemical] = useState<string>('');
  const [editDisclaimer, setEditDisclaimer] = useState<string>('');
  const [saving, setSaving] = useState(false);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [sData, mData, dData] = await Promise.all([
        api.admin.getStatistics(),
        api.admin.getModelInfo(),
        api.admin.getDiseases(),
      ]);
      setStats(sData);
      setModelInfo(mData);
      setDiseases(dData);
    } catch (err) {
      console.error("Error fetching admin data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const openEditModal = (disease: Disease) => {
    setSelectedDisease(disease);
    setEditSuccess(false);
    setEditImmediate(disease.treatment?.immediate_actions.join('\n') || '');
    setEditBiological(disease.treatment?.biological_treatments.join('\n') || '');
    setEditChemical(disease.treatment?.chemical_treatments.join('\n') || '');
    setEditDisclaimer(disease.treatment?.chemical_disclaimer || '');
  };

  const handleSaveDisease = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDisease) return;

    setSaving(true);
    try {
      const updatedPayload = {
        immediate_actions: editImmediate.split('\n').filter(Boolean),
        biological_treatments: editBiological.split('\n').filter(Boolean),
        chemical_treatments: editChemical.split('\n').filter(Boolean),
        chemical_disclaimer: editDisclaimer,
      };

      await api.admin.updateDisease(selectedDisease.id, updatedPayload);
      setEditSuccess(true);
      fetchAdminData();
      setTimeout(() => {
        setSelectedDisease(null);
      }, 900);
    } catch (err: any) {
      alert(err.message || "Failed to update disease guidance.");
    } finally {
      setSaving(false);
    }
  };

  if (user?.role !== 'admin') {
    return (
      <div className="max-w-md mx-auto my-20 p-8 bg-white rounded-3xl border border-danger-200 text-center space-y-4 shadow-card">
        <Shield className="w-12 h-12 text-danger-500 mx-auto" />
        <h2 className="text-xl font-bold text-gray-900">Access Restricted</h2>
        <p className="text-sm text-gray-600">
          You need agronomist administrative privileges to view the Model Management & Disease Knowledgebase.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-agri-100">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-agri-950">
            System & Model Governance
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            Manage CNN model versions, inference confidence, and agricultural treatment protocols.
          </p>
        </div>

        <button
          onClick={fetchAdminData}
          disabled={loading}
          className="px-4 py-2.5 bg-white hover:bg-gray-50 text-gray-700 font-bold text-xs rounded-xl border border-gray-200 shadow-xs flex items-center gap-2 transition-all"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh Metrics
        </button>
      </div>

      {/* Model & Accuracy Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        
        {/* Model Version */}
        <div className="bg-white rounded-3xl p-6 border border-agri-100 shadow-soft">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Active Model</span>
            <Cpu className="w-5 h-5 text-agri-600" />
          </div>
          <div className="text-xl font-extrabold text-agri-900 truncate">
            {modelInfo?.version_tag || 'v1.0.0-mobilenetv2'}
          </div>
          <span className="text-xs text-agri-600 font-semibold mt-1 block">
            {modelInfo?.architecture || 'MobileNetV2'}
          </span>
        </div>

        {/* Benchmark Accuracy */}
        <div className="bg-white rounded-3xl p-6 border border-agri-100 shadow-soft">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Validation Accuracy</span>
            <CheckCircle className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-800">
            {((modelInfo?.benchmark_accuracy ?? 0.964) * 100).toFixed(1)}%
          </div>
          <span className="text-xs text-gray-500 mt-1 block">Trained across 32 pathogen classes</span>
        </div>

        {/* Confidence Thresholds */}
        <div className="bg-white rounded-3xl p-6 border border-agri-100 shadow-soft">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Threshold Rules</span>
            <Activity className="w-5 h-5 text-amber-600" />
          </div>
          <div className="text-sm font-bold text-gray-800 space-y-0.5">
            <div className="flex justify-between">
              <span>High Confidence:</span>
              <span className="text-emerald-700">≥ {((modelInfo?.confidence_threshold_high ?? 0.8) * 100).toFixed(0)}%</span>
            </div>
            <div className="flex justify-between">
              <span>Inspection Flag:</span>
              <span className="text-amber-700">{((modelInfo?.confidence_threshold_medium ?? 0.55) * 100).toFixed(0)}%–{((modelInfo?.confidence_threshold_high ?? 0.8) * 100).toFixed(0)}%</span>
            </div>
          </div>
        </div>

        {/* Global Scans */}
        <div className="bg-white rounded-3xl p-6 border border-agri-100 shadow-soft">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Global Scans</span>
            <Layers className="w-5 h-5 text-agri-700" />
          </div>
          <div className="text-3xl font-extrabold text-agri-950">
            {stats?.total_scans ?? 0}
          </div>
          <span className="text-xs text-gray-500 mt-1 block">
            Across {stats?.total_users ?? 0} registered growers
          </span>
        </div>

      </div>

      {/* Disease Management Knowledgebase Table (Section 19) */}
      <div className="bg-white rounded-3xl border border-agri-100 shadow-card overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-agri-950">Disease Knowledgebase & Guidance Manager</h3>
            <p className="text-xs text-gray-500">Update IPM treatment steps, biological controls, and safety disclaimers</p>
          </div>
          <span className="text-xs font-bold px-3 py-1 bg-agri-100 text-agri-800 rounded-full">
            {diseases.length} Pathogens Cataloged
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-agri-50/50 text-[11px] uppercase tracking-wider font-bold text-gray-500 border-b border-gray-100">
              <tr>
                <th className="py-3.5 px-6">Disease Name</th>
                <th className="py-3.5 px-6">Pathogen Class</th>
                <th className="py-3.5 px-6">Default Severity</th>
                <th className="py-3.5 px-6">Treatment Steps</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {diseases.map((d) => (
                <tr key={d.id} className="hover:bg-agri-50/40 transition-colors">
                  <td className="py-3.5 px-6 font-bold text-gray-900">
                    <div>{d.name}</div>
                    <div className="text-xs text-gray-400 font-normal">{d.common_name}</div>
                  </td>
                  <td className="py-3.5 px-6 text-xs text-gray-600 font-medium">
                    {d.pathogen_type}
                  </td>
                  <td className="py-3.5 px-6">
                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      d.default_severity === 'Healthy' ? 'bg-emerald-100 text-emerald-800' :
                      d.default_severity === 'Severe' ? 'bg-red-100 text-red-800' : 'bg-orange-100 text-orange-800'
                    }`}>
                      {d.default_severity}
                    </span>
                  </td>
                  <td className="py-3.5 px-6 text-xs text-gray-600">
                    {d.treatment?.immediate_actions.length || 0} Actions • {d.treatment?.biological_treatments.length || 0} Bio
                  </td>
                  <td className="py-3.5 px-6 text-right">
                    <button
                      onClick={() => openEditModal(d)}
                      className="py-1.5 px-3 rounded-xl bg-agri-50 hover:bg-agri-100 text-agri-800 text-xs font-bold transition-all inline-flex items-center gap-1.5"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      Edit Guidance
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Disease Treatment Edit Modal */}
      {selectedDisease && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-agri-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-card p-6 sm:p-8 border border-agri-100 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedDisease(null)}
              className="absolute top-5 right-5 p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6">
              <span className="text-xs font-bold text-agri-600 uppercase tracking-wider block">
                Guidance Editor
              </span>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">
                Edit {selectedDisease.name} Guidance
              </h3>
            </div>

            {editSuccess && (
              <div className="mb-4 p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                Guidance updated successfully!
              </div>
            )}

            <form onSubmit={handleSaveDisease} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Immediate Actions (One per line)
                </label>
                <textarea
                  rows={3}
                  value={editImmediate}
                  onChange={(e) => setEditImmediate(e.target.value)}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-agri-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Biological / Non-Chemical Controls (One per line)
                </label>
                <textarea
                  rows={3}
                  value={editBiological}
                  onChange={(e) => setEditBiological(e.target.value)}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-agri-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Chemical Treatments (One per line)
                </label>
                <textarea
                  rows={3}
                  value={editChemical}
                  onChange={(e) => setEditChemical(e.target.value)}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-agri-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Chemical Regulatory Disclaimer
                </label>
                <input
                  type="text"
                  value={editDisclaimer}
                  onChange={(e) => setEditDisclaimer(e.target.value)}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-agri-500"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedDisease(null)}
                  className="px-4 py-2.5 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 bg-agri-700 hover:bg-agri-800 text-white font-bold text-xs rounded-xl shadow-sm flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  {saving ? 'Saving...' : 'Save Guidance'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
