#!/usr/bin/env python3
"""
scripts/process_images.py

Skrypt do automatycznego przetwarzania zdjęć i generowania katalogu dla Zdjęcia Krzysia.

Funkcje:
1. Skanuje foldery kolekcji w public/collections/
2. Automatycznie konwertuje i skaluje nowe zdjęcia (.jpg, .png, .webp itd.):
   - fulls/: max 1920px, WebP (wysoka jakość)
   - thumbs/: max 600px, WebP (szybkie ładowanie)
   - Automatycznie obraca zdjęcia wg EXIF (koniec z obróconymi zdjęciami z aparatu!)
   - Przenosi surowe pliki do podfolderu raw/
3. Zapewnia, że każde zdjęcie ma miniaturkę
4. Generuje bazę danych w public/data/collections.json oraz src/data/collections.json
5. Pozwala łatwo utworzyć nową kolekcję przez flagę --create
"""

import os
import sys
import json
import re
import argparse
from pathlib import Path
from PIL import Image, ImageOps

if sys.platform == 'win32':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
        sys.stderr.reconfigure(encoding='utf-8')
    except Exception:
        pass


SUPPORTED_EXTENSIONS = {'.jpg', '.jpeg', '.png', '.webp', '.bmp', '.tiff', '.tif'}
FULL_MAX_SIZE = 1920
THUMB_MAX_SIZE = 600
FULL_QUALITY = 84
THUMB_QUALITY = 80

def natural_sort_key(s):
    """Sort strings containing numbers in human order (e.g., DSC1, DSC2, DSC10)."""
    return [int(text) if text.isdigit() else text.lower() for text in re.split(r'(\d+)', str(s))]

def slugify(text):
    text = text.lower().strip()
    replacements = {
        'ą': 'a', 'ć': 'c', 'ę': 'e', 'ł': 'l', 'ń': 'n',
        'ó': 'o', 'ś': 's', 'ź': 'z', 'ż': 'z', '/': '-', ' ': '-'
    }
    for k, v in replacements.items():
        text = text.replace(k, v)
    text = re.sub(r'[^a-z0-9\-]', '', text)
    text = re.sub(r'-+', '-', text)
    return text.strip('-')

def resize_and_save(img, max_dim, out_path, quality):
    """Resizes image keeping aspect ratio and saves as WebP."""
    w, h = img.size
    scale = min(max_dim / max(w, h), 1.0)
    new_w = max(1, int(round(w * scale)))
    new_h = max(1, int(round(h * scale)))
    
    if (new_w, new_h) != (w, h):
        resized = img.resize((new_w, new_h), Image.Resampling.LANCZOS)
    else:
        resized = img

    # Ensure RGB or RGBA mode for WebP
    if resized.mode not in ('RGB', 'RGBA'):
        resized = resized.convert('RGB')
        
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    resized.save(out_path, format='WEBP', quality=quality, method=6)
    return new_w, new_h

def process_collection(collection_dir, root_dir):
    slug = collection_dir.name
    meta_path = collection_dir / 'meta.json'
    cache_path = collection_dir / '.cache.json'
    
    meta = {}
    if meta_path.exists():
        try:
            with open(meta_path, 'r', encoding='utf-8') as f:
                meta = json.load(f)
        except Exception as e:
            print(f"  [!] Błąd czytania {meta_path}: {e}")
            
    title = meta.get('title', slug.capitalize())
    category = meta.get('category', 'Inne')
    date = meta.get('date', '2025')
    description = meta.get('description', '')
    specified_cover = meta.get('cover', None)
    
    fulls_dir = collection_dir / 'fulls'
    thumbs_dir = collection_dir / 'thumbs'
    raw_dir = collection_dir / 'raw'
    
    fulls_dir.mkdir(parents=True, exist_ok=True)
    thumbs_dir.mkdir(parents=True, exist_ok=True)

    # 1. Process any new or raw images
    # Check for raw images in root of collection or in raw/
    raw_candidates = []
    for item in collection_dir.iterdir():
        if item.is_file() and item.suffix.lower() in SUPPORTED_EXTENSIONS:
            raw_candidates.append((item, True)) # is in root
            
    if raw_dir.exists() and raw_dir.is_dir():
        for item in raw_dir.iterdir():
            if item.is_file() and item.suffix.lower() in SUPPORTED_EXTENSIONS:
                raw_candidates.append((item, False))

    new_count = 0
    for src_file, is_in_root in raw_candidates:
        base_name = src_file.stem
        target_full = fulls_dir / f"{base_name}.webp"
        target_thumb = thumbs_dir / f"{base_name}.webp"
        
        needs_processing = not target_full.exists() or not target_thumb.exists()
        
        if needs_processing:
            try:
                print(f"  [+] Przetwarzanie nowego zdjęcia: {src_file.name} -> {base_name}.webp")
                with Image.open(src_file) as img:
                    img = ImageOps.exif_transpose(img)
                    resize_and_save(img, FULL_MAX_SIZE, target_full, FULL_QUALITY)
                    resize_and_save(img, THUMB_MAX_SIZE, target_thumb, THUMB_QUALITY)
                    new_count += 1
            except Exception as e:
                print(f"  [!] Błąd przetwarzania {src_file}: {e}")
                
        # If file was in collection root, move it to raw/ so collection folder remains clean
        if is_in_root:
            raw_dir.mkdir(exist_ok=True)
            target_raw = raw_dir / src_file.name
            try:
                if target_raw.exists() and target_raw != src_file:
                    target_raw.unlink()
                src_file.rename(target_raw)
            except Exception as e:
                print(f"  [!] Nie udało się przenieść {src_file.name} do raw/: {e}")

    # 2. Check for any fulls without thumbnails
    for f in fulls_dir.iterdir():
        if f.is_file() and f.suffix.lower() in SUPPORTED_EXTENSIONS:
            t = thumbs_dir / f.name
            if not t.exists():
                try:
                    with Image.open(f) as img:
                        img = ImageOps.exif_transpose(img)
                        resize_and_save(img, THUMB_MAX_SIZE, t, THUMB_QUALITY)
                        print(f"  [+] Wygenerowano brakującą miniaturkę dla: {f.name}")
                except Exception as e:
                    print(f"  [!] Błąd generowania miniaturki dla {f}: {e}")

    # 3. Read image dimensions & cache
    cache = {}
    if cache_path.exists():
        try:
            with open(cache_path, 'r', encoding='utf-8') as f:
                cache = json.load(f)
        except Exception:
            cache = {}

    items = []
    full_files = sorted(
        [f for f in fulls_dir.iterdir() if f.is_file() and f.suffix.lower() == '.webp'],
        key=lambda x: natural_sort_key(x.name)
    )

    cache_updated = False
    for f in full_files:
        name = f.stem
        filename = f.name
        mtime = f.stat().st_mtime
        
        cached = cache.get(filename)
        if cached and cached.get('mtime') == mtime:
            w, h = cached['width'], cached['height']
        else:
            try:
                with Image.open(f) as img:
                    w, h = img.size
                    cache[filename] = {'width': w, 'height': h, 'mtime': mtime}
                    cache_updated = True
            except Exception as e:
                print(f"  [!] Błąd odczytu wymiarów {f}: {e}")
                w, h = 1800, 1200
                
        aspect_ratio = round(w / h, 4) if h > 0 else 1.5
        
        items.append({
            'id': name,
            'name': name,
            'filename': filename,
            'thumb': f"collections/{slug}/thumbs/{filename}",
            'full': f"collections/{slug}/fulls/{filename}",
            'width': w,
            'height': h,
            'aspectRatio': aspect_ratio
        })

    if cache_updated:
        try:
            with open(cache_path, 'w', encoding='utf-8') as f:
                json.dump(cache, f, indent=2)
        except Exception:
            pass

    # 4. Resolve cover image
    cover = specified_cover
    
    # If cover was set to just a filename (e.g. '53.webp')
    if cover and not cover.endswith('/') and '/' not in cover:
        candidate = f"collections/{slug}/thumbs/{cover}"
        if (Path(root_dir) / 'public' / candidate).exists():
            cover = candidate
        elif (fulls_dir / cover).exists():
            cover = f"collections/{slug}/fulls/{cover}"

    # Verify if cover is valid and not just an empty directory ending with '/'
    is_valid_cover = False
    if cover and not cover.endswith('/'):
        if (Path(root_dir) / 'public' / cover).exists() or (Path(root_dir) / cover).exists():
            is_valid_cover = True

    if not is_valid_cover:
        # Check img/<slug>.webp
        img_cover = Path(root_dir) / 'public' / 'img' / f"{slug}.webp"
        if img_cover.exists():
            cover = f"img/{slug}.webp"
        elif items:
            cover = items[0]['thumb']
        else:
            cover = "img/rosliny.webp"
            
    # Save meta if not present or needs updating
    new_meta = {
        'title': title,
        'category': category,
        'date': str(date),
        'cover': cover,
        'description': description
    }
    if new_meta != meta:
        with open(meta_path, 'w', encoding='utf-8') as f:
            json.dump(new_meta, f, ensure_ascii=False, indent=2)

    return {
        'id': slug,
        'slug': slug,
        'title': title,
        'category': category,
        'date': str(date),
        'cover': cover,
        'description': description,
        'itemCount': len(items),
        'items': items
    }, new_count

def parse_create_command(raw_args):
    """
    Inteligentny parser dla komendy tworzenia kolekcji.
    Obsługuje dowolny format:
      npm run new-collection "Nazwa Albumu" "Przyrodnicze"
      python scripts/process_images.py --create Nazwa Albumu Przyrodnicze
      python scripts/process_images.py --create "Nazwa" --category "Wydarzenia"
    """
    if not any(arg in ('--create', '-c', 'create') for arg in raw_args):
        return None

    filtered = []
    category = None
    date_str = None

    i = 0
    while i < len(raw_args):
        arg = raw_args[i]
        if arg in ('--create', '-c', 'create'):
            i += 1
            continue
        if arg in ('--category', '-cat'):
            if i + 1 < len(raw_args):
                category = raw_args[i + 1]
                i += 2
                continue
        if arg in ('--date', '-d'):
            if i + 1 < len(raw_args):
                date_str = raw_args[i + 1]
                i += 2
                continue
        filtered.append(arg)
        i += 1

    words = []
    for item in filtered:
        lower = item.strip().lower()
        if lower in ('przyrodnicze', 'przyroda'):
            if not category:
                category = 'Przyrodnicze'
                continue
        elif lower in ('wydarzenia', 'ludzie'):
            if not category:
                category = 'Wydarzenia'
                continue
        elif lower in ('inne', 'rozne', 'różne'):
            if not category:
                category = 'Inne'
                continue
        elif re.fullmatch(r'20\d\d', item.strip()) and not date_str:
            date_str = item.strip()
            continue
        words.append(item)

    title = " ".join(words).strip()
    if not title:
        title = "Nowa Kolekcja"

    if not category:
        category = "Przyrodnicze"

    if not date_str:
        year_match = re.search(r'\b(20\d\d)\b', title)
        date_str = year_match.group(1) if year_match else "2026"

    return {
        'title': title,
        'category': category,
        'date': date_str
    }

def main():
    repo_root = Path(__file__).resolve().parent.parent
    collections_root = repo_root / 'public' / 'collections'
    collections_root.mkdir(parents=True, exist_ok=True)

    create_info = parse_create_command(sys.argv[1:])

    if create_info:
        title = create_info['title']
        category = create_info['category']
        date_str = create_info['date']
        slug = slugify(title)
        col_dir = collections_root / slug

        if col_dir.exists():
            print(f"\n[!] Kolekcja '{slug}' już istnieje w {col_dir}")
            meta_file = col_dir / 'meta.json'
            if meta_file.exists():
                try:
                    with open(meta_file, 'r', encoding='utf-8') as f:
                        existing = json.load(f)
                    existing['title'] = title
                    existing['category'] = category
                    existing['date'] = date_str
                    with open(meta_file, 'w', encoding='utf-8') as f:
                        json.dump(existing, f, ensure_ascii=False, indent=2)
                    print(f"    Zaktualizowano meta.json: Kategoria={category}, Data={date_str}\n")
                except Exception as e:
                    print(f"    Błąd aktualizacji meta.json: {e}\n")
            return

        col_dir.mkdir(parents=True)
        (col_dir / 'raw').mkdir()
        (col_dir / 'fulls').mkdir()
        (col_dir / 'thumbs').mkdir()

        meta = {
            'title': title,
            'category': category,
            'date': date_str,
            'cover': '',
            'description': ''
        }
        with open(col_dir / 'meta.json', 'w', encoding='utf-8') as f:
            json.dump(meta, f, ensure_ascii=False, indent=2)

        print("\n" + "="*60)
        print(f" Utworzono nową kolekcję: {title}")
        print(f" Folder: {col_dir}")
        print(f" Kategoria: {category} | Data: {date_str}")
        print("="*60)
        print("👉 KROK 1: Wrzuć zdjęcia (JPG, PNG, WebP) do folderu:")
        print(f"          {col_dir}")
        print("👉 KROK 2: Uruchom w terminalu:")
        print("          npm run process-images")
        print("Zdjęcia zostaną automatycznie przeskalowane, przekonwertowane do WebP i dodane do strony!\n")
        return

    print("======================================================")
    print(" Skanowanie i przetwarzanie kolekcji Zdjęcia Krzysia...")
    print("======================================================")

    collections = []
    total_new = 0
    total_photos = 0

    col_dirs = sorted([d for d in collections_root.iterdir() if d.is_dir() and not d.name.startswith('.')])

    for col_dir in col_dirs:
        col_data, new_count = process_collection(col_dir, repo_root)
        collections.append(col_data)
        total_new += new_count
        total_photos += col_data['itemCount']
        print(f"[{col_data['category']:<12}] {col_data['title']:<28} ({col_data['itemCount']} zdjęć)")

    # Sort collections by date descending, then title
    collections.sort(key=lambda c: (str(c.get('date', '0')), c.get('title', '')), reverse=True)

    # Save to public/data/collections.json and src/data/collections.json
    data_dir_pub = repo_root / 'public' / 'data'
    data_dir_src = repo_root / 'src' / 'data'
    data_dir_pub.mkdir(parents=True, exist_ok=True)
    data_dir_src.mkdir(parents=True, exist_ok=True)

    pub_json_path = data_dir_pub / 'collections.json'
    src_json_path = data_dir_src / 'collections.json'

    with open(pub_json_path, 'w', encoding='utf-8') as f:
        json.dump(collections, f, ensure_ascii=False, indent=2)
    with open(src_json_path, 'w', encoding='utf-8') as f:
        json.dump(collections, f, ensure_ascii=False, indent=2)

    print("------------------------------------------------------")
    print(f" Zakończono sukcesem!")
    print(f" Łącznie kolekcji: {len(collections)}")
    print(f" Łącznie zdjęć:    {total_photos}")
    if total_new > 0:
        print(f" Nowo przetworzone zdjęcia: {total_new}")
    print(f" Baza zapisana w:  public/data/collections.json oraz src/data/collections.json")
    print("======================================================\n")

if __name__ == '__main__':
    main()

