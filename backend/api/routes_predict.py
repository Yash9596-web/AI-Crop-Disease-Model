import json
import datetime
from typing import Optional
from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException, status
from sqlalchemy.orm import Session
from database.connection import get_db
from database.models import User, Crop, Disease, TreatmentGuidance, PreventionGuidance, ModelVersion, Detection
from auth.dependencies import get_current_user_optional
from services.image_service import image_service
from ml.inference import inference_engine
from config import settings
from api.schemas import PredictResponse, TreatmentSchema, PreventionSchema, TopCandidate

from ml.universal_knowledge import UNIVERSAL_CROPS_METADATA

router = APIRouter(prefix="/api", tags=["Prediction"])

SAFETY_DISCLAIMER = (
    "This AI prediction is intended as an initial screening and educational aid. "
    "Predictions may be incorrect. For significant crop loss, uncertain results, or chemical "
    "treatment decisions, consult a qualified local agricultural extension specialist and follow "
    "approved product labels."
)

@router.post("/predict", response_model=PredictResponse)
async def predict_leaf_disease(
    image: UploadFile = File(..., description="Photograph of the affected crop leaf"),
    crop_type: Optional[str] = Form(None, description="Optional user-selected crop name (e.g. Tomato)"),
    current_user: Optional[User] = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    # 1. Validate image format, size, integrity, and readability
    pil_image, main_filename, thumb_filename = await image_service.validate_and_save(image)

    # 2. Run real ML inference with confidence threshold evaluation
    inference_result = inference_engine.predict(
        image=pil_image,
        selected_crop=crop_type,
        conf_high_thresh=settings.CONFIDENCE_THRESHOLD_HIGH,
        conf_med_thresh=settings.CONFIDENCE_THRESHOLD_MEDIUM
    )

    predicted_crop_name = inference_result["crop"]
    predicted_disease_name = inference_result["disease"]
    confidence = inference_result["confidence"]
    confidence_level = inference_result["confidence_level"]
    confidence_message = inference_result["confidence_message"]
    severity = inference_result["severity"]
    is_healthy = inference_result["is_healthy"]

    # 3. Lookup or match Crop and Disease in Database (dynamically registering any new crop/plant)
    crop_db = db.query(Crop).filter(Crop.name.ilike(predicted_crop_name)).first()
    if not crop_db:
        meta = UNIVERSAL_CROPS_METADATA.get(predicted_crop_name, {
            "scientific_name": "Plantae spp.",
            "family": "Plantae",
            "icon": "leaf",
            "description": f"Agricultural foliage and botanical leaf specimen for {predicted_crop_name}."
        })
        crop_db = Crop(
            name=predicted_crop_name,
            scientific_name=meta.get("scientific_name", "Plantae spp."),
            icon=meta.get("icon", "leaf"),
            description=meta.get("description", f"Botanical leaf specimen of {predicted_crop_name}."),
            is_active=True
        )
        db.add(crop_db)
        db.commit()
        db.refresh(crop_db)

    disease_db = db.query(Disease).filter(
        Disease.crop_id == crop_db.id,
        Disease.name.ilike(predicted_disease_name)
    ).first()

    if not disease_db:
        # Dynamically register newly scanned disease/condition with complete guidance
        pathogen_type = "Healthy" if is_healthy else (
            "Bacterial" if "bacterial" in predicted_disease_name.lower()
            else ("Viral" if "viral" in predicted_disease_name.lower() or "mosaic" in predicted_disease_name.lower() or "curl" in predicted_disease_name.lower()
            else ("Nutritional" if "chlorosis" in predicted_disease_name.lower() or "deficiency" in predicted_disease_name.lower()
            else "Fungal"))
        )
        disease_db = Disease(
            crop_id=crop_db.id,
            name=predicted_disease_name,
            common_name=f"{predicted_crop_name} {predicted_disease_name}",
            pathogen_type=pathogen_type,
            description=f"Pathological condition affecting {predicted_crop_name} foliage.",
            symptoms=json.dumps(inference_result.get("symptoms", [])),
            default_severity=severity,
            is_healthy=is_healthy
        )
        db.add(disease_db)
        db.commit()
        db.refresh(disease_db)

        # Create TreatmentGuidance and PreventionGuidance
        t_raw = inference_result.get("treatment", {})
        treatment_model = TreatmentGuidance(
            disease_id=disease_db.id,
            immediate_actions=json.dumps(t_raw.get("immediate_actions", [])),
            biological_treatments=json.dumps(t_raw.get("biological_treatments", [])),
            chemical_treatments=json.dumps(t_raw.get("chemical_treatments", [])),
            chemical_disclaimer=t_raw.get("chemical_disclaimer", "Always follow local agricultural safety guidelines."),
            expert_notes=t_raw.get("expert_notes", "")
        )
        db.add(treatment_model)

        p_raw = inference_result.get("prevention", {})
        prevention_model = PreventionGuidance(
            disease_id=disease_db.id,
            spacing=p_raw.get("spacing", ""),
            sanitation=p_raw.get("sanitation", ""),
            irrigation=p_raw.get("irrigation", ""),
            rotation=p_raw.get("rotation", ""),
            resistant_varieties=p_raw.get("resistant_varieties", ""),
            monitoring=p_raw.get("monitoring", "")
        )
        db.add(prevention_model)
        db.commit()

    # Retrieve symptoms and guidance directly from inference_result (grounded in universal knowledgebase)
    symptoms_list = inference_result.get("symptoms")
    if not symptoms_list and disease_db and disease_db.symptoms:
        try:
            symptoms_list = json.loads(disease_db.symptoms)
        except Exception:
            symptoms_list = [disease_db.symptoms]
    if not symptoms_list:
        symptoms_list = ["Foliar discoloration observed in leaf blade"]

    t_dict = inference_result.get("treatment", {})
    treatment_data = TreatmentSchema(
        immediate_actions=t_dict.get("immediate_actions", [
            "Isolate or prune visibly infected leaves to minimize pathogen transmission.",
            "Sanitize tools and shears with 70% isopropyl alcohol.",
            "Avoid overhead irrigation to keep foliage dry."
        ]),
        biological_treatments=t_dict.get("biological_treatments", [
            "Apply neem oil extract spray (0.5% concentration) as organic deterrent.",
            "Introduce beneficial Trichoderma or Bacillus amyloliquefaciens soil inoculant."
        ]),
        chemical_treatments=t_dict.get("chemical_treatments", [
            "Apply registered foliar contact or systemic protector according to agricultural label."
        ]),
        chemical_disclaimer=t_dict.get("chemical_disclaimer", "Always verify approved chemical active ingredients with your local agricultural extension service."),
        expert_notes=t_dict.get("expert_notes", "Prompt foliar intervention prevents secondary spread across the canopy.")
    )

    p_dict = inference_result.get("prevention", {})
    prevention_data = PreventionSchema(
        spacing=p_dict.get("spacing", "Maintain adequate spacing between rows for ventilation and sunlight."),
        sanitation=p_dict.get("sanitation", "Collect and destroy fallen leaf debris post-harvest."),
        irrigation=p_dict.get("irrigation", "Use furrow or drip irrigation to keep leaf surfaces completely dry."),
        rotation=p_dict.get("rotation", "Rotate with non-susceptible botanical families every 2 seasons."),
        resistant_varieties=p_dict.get("resistant_varieties", "Select certified disease-tolerant cultivars."),
        monitoring=p_dict.get("monitoring", "Scout the canopy twice weekly, inspecting undersides of leaves.")
    )

    # 4. Fetch or default active ModelVersion
    active_model_ver = db.query(ModelVersion).filter_by(is_active=True).first()
    model_ver_id = active_model_ver.id if active_model_ver else None

    # 5. Persist detection record into Database
    detection = Detection(
        user_id=current_user.id if current_user else None,
        crop_id=crop_db.id if crop_db else 1,
        disease_id=disease_db.id if disease_db else 1,
        model_version_id=model_ver_id,
        confidence=confidence,
        confidence_level=confidence_level,
        severity=severity,
        image_path=main_filename,
        thumbnail_path=thumb_filename,
        status="Completed",
        notes=f"Detected via {inference_result['model_type']}",
        created_at=datetime.datetime.utcnow()
    )
    db.add(detection)
    db.commit()
    db.refresh(detection)

    image_url = f"/api/uploads/{main_filename}"
    thumbnail_url = f"/api/uploads/thumbnails/{thumb_filename}"

    top_candidates = [
        TopCandidate(
            index=c["index"],
            crop=c["crop"],
            disease=c["disease"],
            display_name=c["display_name"],
            confidence=c["confidence"],
            is_healthy=c["is_healthy"]
        ) for c in inference_result["top_candidates"]
    ]

    return PredictResponse(
        success=True,
        detection_id=detection.id,
        crop=predicted_crop_name,
        disease=predicted_disease_name,
        confidence=confidence,
        confidence_level=confidence_level,
        confidence_message=confidence_message,
        severity=severity,
        is_healthy=is_healthy,
        image_url=image_url,
        thumbnail_url=thumbnail_url,
        symptoms=symptoms_list,
        treatment=treatment_data,
        prevention=prevention_data,
        top_candidates=top_candidates,
        safety_disclaimer=SAFETY_DISCLAIMER,
        created_at=detection.created_at.isoformat()
    )
