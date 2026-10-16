import json
from typing import List, Optional
from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from database.connection import get_db
from database.models import User, Detection, Crop, Disease
from auth.dependencies import get_current_user, get_current_user_optional
from api.schemas import DetectionResponse, DetectionDetailResponse, DashboardStats, CropResponse, DiseaseResponse, TreatmentSchema, PreventionSchema

router = APIRouter(prefix="/api/detections", tags=["Detections"])

@router.get("", response_model=List[DetectionResponse])
def get_detections(
    crop: Optional[str] = Query(None, description="Filter by crop name"),
    disease: Optional[str] = Query(None, description="Filter by disease name"),
    search: Optional[str] = Query(None, description="Search crop or disease"),
    severity: Optional[str] = Query(None, description="Filter by severity"),
    start_date: Optional[str] = Query(None, description="Filter start date YYYY-MM-DD"),
    end_date: Optional[str] = Query(None, description="Filter end date YYYY-MM-DD"),
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
    current_user: Optional[User] = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    query = db.query(Detection).join(Crop).join(Disease)

    # If logged in as non-admin, filter by user; if admin, can view all
    if current_user:
        if current_user.role != "admin":
            query = query.filter(Detection.user_id == current_user.id)
    else:
        # For public/guest demo, show latest scans with null user_id or sample scans
        query = query.filter((Detection.user_id == None) | (Detection.user_id == 2))

    if crop and crop.lower() != "all":
        query = query.filter(Crop.name.ilike(f"%{crop}%"))
    if disease and disease.lower() != "all":
        query = query.filter(Disease.name.ilike(f"%{disease}%"))
    if severity and severity.lower() != "all":
        query = query.filter(Detection.severity.ilike(severity))
    if search:
        search_pattern = f"%{search}%"
        query = query.filter(
            (Crop.name.ilike(search_pattern)) |
            (Disease.name.ilike(search_pattern)) |
            (Detection.notes.ilike(search_pattern))
        )
    if start_date:
        try:
            sd = datetime.strptime(start_date, "%Y-%m-%d")
            query = query.filter(Detection.created_at >= sd)
        except ValueError:
            pass
    if end_date:
        try:
            ed = datetime.strptime(end_date, "%Y-%m-%d") + timedelta(days=1)
            query = query.filter(Detection.created_at < ed)
        except ValueError:
            pass

    records = query.order_by(desc(Detection.created_at)).offset(offset).limit(limit).all()

    results = []
    for d in records:
        results.append(DetectionResponse(
            id=d.id,
            user_id=d.user_id,
            crop_name=d.crop.name if d.crop else "Unknown",
            disease_name=d.disease.name if d.disease else "Unknown",
            confidence=round(d.confidence, 4),
            confidence_level=d.confidence_level or "High",
            severity=d.severity or "Moderate",
            image_url=f"/api/uploads/{d.image_path}",
            thumbnail_url=f"/api/uploads/thumbnails/{d.thumbnail_path}" if d.thumbnail_path else f"/api/uploads/{d.image_path}",
            status=d.status or "Completed",
            notes=d.notes,
            created_at=d.created_at,
            is_healthy=d.disease.is_healthy if d.disease else False
        ))
    return results

@router.get("/dashboard/stats", response_model=DashboardStats)
def get_dashboard_stats(
    current_user: Optional[User] = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    query = db.query(Detection).join(Crop).join(Disease)
    if current_user and current_user.role != "admin":
        query = query.filter(Detection.user_id == current_user.id)

    total_scans = query.count()
    healthy_scans = query.filter(Detection.severity == "Healthy").count()
    diseased_scans = total_scans - healthy_scans

    # Most common disease
    top_disease = (
        db.query(Disease.name, func.count(Detection.id).label("count"))
        .join(Detection, Detection.disease_id == Disease.id)
        .filter(Disease.is_healthy == False)
        .group_by(Disease.name)
        .order_by(desc("count"))
        .first()
    )
    most_common = top_disease[0] if top_disease else "None recorded"

    # Recent scans
    recent = query.order_by(desc(Detection.created_at)).limit(6).all()
    recent_list = []
    for d in recent:
        recent_list.append(DetectionResponse(
            id=d.id,
            user_id=d.user_id,
            crop_name=d.crop.name if d.crop else "Unknown",
            disease_name=d.disease.name if d.disease else "Unknown",
            confidence=round(d.confidence, 4),
            confidence_level=d.confidence_level or "High",
            severity=d.severity or "Moderate",
            image_url=f"/api/uploads/{d.image_path}",
            thumbnail_url=f"/api/uploads/thumbnails/{d.thumbnail_path}" if d.thumbnail_path else f"/api/uploads/{d.image_path}",
            status=d.status or "Completed",
            notes=d.notes,
            created_at=d.created_at,
            is_healthy=d.disease.is_healthy if d.disease else False
        ))

    return DashboardStats(
        total_scans=total_scans,
        healthy_scans=healthy_scans,
        diseased_scans=diseased_scans,
        most_common_disease=most_common,
        recent_detections=recent_list
    )

@router.get("/{detection_id}", response_model=DetectionDetailResponse)
def get_detection_detail(
    detection_id: int,
    current_user: Optional[User] = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    detection = db.query(Detection).filter(Detection.id == detection_id).first()
    if not detection:
        raise HTTPException(status_code=404, detail="Detection record not found.")

    if current_user and current_user.role != "admin" and detection.user_id and detection.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="You do not have permission to view this record.")

    crop_info = None
    if detection.crop:
        crop_info = CropResponse(
            id=detection.crop.id,
            name=detection.crop.name,
            scientific_name=detection.crop.scientific_name,
            icon=detection.crop.icon,
            description=detection.crop.description,
            disease_count=len(detection.crop.diseases)
        )

    disease_info = None
    if detection.disease:
        treatment_schema = None
        if detection.disease.treatment:
            t = detection.disease.treatment
            treatment_schema = TreatmentSchema(
                immediate_actions=json.loads(t.immediate_actions) if t.immediate_actions else [],
                biological_treatments=json.loads(t.biological_treatments) if t.biological_treatments else [],
                chemical_treatments=json.loads(t.chemical_treatments) if t.chemical_treatments else [],
                chemical_disclaimer=t.chemical_disclaimer,
                expert_notes=t.expert_notes
            )
        prevention_schema = None
        if detection.disease.prevention:
            p = detection.disease.prevention
            prevention_schema = PreventionSchema(
                spacing=p.spacing,
                sanitation=p.sanitation,
                irrigation=p.irrigation,
                rotation=p.rotation,
                resistant_varieties=p.resistant_varieties,
                monitoring=p.monitoring
            )
        disease_info = DiseaseResponse(
            id=detection.disease.id,
            crop_id=detection.disease.crop_id,
            name=detection.disease.name,
            common_name=detection.disease.common_name,
            pathogen_type=detection.disease.pathogen_type,
            description=detection.disease.description,
            symptoms=json.loads(detection.disease.symptoms) if detection.disease.symptoms else [],
            default_severity=detection.disease.default_severity,
            is_healthy=detection.disease.is_healthy,
            treatment=treatment_schema,
            prevention=prevention_schema
        )

    return DetectionDetailResponse(
        id=detection.id,
        user_id=detection.user_id,
        crop_name=detection.crop.name if detection.crop else "Unknown",
        disease_name=detection.disease.name if detection.disease else "Unknown",
        confidence=round(detection.confidence, 4),
        confidence_level=detection.confidence_level or "High",
        severity=detection.severity or "Moderate",
        image_url=f"/api/uploads/{detection.image_path}",
        thumbnail_url=f"/api/uploads/thumbnails/{detection.thumbnail_path}" if detection.thumbnail_path else f"/api/uploads/{detection.image_path}",
        status=detection.status or "Completed",
        notes=detection.notes,
        created_at=detection.created_at,
        is_healthy=detection.disease.is_healthy if detection.disease else False,
        crop_details=crop_info,
        disease_details=disease_info
    )

@router.delete("/{detection_id}")
def delete_detection(
    detection_id: int,
    current_user: Optional[User] = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    detection = db.query(Detection).filter(Detection.id == detection_id).first()
    if not detection:
        raise HTTPException(status_code=404, detail="Detection record not found.")

    if current_user and current_user.role != "admin" and detection.user_id and detection.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="You do not have permission to delete this record.")

    db.delete(detection)
    db.commit()
    return {"success": True, "message": "Detection history entry deleted successfully."}
