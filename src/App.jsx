import React, { useState, useEffect, useMemo, useCallback } from 'react';

import Header from './components/Header.jsx';
import CategorySwitchers from './components/CategorySwitchers.jsx';
import CollectionCard from './components/CollectionCard.jsx';
import GalleryView from './components/GalleryView.jsx';
import Lightbox from './components/Lightbox.jsx';
import Footer from './components/Footer.jsx';

export default function App() {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('Przyrodnicze');
  const [activeCollectionId, setActiveCollectionId] = useState(null);
  const [lightboxIndex, setLightboxIndex] = useState(null);

  useEffect(() => {
    import('./data/collections.json')
      .then((mod) => {
        setCollections(mod.default || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Błąd ładowania kolekcji:', err);
        setLoading(false);
      });
  }, []);

  // Hash-based navigation for back/forward browser support on GitHub Pages
  const parseHash = useCallback(() => {
    const hash = window.location.hash || '';
    if (hash.startsWith('#/kolekcja/')) {
      const colId = hash.replace('#/kolekcja/', '').split('?')[0];
      setActiveCollectionId(colId);
    } else if (hash.startsWith('#/kategoria/')) {
      const cat = decodeURIComponent(hash.replace('#/kategoria/', ''));
      setSelectedCategory(cat);
      setActiveCollectionId(null);
    } else {
      setActiveCollectionId(null);
    }
  }, []);

  useEffect(() => {
    parseHash();
    window.addEventListener('hashchange', parseHash);
    return () => window.removeEventListener('hashchange', parseHash);
  }, [parseHash]);

  const activeCollection = useMemo(() => {
    if (!activeCollectionId) return null;
    return collections.find((c) => c.id === activeCollectionId) || null;
  }, [collections, activeCollectionId]);

  const filteredCollections = useMemo(() => {
    if (selectedCategory === 'all') return collections;
    return collections.filter(
      (c) => c.category.toLowerCase() === selectedCategory.toLowerCase()
    );
  }, [collections, selectedCategory]);

  const handleSelectCategory = (cat) => {
    setSelectedCategory(cat);
    if (activeCollectionId) {
      setActiveCollectionId(null);
    }
    window.location.hash = `#/kategoria/${encodeURIComponent(cat)}`;
  };

  const handleEnterCollection = (col) => {
    window.location.hash = `#/kolekcja/${col.id}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToCollections = () => {
    window.location.hash = `#/kategoria/${encodeURIComponent(selectedCategory)}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoHome = () => {
    setActiveCollectionId(null);
    setSelectedCategory('Przyrodnicze');
    window.location.hash = '#/';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header
        onGoHome={handleGoHome}
        title="Zdjęcia Krzysia"
        subtitle={activeCollection ? activeCollection.title : "Fotografia jest moją pasją"}
      />

      <main style={{ flex: 1 }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
            Ładowanie zdjęć...
          </div>
        ) : activeCollection ? (
          <GalleryView
            collection={activeCollection}
            onBack={handleBackToCollections}
            onOpenPhoto={(idx) => setLightboxIndex(idx)}
          />
        ) : (
          <div className="container">
            {/* Górne kafelki przełączania kategorii (Przyrodnicze / Wydarzenia / Inne) */}
            <CategorySwitchers
              selectedCategory={selectedCategory}
              onSelectCategory={handleSelectCategory}
            />

            <div className="section-header">
              <h2 className="section-title">
                {selectedCategory === 'all' ? 'Wszystkie kolekcje' : selectedCategory}
              </h2>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  className={`btn btn-outline ${selectedCategory === 'all' ? 'btn-blue' : ''}`}
                  onClick={() => handleSelectCategory('all')}
                  style={{ fontSize: '0.85rem', padding: '6px 14px' }}
                >
                  Pokaż wszystkie ({collections.length})
                </button>
              </div>
            </div>

            <div className="collections-grid">
              {filteredCollections.map((col) => (
                <CollectionCard
                  key={col.id}
                  collection={col}
                  onEnter={handleEnterCollection}
                />
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Lightbox */}
      {activeCollection && lightboxIndex !== null && (
        <Lightbox
          photos={activeCollection.items}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={(newIdx) => setLightboxIndex(newIdx)}
        />
      )}

      <Footer />
    </div>
  );
}
