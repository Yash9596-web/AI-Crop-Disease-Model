import axios from 'axios';
import {
  User,
  Crop,
  Disease,
  Detection,
  PredictResponse,
  DashboardStats,
  AdminStatistics
} from '../types';
import { clientSideDiagnose } from './diagnosticFallback';

const API_BASE = import.meta.env.VITE_API_BASE_URL
  ? `${import.meta.env.VITE_API_BASE_URL.replace(/\/+$/, '')}/api`
  : '/api';

export const apiClient = axios.create({
  baseURL: API_BASE,
  timeout: 45000,
  headers: {
    'Accept': 'application/json',
  },
});

// Attach JWT token automatically
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('crop_auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Format friendly errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    let message = 'Connection problem. Please check your internet connection and try again.';
    if (error.response?.data?.detail) {
      if (typeof error.response.data.detail === 'string') {
        message = error.response.data.detail;
      } else if (Array.isArray(error.response.data.detail)) {
        message = error.response.data.detail.map((d: any) => d.msg || d.message || JSON.stringify(d)).join('; ');
      }
    } else if (error.code === 'ECONNABORTED' || (error.message && error.message.toLowerCase().includes('timeout'))) {
      message = 'Analysis took longer than expected. Please try again with a clear, well-lit photo.';
    } else if (error.message && error.message.includes('Network Error')) {
      message = 'Unable to connect to the disease analysis server. Please check your connection.';
    }
    return Promise.reject(new Error(message));
  }
);

export const api = {
  // Authentication
  auth: {
    register: async (data: { name: string; email: string; password: string; phone?: string; preferred_language?: string }) => {
      const res = await apiClient.post<{ access_token: string; user: User }>('/auth/register', data);
      localStorage.setItem('crop_auth_token', res.data.access_token);
      return res.data;
    },
    login: async (credentials: { email: string; password: string }) => {
      const res = await apiClient.post<{ access_token: string; user: User }>('/auth/login', credentials);
      localStorage.setItem('crop_auth_token', res.data.access_token);
      return res.data;
    },
    demoLogin: async (role: 'farmer' | 'admin') => {
      const res = await apiClient.post<{ access_token: string; user: User }>(`/auth/demo-login/${role}`);
      localStorage.setItem('crop_auth_token', res.data.access_token);
      return res.data;
    },
    getProfile: async () => {
      const res = await apiClient.get<User>('/auth/profile');
      return res.data;
    },
    updateProfile: async (data: { name?: string; phone?: string; preferred_language?: string }) => {
      const res = await apiClient.put<User>('/auth/profile', data);
      return res.data;
    },
    logout: () => {
      localStorage.removeItem('crop_auth_token');
    },
  },

  // Disease Prediction
  predict: {
    analyzeLeaf: async (imageFile: File, cropType?: string): Promise<PredictResponse> => {
      const formData = new FormData();
      formData.append('image', imageFile);
      if (cropType && cropType !== 'All' && cropType !== 'Other') {
        formData.append('crop_type', cropType);
      }

      try {
        const res = await apiClient.post<PredictResponse>('/predict', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        return res.data;
      } catch (err: any) {
        console.warn('Remote /predict API unreachable or failed, activating intelligent edge diagnosis:', err);
        return await clientSideDiagnose(imageFile, cropType);
      }
    },
  },

  // Detections & History
  detections: {
    getAll: async (params?: {
      crop?: string;
      disease?: string;
      search?: string;
      severity?: string;
      start_date?: string;
      end_date?: string;
    }): Promise<Detection[]> => {
      const res = await apiClient.get<Detection[]>('/detections', { params });
      return res.data;
    },
    getById: async (id: number): Promise<Detection> => {
      const res = await apiClient.get<Detection>(`/detections/${id}`);
      return res.data;
    },
    delete: async (id: number): Promise<{ success: boolean; message: string }> => {
      const res = await apiClient.delete<{ success: boolean; message: string }>(`/detections/${id}`);
      return res.data;
    },
    getDashboardStats: async (): Promise<DashboardStats> => {
      const res = await apiClient.get<DashboardStats>('/detections/dashboard/stats');
      return res.data;
    },
  },

  // Crops & Knowledgebase
  crops: {
    getAll: async (): Promise<Crop[]> => {
      const res = await apiClient.get<Crop[]>('/crops');
      return res.data;
    },
    getDiseases: async (cropId: number): Promise<Disease[]> => {
      const res = await apiClient.get<Disease[]>(`/crops/${cropId}/diseases`);
      return res.data;
    },
  },

  // Admin Controls
  admin: {
    getStatistics: async (): Promise<AdminStatistics> => {
      const res = await apiClient.get<AdminStatistics>('/admin/statistics');
      return res.data;
    },
    getModelInfo: async () => {
      const res = await apiClient.get('/admin/model-info');
      return res.data;
    },
    getDiseases: async (): Promise<Disease[]> => {
      const res = await apiClient.get<Disease[]>('/admin/diseases');
      return res.data;
    },
    updateDisease: async (id: number, data: any) => {
      const res = await apiClient.put(`/admin/diseases/${id}`, data);
      return res.data;
    },
  },
};
