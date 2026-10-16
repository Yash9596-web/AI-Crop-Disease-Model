# 🚀 AI Crop Disease Detection — Production Deployment Guide

This project is configured as a **Unified Full-Stack Application** where a single container or service runs both the high-performance **FastAPI backend** and serves the **React + Vite frontend** with zero CORS complexity.

---

## ⚡ Option 1: Render.com (Recommended Free Cloud Hosting)

Render offers free hosting with automated GitHub builds.

### Step-by-Step Instructions:
1. Push your repository to **GitHub** (public or private).
2. Go to [https://dashboard.render.com](https://dashboard.render.com) and click **"New +"** → **"Web Service"**.
3. Connect your GitHub repository.
4. Render will automatically detect the `render.yaml` or `Dockerfile`:
   - **Environment**: `Docker`
   - **Region**: Choose closest to your audience (e.g., Oregon, Frankfurt, Singapore)
   - **Plan**: `Free`
5. In **Environment Variables**, add:
   - `GEMINI_API_KEY`: *(Your Google AI Studio Gemini API key)*
   - `ENVIRONMENT`: `production`
   - `DEBUG`: `false`
6. Click **"Deploy Web Service"**.
7. Render will build the React frontend and launch the FastAPI server. Your live app will be available at:
   `https://ai-crop-disease-detection.onrender.com`

---

## ⚡ Option 2: Railway.app

1. Go to [https://railway.app](https://railway.app) and sign in with GitHub.
2. Click **"New Project"** → **"Deploy from GitHub repo"**.
3. Select this repository.
4. Railway will automatically detect the `Dockerfile` and `railway.json`.
5. Under **Variables**, add:
   - `GEMINI_API_KEY`: *(Your Google AI Studio Gemini API key)*
   - `PORT`: `8000`
6. Click **"Deploy"**. Railway will generate a public domain (e.g. `your-app.up.railway.app`).

---

## ⚡ Option 3: Local or VPS with Docker Compose

If you have Docker installed on your computer or a Linux VPS (Ubuntu / Debian / AWS EC2 / DigitalOcean Droplet):

### 1. Build and Run:
```bash
# Clone the repository and navigate to folder
cd "AI Crop disease model"

# Set your Gemini API key in environment or .env file
export GEMINI_API_KEY="your-gemini-api-key"

# Build and start container in detached mode
docker compose up --build -d
```

### 2. Access the Application:
- Open your browser to: **`http://localhost:8000/`**
- Check health: **`http://localhost:8000/api/health`**
- Interactive API Docs: **`http://localhost:8000/docs`**

### 3. View Logs or Stop:
```bash
# View real-time logs
docker compose logs -f

# Stop application
docker compose down
```

---

## ⚡ Option 4: Google Cloud Run (Serverless Container)

1. Make sure you have the Google Cloud CLI (`gcloud`) installed.
2. Submit and deploy container:
```bash
# Build with Cloud Build
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/ai-crop-disease

# Deploy to Cloud Run
gcloud run deploy ai-crop-disease \
  --image gcr.io/YOUR_PROJECT_ID/ai-crop-disease \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars="GEMINI_API_KEY=your_key,ENVIRONMENT=production,DEBUG=false"
```

---

## 📋 Environment Variables Reference

| Variable | Required | Default | Description |
| :--- | :--- | :--- | :--- |
| `GEMINI_API_KEY` | Recommended | `""` | Google Gemini Vision API key for multimodal leaf diagnosis |
| `PORT` | Optional | `8000` | Port for the web server |
| `HOST` | Optional | `0.0.0.0` | Bind address |
| `ENVIRONMENT` | Optional | `production` | Set to `production` in live environments |
| `DEBUG` | Optional | `false` | Disable debug logs and reloaders in production |
| `JWT_SECRET` | Optional | Auto-generated | Secret key for farmer/admin authentication tokens |
| `CORS_ORIGINS` | Optional | `*` | Allowed CORS origins for external API access |
