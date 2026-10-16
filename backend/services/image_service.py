"""
AI Crop Disease Detection - Image Validation & Processing Service
Validates file type, size, dimensions, readability, and blurriness.
Compresses and creates optimized WebP thumbnails.
"""

import os
import uuid
import datetime
from pathlib import Path
from typing import Tuple, Dict, Any
from PIL import Image, ImageOps, ImageStat
from fastapi import UploadFile, HTTPException
from config import settings

class ImageProcessingService:
    def __init__(self):
        self.upload_dir = Path(settings.UPLOAD_DIR)
        self.upload_dir.mkdir(parents=True, exist_ok=True)
        self.thumbnails_dir = self.upload_dir / "thumbnails"
        self.thumbnails_dir.mkdir(parents=True, exist_ok=True)

    async def validate_and_save(self, file: UploadFile) -> Tuple[Image.Image, str, str]:
        """
        Validates the uploaded file for:
        - Allowed file extension
        - File size <= MAX_IMAGE_SIZE_MB
        - PIL image format and integrity
        - Minimum dimensions (at least 100x100)
        - Readability / blurriness / blank image check

        Returns:
            Tuple of (PIL.Image, full_image_filename, thumbnail_filename)
        """
        # 1. File extension validation
        filename = file.filename or "upload.jpg"
        ext = filename.split(".")[-1].lower()
        if ext not in settings.allowed_extensions_list:
            raise HTTPException(
                status_code=400,
                detail=f"Please upload a supported image format ({', '.join(settings.allowed_extensions_list).upper()})."
            )

        # 2. File size validation
        content = await file.read()
        max_bytes = settings.MAX_IMAGE_SIZE_MB * 1024 * 1024
        if len(content) > max_bytes:
            raise HTTPException(
                status_code=400,
                detail=f"Image size exceeds {settings.MAX_IMAGE_SIZE_MB}MB limit. Please upload a smaller photo."
            )
        if len(content) < 1024:
            raise HTTPException(
                status_code=400,
                detail="The uploaded file appears empty or corrupted. Please upload a clear photo of a crop leaf."
            )

        # 3. PIL image validation & integrity
        import io
        try:
            image = Image.open(io.BytesIO(content))
            image.verify()  # Verifies file header and integrity
            # Reopen because verify() closes the image
            image = Image.open(io.BytesIO(content))
            # Auto-orient if EXIF orientation metadata exists (common in smartphone camera photos)
            image = ImageOps.exif_transpose(image)
        except Exception:
            raise HTTPException(
                status_code=400,
                detail="Could not read the uploaded image. Please ensure it is a valid, uncorrupted photo."
            )

        # 4. Dimension validation
        width, height = image.size
        if width < 100 or height < 100:
            raise HTTPException(
                status_code=400,
                detail="Image resolution is too low for accurate leaf disease diagnosis. Minimum resolution is 100x100 pixels."
            )
        if width > 7000 or height > 7000:
            # Resize giant phone panoramas to max 2048px for performance
            image.thumbnail((2048, 2048), Image.Resampling.LANCZOS)

        # 5. Readability / Blank / Contrast Check
        # Convert to RGB if palette/RGBA
        if image.mode != "RGB":
            image = image.convert("RGB")

        stat = ImageStat.Stat(image)
        # Check standard deviation of colors; only reject completely flat/solid blank images
        max_std = max(stat.stddev)
        if max_std < 2.5:
            raise HTTPException(
                status_code=400,
                detail="The uploaded image appears completely blank or solid. Please upload a clear photo of a plant leaf."
            )

        # 6. Save optimized main image and thumbnail
        unique_id = uuid.uuid4().hex
        main_filename = f"{unique_id}.jpg"
        thumb_filename = f"{unique_id}_thumb.webp"

        main_path = self.upload_dir / main_filename
        thumb_path = self.thumbnails_dir / thumb_filename

        # Save main image with good compression
        image.save(main_path, format="JPEG", quality=88, optimize=True)

        # Generate responsive thumbnail
        thumb_img = image.copy()
        thumb_img.thumbnail((320, 320), Image.Resampling.LANCZOS)
        thumb_img.save(thumb_path, format="WEBP", quality=80)

        return image, main_filename, thumb_filename

    def cleanup_old_images(self, days: int = None):
        """Removes temporary or aged images based on retention policy."""
        days = days or settings.IMAGE_RETENTION_DAYS
        cutoff = datetime.datetime.now() - datetime.timedelta(days=days)
        count = 0
        for f in self.upload_dir.glob("*.*"):
            if f.is_file():
                mtime = datetime.datetime.fromtimestamp(f.stat().st_mtime)
                if mtime < cutoff:
                    try:
                        f.unlink()
                        count += 1
                    except Exception:
                        pass
        return count

image_service = ImageProcessingService()
