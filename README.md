
## Jak dodać nową kolekcję lub nowe zdjęcia?

Dodawanie zdjęć jest teraz w pełni zautomatyzowane dzięki lokalnemu skryptowi Python (`scripts/process_images.py`).

### Sposób 1: Automatyczne utworzenie nowej kolekcji

Wpisz w terminalu:
```bash
npm run new-collection "Tatry 2026" "Przyrodnicze"
```
Skrypt automatycznie utworzy folder `public/collections/tatry-2026` z plikiem `meta.json`.

Następnie:
1. Przeciągnij swoje zdjęcia (oryginalne `.jpg`, `.png`, `.webp` prosto z aparatu) do folderu:
   `public/collections/tatry-2026/`
2. Uruchom przetwarzanie:
   ```bash
   npm run process-images
   ```
   Skrypt automatycznie:
   - Skonwertuje i przeskaluje zdjęcia do formatu WebP:
     - `fulls/` (1920px - wysoka jakość do powiększenia)
     - `thumbs/` (600px - super szybkie miniaturki)
   - Automatycznie obróci zdjęcia wg czujnika aparatu (EXIF)
   - Przeniesie surowe pliki do podfolderu `raw/`
   - Zaktualizuje bazę `public/data/collections.json`

### Sposób 2: Dodanie zdjęć do istniejącej kolekcji

1. Wrzuć nowe pliki `.jpg` lub `.png` do folderu danej kolekcji, np. `public/collections/park25/`
2. Uruchom:
   ```bash
   npm run process-images
   ```
   Gotowe! Nowe zdjęcia natychmiast pojawią się w galerii.

