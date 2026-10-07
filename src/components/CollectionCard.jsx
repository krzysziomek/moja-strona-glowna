import React from 'react';
import { Images, ArrowRight } from 'lucide-react';

function getCategoryBadgeClass(category) {
  const cat = (category || '').toLowerCase();
  if (cat.includes('przyrodnicze') || cat.includes('przyroda')) return 'badge-emerald';
  if (cat.includes('wydarzenia') || cat.includes('ludzie') || cat.includes('bieg')) return 'badge-amber';
  return 'badge-blue';
}

export default function CollectionCard({ collection, onClick }) {
  const coverSrc = collection.cover || 'img/rosliny.webp';

  return (
    <article 
      className="collection-card" 
      onClick={() => onClick(collection)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick(collection);
        }
      }}
    >
      <div className="card-media">
        <img 
          src={coverSrc} 
          alt={collection.title}
          className="card-img"
          loading="lazy"
        />
        <div className="card-badges">
          <span className={`badge ${getCategoryBadgeClass(collection.category)}`}>
            {collection.category}
          </span>
          <span className="card-count-badge">
            <Images size={13} />
            <span>{collection.itemCount}</span>
          </span>
        </div>
        <div className="card-media-overlay" />
      </div>

      <div className="card-body">
        <div className="card-header-row">
          <h2 className="card-title">{collection.title}</h2>
          <span className="card-year">{collection.date}</span>
        </div>

        {collection.description && (
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '12px' }}>
            {collection.description}
          </p>
        )}

        <div className="card-footer">
          <span className="card-cta">
            <span>Zobacz galerię</span>
            <ArrowRight size={16} />
          </span>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            {collection.itemCount} zdjęć
          </span>
        </div>
      </div>
    </article>
  );
}
