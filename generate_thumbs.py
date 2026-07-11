import os
import shutil
from PIL import Image, ImageOps

# Constants for image resizing
THUMB_MAX_SIZE = (400, 400)      # Bounding box for gallery grid
MEDIUM_MAX_SIZE = (1600, 1200)   # Bounding box for lightbox full-screen
THUMB_QUALITY = 75               # WebP quality for thumbs
MEDIUM_QUALITY = 80              # WebP quality for medium images

CATEGORIES = ["photos-retouchees", "photos-invitees", "photos-normales"]
BASE_MEDIA_DIR = "media"
ORIGINALS_DIR = os.path.join(BASE_MEDIA_DIR, "originals")
THUMBS_DIR = os.path.join(BASE_MEDIA_DIR, "thumbs")
MEDIUM_DIR = os.path.join(BASE_MEDIA_DIR, "medium")
VIDEOS_DIR = os.path.join(BASE_MEDIA_DIR, "videos")
OUTPUT_JS_FILE = "media_list.js"

IMAGE_EXTENSIONS = ('.jpg', '.jpeg', '.png', '.webp', '.gif', '.tiff', '.bmp')

def init_directories():
    # Make sure target dirs exist
    for category in CATEGORIES:
        os.makedirs(os.path.join(ORIGINALS_DIR, category), exist_ok=True)
        os.makedirs(os.path.join(THUMBS_DIR, category), exist_ok=True)
        os.makedirs(os.path.join(MEDIUM_DIR, category), exist_ok=True)

def migrate_new_files():
    # Check if user placed raw photos in standard folders, and move them to originals/
    for category in CATEGORIES:
        source_dir = os.path.join(BASE_MEDIA_DIR, category)
        if not os.path.exists(source_dir):
            continue
        
        target_originals_dir = os.path.join(ORIGINALS_DIR, category)
        
        for filename in os.listdir(source_dir):
            file_path = os.path.join(source_dir, filename)
            # Skip directories
            if os.path.isdir(file_path):
                continue
            
            # Move image files
            if filename.lower().endswith(IMAGE_EXTENSIONS):
                target_path = os.path.join(target_originals_dir, filename)
                # If file already exists in originals, add a suffix to prevent overwrite collisions
                if os.path.exists(target_path):
                    base, ext = os.path.splitext(filename)
                    counter = 1
                    while os.path.exists(os.path.join(target_originals_dir, f"{base}_{counter}{ext}")):
                        counter += 1
                    target_path = os.path.join(target_originals_dir, f"{base}_{counter}{ext}")
                
                print(f"Migrating new original: {filename} -> originals/{category}/")
                shutil.move(file_path, target_path)

def process_image(src_path, thumb_path, medium_path):
    try:
        # Check if output files already exist and are newer than source to skip reprocessing
        if os.path.exists(thumb_path) and os.path.exists(medium_path):
            src_mtime = os.path.getmtime(src_path)
            thumb_mtime = os.path.getmtime(thumb_path)
            medium_mtime = os.path.getmtime(medium_path)
            if thumb_mtime > src_mtime and medium_mtime > src_mtime:
                # We still need aspect ratio of the cached image, load it quickly from metadata
                with Image.open(src_path) as img:
                    # Resolve EXIF rotation for aspect ratio calculation
                    img = ImageOps.exif_transpose(img)
                    w, h = img.size
                    return float(w) / float(h), True
        
        # Load and auto-orient the image
        with Image.open(src_path) as img:
            img = ImageOps.exif_transpose(img)
            w, h = img.size
            aspect_ratio = float(w) / float(h)
            
            # 1. Save Medium Image
            medium_img = img.copy()
            medium_img.thumbnail(MEDIUM_MAX_SIZE, Image.Resampling.LANCZOS)
            medium_img.save(medium_path, "WEBP", quality=MEDIUM_QUALITY)
            
            # 2. Save Thumbnail Image
            thumb_img = img.copy()
            thumb_img.thumbnail(THUMB_MAX_SIZE, Image.Resampling.LANCZOS)
            thumb_img.save(thumb_path, "WEBP", quality=THUMB_QUALITY)
            
            return aspect_ratio, False
    except Exception as e:
        print(f"Error processing image {src_path}: {e}")
        return None, False

def run():
    print("Initializing directories...")
    init_directories()
    
    print("Checking for new files to migrate...")
    migrate_new_files()
    
    media_data = {
        "photosRetouchees": [],
        "photosInvitees": [],
        "photosNormales": [],
        "highlightVideo": ""
    }
    
    # Process each category
    for category in CATEGORIES:
        originals_cat_dir = os.path.join(ORIGINALS_DIR, category)
        key = "photosRetouchees" if category == "photos-retouchees" else ("photosInvitees" if category == "photos-invitees" else "photosNormales")
        
        if not os.path.exists(originals_cat_dir):
            continue
        
        files = sorted(os.listdir(originals_cat_dir))
        image_files = [f for f in files if f.lower().endswith(IMAGE_EXTENSIONS)]
        
        print(f"Processing {len(image_files)} images in '{category}'...")
        processed_count = 0
        skipped_count = 0
        
        for filename in image_files:
            src_path = os.path.join(originals_cat_dir, filename)
            base_name, _ = os.path.splitext(filename)
            
            # Webp output paths
            thumb_filename = f"{base_name}.webp"
            thumb_path = os.path.join(THUMBS_DIR, category, thumb_filename)
            medium_path = os.path.join(MEDIUM_DIR, category, thumb_filename)
            
            # Generate WebPs
            res = process_image(src_path, thumb_path, medium_path)
            if res:
                aspect_ratio, skipped = res
                if skipped:
                    skipped_count += 1
                else:
                    processed_count += 1
                
                # Paths relative to the project root for JS consumption
                js_thumb = f"media/thumbs/{category}/{thumb_filename}".replace("\\", "/")
                js_medium = f"media/medium/{category}/{thumb_filename}".replace("\\", "/")
                js_original = f"media/originals/{category}/{filename}".replace("\\", "/")
                
                media_data[key].append({
                    "thumb": js_thumb,
                    "medium": js_medium,
                    "original": js_original,
                    "aspectRatio": round(aspect_ratio, 3)
                })
        
        print(f"Finished '{category}': {processed_count} generated, {skipped_count} skipped.")
    
    # Check for highlight video
    video_file = ""
    if os.path.exists(VIDEOS_DIR):
        videos = sorted(os.listdir(VIDEOS_DIR))
        video_files = [v for v in videos if v.lower().endswith(('.mp4', '.webm', '.mov'))]
        if video_files:
            # Match the first mp4 video
            video_file = f"media/videos/{video_files[0]}".replace("\\", "/")
            media_data["highlightVideo"] = video_file
            
    # Write to media_list.js
    print(f"Writing registry to {OUTPUT_JS_FILE}...")
    import json
    
    js_content = f"""// Automatically generated by generate_thumbs.py
// Do not edit manually. Run the Python script to regenerate.
window.MEDIA_DATA = {json.dumps(media_data, indent=4)};
"""
    
    with open(OUTPUT_JS_FILE, "w", encoding="utf-8") as f:
        f.write(js_content)
        
    print("Successfully finished thumbnail generation and wrote registry file!")

if __name__ == "__main__":
    run()
