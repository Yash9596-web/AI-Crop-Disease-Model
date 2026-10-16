# ===============================================================
# Stage 1: Build Frontend Assets (React + Vite + Tailwind CSS)
# ===============================================================
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend

# Copy frontend package manifests and install dependencies
COPY frontend/package*.json ./
RUN npm ci --silent || npm install --silent

# Copy frontend source code and compile production bundle
COPY frontend/ ./
RUN npm run build

# ===============================================================
# Stage 2: Production Python Backend & Unified Static Server
# ===============================================================
FROM python:3.11-slim AS production

# Set environment variables for high performance & clean logging
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PORT=8000 \
    HOST=0.0.0.0 \
    ENVIRONMENT=production \
    DEBUG=false

# Install minimal OS dependencies for Pillow, image processing and SQLite
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    ca-certificates \
    libglib2.0-0 \
    libgl1 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy backend requirements and install Python packages
COPY backend/requirements.txt ./backend/
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r backend/requirements.txt

# Copy backend application code
COPY backend/ ./backend/

# Copy compiled frontend distribution from Stage 1 into frontend/dist
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

# Ensure persistent uploads and model directories exist
RUN mkdir -p /app/backend/uploads/thumbnails /app/backend/ml/model

# Expose default HTTP port
EXPOSE 8000

# Healthcheck for container orchestration (Cloud Run, ECS, Kubernetes)
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:${PORT:-8000}/api/health || exit 1

# Start FastAPI production server with uvicorn
WORKDIR /app/backend
CMD ["sh", "-c", "python -m uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000} --workers 2"]
