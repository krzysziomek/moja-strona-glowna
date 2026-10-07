import React from 'react';
import { Camera, Mail, Heart } from 'lucide-react';
import InstagramIcon from './InstagramIcon.jsx';

export default function Footer({ onOpenContact, onSelectCategory }) {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div className="nav-logo-badge" style={{ width: '36px', height: '36px' }}>
            <Camera size={18} />
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.2rem' }}>
            Zdjęcia Krzysia
          </span>
        </div>

        <p style={{ maxWidth: '520px', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Fotografia jest moją pasją. Od zawsze lubiłem robić zdjęcia, teraz możecie je zobaczyć.
        </p>

        <div className="footer-links">
          <button 
            className="btn btn-secondary" 
            onClick={() => {
              onSelectCategory('Przyrodnicze');
              document.getElementById('explore')?.scrollIntoView({ behavior: 'smooth' });
            }}
            style={{ padding: '6px 14px', fontSize: '0.85rem' }}
          >
            Przyrodnicze
          </button>
          <button 
            className="btn btn-secondary" 
            onClick={() => {
              onSelectCategory('Wydarzenia');
              document.getElementById('explore')?.scrollIntoView({ behavior: 'smooth' });
            }}
            style={{ padding: '6px 14px', fontSize: '0.85rem' }}
          >
            Wydarzenia
          </button>
          <button 
            className="btn btn-secondary" 
            onClick={() => {
              onSelectCategory('Inne');
              document.getElementById('explore')?.scrollIntoView({ behavior: 'smooth' });
            }}
            style={{ padding: '6px 14px', fontSize: '0.85rem' }}
          >
            Inne
          </button>
          <a
            href="https://www.instagram.com/zdjeciakrzysia"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-icon"
            title="Instagram"
          >
            <InstagramIcon size={16} />
          </a>
          <button
            className="btn-icon"
            onClick={onOpenContact}
            title="Napisz do mnie"
          >
            <Mail size={16} />
          </button>
        </div>

        <div className="footer-copy">
          &copy; {new Date().getFullYear()} Zdjęcia Krzysia. Wszystkie prawa zastrzeżone.
        </div>
      </div>
    </footer>
  );
}
