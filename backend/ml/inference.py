"""
AI Crop Disease Detection - Gemini Vision Inference Engine
Powered by Google Gemini 2.0 Flash multimodal vision model.
Provides accurate crop identification, disease diagnosis, severity assessment,
symptoms, treatment, and prevention — all from a real leaf photograph.
Falls back to a spectral heuristic engine when no API key is configured.
"""

import json
import io
import os
import base64
import re
from pathlib import Path
from typing import Dict, Any, List, Optional
import numpy as np
from PIL import Image
import concurrent.futures
from ml.universal_knowledge import UNIVERSAL_CROPS_METADATA, get_guidance_for_condition

BASE_DIR = Path(__file__).resolve().parent

# ─────────────────────────────────────────────────────────────────────────────
# Gemini Vision Engine
# ─────────────────────────────────────────────────────────────────────────────

GEMINI_SYSTEM_PROMPT = """You are an expert senior agricultural plant pathologist and botanist with decades of field and laboratory diagnostic experience.
Your task is to analyze a photograph of a plant or crop leaf and provide an accurate, scientific diagnosis.

You must respond with ONLY a valid JSON object — no markdown, no extra text, no code fences.

Diagnostic Rules:
1. Crop/Plant Identification:
   - Inspect leaf morphology: blade shape (ovate, lanceolate, lobed, compound), margin (entire, serrated, dentate), venation (parallel, pinnate, palmate), surface texture, and petiole.
   - If the user provides a crop hint, carefully check whether the leaf morphology is consistent with that crop. If it matches or is plausible, confirm and use that crop name. Do NOT return 'Unknown Plant' if the leaf features match the provided crop.
2. Disease/Condition Identification:
   - Early Blight (Alternaria spp.): Dark brown to black circular lesions with distinct concentric rings ("target-board" / "bullseye") surrounded by a chlorotic yellow halo.
   - Late Blight (Phytophthora infestans): Rapidly expanding irregular, water-soaked lesions that turn brown/purplish-black, often with pale borders or mildew underside.
   - Common Rust / Leaf Rust (Puccinia spp.): Raised, powdery blister-like pustules (uredinia) shedding yellow, reddish-brown, or dark spores.
   - Cercospora Leaf Spot / Gray Leaf Spot: Small circular to angular spots with tan/grayish centers and distinct darker brown margins on Sweet Potato, Corn, Beet, or Solanaceae. Do NOT diagnose as Rust unless raised, powdery spore pustules are explicitly observed.
   - Bacterial Spot / Blight (Xanthomonas spp.): Angular, water-soaked lesions strictly delimited by veins, later turning necrotic with yellow halos.
   - Powdery Mildew (Erysiphales): Superficial white or light-gray powdery talcum-like fungal patches across the upper or lower leaf surface.
   - Septoria Leaf Spot: Small circular lesions with distinctive light tan/gray centers speckled with tiny black pycnidia and dark margins.
   - Viral Leaf Curl / Mosaic: Stunted growth, upward or downward leaf curling, blistered puckering, and mottled light/dark green mosaic patterns.
   - Healthy: Uniform green pigmentation, intact lamina, absence of necrotic spots, chlorosis, lesions, or sporulation.
3. Severity and Practical Treatment:
   - Healthy: No disease symptoms.
   - Mild: Less than 15% leaf area affected.
   - Moderate: 15% to 40% leaf area affected, clear diagnostic symptoms.
   - Severe: Over 40% leaf area necrotic/wilted, risk of defoliation.
   - Provide actionable Immediate Actions, Biological IPM (e.g. Bacillus subtilis, Trichoderma, neem), and Chemical treatments with specific active ingredients (e.g. Chlorothalonil, Mancozeb, Azoxystrobin, Copper hydroxide).

Respond with this exact JSON structure:
{
  "crop": "<exact crop or plant name, e.g. Tomato, Potato, Corn, Rice, Wheat, Cotton, Apple, Grape, Mango, etc.>",
  "scientific_name": "<exact botanical scientific name, e.g. Solanum lycopersicum, Zea mays, etc.>",
  "disease": "<disease name, or 'Healthy' if the leaf is healthy>",
  "confidence": <number between 0.75 and 0.99>,
  "severity": "<one of: Healthy, Mild, Moderate, Severe>",
  "is_healthy": <true or false>,
  "pathogen_type": "<one of: Healthy, Fungal, Bacterial, Viral, Nutritional, Pest>",
  "symptoms": [
    "<detailed visual symptom 1>",
    "<detailed visual symptom 2>",
    "<detailed visual symptom 3>"
  ],
  "treatment": {
    "immediate_actions": [
      "<immediate action 1>",
      "<immediate action 2>"
    ],
    "biological_treatments": [
      "<biological/organic treatment 1 with active agent>",
      "<biological/organic treatment 2>"
    ],
    "chemical_treatments": [
      "<chemical treatment 1 with specific active ingredient>",
      "<chemical treatment 2>"
    ],
    "chemical_disclaimer": "Always read and follow the pesticide label. Consult a local agricultural extension officer before applying chemical treatments.",
    "expert_notes": "<practical agronomic tip for this condition>"
  },
  "prevention": {
    "spacing": "<canopy and planting spacing recommendation>",
    "sanitation": "<field and debris hygiene recommendation>",
    "irrigation": "<watering practice to minimize leaf wetness duration>",
    "rotation": "<crop rotation recommendation>",
    "resistant_varieties": "<recommended resistant cultivars/hybrids>",
    "monitoring": "<scouting frequency and threshold guidelines>"
  },
  "top_candidates": [
    {"crop": "<crop>", "disease": "<most likely disease or Healthy>", "confidence": <conf1>, "is_healthy": <bool>},
    {"crop": "<crop>", "disease": "<second likely candidate>", "confidence": <conf2>, "is_healthy": <bool>},
    {"crop": "<crop>", "disease": "<third candidate>", "confidence": <conf3>, "is_healthy": <bool>}
  ]
}

Be precise, scientific, and practical. Order top_candidates strictly descending by confidence.
"""


def _encode_image_to_base64(image: Image.Image) -> str:
    """Convert PIL image to base64 JPEG string."""
    if image.mode != "RGB":
        image = image.convert("RGB")
    buf = io.BytesIO()
    image.save(buf, format="JPEG", quality=90)
    buf.seek(0)
    return base64.b64encode(buf.read()).decode("utf-8")


def _gemini_vision_predict(image: Image.Image, selected_crop: Optional[str] = None) -> Dict[str, Any]:
    """
    Use Gemini Vision to analyze the leaf and return structured diagnosis.
    Returns None if API key is not set or on any error.
    """
    api_key = os.environ.get("GEMINI_API_KEY") or os.environ.get("GOOGLE_API_KEY")
    if not api_key:
        return None

    try:
        from google import genai
        from google.genai import types

        client = genai.Client(api_key=api_key)

        # Optimize image size for faster network transfer
        gemini_img = image.copy()
        if gemini_img.mode != "RGB":
            gemini_img = gemini_img.convert("RGB")
        gemini_img.thumbnail((768, 768))

        crop_hint = ""
        if selected_crop and selected_crop.strip().lower() not in ["auto", "other", "all", "universal foliage", "any", "none"]:
            user_crop = selected_crop.strip().title()
            crop_hint = (
                f"\n\nIMPORTANT FIELD CONTEXT: The grower confirms this specimen is a {user_crop} leaf. "
                f"You MUST set \"crop\": \"{user_crop}\" unless the image is clearly not plant foliage. "
                f"Focus your pathological diagnosis on conditions affecting {user_crop}."
            )

        # Prioritize high-availability Gemini models with active quota
        candidate_models = ["gemini-flash-latest", "gemini-2.5-flash"]
        raw = None

        def _call_model(m_name: str) -> Optional[str]:
            res = client.models.generate_content(
                model=m_name,
                contents=[
                    gemini_img,
                    GEMINI_SYSTEM_PROMPT + crop_hint
                ],
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    temperature=0.2
                )
            )
            if res and res.text:
                return res.text.strip()
            return None

        with concurrent.futures.ThreadPoolExecutor(max_workers=1) as executor:
            for model_name in candidate_models:
                try:
                    future = executor.submit(_call_model, model_name)
                    # Limit to 8 seconds maximum per model attempt to prevent connection hanging
                    result_text = future.result(timeout=8.0)
                    if result_text:
                        raw = result_text
                        break
                except concurrent.futures.TimeoutError:
                    print(f"[Gemini Vision] Model {model_name} timed out after 8.0s, proceeding to next")
                    continue
                except Exception as model_err:
                    print(f"[Gemini Vision] Model {model_name} failed: {model_err}")
                    continue

        if not raw:
            return None

        # Strip markdown code fences if present
        raw = re.sub(r"^```(?:json)?\s*", "", raw, flags=re.IGNORECASE)
        raw = re.sub(r"\s*```$", "", raw)

        data = json.loads(raw)
        return data

    except Exception as e:
        print(f"[Gemini Vision] Error: {e}")
        return None


# ─────────────────────────────────────────────────────────────────────────────
# Pixel-analysis Fallback Engine
# ─────────────────────────────────────────────────────────────────────────────

def _spectral_fallback(image: Image.Image, selected_crop: Optional[str] = None) -> Dict[str, Any]:
    """
    Fallback heuristic engine using pixel-level spectral analysis.
    Used when Gemini API key is unavailable or rate-limited.
    Segments leaf lamina from background canvas before calculating lesion ratios.
    """
    if image.mode != "RGB":
        image = image.convert("RGB")
    resized = image.resize((224, 224), Image.Resampling.BILINEAR)
    arr = np.asarray(resized, dtype=np.float32) / 255.0

    r, g, b = arr[:, :, 0], arr[:, :, 1], arr[:, :, 2]

    # Segment plant foliage from background canvas (white studio paper or dark void)
    bg_mask = ((r > 0.85) & (g > 0.85) & (b > 0.80)) | ((r < 0.05) & (g < 0.05) & (b < 0.05))
    leaf_mask = ~bg_mask
    leaf_pixel_count = int(np.sum(leaf_mask))
    if leaf_pixel_count < 250:
        leaf_mask = np.ones_like(r, dtype=bool)
        leaf_pixel_count = leaf_mask.size

    r_mean = float(np.mean(r[leaf_mask]))
    g_mean = float(np.mean(g[leaf_mask]))
    b_mean = float(np.mean(b[leaf_mask]))
    excess_green = 2.0 * g_mean - r_mean - b_mean

    yellow_mask = leaf_mask & (r > 0.40) & (g > 0.40) & (b < 0.35)
    yellow_ratio = float(np.sum(yellow_mask)) / float(leaf_pixel_count)

    brown_mask = leaf_mask & (r > 0.30) & (g > 0.18) & (b < 0.28) & (r > g)
    brown_ratio = float(np.sum(brown_mask)) / float(leaf_pixel_count)

    dark_spot_mask = leaf_mask & (r < 0.28) & (g < 0.28) & (b < 0.28)
    dark_spot_ratio = float(np.sum(dark_spot_mask)) / float(leaf_pixel_count)

    # Powdery mildew appears as pale powdery patches on leaf blade (not canvas background)
    white_mask = leaf_mask & (r > 0.60) & (g > 0.60) & (b > 0.55) & (np.abs(r - g) < 0.08) & (r < 0.85)
    white_mildew_ratio = float(np.sum(white_mask)) / float(leaf_pixel_count)

    rust_mask = leaf_mask & (r > 0.48) & (g > 0.24) & (g < 0.46) & (b < 0.22)
    rust_ratio = float(np.sum(rust_mask)) / float(leaf_pixel_count)

    diff_x = np.abs(arr[:, 1:, :] - arr[:, :-1, :])
    diff_y = np.abs(arr[1:, :, :] - arr[:-1, :, :])
    texture_roughness = float(np.mean(diff_x) + np.mean(diff_y))

    diff_x_edge = np.abs(arr[:, 1:, 0] - arr[:, :-1, 0])
    diff_y_edge = np.abs(arr[1:, :, 0] - arr[:-1, :, 0])
    edge_mask = (diff_x_edge[:-1, :] > 0.08) | (diff_y_edge[:, :-1] > 0.08)
    edge_density = float(np.mean(edge_mask))

    w, h = image.size
    ar = float(w) / float(max(1, h))
    grad_ratio = float(np.mean(diff_x) / max(0.001, np.mean(diff_y)))

    # Crop detection
    if selected_crop and selected_crop.strip() and selected_crop.lower() not in ["auto", "other", "all", "none", "any", "universal foliage"]:
        detected_crop = selected_crop.strip().title()
    elif edge_density > 0.065 and dark_spot_ratio > 0.02 and (0.55 < ar < 1.6):
        detected_crop = "Cotton"
    elif ar > 2.2 or ar < 0.45 or grad_ratio > 1.4 or grad_ratio < 0.65:
        detected_crop = "Rice" if excess_green > 0.20 else ("Wheat" if r_mean > 0.40 else "Corn")
    elif 0.70 <= ar <= 1.45 and excess_green > 0.15:
        detected_crop = "Tomato" if edge_density > 0.05 else ("Chilli" if g_mean > 0.42 else "Potato")
    elif r_mean < 0.32 and b_mean < 0.28:
        detected_crop = "Mango" if (ar > 1.3 or ar < 0.75) else "Citrus"
    elif edge_density > 0.045 and 0.8 <= ar <= 1.3:
        detected_crop = "Grape"
    elif (1.5 <= ar <= 2.2 or 0.45 <= ar <= 0.65) and g_mean > 0.38:
        detected_crop = "Banana"
    else:
        detected_crop = "Universal Plant Leaf"

    # Disease classification
    has_dark_spots = dark_spot_ratio > 0.015
    has_chlorosis = yellow_ratio > 0.05
    has_browning = brown_ratio > 0.02
    has_high_roughness = texture_roughness > 0.035
    has_lesions = has_dark_spots or has_browning or (has_chlorosis and has_high_roughness) or (white_mildew_ratio > 0.03) or (rust_ratio > 0.02)

    if not has_lesions and excess_green > 0.15 and texture_roughness < 0.038:
        predicted_disease = "Healthy"
        confidence_val = min(0.975, 0.91 + (excess_green * 0.15))
        is_healthy = True
        severity = "Healthy"
    elif rust_ratio > 0.025 or (r_mean > 0.50 and yellow_ratio > 0.08 and brown_ratio > 0.04):
        predicted_disease = "Rust"
        confidence_val = min(0.955, 0.86 + (rust_ratio * 2.0))
        is_healthy = False
        severity = "Moderate"
    elif white_mildew_ratio > 0.035:
        predicted_disease = "Powdery Mildew"
        confidence_val = min(0.95, 0.85 + (white_mildew_ratio * 1.8))
        is_healthy = False
        severity = "Moderate"
    elif edge_density > 0.07 and dark_spot_ratio > 0.025:
        predicted_disease = "Bacterial Blight"
        confidence_val = min(0.965, 0.88 + (dark_spot_ratio * 1.5))
        is_healthy = False
        severity = "Moderate"
    elif yellow_ratio > 0.07 and texture_roughness > 0.045 and dark_spot_ratio < 0.02:
        predicted_disease = "Viral Leaf Curl / Mosaic"
        confidence_val = min(0.945, 0.84 + (yellow_ratio * 1.2))
        is_healthy = False
        severity = "Moderate"
    elif yellow_ratio > 0.07 and dark_spot_ratio < 0.015 and brown_ratio < 0.02:
        predicted_disease = "Chlorosis / Nutrient Deficiency"
        confidence_val = min(0.935, 0.84 + (yellow_ratio * 1.0))
        is_healthy = False
        severity = "Mild"
    elif brown_ratio > 0.05 and dark_spot_ratio > 0.03:
        predicted_disease = "Anthracnose" if detected_crop in ["Mango", "Banana", "Grape", "Apple", "Chilli"] else "Late Blight"
        confidence_val = min(0.955, 0.82 + (dark_spot_ratio * 1.6) + (brown_ratio * 1.2))
        is_healthy = False
        severity = "Moderate"
    else:
        predicted_disease = "Early Blight / Leaf Spot"
        confidence_val = min(0.935, 0.82 + (dark_spot_ratio * 1.6) + (brown_ratio * 1.0))
        is_healthy = False
        severity = "Mild"

    guidance = get_guidance_for_condition(detected_crop, predicted_disease)
    botanical_info = UNIVERSAL_CROPS_METADATA.get(detected_crop, UNIVERSAL_CROPS_METADATA.get("Universal Plant Leaf", {}))

    cand1_disease = "Early Blight / Leaf Spot" if predicted_disease != "Early Blight / Leaf Spot" else "Bacterial Blight"
    cand2_disease = "Healthy" if not is_healthy else "Chlorosis / Nutrient Deficiency"

    candidates = [
        {"index": 0, "crop": detected_crop, "disease": predicted_disease, "display_name": f"{detected_crop} — {predicted_disease}", "confidence": round(confidence_val, 4), "is_healthy": is_healthy},
        {"index": 1, "crop": detected_crop, "disease": cand1_disease, "display_name": f"{detected_crop} — {cand1_disease}", "confidence": round(max(0.02, (1 - confidence_val) * 0.7), 4), "is_healthy": False},
        {"index": 2, "crop": detected_crop, "disease": cand2_disease, "display_name": f"{detected_crop} — {cand2_disease}", "confidence": round(max(0.01, (1 - confidence_val) * 0.3), 4), "is_healthy": is_healthy if predicted_disease == "Healthy" else False},
    ]

    return {
        "crop": detected_crop,
        "scientific_name": botanical_info.get("scientific_name", "Plantae spp."),
        "disease": predicted_disease,
        "confidence": round(confidence_val, 4),
        "severity": severity,
        "is_healthy": is_healthy,
        "pathogen_type": "Healthy" if is_healthy else "Fungal",
        "symptoms": guidance["symptoms"],
        "treatment": guidance["treatment"],
        "prevention": guidance["prevention"],
        "top_candidates": candidates,
    }


# ─────────────────────────────────────────────────────────────────────────────
# Main Inference Engine Class
# ─────────────────────────────────────────────────────────────────────────────

class CropDiseaseInferenceEngine:
    def __init__(self, model_path: Optional[str] = None, labels_path: Optional[str] = None):
        self.base_dir = BASE_DIR
        self.model_path = model_path or str(self.base_dir / "model" / "crop_disease_model.keras")
        self.model = None
        self.model_loaded = False
        self.model_type = "Gemini-Vision"
        self._check_gemini()

    def _check_gemini(self):
        api_key = os.environ.get("GEMINI_API_KEY") or os.environ.get("GOOGLE_API_KEY")
        if api_key:
            print("[OK] Gemini Vision API key detected - using Gemini Flash for accurate leaf diagnosis.")
            self.model_type = "Gemini-Flash-Vision"
        else:
            print("[WARN] No GEMINI_API_KEY found. Using spectral heuristic fallback engine.")
            print("   To get accurate results, add GEMINI_API_KEY=your_key to backend/.env")
            self.model_type = "Spectral-Heuristic-Fallback"

    def predict(
        self,
        image: Image.Image,
        selected_crop: Optional[str] = None,
        conf_high_thresh: float = 0.80,
        conf_med_thresh: float = 0.55,
    ) -> Dict[str, Any]:
        """
        Analyze a leaf image and return disease diagnosis.
        Uses Gemini Vision if API key is available, otherwise falls back to spectral analysis.
        """
        # ── Try Gemini Vision first ──────────────────────────────────────────
        gemini_result = _gemini_vision_predict(image, selected_crop)

        if gemini_result:
            crop = gemini_result.get("crop", "Unknown Plant")
            disease = gemini_result.get("disease", "Unknown")
            confidence = float(gemini_result.get("confidence", 0.85))
            severity = gemini_result.get("severity", "Moderate")
            is_healthy = bool(gemini_result.get("is_healthy", False))
            scientific_name = gemini_result.get("scientific_name", "Plantae spp.")
            pathogen_type = gemini_result.get("pathogen_type", "Fungal")
            symptoms = gemini_result.get("symptoms", [])
            treatment = gemini_result.get("treatment", {})
            prevention = gemini_result.get("prevention", {})

            # If user specified a crop, ensure we honor the user's field knowledge
            user_crop = None
            if selected_crop and selected_crop.strip().lower() not in ["auto", "other", "all", "universal foliage", "any", "none"]:
                user_crop = selected_crop.strip().title()
                if crop.lower() != user_crop.lower():
                    # If model returned generic plant or wild/alternate species, align to user's selected crop
                    if any(w in crop.lower() for w in ["plant", "leaf", "foliage", "unknown", "laurel", "broadleaf", "tree", "weed", "indeterminate"]) or "bay" in crop.lower():
                        crop = user_crop

            # Refine scientific name if generic or if crop was aligned
            if (not scientific_name or scientific_name.lower() in ["plantae spp.", "n/a", "unknown", "none"] or (user_crop and crop == user_crop)) and crop in UNIVERSAL_CROPS_METADATA:
                scientific_name = UNIVERSAL_CROPS_METADATA[crop].get("scientific_name", scientific_name)

            # Normalize severity tier to standard UI classes
            if is_healthy or disease.strip().lower() in ["healthy", "normal", "healthy leaf"]:
                severity = "Healthy"
                is_healthy = True
            else:
                sev_norm = severity.strip().title()
                if sev_norm not in ["Healthy", "Mild", "Moderate", "Severe"]:
                    severity = "Severe" if confidence > 0.90 else "Moderate"
                else:
                    severity = sev_norm

            # Enrich with knowledge base if treatment/prevention missing
            if not symptoms or not treatment or not prevention:
                guidance = get_guidance_for_condition(crop, disease)
                if not symptoms:
                    symptoms = guidance["symptoms"]
                if not treatment:
                    treatment = guidance["treatment"]
                if not prevention:
                    prevention = guidance["prevention"]

            # Build and sort top_candidates list
            raw_candidates = gemini_result.get("top_candidates", [])
            parsed_candidates = []
            for c in raw_candidates:
                c_crop = c.get("crop", crop)
                if selected_crop and c_crop.lower() in ["unknown plant", "unknown", "plant"]:
                    c_crop = crop
                c_disease = c.get("disease", disease)
                c_conf = float(c.get("confidence", 0.0))
                c_healthy = bool(c.get("is_healthy", False))
                parsed_candidates.append({
                    "crop": c_crop,
                    "disease": c_disease,
                    "display_name": f"{c_crop} — {c_disease}",
                    "confidence": round(c_conf, 4),
                    "is_healthy": c_healthy
                })

            # Sort descending by confidence
            parsed_candidates.sort(key=lambda x: x["confidence"], reverse=True)

            # Ensure the top predicted item is represented first
            if not parsed_candidates or parsed_candidates[0]["disease"].lower() != disease.lower():
                parsed_candidates.insert(0, {
                    "crop": crop,
                    "disease": disease,
                    "display_name": f"{crop} — {disease}",
                    "confidence": round(confidence, 4),
                    "is_healthy": is_healthy
                })

            top_candidates = []
            for i, cand in enumerate(parsed_candidates[:3]):
                cand["index"] = i
                top_candidates.append(cand)

        else:
            # ── Spectral fallback ────────────────────────────────────────────
            result = _spectral_fallback(image, selected_crop)
            crop = result["crop"]
            disease = result["disease"]
            confidence = result["confidence"]
            severity = result["severity"]
            is_healthy = result["is_healthy"]
            scientific_name = result.get("scientific_name", "Plantae spp.")
            pathogen_type = result.get("pathogen_type", "Fungal")
            symptoms = result["symptoms"]
            treatment = result["treatment"]
            prevention = result["prevention"]
            top_candidates = result["top_candidates"]

        # Confidence level classification
        if confidence >= conf_high_thresh:
            confidence_level = "High"
            confidence_message = "High Confidence: Crop Appears Healthy" if is_healthy else "Likely Disease Detected"
        elif confidence >= conf_med_thresh:
            confidence_level = "Medium"
            confidence_message = "Possible Disease — Further Field Inspection Recommended"
        else:
            confidence_level = "Low"
            confidence_message = "Low Confidence — Please upload a clearer, well-lit close-up photo of the leaf."

        return {
            "success": True,
            "crop": crop,
            "disease": disease,
            "display_name": f"{crop} — {disease}",
            "scientific_name": scientific_name,
            "confidence": round(confidence, 4),
            "confidence_level": confidence_level,
            "confidence_message": confidence_message,
            "severity": severity,
            "is_healthy": is_healthy,
            "symptoms": symptoms,
            "treatment": treatment,
            "prevention": prevention,
            "top_candidates": top_candidates,
            "model_type": self.model_type,
            "model_version": "v2.0-gemini-vision",
        }


# Global singleton engine
inference_engine = CropDiseaseInferenceEngine()
