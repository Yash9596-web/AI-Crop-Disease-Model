import json
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database.connection import get_db
from database.models import Crop, Disease
from api.schemas import CropResponse, DiseaseResponse, TreatmentSchema, PreventionSchema

router = APIRouter(prefix="/api/crops", tags=["Crops & Diseases"])

@router.get("", response_model=List[CropResponse])
def get_crops(db: Session = Depends(get_db)):
    crops = db.query(Crop).filter(Crop.is_active == True).all()
    results = []
    for c in crops:
        results.append(CropResponse(
            id=c.id,
            name=c.name,
            scientific_name=c.scientific_name,
            icon=c.icon or "leaf",
            description=c.description,
            disease_count=len(c.diseases)
        ))
    return results

@router.get("/{crop_id}/diseases", response_model=List[DiseaseResponse])
def get_crop_diseases(crop_id: int, db: Session = Depends(get_db)):
    crop = db.query(Crop).filter(Crop.id == crop_id).first()
    if not crop:
        raise HTTPException(status_code=404, detail="Crop not found.")

    diseases = db.query(Disease).filter(Disease.crop_id == crop_id).all()
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
