import os
import sys
from pathlib import Path

# Add backend directory to sys.path
sys.path.insert(0, str(Path(__file__).resolve().parent))

from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse, FileResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from config import settings
from database.seed import seed_database
from api.routes_auth import router as auth_router
from api.routes_predict import router as predict_router
from api.routes_detections import router as detections_router
from api.routes_crops import router as crops_router
from api.routes_admin import router as admin_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Seed database and ensure directories exist
    print(f"Starting {settings.PROJECT_NAME} (v{settings.VERSION})...")
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    os.makedirs(os.path.join(settings.UPLOAD_DIR, "thumbnails"), exist_ok=True)
    try:
        seed_database()
    except Exception as e:
        print(f"Warning during seed: {e}")
    yield
    print("Shutting down application...")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Production-grade AI Crop Disease Detection and Treatment Guidance API",
    lifespan=lifespan
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve uploaded crop leaf images
upload_dir_path = Path(settings.UPLOAD_DIR)
upload_dir_path.mkdir(parents=True, exist_ok=True)
app.mount("/api/uploads", StaticFiles(directory=str(upload_dir_path)), name="uploads")

# Include API Routers
app.include_router(auth_router)
app.include_router(predict_router)
app.include_router(detections_router)
app.include_router(crops_router)
app.include_router(admin_router)

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "environment": settings.ENVIRONMENT
    }

# Farmer-friendly Global Exception Handler (Never expose stack traces)
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    print(f"[INTERNAL ERROR] {request.method} {request.url.path}: {exc}")
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "success": False,
            "detail": "Disease analysis is temporarily unavailable or encountered a connection problem. Please try again or check your photo."
        }
    )

# Serve built frontend static files if available (in production / container)
frontend_dist_dir = Path(__file__).resolve().parent.parent / "frontend" / "dist"
if not frontend_dist_dir.exists():
    frontend_dist_dir = Path(__file__).resolve().parent / "dist"

if frontend_dist_dir.exists() and (frontend_dist_dir / "index.html").exists():
    for sub in ["assets", "crops"]:
        sub_path = frontend_dist_dir / sub
        if sub_path.exists():
            app.mount(f"/{sub}", StaticFiles(directory=str(sub_path)), name=f"spa-{sub}")

    @app.get("/{full_path:path}", include_in_schema=False)
    async def serve_spa(full_path: str):
        if full_path.startswith("api") or full_path.startswith("docs") or full_path.startswith("openapi.json"):
            return JSONResponse(status_code=404, content={"detail": "Not found"})
        target_file = frontend_dist_dir / full_path
        if target_file.is_file():
            return FileResponse(target_file)
        return FileResponse(frontend_dist_dir / "index.html")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host=settings.HOST, port=settings.PORT, reload=settings.DEBUG)
