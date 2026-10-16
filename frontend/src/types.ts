export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  preferred_language: string;
  role: 'farmer' | 'admin';
  created_at: string;
}

export interface Crop {
  id: number;
  name: string;
  scientific_name?: string;
  icon: string;
  description?: string;
  disease_count?: number;
}

export interface TreatmentGuidance {
  immediate_actions: string[];
  biological_treatments: string[];
  chemical_treatments: string[];
  chemical_disclaimer: string;
  expert_notes?: string;
}

export interface PreventionGuidance {
  spacing?: string;
  sanitation?: string;
  irrigation?: string;
  rotation?: string;
  resistant_varieties?: string;
  monitoring?: string;
}

export interface Disease {
  id: number;
  crop_id: number;
  name: string;
  common_name?: string;
  pathogen_type: string;
  description: string;
  symptoms: string[];
  default_severity: 'Mild' | 'Moderate' | 'Severe' | 'Healthy';
  is_healthy: boolean;
  treatment?: TreatmentGuidance;
  prevention?: PreventionGuidance;
}

export interface TopCandidate {
  index: number;
  crop: string;
  disease: string;
  display_name: string;
  confidence: number;
  is_healthy: boolean;
}

export interface PredictResponse {
  success: boolean;
  detection_id?: number;
  crop: string;
  disease: string;
  confidence: number;
  confidence_level: 'High' | 'Medium' | 'Low';
  confidence_message: string;
  severity: 'Mild' | 'Moderate' | 'Severe' | 'Healthy';
  is_healthy: boolean;
  image_url: string;
  thumbnail_url?: string;
  symptoms: string[];
  treatment: TreatmentGuidance;
  prevention: PreventionGuidance;
  top_candidates: TopCandidate[];
  safety_disclaimer: string;
  created_at: string;
}

export interface Detection {
  id: number;
  user_id?: number;
  crop_name: string;
  disease_name: string;
  confidence: number;
  confidence_level: string;
  severity: 'Mild' | 'Moderate' | 'Severe' | 'Healthy';
  image_url: string;
  thumbnail_url?: string;
  status: string;
  notes?: string;
  created_at: string;
  is_healthy: boolean;
  crop_details?: Crop;
  disease_details?: Disease;
}

export interface DashboardStats {
  total_scans: number;
  healthy_scans: number;
  diseased_scans: number;
  most_common_disease: string;
  recent_detections: Detection[];
}

export interface AdminStatistics {
  total_users: number;
  total_scans: number;
  scans_by_crop: Record<string, number>;
  scans_by_severity: Record<string, number>;
  average_confidence: number;
  model_version: string;
  model_architecture: string;
  active_crops_count: number;
  active_diseases_count: number;
}
