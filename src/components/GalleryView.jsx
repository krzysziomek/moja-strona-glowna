import React from 'react';
import { ArrowLeft } from 'lucide-react';

export default function GalleryView({ collection, onBack, onOpenPhoto }) {
  if (!collection) return null;

  return (
    <div className="container">
      <div className="gallery-top">
        <div>
          <button 
            className="btn btn-blue"
            onClick={onBack}
            style={{ marginBottom: '14px', padding: '8px 18px' }}
          >
            <ArrowLeft size={18} />
            <span>Wróć do kolekcji</span>
          </button>

          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff' }}>
            {collection.title}
          </h2>
          <p style={{ color: 'var(--text-muted)', marginTop: '4px' }}>
            Kliknij w zdjęcie, aby powiększyć ({collection.itemCount} zdjęć)
          </p>
        </div>
      </div>

      <div className="gallery-photos-grid">
        {collection.items.map((item, index) => (
          <div
            key={item.id || index}
            className="photo-thumb-wrapper"
            onClick={() => onOpenPhoto(index)}
            title={`Powiększ: ${item.name}`}
          >
            <img
              src={item.thumb}
              alt={item.name}
              className="photo-thumb-img"
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
