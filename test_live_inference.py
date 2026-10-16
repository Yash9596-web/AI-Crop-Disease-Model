import httpx
import json

BASE_URL = "http://127.0.0.1:8000/api"

def test_inference_on_sample(image_path: str, crop_name: str):
    print(f"\n========================================================")
    print(f"TESTING LIVE INFERENCE: {image_path} (Crop: {crop_name})")
    print(f"========================================================")

    with open(image_path, "rb") as f:
        files = {"image": (image_path, f, "image/jpeg")}
        data = {"crop_type": crop_name}

        with httpx.Client(timeout=60.0) as client:
            response = client.post(f"{BASE_URL}/predict", files=files, data=data)

    if response.status_code != 200:
        print(f"Error {response.status_code}: {response.text}")
        return

    result = response.json()
    print(f"Diagnosis Status      : {result['success']}")
    print(f"Crop Identified       : {result['crop']}")
    print(f"Predicted Condition   : {result['disease']}")
    print(f"Confidence Score      : {(result['confidence'] * 100):.2f}% ({result['confidence_level']})")
    print(f"Certainty Assessment  : {result['confidence_message']}")
    print(f"Severity Tier         : {result['severity']}")
    print(f"Saved Image URL       : {result['image_url']}")

    print("\n[Observed Diagnostic Symptoms]")
    for s in result.get("symptoms", [])[:3]:
        print(f"  • {s}")

    print("\n[Immediate Containment Actions]")
    for a in result.get("treatment", {}).get("immediate_actions", [])[:2]:
        print(f"  • {a}")

    print("\n[Biological / Organic IPM]")
    for b in result.get("treatment", {}).get("biological_treatments", [])[:2]:
        print(f"  • {b}")

    print("\n[Safety Disclaimer]")
    print(f"  \"{result['safety_disclaimer']}\"")

    print("\n[Top Candidate Breakdown]")
    for cand in result.get("top_candidates", [])[:3]:
        print(f"  - {cand['display_name']}: {(cand['confidence'] * 100):.2f}%")

if __name__ == "__main__":
    # Test 1: Diseased Tomato with Early Blight
    test_inference_on_sample("sample_images/tomato_early_blight_sample.jpg", "Tomato")

    # Test 2: Healthy Tomato Foliage
    test_inference_on_sample("sample_images/tomato_healthy_sample.jpg", "Tomato")

    # Test 3: Corn Leaf with Rust
    test_inference_on_sample("sample_images/corn_rust_sample.jpg", "Corn")
