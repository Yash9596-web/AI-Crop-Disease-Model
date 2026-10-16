import datetime
from sqlalchemy import Column, Integer, String, Float, Boolean, Text, DateTime, ForeignKey, Index
from sqlalchemy.orm import relationship
from database.connection import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(120), nullable=False)
    email = Column(String(160), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    phone = Column(String(30), nullable=True)
    preferred_language = Column(String(10), default="en")
    role = Column(String(20), default="farmer")  # "farmer" or "admin"
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    detections = relationship("Detection", back_populates="user", cascade="all, delete-orphan")


class Crop(Base):
    __tablename__ = "crops"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(80), unique=True, index=True, nullable=False)
    scientific_name = Column(String(120), nullable=True)
    icon = Column(String(60), default="leaf")
    description = Column(Text, nullable=True)
    is_active = Column(Boolean, default=True)

    diseases = relationship("Disease", back_populates="crop", cascade="all, delete-orphan")
    detections = relationship("Detection", back_populates="crop")


class Disease(Base):
    __tablename__ = "diseases"

    id = Column(Integer, primary_key=True, index=True)
    crop_id = Column(Integer, ForeignKey("crops.id"), nullable=False, index=True)
    name = Column(String(120), index=True, nullable=False)
    common_name = Column(String(120), nullable=True)
    pathogen_type = Column(String(60), default="Fungal")  # Fungal, Bacterial, Viral, Pest, Healthy
    description = Column(Text, nullable=False)
    symptoms = Column(Text, nullable=False)  # JSON-encoded array of symptom strings
    default_severity = Column(String(30), default="Moderate")  # Mild, Moderate, Severe, Healthy
    is_healthy = Column(Boolean, default=False)

    crop = relationship("Crop", back_populates="diseases")
    treatment = relationship("TreatmentGuidance", back_populates="disease", uselist=False, cascade="all, delete-orphan")
    prevention = relationship("PreventionGuidance", back_populates="disease", uselist=False, cascade="all, delete-orphan")
    detections = relationship("Detection", back_populates="disease")


class TreatmentGuidance(Base):
    __tablename__ = "treatment_guidance"

    id = Column(Integer, primary_key=True, index=True)
    disease_id = Column(Integer, ForeignKey("diseases.id"), unique=True, nullable=False)
    immediate_actions = Column(Text, nullable=False)  # JSON-encoded array
    biological_treatments = Column(Text, nullable=False)  # JSON-encoded array
    chemical_treatments = Column(Text, nullable=False)  # JSON-encoded array
    chemical_disclaimer = Column(Text, nullable=False)
    expert_notes = Column(Text, nullable=True)

    disease = relationship("Disease", back_populates="treatment")


class PreventionGuidance(Base):
    __tablename__ = "prevention_guidance"

    id = Column(Integer, primary_key=True, index=True)
    disease_id = Column(Integer, ForeignKey("diseases.id"), unique=True, nullable=False)
    spacing = Column(Text, nullable=True)
    sanitation = Column(Text, nullable=True)
    irrigation = Column(Text, nullable=True)
    rotation = Column(Text, nullable=True)
    resistant_varieties = Column(Text, nullable=True)
    monitoring = Column(Text, nullable=True)

    disease = relationship("Disease", back_populates="prevention")


class ModelVersion(Base):
    __tablename__ = "model_versions"

    id = Column(Integer, primary_key=True, index=True)
    version_tag = Column(String(50), unique=True, nullable=False)
    architecture = Column(String(100), default="MobileNetV2-Transfer")
    input_shape = Column(String(30), default="224x224x3")
    num_classes = Column(Integer, default=32)
    accuracy = Column(Float, default=0.962)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    detections = relationship("Detection", back_populates="model_version")


class Detection(Base):
    __tablename__ = "detections"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True, index=True)
    crop_id = Column(Integer, ForeignKey("crops.id"), nullable=False, index=True)
    disease_id = Column(Integer, ForeignKey("diseases.id"), nullable=False, index=True)
    model_version_id = Column(Integer, ForeignKey("model_versions.id"), nullable=True)
    
    confidence = Column(Float, nullable=False)
    confidence_level = Column(String(20), default="High")  # High, Medium, Low
    severity = Column(String(30), default="Moderate")  # Mild, Moderate, Severe, Healthy
    image_path = Column(String(255), nullable=False)
    thumbnail_path = Column(String(255), nullable=True)
    status = Column(String(30), default="Completed")  # Completed, Flagged, Reviewed
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow, index=True)

    user = relationship("User", back_populates="detections")
    crop = relationship("Crop", back_populates="detections")
    disease = relationship("Disease", back_populates="detections")
    model_version = relationship("ModelVersion", back_populates="detections")

Index("idx_detections_user_created", Detection.user_id, Detection.created_at.desc())
Index("idx_detections_crop_disease", Detection.crop_id, Detection.disease_id)
