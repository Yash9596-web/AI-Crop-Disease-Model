from typing import List, Optional, Dict, Any
from datetime import datetime
from pydantic import BaseModel, Field

# --- User & Auth Schemas ---
class UserRegister(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: str = Field(..., pattern=r"^[^@\s]+@[^@\s]+\.[^@\s]+$")
    password: str = Field(..., min_length=6)
    phone: Optional[str] = None
    preferred_language: str = "en"

class UserLogin(BaseModel):
    email: str = Field(..., pattern=r"^[^@\s]+@[^@\s]+\.[^@\s]+$")
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: "UserResponse"

class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    phone: Optional[str] = None
    preferred_language: str = "en"
    role: str
    created_at: datetime

    class Config:
        from_attributes = True

class UserProfileUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    preferred_language: Optional[str] = None

class PasswordResetRequest(BaseModel):
    email: str = Field(..., pattern=r"^[^@\s]+@[^@\s]+\.[^@\s]+$")

# --- Crop & Disease Schemas ---
class TreatmentSchema(BaseModel):
    immediate_actions: List[str]
    biological_treatments: List[str]
    chemical_treatments: List[str]
    chemical_disclaimer: str
    expert_notes: Optional[str] = None

class PreventionSchema(BaseModel):
    spacing: Optional[str] = None
    sanitation: Optional[str] = None
    irrigation: Optional[str] = None
    rotation: Optional[str] = None
    resistant_varieties: Optional[str] = None
    monitoring: Optional[str] = None

class DiseaseResponse(BaseModel):
    id: int
    crop_id: int
    name: str
    common_name: Optional[str] = None
    pathogen_type: str
    description: str
    symptoms: List[str]
    default_severity: str
    is_healthy: bool
    treatment: Optional[TreatmentSchema] = None
    prevention: Optional[PreventionSchema] = None

    class Config:
        from_attributes = True

class CropResponse(BaseModel):
    id: int
    name: str
    scientific_name: Optional[str] = None
    icon: Optional[str] = "leaf"
    description: Optional[str] = None
    disease_count: Optional[int] = 0

    class Config:
        from_attributes = True

# --- Prediction & Detection Schemas ---
class TopCandidate(BaseModel):
    index: int
    crop: str
    disease: str
    display_name: str
    confidence: float
    is_healthy: bool

class PredictResponse(BaseModel):
    success: bool
    detection_id: Optional[int] = None
    crop: str
    scientific_name: Optional[str] = None
    disease: str
    confidence: float
    confidence_level: str  # High, Medium, Low
    confidence_message: str
    severity: str          # Mild, Moderate, Severe, Healthy
    is_healthy: bool
    image_url: str
    thumbnail_url: Optional[str] = None
    symptoms: List[str]
    treatment: TreatmentSchema
    prevention: PreventionSchema
    top_candidates: List[TopCandidate]
    model_type: Optional[str] = None
    model_version: Optional[str] = None
    safety_disclaimer: str
    created_at: str

class DetectionResponse(BaseModel):
    id: int
    user_id: Optional[int] = None
    crop_name: str
    disease_name: str
    confidence: float
    confidence_level: str
    severity: str
    image_url: str
    thumbnail_url: Optional[str] = None
    status: str
    notes: Optional[str] = None
    created_at: datetime
    is_healthy: bool = False

    class Config:
        from_attributes = True

class DetectionDetailResponse(DetectionResponse):
    crop_details: Optional[CropResponse] = None
    disease_details: Optional[DiseaseResponse] = None

class DashboardStats(BaseModel):
    total_scans: int
    healthy_scans: int
    diseased_scans: int
    most_common_disease: str
    recent_detections: List[DetectionResponse]

class AdminStatistics(BaseModel):
    total_users: int
    total_scans: int
    scans_by_crop: Dict[str, int]
    scans_by_severity: Dict[str, int]
    average_confidence: float
    model_version: str
    model_architecture: str
    active_crops_count: int
    active_diseases_count: int
