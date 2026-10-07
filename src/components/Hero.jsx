import React from 'react';
import { Camera, Sparkles, Mail, Compass } from 'lucide-react';

export default function Hero({ totalCollections, totalPhotos, onOpenContact, onExplore }) {
  return (
    <header className="hero">
      <div className="container">
        <div className="hero-tag">
          <Sparkles size={14} />
          <span>Fotografia jest moją pasją</span>
        </div>

        <h1 className="hero-title">
          Cześć, Jestem <span className="gradient-text">Krzyś</span>
        </h1>

        <p className="hero-desc">
          Od zawsze uwielbiałem chwytać chwile aparatem. Zobacz moje reportaże 
          z biegów i festiwali, wyprawy przyrodnicze oraz fotografie dzikiej fauny i flory.
        </p>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="btn btn-primary" onClick={onExplore}>
            <Compass size={18} />
            <span>Odkryj kolekcje</span>
          </button>
          <button className="btn btn-secondary" onClick={onOpenContact}>
            <Mail size={18} />
            <span>Napisz do mnie</span>
          </button>
        </div>

        <div className="hero-stats">
          <div className="hero-stat-item">
            <span className="hero-stat-num">{totalCollections}</span>
            <span className="hero-stat-label">Kolekcji</span>
          </div>
          <div className="hero-stat-item">
            <span className="hero-stat-num">{totalPhotos}+</span>
            <span className="hero-stat-label">Zdjęć</span>
          </div>
          <div className="hero-stat-item">
            <span className="hero-stat-num">2022–2026</span>
            <span className="hero-stat-label">Lata pracy</span>
          </div>
        </div>
      </div>
    </header>
  );
}
