import React from 'react';
import { X, Sparkles, FolderPlus, ImagePlus, Terminal, Globe, CheckCircle } from 'lucide-react';

export default function AddGuideModal({ onClose }) {
  return (
    <div className="modal-overlay" onClick={(e) => {
      if (e.target === e.currentTarget) onClose();
    }}>
      <div className="modal-card" style={{ maxWidth: '640px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className="nav-logo-badge" style={{ width: '38px', height: '38px', background: 'var(--accent-warm)' }}>
              <Sparkles size={18} />
            </div>
            <h2 className="modal-title">Jak dodać nowe zdjęcia?</h2>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', fontSize: '0.95rem' }}>
          Dodawanie zdjęć i całych nowych kolekcji jest teraz w 100% zautomatyzowane. 
          Nie musisz już ręcznie tworzyć miniaturek ani edytować plików HTML!
        </p>

        {/* Step 1 */}
        <div className="guide-step">
          <div className="guide-step-num">1</div>
          <div className="guide-step-content">
            <div className="guide-step-title">Utwórz nową kolekcję</div>
            <div className="guide-step-text">
              Wpisz w terminalu jedno polecenie:
              <br />
              <span className="code-pill">npm run new-collection "Tatry 2026" "Przyrodnicze"</span>
              <br />
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                (Lub po prostu utwórz nowy folder w <code>public/collections/tatry26</code>)
              </span>
            </div>
          </div>
        </div>

        {/* Step 2 */}
        <div className="guide-step">
          <div className="guide-step-num">2</div>
          <div className="guide-step-content">
            <div className="guide-step-title">Wrzuć zdjęcia z aparatu</div>
            <div className="guide-step-text">
              Przeciągnij swoje oryginalne zdjęcia (<span className="code-pill">.JPG</span>, <span className="code-pill">.PNG</span>) 
              bezpośrednio do folderu nowej kolekcji. Mogą być wielkie pliki prosto z karty pamięci!
            </div>
          </div>
        </div>

        {/* Step 3 */}
        <div className="guide-step">
          <div className="guide-step-num">3</div>
          <div className="guide-step-content">
            <div className="guide-step-title">Uruchom automatyczny skrypt</div>
            <div className="guide-step-text">
              Wpisz w terminalu:
              <br />
              <span className="code-pill">npm run process-images</span>
              <br />
              Skrypt w parę sekund:
              <ul style={{ paddingLeft: '18px', marginTop: '6px', fontSize: '0.85rem' }}>
                <li>Skaluje zdjęcia do WebP 1920px (duże) oraz 600px (miniaturki)</li>
                <li>Automatycznie obraca zdjęcia wg czujnika aparatu (EXIF)</li>
                <li>Aktualizuje bazę danych kolekcji dla strony React</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Step 4 */}
        <div className="guide-step">
          <div className="guide-step-num">4</div>
          <div className="guide-step-content">
            <div className="guide-step-title">Publikacja na zdjeciakrzysia.pl</div>
            <div className="guide-step-text">
              Wystarczy wysłać zmiany do GitHuba:
              <br />
              <span className="code-pill">git add .</span> &nbsp;
              <span className="code-pill">git commit -m "Nowe zdjęcia"</span> &nbsp;
              <span className="code-pill">git push</span>
              <br />
              GitHub Actions automatycznie zbuduje i opublikuje Twoją stronę na GitHub Pages!
            </div>
          </div>
        </div>

        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <button className="btn btn-primary" onClick={onClose} style={{ width: '100%' }}>
            <CheckCircle size={16} />
            <span>Jasne, rozumiem!</span>
          </button>
        </div>
      </div>
    </div>
  );
}
