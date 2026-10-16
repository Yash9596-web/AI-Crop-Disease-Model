import io
import sys
from pathlib import Path
import pytest
from PIL import Image
from fastapi.testclient import TestClient

# Add backend directory to sys.path
BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BASE_DIR))

from main import app
from database.seed import seed_database

client = TestClient(app)

@pytest.fixture(scope="session", autouse=True)
def setup_database():
    seed_database()

def create_test_leaf_image(width=300, height=300, color=(45, 106, 79)):
    """Helper to create an in-memory synthetic leaf image with texture."""
    img = Image.new("RGB", (width, height), color)
    # Add variations / texture across the image
    pixels = img.load()
    for x in range(width):
        for y in range(height):
            if (x + y) % 15 == 0:
                pixels[x, y] = (150, 100, 50)  # necrotic lesion spot
            elif (x * y) % 23 == 0:
                pixels[x, y] = (200, 180, 50)  # chlorotic yellowing
    buf = io.BytesIO()
    img.save(buf, format="JPEG")
    buf.seek(0)
    return buf

# 1. Health Check Test
def test_health_check():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "AI Crop Disease Detection" in data["service"]

# 2. Authentication Flow Test
def test_auth_register_and_login():
    email = "testfarmer@agriculture.org"
    password = "StrongPassword@123"

    # Register
    reg_res = client.post("/api/auth/register", json={
        "name": "Kishan Kumar",
        "email": email,
        "password": password,
        "phone": "+91 99988 77766",
        "preferred_language": "hi"
    })
    assert reg_res.status_code in [201, 400]  # 400 if already exists

    # Login
    login_res = client.post("/api/auth/login", json={
        "email": email,
        "password": password
    })
    assert login_res.status_code == 200
    token_data = login_res.json()
    assert "access_token" in token_data
    token = token_data["access_token"]

    # Profile
    prof_res = client.get("/api/auth/profile", headers={"Authorization": f"Bearer {token}"})
    assert prof_res.status_code == 200
    profile = prof_res.json()
    assert profile["name"] == "Kishan Kumar"
    assert profile["email"] == email

# 3. Demo Logins
def test_demo_logins():
    farmer_demo = client.post("/api/auth/demo-login/farmer")
    assert farmer_demo.status_code == 200
    assert farmer_demo.json()["user"]["role"] == "farmer"

    admin_demo = client.post("/api/auth/demo-login/admin")
    assert admin_demo.status_code == 200
    assert admin_demo.json()["user"]["role"] == "admin"

# 4. Crops and Diseases Knowledgebase
def test_get_crops_and_diseases():
    crops_res = client.get("/api/crops")
    assert crops_res.status_code == 200
    crops = crops_res.json()
    assert len(crops) >= 8
    crop_names = [c["name"] for c in crops]
    assert "Tomato" in crop_names
    assert "Potato" in crop_names

    # Get diseases for Tomato
    tomato_id = next(c["id"] for c in crops if c["name"] == "Tomato")
    diseases_res = client.get(f"/api/crops/{tomato_id}/diseases")
    assert diseases_res.status_code == 200
    diseases = diseases_res.json()
    assert len(diseases) >= 4
    d_names = [d["name"] for d in diseases]
    assert "Early Blight" in d_names

# 5. Image Validation Error Handling
def test_image_validation_errors():
    # Unsupported file type (text file disguised or txt)
    invalid_file = io.BytesIO(b"not an image file content")
    res = client.post(
        "/api/predict",
        files={"image": ("bad.txt", invalid_file, "text/plain")},
        data={"crop_type": "Tomato"}
    )
    assert res.status_code == 400
    assert "supported image format" in res.json()["detail"].lower()

    # Corrupted / Too small
    tiny_file = io.BytesIO(b"tiny")
    res_tiny = client.post(
        "/api/predict",
        files={"image": ("tiny.jpg", tiny_file, "image/jpeg")},
        data={"crop_type": "Tomato"}
    )
    assert res_tiny.status_code == 400

# 6. Real Prediction API Test
def test_predict_leaf_disease():
    image_buf = create_test_leaf_image()
    res = client.post(
        "/api/predict",
        files={"image": ("test_leaf.jpg", image_buf, "image/jpeg")},
        data={"crop_type": "Tomato"}
    )
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True
    assert "crop" in data
    assert "disease" in data
    assert 0.0 <= data["confidence"] <= 1.0
    assert data["confidence_level"] in ["High", "Medium", "Low"]
    assert len(data["symptoms"]) > 0
    assert "immediate_actions" in data["treatment"]
    assert len(data["treatment"]["immediate_actions"]) > 0
    assert "spacing" in data["prevention"]
    assert "initial screening" in data["safety_disclaimer"].lower()

# 7. Detection History & Filtering
def test_detection_history_and_detail():
    res = client.get("/api/detections")
    assert res.status_code == 200
    detections = res.json()
    assert len(detections) > 0

    first_id = detections[0]["id"]
    detail_res = client.get(f"/api/detections/{first_id}")
    assert detail_res.status_code == 200
    detail = detail_res.json()
    assert detail["id"] == first_id
    assert "crop_name" in detail
    assert "disease_name" in detail

    # Filter by Crop
    crop_res = client.get("/api/detections?crop=Tomato")
    assert crop_res.status_code == 200
    for d in crop_res.json():
        assert "tomato" in d["crop_name"].lower()

# 8. Farmer Dashboard Stats
def test_dashboard_stats():
    res = client.get("/api/detections/dashboard/stats")
    assert res.status_code == 200
    stats = res.json()
    assert stats["total_scans"] >= 1
    assert "most_common_disease" in stats
    assert isinstance(stats["recent_detections"], list)

# 9. Admin Authorization and Statistics
def test_admin_permissions_and_stats():
    # Regular farmer token
    farmer_demo = client.post("/api/auth/demo-login/farmer").json()
    f_token = farmer_demo["access_token"]

    # Admin route should return 403 Forbidden for farmer
    forbidden_res = client.get("/api/admin/statistics", headers={"Authorization": f"Bearer {f_token}"})
    assert forbidden_res.status_code == 403

    # Admin token
    admin_demo = client.post("/api/auth/demo-login/admin").json()
    a_token = admin_demo["access_token"]

    # Admin route should succeed
    admin_res = client.get("/api/admin/statistics", headers={"Authorization": f"Bearer {a_token}"})
    assert admin_res.status_code == 200
    admin_stats = admin_res.json()
    assert admin_stats["total_scans"] >= 1
    assert "scans_by_crop" in admin_stats
    assert "model_version" in admin_stats

# 10. Admin Update Disease Guidance
def test_admin_update_disease_guidance():
    admin_demo = client.post("/api/auth/demo-login/admin").json()
    a_token = admin_demo["access_token"]

    diseases = client.get("/api/admin/diseases", headers={"Authorization": f"Bearer {a_token}"}).json()
    assert len(diseases) > 0
    target_disease = diseases[0]

    update_res = client.put(
        f"/api/admin/diseases/{target_disease['id']}",
        headers={"Authorization": f"Bearer {a_token}"},
        json={
            "immediate_actions": ["Isolate immediately", "Alert regional extension officer"],
            "chemical_disclaimer": "Strictly wear protective gloves and respirator mask."
        }
    )
    assert update_res.status_code == 200
    assert update_res.json()["success"] is True
