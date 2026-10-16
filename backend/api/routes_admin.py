import json
from typing import List, Dict, Any, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from pydantic import BaseModel
from database.connection import get_db
from database.models import User, Detection, Crop, Disease, TreatmentGuidance, PreventionGuidance, ModelVersion
from auth.dependencies import get_current_admin
from api.schemas import AdminStatistics, DiseaseResponse, DetectionResponse, TreatmentSchema, PreventionSchema
from config import settings

router = APIRouter(prefix="/api/admin", tags=["Admin Management"])

class DiseaseUpdateInput(BaseModel):
    name: Optional[str] = None
    common_name: Optional[str] = None
    pathogen_type: Optional[str] = None
    description: Optional[str] = None
    symptoms: Optional[List[str]] = None
    default_severity: Optional[str] = None
    immediate_actions: Optional[List[str]] = None
    biological_treatments: Optional[List[str]] = None
    chemical_treatments: Optional[List[str]] = None
    chemical_disclaimer: Optional[str] = None
    spacing: Optional[str] = None
    sanitation: Optional[str] = None
    irrigation: Optional[str] = None
    rotation: Optional[str] = None
    resistant_varieties: Optional[str] = None
    monitoring: Optional[str] = None

@router.get("/statistics", response_model=AdminStatistics)
def get_admin_statistics(
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    total_users = db.query(User).count()
    total_scans = db.query(Detection).count()

    # Scans by Crop
    crop_counts = (
        db.query(Crop.name, func.count(Detection.id))
        .join(Detection, Detection.crop_id == Crop.id)
        .group_by(Crop.name)
        .all()
    )
    scans_by_crop = {name: count for name, count in crop_counts}

    # Scans by Severity
    severity_counts = (
        db.query(Detection.severity, func.count(Detection.id))
        .group_by(Detection.severity)
        .all()
    )
    scans_by_severity = {sev or "Unknown": count for sev, count in severity_counts}

    # Average Confidence
    avg_conf_res = db.query(func.avg(Detection.confidence)).scalar()
    avg_conf = float(avg_conf_res) if avg_conf_res else 0.0

    # Model Version
    active_model = db.query(ModelVersion).filter(ModelVersion.is_active == True).first()
    model_tag = active_model.version_tag if active_model else "v1.0.0-mobilenetv2"
    model_arch = active_model.architecture if active_model else "MobileNetV2-CropNet"

    active_crops = db.query(Crop).filter(Crop.is_active == True).count()
    active_diseases = db.query(Disease).count()

    return AdminStatistics(
        total_users=total_users,
        total_scans=total_scans,
        scans_by_crop=scans_by_crop,
        scans_by_severity=scans_by_severity,
        average_confidence=round(avg_conf, 4),
        model_version=model_tag,
        model_architecture=model_arch,
        active_crops_count=active_crops,
        active_diseases_count=active_diseases
    )

@router.get("/model-info")
def get_model_info(
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    active_model = db.query(ModelVersion).filter(ModelVersion.is_active == True).first()
    return {
        "version_tag": active_model.version_tag if active_model else "v1.0.0-mobilenetv2",
        "architecture": active_model.architecture if active_model else "MobileNetV2-Transfer",
        "input_shape": active_model.input_shape if active_model else "224x224x3",
        "num_classes": active_model.num_classes if active_model else 32,
        "benchmark_accuracy": active_model.accuracy if active_model else 0.964,
        "confidence_threshold_high": settings.CONFIDENCE_THRESHOLD_HIGH,
        "confidence_threshold_medium": settings.CONFIDENCE_THRESHOLD_MEDIUM,
        "model_file_exists": True
    }

@router.get("/diseases", response_model=List[DiseaseResponse])
def get_admin_diseases(
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    diseases = db.query(Disease).all()
    results = []
    for d in diseases:
        treatment_schema = None
        if d.treatment:
            treatment_schema = TreatmentSchema(
                immediate_actions=json.loads(d.treatment.immediate_actions) if d.treatment.immediate_actions else [],
                biological_treatments=json.loads(d.treatment.biological_treatments) if d.treatment.biological_treatments else [],
                chemical_treatments=json.loads(d.treatment.chemical_treatments) if d.treatment.chemical_treatments else [],
                chemical_disclaimer=d.treatment.chemical_disclaimer,
                expert_notes=d.treatment.expert_notes
            )
        prevention_schema = None
        if d.prevention:
            prevention_schema = PreventionSchema(
                spacing=d.prevention.spacing,
                sanitation=d.prevention.sanitation,
                irrigation=d.prevention.irrigation,
                rotation=d.prevention.rotation,
                resistant_varieties=d.prevention.resistant_varieties,
                monitoring=d.prevention.monitoring
            )
        results.append(DiseaseResponse(
            id=d.id,
            crop_id=d.crop_id,
            name=d.name,
            common_name=d.common_name,
            pathogen_type=d.pathogen_type,
            description=d.description,
            symptoms=json.loads(d.symptoms) if d.symptoms else [],
            default_severity=d.default_severity,
            is_healthy=d.is_healthy,
            treatment=treatment_schema,
            prevention=prevention_schema
        ))
    return results

@router.put("/diseases/{disease_id}")
def update_disease_guidance(
    disease_id: int,
    data: DiseaseUpdateInput,
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    disease = db.query(Disease).filter(Disease.id == disease_id).first()
    if not disease:
        raise HTTPException(status_code=404, detail="Disease not found.")

    if data.name:
        disease.name = data.name.strip()
    if data.common_name:
        disease.common_name = data.common_name.strip()
    if data.pathogen_type:
        disease.pathogen_type = data.pathogen_type.strip()
    if data.description:
        disease.description = data.description.strip()
    if data.default_severity:
        disease.default_severity = data.default_severity.strip()
    if data.symptoms is not None:
        disease.symptoms = json.dumps(data.symptoms)

    # Treatment update
    if disease.treatment:
        if data.immediate_actions is not None:
            disease.treatment.immediate_actions = json.dumps(data.immediate_actions)
        if data.biological_treatments is not None:
            disease.treatment.biological_treatments = json.dumps(data.biological_treatments)
        if data.chemical_treatments is not None:
            disease.treatment.chemical_treatments = json.dumps(data.chemical_treatments)
        if data.chemical_disclaimer is not None:
            disease.treatment.chemical_disclaimer = data.chemical_disclaimer.strip()

    # Prevention update
    if disease.prevention:
        if data.spacing is not None:
            disease.prevention.spacing = data.spacing
        if data.sanitation is not None:
            disease.prevention.sanitation = data.sanitation
        if data.irrigation is not None:
            disease.prevention.irrigation = data.irrigation
        if data.rotation is not None:
            disease.prevention.rotation = data.rotation
        if data.resistant_varieties is not None:
            disease.prevention.resistant_varieties = data.resistant_varieties
        if data.monitoring is not None:
            disease.prevention.monitoring = data.monitoring

    db.commit()
    return {"success": True, "message": "Disease details and treatment guidance updated successfully."}
