import React from 'react';

export default function CollectionCard({ collection, onEnter }) {
  const coverSrc = collection.cover || 'img/rosliny.webp';

  return (
    <div className="collection-card">
      <img
        src={coverSrc}
        alt={collection.title}
        className="collection-card-img"
        loading="lazy"
        onClick={() => onEnter(collection)}
        style={{ cursor: 'pointer' }}
      />
      <div className="collection-card-body">
        <h2 
          className="collection-card-title"
          onClick={() => onEnter(collection)}
          style={{ cursor: 'pointer' }}
        >
          {collection.title}
        </h2>

        <div className="collection-card-info">
          {collection.category} • {collection.itemCount} zdjęć
        </div>

        <button
          className="collection-enter-btn"
          onClick={() => onEnter(collection)}
        >
          Wchodzę
        </button>
      </div>
    </div>
  );
}
