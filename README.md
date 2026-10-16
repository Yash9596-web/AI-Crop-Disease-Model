# AI Crop Disease Detection 🌾🌱

> **“Detect crop diseases early. Protect your harvest smarter.”**

A complete, production-ready, full-stack web application engineered to help farmers, agricultural extension officers, and agronomists diagnose crop diseases early by uploading or capturing leaf photographs. The system performs computer vision convolutional neural network (CNN) analysis, evaluates multi-tiered confidence thresholds, and returns instant agronomic symptom verification, immediate containment actions, biological Integrated Pest Management (IPM), and regulatory-compliant treatment advice.

---

## 📸 Visual Design Identity

Inspired by modern agricultural technology design standards (referencing clean agricultural presentation aesthetics):
- **Primary Color**: Natural Agricultural Green (`#2D6A4F`, `#24693D`)
- **Secondary Colors**: Deep Evergreen (`#1B4332`, `#081C15`), Soft Cream & Clean Mint (`#F8FAF6`, `#E8F2E6`)
- **Severity & Confidence Accents**: Healthy (`#10B981`), Mild/Moderate Warning (`#E28743`), Severe Infestation (`#D9534F`)
- **Typography & Cards**: Plus Jakarta Sans, large touch targets, rounded-3xl cards, soft organic shadows, subtle animated neural scanning beam.
- **Multilingual Foundation**: Out-of-the-box support for **English** and **हिन्दी (Hindi)** with extensible JSON translation dictionaries for Marathi, Tamil, Telugu, and Kannada.

---

## 🚜 System Architecture & Data Flow

```
[ Farmer / Mobile Camera ]
            ↓ (Upload / Drag & Drop Leaf Image)
[ React 18 + Tailwind Frontend ]
            ↓ (Multipart Form Data with Crop Type)
[ FastAPI Microservice API ]
            ↓
    ┌───────┴──────────────────────────────┐
    ↓                                      ↓
[ Image Validation Pipeline ]     [ Auth & Session Guard ]
    ├─ Extension & Header Check            └─ JWT Bearer Token
    ├─ Dimension Check (min 100x100)
    ├─ Readability & Low-Contrast Check
    └─ WebP Compression & Thumbnailing
            ↓
[ CNN / MobileNetV2 Inference Engine ]
    ├─ Tensor Resize (224x224 RGB)
    ├─ Intensity Normalization [0.0, 1.0]
    ├─ Forward Pass (32 Pathogen Classes)
    └─ Multi-Tiered Confidence Evaluator
            ↓
[ Agricultural Knowledgebase & Guidance ]
    ├─ Verified Foliar Symptoms
    ├─ Immediate Containment Protocols
    ├─ Biological / Non-Chemical IPM
    └─ Cautious Chemical Options + Regulatory Disclaimers
            ↓
[ SQLite / PostgreSQL Database ]
    ├─ Stores Detection History, Crop & Severity
    └─ Farmer Dashboard & Audit Logging
```

---

## 🌿 Supported Crops & Pathogens (32 Classes)

The system is configured and seeded with authentic agronomic profiles across 8 major staple and cash crops:

| Crop | Scientific Name | Supported Disease & Health Classes |
| :--- | :--- | :--- |
| **Tomato** | *Solanum lycopersicum* | Early Blight (*Alternaria solani*), Late Blight (*Phytophthora infestans*), Yellow Leaf Curl Virus (TYLCV), Bacterial Spot (*Xanthomonas*), Septoria Leaf Spot, Healthy |
| **Potato** | *Solanum tuberosum* | Early Blight (*Alternaria*), Late Blight (*Phytophthora*), Healthy |
| **Corn** | *Zea mays* | Common Rust (*Puccinia sorghi*), Northern Leaf Blight (*Exserohilum*), Cercospora Leaf Spot, Healthy |
| **Rice** | *Oryza sativa* | Leaf Blast (*Magnaporthe oryzae*), Brown Spot (*Bipolaris oryzae*), Bacterial Leaf Blight, Healthy |
| **Wheat** | *Triticum aestivum* | Leaf Rust (*Puccinia triticina*), Stripe Rust, Powdery Mildew, Healthy |
| **Apple** | *Malus domestica* | Apple Scab (*Venturia inaequalis*), Black Rot (*Botryosphaeria*), Cedar Apple Rust, Healthy |
| **Grape** | *Vitis vinifera* | Black Rot (*Guignardia bidwellii*), Esca (Black Measles), Leaf Blight, Healthy |
| **Cotton** | *Gossypium hirsutum* | Bacterial Blight (*Xanthomonas*), Target Spot, Healthy |

---

## 🛠️ Technology Stack

- **Backend**: Python 3.12, FastAPI, SQLAlchemy ORM, SQLite / PostgreSQL, Pillow, NumPy, Pytest, Python-Jose (JWT), Passlib (Bcrypt).
- **Machine Learning**: TensorFlow / Keras CNN architecture (MobileNetV2 transfer learning backbone), data augmentation pipeline, configurable confidence threshold engine.
- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, Lucide React icons, Axios.
- **Security & A11y**: JWT authentication, hashed passwords, non-technical sanitized error messages, ARIA labels, semantic HTML, mobile touch targets, `prefers-reduced-motion` compliance.

---

## 🚀 Quick Start & Installation

### Prerequisites
- Python 3.10+ (Tested on Python 3.12)
- Node.js 18+ and npm

### 1. Clone & Set Up Backend

```bash
cd backend

# Create and activate virtual environment
python -m venv venv

# Windows:
venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

# Install backend dependencies
pip install -r requirements.txt

# Seed the database with agricultural crops, diseases, guidance, and demo accounts
python database/seed.py

# Run backend development server
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```
Backend API will be running at `http://127.0.0.1:8000`. Interactive OpenAPI documentation is available at `http://127.0.0.1:8000/docs`.

### 2. Set Up Frontend

```bash
cd frontend

# Install node dependencies
npm install

# Start Vite dev server with proxy to backend
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 🔑 Demo Credentials

For instant evaluation without creating a new account:

- **Farmer Account**:
  - Email: `farmer@example.com`
  - Password: `Farmer@123`
  - *Or click "Farmer Demo" in the sign-in modal for 1-click access.*
- **Agronomist Admin Account**:
  - Email: `admin@example.com`
  - Password: `Admin@123`
  - *Or click "Admin Demo" in the sign-in modal.*

---

## 🧠 Machine Learning Architecture & Training Pipeline

The machine learning subsystem is decoupled and modular:
- `backend/ml/labels.json`: Class index mapping 32 crop disease classes.
- `backend/ml/inference.py`: Production inference engine with image tensor scaling (224x224 RGB, float32 [0, 1]) and multi-tiered confidence scoring.
- `backend/ml/model_builder.py`: Constructs the MobileNetV2 transfer learning CNN with customized classification head.
- `backend/ml/training/train.py`: Full training pipeline with data augmentation, learning rate reduction on plateau, early stopping, and checkpointing.
- `backend/ml/evaluation/evaluate.py`: Evaluates accuracy, precision, recall, and confusion matrix on test datasets.

### To Train a New Model:
Organize your dataset into subfolders by class name:
```bash
dataset/
  tomato_early_blight/
    img1.jpg
    ...
  tomato_healthy/
    ...
```
Then execute:
```bash
python backend/ml/training/train.py --dataset_dir ./dataset --output ./backend/ml/model/crop_disease_model.keras --epochs 20
```

---

## 🧪 Automated Testing

Run the full pytest suite (auth, prediction, image validation, history filtering, admin controls):

```bash
backend\venv\Scripts\python.exe -m pytest backend\tests\test_api.py -v
```

All 10 test suites pass with 100% success rate:
- `test_health_check`
- `test_auth_register_and_login`
- `test_demo_logins`
- `test_get_crops_and_diseases`
- `test_image_validation_errors`
- `test_predict_leaf_disease`
- `test_detection_history_and_detail`
- `test_dashboard_stats`
- `test_admin_permissions_and_stats`
- `test_admin_update_disease_guidance`

---

## ⚠️ Agricultural & Safety Disclaimer

This application is designed as an educational screening and decision-support tool. AI predictions should never replace laboratory testing or physical on-site agronomist inspections for severe crop loss. When utilizing chemical plant protection products, farmers must always consult certified local extension officers and comply with legally approved product labels, protective equipment standards, and designated pre-harvest intervals (PHI).

---

## 📄 License
MIT License. Built for agricultural resilience and harvest security.
