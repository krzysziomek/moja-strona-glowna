# Zdjęcia Krzysia (zdjeciakrzysia.pl) 📸

Nowoczesne, responsywne portfolio fotograficzne stworzone w **React 19 + Vite 6**, przystosowane do darmowego hostingu na **GitHub Pages** pod własną domeną `zdjeciakrzysia.pl`.

---

## 🚀 Szybki start (uruchomienie lokalne)

```bash
# 1. Instalacja zależności (jeśli jeszcze nie zainstalowano)
npm install

# 2. Uruchomienie serwera deweloperskiego
npm run dev
```

Strona otworzy się pod adresem: `http://localhost:5173/`

---

## 📷 Jak dodać nową kolekcję lub nowe zdjęcia?

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

---

## 🌐 Publikacja na GitHub Pages (zdjeciakrzysia.pl)

Projekt posiada wbudowany workflow **GitHub Actions** (`.github/workflows/deploy.yml`).

Aby opublikować nowe zdjęcia na żywo:
```bash
git add .
git commit -m "Dodano kolekcję Tatry 2026"
git push
```

GitHub Actions automatycznie zbuduje stronę w Vite i opublikuje ją pod domeną **zdjeciakrzysia.pl** w ciągu ~30 sekund.

*(Opcjonalnie możesz też wdrożyć ręcznie za pomocą: `npm run deploy`)*

---

## 📂 Struktura folderów

```text
moja-strona-glowna/
├── .github/workflows/deploy.yml  # Automatyczne wdrożenie na GitHub Pages
├── public/
│   ├── collections/              # Wszystkie kolekcje zdjęć
│   │   ├── park25/
│   │   │   ├── fulls/            # Zdjęcia w pełnej rozdzielczości (WebP 1920px)
│   │   │   ├── thumbs/           # Miniaturki (WebP 600px)
│   │   │   ├── raw/              # Oryginalne pliki z aparatu
│   │   │   └── meta.json         # Tytuł, kategoria, data, okładka
│   │   └── ...
│   ├── data/collections.json     # Automatycznie generowana baza katalogu
│   ├── img/                      # Okładki i ikony strony
│   ├── CNAME                     # Domena zdjeciakrzysia.pl dla GitHub Pages
│   └── 404.html                  # Obsługa routingu SPA na GitHub Pages
├── scripts/
│   └── process_images.py         # Skrypt automatycznego skalowania do WebP
├── src/
│   ├── components/               # Komponenty React (Navbar, Gallery, Lightbox itd.)
│   ├── App.jsx                   # Główna aplikacja z routingiem hash i filtrami
│   └── index.css                 # Stylistyka (ciemny motyw, responsywność)
└── package.json
```

---

## ⚙️ Dostępne polecenia npm

| Polecenie | Opis |
|---|---|
| `npm run dev` | Uruchamia lokalny serwer deweloperski Vite |
| `npm run build` | Buduje zoptymalizowaną wersję produkcyjną do folderu `dist/` |
| `npm run preview` | Podgląd zbudowanej wersji produkcyjnej |
| `npm run process-images` | Przetwarza nowe zdjęcia, konwertuje do WebP i aktualizuje bazę |
| `npm run new-collection` | Tworzy szablon nowej kolekcji (np. `npm run new-collection "Tytuł" "Kategoria"`) |
| `npm run deploy` | Ręczna publikacja do gałęzi `gh-pages` |
