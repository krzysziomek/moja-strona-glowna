import React from 'react';
import { X } from 'lucide-react';

export default function AddGuideModal({ onClose }) {
  return (
    <div className="modal-overlay" onClick={(e) => {
      if (e.target === e.currentTarget) onClose();
    }}>
      <div className="modal-box" style={{ maxWidth: '600px' }}>
        <div className="modal-header">
          <h2>Jak dodać nowe zdjęcia?</h2>
          <button className="lightbox-btn" onClick={onClose}>
            <X size={22} />
          </button>
        </div>

        <div style={{ color: 'var(--text-main)', fontSize: '0.95rem', lineHeight: 1.7 }}>
          <p style={{ marginBottom: '14px' }}>
            <strong>Krok 1: Nowa kolekcja</strong><br />
            Utwórz nowy folder w <code>public/collections/</code> (np. <code>tatry26</code>) lub wpisz w terminalu:
            <br />
            <code style={{ background: '#111827', padding: '4px 8px', borderRadius: '4px', display: 'inline-block', margin: '4px 0', color: '#60a5fa' }}>
              npm run new-collection "Tatry 2026" "Przyrodnicze"
            </code>
          </p>

          <p style={{ marginBottom: '14px' }}>
            <strong>Krok 2: Wrzuć zdjęcia</strong><br />
            Wrzuć zdjęcia prosto z aparatu (pliki .jpg lub .png) bezpośrednio do folderu nowej kolekcji.
          </p>

          <p style={{ marginBottom: '14px' }}>
            <strong>Krok 3: Uruchom skrypt</strong><br />
            Wpisz w terminalu:
            <br />
            <code style={{ background: '#111827', padding: '4px 8px', borderRadius: '4px', display: 'inline-block', margin: '4px 0', color: '#60a5fa' }}>
              npm run process-images
            </code>
            <br />
            Skrypt sam przeskaluje zdjęcia do formatu WebP, utworzy miniaturki i zaktualizuje stronę.
          </p>

          <p style={{ marginBottom: '20px' }}>
            <strong>Krok 4: Zapisz i wyślij na GitHub</strong><br />
            <code style={{ background: '#111827', padding: '4px 8px', borderRadius: '4px', display: 'inline-block', margin: '4px 0', color: '#60a5fa' }}>
              git add . && git commit -m "Nowe zdjęcia" && git push
            </code>
            <br />
            Strona zaktualizuje się automatycznie na <strong>zdjeciakrzysia.pl</strong>.
          </p>
        </div>

        <div style={{ textAlign: 'center' }}>
          <button className="btn btn-blue" onClick={onClose} style={{ width: '100%' }}>
            Zamknij
          </button>
        </div>
      </div>
    </div>
  );
}
