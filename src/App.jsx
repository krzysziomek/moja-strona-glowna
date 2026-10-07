import React, { useState, useEffect, useMemo, useCallback } from 'react';

import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import CategoryNav from './components/CategoryNav.jsx';
import CollectionCard from './components/CollectionCard.jsx';
import GalleryView from './components/GalleryView.jsx';
import Lightbox from './components/Lightbox.jsx';
import ContactModal from './components/ContactModal.jsx';
import AddGuideModal from './components/AddGuideModal.jsx';
import Footer from './components/Footer.jsx';
import { Camera, Sparkles, FilterX, Loader2 } from 'lucide-react';

export default function App() {
  const [collections, setCollections] = useState([]);
  const [loadingCollections, setLoadingCollections] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCollectionId, setActiveCollectionId] = useState(null);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [contactOpen, setContactOpen] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);

  useEffect(() => {
    // Dynamic import allows code-splitting the large catalog JSON
    import('./data/collections.json')
      .then((mod) => {
        setCollections(mod.default || []);
        setLoadingCollections(false);
      })
      .catch((err) => {
        console.error('Failed to load collections:', err);
        setLoadingCollections(false);
      });
  }, []);

  // Sync with window.location.hash for deep-linking and browser Back/Forward support
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

  // Extract unique categories in custom preferred order
  const categories = useMemo(() => {
    const order = ['Przyrodnicze', 'Wydarzenia', 'Inne'];
    const unique = new Set(collections.map((c) => c.category));
    const sorted = [];
    order.forEach((cat) => {
      if (unique.has(cat)) {
        sorted.push(cat);
        unique.delete(cat);
      }
    });
    // Append any extra new categories
    unique.forEach((cat) => sorted.push(cat));
    return sorted;
  }, [collections]);

  // Compute item counts per category
  const categoryCounts = useMemo(() => {
    const counts = { all: collections.length };
    collections.forEach((c) => {
      counts[c.category] = (counts[c.category] || 0) + 1;
    });
    return counts;
  }, [collections]);

  // Total metrics
  const totalPhotos = useMemo(() => {
    return collections.reduce((acc, c) => acc + (c.itemCount || 0), 0);
  }, [collections]);

  // Filtered collections
  const filteredCollections = useMemo(() => {
    return collections.filter((c) => {
      const matchesCategory =
        selectedCategory === 'all' ||
        c.category.toLowerCase() === selectedCategory.toLowerCase();

      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !query ||
        c.title.toLowerCase().includes(query) ||
        (c.date && c.date.toLowerCase().includes(query)) ||
        c.category.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [collections, selectedCategory, searchQuery]);

  const handleSelectCollection = (col) => {
    window.location.hash = `#/kolekcja/${col.id}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToCollections = () => {
    window.location.hash = '#/';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoHome = () => {
    setActiveCollectionId(null);
    setSelectedCategory('all');
    setSearchQuery('');
    window.location.hash = '#/';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectCategory = (cat) => {
    setSelectedCategory(cat);
    if (activeCollectionId) {
      setActiveCollectionId(null);
    }
    if (cat === 'all') {
      window.location.hash = '#/';
    } else {
      window.location.hash = `#/kategoria/${encodeURIComponent(cat)}`;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar
        onOpenContact={() => setContactOpen(true)}
        onOpenGuide={() => setGuideOpen(true)}
        onGoHome={handleGoHome}
        currentCollection={activeCollection}
      />

      <main style={{ flex: 1 }}>
        {loadingCollections ? (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '120px 20px',
            gap: '16px',
            color: 'var(--text-secondary)'
          }}>
            <Loader2 size={36} style={{ animation: 'spin 1s linear infinite', color: 'var(--accent-blue)' }} />
            <p style={{ fontWeight: 600 }}>Ładowanie galerii zdjęć...</p>
          </div>
        ) : activeCollection ? (
          <GalleryView
            collection={activeCollection}
            onBack={handleBackToCollections}
            onOpenPhoto={(idx) => setLightboxIndex(idx)}
          />
        ) : (
          <>
            <Hero
              totalCollections={collections.length}
              totalPhotos={totalPhotos}
              onOpenContact={() => setContactOpen(true)}
              onExplore={() => {
                document.getElementById('explore')?.scrollIntoView({ behavior: 'smooth' });
              }}
            />

            <div className="container">
              <CategoryNav
                categories={categories}
                selectedCategory={selectedCategory}
                onSelectCategory={handleSelectCategory}
                categoryCounts={categoryCounts}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
              />

              {filteredCollections.length > 0 ? (
                <div className="collections-grid">
                  {filteredCollections.map((col) => (
                    <CollectionCard
                      key={col.id}
                      collection={col}
                      onClick={handleSelectCollection}
                    />
                  ))}
                </div>
              ) : (
                <div style={{
                  textAlign: 'center',
                  padding: '64px 20px',
                  background: 'var(--bg-card)',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--border-subtle)',
                  marginBottom: '64px'
                }}>
                  <div style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.05)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--text-muted)',
                    marginBottom: '16px'
                  }}>
                    <FilterX size={26} />
                  </div>
                  <h3 style={{ fontSize: '1.3rem', marginBottom: '8px' }}>Brak wyników</h3>
                  <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>
                    Nie znaleziono kolekcji dla zapytania "{searchQuery}".
                  </p>
                  <button
                    className="btn btn-secondary"
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('all');
                    }}
                  >
                    Wyczyść filtry
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </main>

      {/* Lightbox Modal */}
      {activeCollection && lightboxIndex !== null && (
        <Lightbox
          photos={activeCollection.items}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={(newIdx) => setLightboxIndex(newIdx)}
        />
      )}

      {/* Contact Modal */}
      {contactOpen && (
        <ContactModal onClose={() => setContactOpen(false)} />
      )}

      {/* Add Photos Guide Modal */}
      {guideOpen && (
        <AddGuideModal onClose={() => setGuideOpen(false)} />
      )}

      <Footer
        onOpenContact={() => setContactOpen(true)}
        onSelectCategory={handleSelectCategory}
      />
    </div>
  );
}
