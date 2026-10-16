import os
from pathlib import Path
from pydantic_settings import BaseSettings
from pydantic import Field

BASE_DIR = Path(__file__).resolve().parent

class Settings(BaseSettings):
    PROJECT_NAME: str = "AI Crop Disease Detection"
    VERSION: str = "1.0.0"
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    PORT: int = 8000
    HOST: str = "0.0.0.0"

    # Database
    DATABASE_URL: str = f"sqlite:///{BASE_DIR / 'crop_disease.db'}"

    # Authentication
    JWT_SECRET: str = "supersecretcropdiseasejwtkey2026agriculturesecuretoken!"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440  # 24 hours

    # Machine Learning
    MODEL_PATH: str = str(BASE_DIR / "ml" / "model" / "crop_disease_model.keras")
    CONFIDENCE_THRESHOLD_HIGH: float = 0.80
    CONFIDENCE_THRESHOLD_MEDIUM: float = 0.55

    # Storage & Uploads
    UPLOAD_DIR: str = str(BASE_DIR / "uploads")
    MAX_IMAGE_SIZE_MB: int = 10
    ALLOWED_IMAGE_EXTENSIONS: str = "jpg,jpeg,png,webp"
    IMAGE_RETENTION_DAYS: int = 30

    # CORS
    CORS_ORIGINS: str = "http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173"

    # Gemini Vision AI
    GEMINI_API_KEY: str = ""

    model_config = {
        "env_file": str(BASE_DIR / ".env"),
        "extra": "ignore"
    }

    @property
    def allowed_extensions_list(self) -> list[str]:
        return [ext.strip().lower().lstrip(".") for ext in self.ALLOWED_IMAGE_EXTENSIONS.split(",")]

    @property
    def cors_origins_list(self) -> list[str]:
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",") if origin.strip()]

    @property
    def resolved_database_url(self) -> str:
        if self.DATABASE_URL.startswith("sqlite:///./"):
            rel_name = self.DATABASE_URL.replace("sqlite:///./", "")
            return f"sqlite:///{BASE_DIR / rel_name}"
        return self.DATABASE_URL

settings = Settings()

# Export Gemini key to os.environ so inference engine can find it
if settings.GEMINI_API_KEY and settings.GEMINI_API_KEY not in ("your_gemini_api_key_here", ""):
    os.environ["GEMINI_API_KEY"] = settings.GEMINI_API_KEY

# Ensure critical directories exist
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
os.makedirs(os.path.dirname(settings.MODEL_PATH), exist_ok=True)
