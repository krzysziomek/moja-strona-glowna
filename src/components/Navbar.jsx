import React from 'react';
import { Camera, Mail, HelpCircle } from 'lucide-react';
import InstagramIcon from './InstagramIcon.jsx';

export default function Navbar({ onOpenContact, onOpenGuide, onGoHome, currentCollection }) {
  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        <a 
          href="#/" 
          className="nav-brand"
          onClick={(e) => {
            e.preventDefault();
            onGoHome();
          }}
        >
          <div className="nav-logo-badge">
            <Camera size={22} />
          </div>
          <div>
            <span className="nav-title">Zdjęcia Krzysia</span>
            <span className="nav-subtitle">Portfolio Fotograficzne</span>
          </div>
        </a>

        <div className="nav-actions">
          <button 
            className="btn btn-secondary"
            onClick={onOpenGuide}
            title="Jak dodać nowe zdjęcia i kolekcje?"
            style={{ padding: '8px 14px', fontSize: '0.85rem' }}
          >
            <HelpCircle size={16} />
            <span className="hide-on-mobile">Jak dodać zdjęcia?</span>
          </button>

          <a 
            href="https://www.instagram.com/zdjeciakrzysia" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="btn-icon"
            title="Instagram @zdjeciakrzysia"
          >
            <InstagramIcon size={18} />
          </a>

          <button 
            className="btn btn-primary"
            onClick={onOpenContact}
            style={{ padding: '8px 18px' }}
          >
            <Mail size={16} />
            <span>Kontakt</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
