import os
import math
from PIL import Image, ImageDraw

OUTPUT_DIR = "sample_images"
os.makedirs(OUTPUT_DIR, exist_ok=True)

def generate_tomato_early_blight():
    img = Image.new("RGB", (500, 500), (245, 245, 240))
    draw = ImageDraw.Draw(img)

    # Leaf base polygon
    leaf_pts = [
        (250, 40), (320, 120), (360, 220), (320, 340), (280, 410),
        (250, 460), (220, 410), (180, 340), (140, 220), (180, 120)
    ]
    draw.polygon(leaf_pts, fill=(58, 125, 68), outline=(35, 80, 45))

    # Midrib & veins
    draw.line([(250, 40), (250, 460)], fill=(74, 160, 87), width=4)
    for y in [120, 180, 240, 300, 360]:
        draw.line([(250, y), (330, y - 30)], fill=(85, 180, 100), width=2)
        draw.line([(250, y), (170, y - 30)], fill=(85, 180, 100), width=2)

    # Early Blight Lesions (Concentric rings with chlorotic yellow halo)
    lesions = [(210, 190, 45), (290, 260, 35), (230, 320, 30)]
    for (cx, cy, r) in lesions:
        # Yellow chlorotic halo
        draw.ellipse([cx - r - 12, cy - r - 12, cx + r + 12, cy + r + 12], fill=(195, 185, 60))
        # Brown necrotic ring
        draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=(120, 75, 40))
        # Concentric rings
        draw.ellipse([cx - r * 0.7, cy - r * 0.7, cx + r * 0.7, cy + r * 0.7], outline=(80, 45, 20), width=2)
        draw.ellipse([cx - r * 0.4, cy - r * 0.4, cx + r * 0.4, cy + r * 0.4], fill=(70, 35, 15))

    path = os.path.join(OUTPUT_DIR, "tomato_early_blight_sample.jpg")
    img.save(path, "JPEG", quality=95)
    print(f"Generated: {path}")

def generate_tomato_healthy():
    img = Image.new("RGB", (500, 500), (245, 245, 240))
    draw = ImageDraw.Draw(img)

    # Leaf base polygon
    leaf_pts = [
        (250, 40), (330, 120), (370, 220), (330, 340), (290, 410),
        (250, 460), (210, 410), (170, 340), (130, 220), (170, 120)
    ]
    draw.polygon(leaf_pts, fill=(45, 135, 60), outline=(25, 95, 40))

    # Midrib & veins
    draw.line([(250, 40), (250, 460)], fill=(75, 175, 90), width=4)
    for y in [110, 170, 230, 290, 350, 400]:
        draw.line([(250, y), (330, y - 25)], fill=(75, 175, 90), width=2)
        draw.line([(250, y), (170, y - 25)], fill=(75, 175, 90), width=2)

    path = os.path.join(OUTPUT_DIR, "tomato_healthy_sample.jpg")
    img.save(path, "JPEG", quality=95)
    print(f"Generated: {path}")

def generate_corn_rust():
    img = Image.new("RGB", (500, 500), (245, 245, 240))
    draw = ImageDraw.Draw(img)

    # Long corn leaf blade
    leaf_pts = [(160, 20), (340, 20), (320, 480), (180, 480)]
    draw.polygon(leaf_pts, fill=(80, 140, 50), outline=(50, 100, 30))

    # Prominent central midrib
    draw.line([(250, 20), (250, 480)], fill=(120, 180, 80), width=6)

    # Reddish-brown powdery rust pustules scattered across blade
    import random
    random.seed(42)
    for _ in range(120):
        px = random.randint(180, 320)
        py = random.randint(40, 460)
        rx = random.randint(3, 7)
        ry = random.randint(5, 12)
        draw.ellipse([px - rx, py - ry, px + rx, py + ry], fill=(185, 75, 25), outline=(130, 45, 15))

    path = os.path.join(OUTPUT_DIR, "corn_rust_sample.jpg")
    img.save(path, "JPEG", quality=95)
    print(f"Generated: {path}")

if __name__ == "__main__":
    generate_tomato_early_blight()
    generate_tomato_healthy()
    generate_corn_rust()
