import os
from PIL import Image, ImageDraw, ImageFont, ImageFilter

REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FAVICON_SRC = os.path.join(REPO_ROOT, "favicon.png")
LOGO_SRC = os.path.join(REPO_ROOT, "templates", "logo.png")

print(f"Working in: {REPO_ROOT}")

# 1. Load base favicon image
fav_img = Image.open(FAVICON_SRC).convert("RGBA")

# Generate resized favicon set
sizes = {
    "favicon-16x16.png": (16, 16),
    "favicon-32x32.png": (32, 32),
    "apple-touch-icon.png": (180, 180),
    "android-chrome-192x192.png": (192, 192),
    "android-chrome-512x512.png": (512, 512),
}

for filename, size in sizes.items():
    out_path = os.path.join(REPO_ROOT, filename)
    resized = fav_img.resize(size, Image.Resampling.LANCZOS)
    resized.save(out_path, format="PNG", optimize=True)
    print(f"Generated {filename} ({size[0]}x{size[1]})")

# Generate favicon.ico (multi-size)
ico_path = os.path.join(REPO_ROOT, "favicon.ico")
fav_img.save(ico_path, format="ICO", sizes=[(16, 16), (32, 32), (48, 48)])
print("Generated favicon.ico")

# 2. Compress favicon.png and templates/logo.png
fav_img.save(FAVICON_SRC, format="PNG", optimize=True)
print(f"Compressed {FAVICON_SRC}")

if os.path.exists(LOGO_SRC):
    logo_img = Image.open(LOGO_SRC).convert("RGBA")
    logo_img.save(LOGO_SRC, format="PNG", optimize=True)
    # Also save to root logo.png for consistency
    root_logo = os.path.join(REPO_ROOT, "logo.png")
    logo_img.save(root_logo, format="PNG", optimize=True)
    print(f"Compressed {LOGO_SRC} and updated {root_logo}")

# 3. Generate a beautiful 1200x630 Open Graph Image
WIDTH = 1200
HEIGHT = 630
og = Image.new("RGBA", (WIDTH, HEIGHT), (1, 1, 10, 255))
draw = ImageDraw.Draw(og)

# Background subtle radial gradients / decorative ambient orbs
# Glow 1: Top-right indigo glow
glow_layer = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
glow_draw = ImageDraw.Draw(glow_layer)
glow_draw.ellipse([700, -100, 1300, 500], fill=(79, 70, 229, 60))
glow_draw.ellipse([-150, 200, 450, 800], fill=(124, 58, 237, 50))
glow_layer = glow_layer.filter(ImageFilter.GaussianBlur(80))
og = Image.alpha_composite(og, glow_layer)
draw = ImageDraw.Draw(og)

# Subtle grid lines / border
draw.rectangle([20, 20, WIDTH - 20, HEIGHT - 20], outline=(255, 255, 255, 25), width=1)
draw.rectangle([24, 24, WIDTH - 24, HEIGHT - 24], outline=(79, 70, 229, 40), width=1)

# Try loading system font or fallback
def get_font(font_name, size):
    try:
        return ImageFont.truetype(font_name, size)
    except Exception:
        return ImageFont.load_default()

font_brand = get_font("arialbd.ttf", 34)
font_title = get_font("arialbd.ttf", 52)
font_sub = get_font("arial.ttf", 26)
font_tag = get_font("consola.ttf", 18)
font_badge = get_font("arialbd.ttf", 16)

# Draw Logo on left side
logo_display = fav_img.resize((120, 120), Image.Resampling.LANCZOS)
# Rounded mask for logo
mask = Image.new("L", (120, 120), 0)
mask_draw = ImageDraw.Draw(mask)
mask_draw.rounded_rectangle([0, 0, 120, 120], radius=24, fill=255)
og.paste(logo_display, (80, 80), mask)

# Brand header
draw.text((225, 100), "ALL WE NEED", font=font_brand, fill=(255, 255, 255, 255))
draw.text((225, 145), "AWN_  •  OPEN SOURCE DEVELOPER DIRECTORY", font=font_tag, fill=(165, 180, 252, 220))

# Main Title
draw.text((80, 240), "Stop Paying for Overpriced SaaS.", font=font_title, fill=(255, 255, 255, 255))
draw.text((80, 310), "100+ Curated Free Developer Tools & Alternatives", font=font_sub, fill=(203, 213, 225, 240))
draw.text((80, 350), "Free Hosting, AI Models, Databases, and APIs — Curated by Developers.", font=font_sub, fill=(148, 163, 184, 200))

# Badges / category pills
chips = ["🚀 Free Hosting", "🤖 AI & Models", "⚡ Fast APIs", "💾 Free Databases", "🛡️ Open Source", "⭐ 100% Free"]
chip_x = 80
chip_y = 425
for chip in chips:
    bbox = draw.textbbox((chip_x, chip_y), chip, font=font_badge)
    w = bbox[2] - bbox[0] + 28
    h = 36
    draw.rounded_rectangle([chip_x, chip_y, chip_x + w, chip_y + h], radius=18, fill=(30, 30, 60, 200), outline=(255, 255, 255, 40), width=1)
    draw.text((chip_x + 14, chip_y + 9), chip, font=font_badge, fill=(224, 231, 255, 255))
    chip_x += w + 12

# Footer URL & Verification
draw.line([(80, 520), (WIDTH - 80, 520)], fill=(255, 255, 255, 30), width=1)
draw.text((80, 545), "allweneed.pages.dev", font=font_brand, fill=(129, 140, 248, 255))
draw.text((WIDTH - 420, 552), "github.com/sablekunal/all_we_need", font=font_tag, fill=(148, 163, 184, 200))

# Save OG Image to root and docs
og_rgb = og.convert("RGB")
og_path = os.path.join(REPO_ROOT, "og-image.png")
og_rgb.save(og_path, format="PNG", optimize=True)
print(f"Generated {og_path} (1200x630)")

# Also copy to docs if docs exists
docs_dir = os.path.join(REPO_ROOT, "docs")
if os.path.exists(docs_dir):
    og_rgb.save(os.path.join(docs_dir, "og-image.png"), format="PNG", optimize=True)
    for filename in list(sizes.keys()) + ["favicon.ico"]:
        src = os.path.join(REPO_ROOT, filename)
        if os.path.exists(src):
            with open(src, "rb") as fsrc, open(os.path.join(docs_dir, filename), "wb") as fdst:
                fdst.write(fsrc.read())
    print("Synchronized all favicon and og-image assets to docs/")
