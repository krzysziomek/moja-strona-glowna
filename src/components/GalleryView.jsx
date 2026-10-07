import React, { useState } from 'react';
import { ArrowLeft, ZoomIn, Images, Calendar, Grid3X3, LayoutGrid } from 'lucide-react';

function getCategoryBadgeClass(category) {
  const cat = (category || '').toLowerCase();
  if (cat.includes('przyrodnicze') || cat.includes('przyroda')) return 'badge-emerald';
  if (cat.includes('wydarzenia') || cat.includes('ludzie') || cat.includes('bieg')) return 'badge-amber';
  return 'badge-blue';
}

export default function GalleryView({ collection, onBack, onOpenPhoto }) {
  const [compactGrid, setCompactGrid] = useState(false);

  if (!collection) return null;

  return (
    <div className="container" style={{ paddingTop: '24px' }}>
      <div className="gallery-header">
        <button 
          onClick={onBack}
          className="btn btn-secondary"
          style={{ marginBottom: '20px', padding: '8px 16px', fontSize: '0.9rem' }}
        >
          <ArrowLeft size={16} />
          <span>Wróć do kolekcji</span>
        </button>

        <div className="gallery-title-row">
          <div>
            <div className="gallery-meta-pills">
              <span className={`badge ${getCategoryBadgeClass(collection.category)}`}>
                {collection.category}
              </span>
              <span className="badge badge-purple">
                <Calendar size={12} />
                <span>{collection.date}</span>
              </span>
              <span className="card-count-badge" style={{ background: 'rgba(255,255,255,0.08)' }}>
                <Images size={13} />
                <span>{collection.itemCount} zdjęć</span>
              </span>
            </div>

            <h1 className="gallery-title" style={{ marginTop: '12px' }}>
              {collection.title}
            </h1>

            {collection.description && (
              <p style={{ color: 'var(--text-secondary)', marginTop: '8px', maxWidth: '700px' }}>
                {collection.description}
              </p>
            )}
          </div>

          <div className="gallery-view-options">
            <button
              className={`btn-icon ${!compactGrid ? 'active' : ''}`}
              onClick={() => setCompactGrid(false)}
              title="Duże kafelki"
              style={{
                borderColor: !compactGrid ? 'var(--accent-blue)' : 'var(--border-subtle)',
                color: !compactGrid ? 'var(--accent-blue)' : 'var(--text-secondary)'
              }}
            >
              <LayoutGrid size={18} />
            </button>
            <button
              className={`btn-icon ${compactGrid ? 'active' : ''}`}
              onClick={() => setCompactGrid(true)}
              title="Kompaktowe kafelki"
              style={{
                borderColor: compactGrid ? 'var(--accent-blue)' : 'var(--border-subtle)',
                color: compactGrid ? 'var(--accent-blue)' : 'var(--text-secondary)'
              }}
            >
              <Grid3X3 size={18} />
            </button>
          </div>
        </div>
      </div>

      <div 
        className="photo-grid"
        style={{
          gridTemplateColumns: compactGrid 
            ? 'repeat(auto-fill, minmax(200px, 1fr))' 
            : undefined
        }}
      >
        {collection.items.map((item, index) => (
          <div
            key={item.id || index}
            className="photo-item"
            onClick={() => onOpenPhoto(index)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onOpenPhoto(index);
              }
            }}
          >
            <img
              src={item.thumb}
              alt={`${collection.title} - ${item.name}`}
              className="photo-thumb"
              loading="lazy"
            />
            <div className="photo-overlay">
              <div className="photo-zoom-icon">
                <ZoomIn size={20} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
