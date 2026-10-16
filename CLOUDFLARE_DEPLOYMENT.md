# ☁️ Cloudflare Deployment Guide — AI Crop Disease Detection

This project is fully configured for deployment on the **Cloudflare Global Edge Network**.

---

## 🏗️ Architecture Overview

```
                        ┌───────────────────────────────────────────────┐
                        │             Cloudflare Global Edge            │
                        └───────┬───────────────────────────────┬───────┘
                                │                               │
                   (User Requests: /)               (API Requests: /api)
                                ▼                               ▼
            ┌───────────────────────────────────┐   ┌───────────────────────────┐
            │         Cloudflare Pages          │   │     Cloudflare Tunnel     │
            │   (React + Vite + Tailwind CSS)   │   │  (FastAPI Backend Server) │
            │   - Edge Cached Worldwide         │   │  - AI Diagnostic Engine   │
            │   - Zero-Config SSL & DDoS Shield │   │  - Zero Open Ports Needed │
            │   - _redirects & _headers built-in│   │  - Automated Healthchecks │
            └───────────────────────────────────┘   └───────────────────────────┘
```

---

## 🚀 Part 1: Deploy Frontend to Cloudflare Pages

### Option 1A: One-Command CLI Deployment (Fastest)

From the project root on your computer or server:

```bash
cd frontend

# Deploy directly to Cloudflare Pages with Wrangler
npx wrangler pages deploy dist --project-name=ai-crop-disease-detection
```

- When prompted, log in to your Cloudflare account in the browser.
- Cloudflare will upload your pre-built assets in seconds and output your live URL:
  `https://ai-crop-disease-detection.pages.dev`

---

### Option 1B: Automatic GitHub CI/CD Deployment

1. Go to the **Cloudflare Dashboard** → **Workers & Pages** → **Create application** → **Pages** → **Connect to Git**.
2. Select your GitHub repository.
3. Configure the build settings:
   - **Framework preset**: `Vite`
   - **Root directory**: `frontend`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
4. Under **Environment variables**, optionally add:
   - `VITE_API_BASE_URL`: `https://api.yourdomain.com` *(or leave blank to use same-origin proxy)*
5. Click **Save and Deploy**. Cloudflare Pages will build and deploy automatically on every `git push`.

---

## 🔒 Part 2: Connect the Backend with Cloudflare Tunnel (`cloudflared`)

Since the backend is Python FastAPI with PyTorch & Gemini vision models, you can run the backend on any server, computer, or Docker container, and expose it through **Cloudflare Tunnel** with **zero open ports** and full Cloudflare DDoS protection.

### Step-by-Step Tunnel Setup:

1. **Install cloudflared**:
   - Windows: `winget install Cloudflare.cloudflared` or download from [Cloudflare Releases](https://github.com/cloudflare/cloudflared/releases)
   - Linux: `sudo apt-get install cloudflared`
   - Mac: `brew install cloudflare/cloudflare/cloudflared`

2. **Authenticate with Cloudflare**:
   ```bash
   cloudflared tunnel login
   ```

3. **Create a Named Tunnel**:
   ```bash
   cloudflared tunnel create crop-disease-api
   ```

4. **Start your FastAPI backend locally or via Docker**:
   ```bash
   # Option 1: Native Python
   cd backend
   .\venv\Scripts\python.exe -m uvicorn main:app --host 127.0.0.1 --port 8000

   # Option 2: Docker
   docker compose up -d
   ```

5. **Route Tunnel to Port 8000**:
   ```bash
   # Quick public edge tunnel (Instant testing)
   cloudflared tunnel --url http://127.0.0.1:8000
   ```
   *Cloudflare will provide an instant HTTPS URL (e.g. `https://xxxx.trycloudflare.com`) that connects securely to your local FastAPI backend!*

6. **Bind to your Custom Cloudflare Domain (Production)**:
   ```bash
   cloudflared tunnel route dns crop-disease-api api.yourdomain.com
   cloudflared tunnel run crop-disease-api
   ```

---

## ⚙️ Configuration Files Added to the Project

1. **`frontend/public/_redirects`**:
   Ensures single-page application (SPA) client-side routing works on Cloudflare Pages without 404 errors on `/analyze`, `/dashboard`, or `/history`.
   ```
   /*    /index.html   200
   ```

2. **`frontend/public/_headers`**:
   Adds browser security headers (`X-Content-Type-Options`, `X-Frame-Options`) and immutable caching for static assets.

3. **`frontend/wrangler.toml`**:
   Wrangler configuration file for deploying to Cloudflare Pages with `npx wrangler pages deploy dist`.

4. **`frontend/src/services/api.ts`**:
   Supports `import.meta.env.VITE_API_BASE_URL` so Cloudflare Pages can target your backend domain dynamically.
