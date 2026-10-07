import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, 
  RotateCcw, Maximize, Minimize, Download, Loader2 
} from 'lucide-react';

export default function Lightbox({ 
  photos, 
  currentIndex, 
  onClose, 
  onNavigate 
}) {
  const [zoom, setZoom] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [loading, setLoading] = useState(true);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const filmstripRef = useRef(null);

  const currentPhoto = photos[currentIndex];

  // Reset zoom & loading when photo changes
  useEffect(() => {
    setZoom(1);
    setLoading(true);
  }, [currentIndex]);

  // Scroll active thumbnail into view in filmstrip
  useEffect(() => {
    if (filmstripRef.current) {
      const activeThumb = filmstripRef.current.children[currentIndex];
      if (activeThumb) {
        activeThumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [currentIndex]);

  // Keyboard navigation
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowLeft') {
      if (currentIndex > 0) onNavigate(currentIndex - 1);
    } else if (e.key === 'ArrowRight') {
      if (currentIndex < photos.length - 1) onNavigate(currentIndex + 1);
    } else if (e.key === '+' || e.key === '=') {
      setZoom((z) => Math.min(z + 0.5, 3));
    } else if (e.key === '-') {
      setZoom((z) => Math.max(z - 0.5, 1));
    } else if (e.key === '0') {
      setZoom(1);
    } else if (e.key === 'f' || e.key === 'F') {
      toggleFullscreen();
    }
  }, [currentIndex, photos.length, onClose, onNavigate]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Prevent body scroll when lightbox is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
        setIsFullscreen(false);
      }
    }
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0 && currentIndex < photos.length - 1) {
        // swipe left -> next
        onNavigate(currentIndex + 1);
      } else if (diff < 0 && currentIndex > 0) {
        // swipe right -> prev
        onNavigate(currentIndex - 1);
      }
    }
  };

  if (!currentPhoto) return null;

  return (
    <div 
      className="lightbox"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Top control bar */}
      <div className="lightbox-topbar">
        <div className="lightbox-counter">
          <span>{currentIndex + 1} / {photos.length}</span>
          <span style={{ margin: '0 8px', color: 'var(--border-medium)' }}>•</span>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{currentPhoto.filename}</span>
        </div>

        <div className="lightbox-controls">
          <button
            className="btn-icon"
            onClick={() => setZoom((z) => Math.min(z + 0.5, 3))}
            title="Powiększ (+)"
            disabled={zoom >= 3}
          >
            <ZoomIn size={18} />
          </button>
          <button
            className="btn-icon"
            onClick={() => setZoom((z) => Math.max(z - 0.5, 1))}
            title="Pomniejsz (-)"
            disabled={zoom <= 1}
          >
            <ZoomOut size={18} />
          </button>
          {zoom > 1 && (
            <button
              className="btn-icon"
              onClick={() => setZoom(1)}
              title="Resetuj powiększenie (0)"
            >
              <RotateCcw size={16} />
            </button>
          )}

          <button
            className="btn-icon"
            onClick={toggleFullscreen}
            title="Pełny ekran (F)"
          >
            {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
          </button>

          <a
            href={currentPhoto.full}
            download={currentPhoto.filename}
            className="btn-icon"
            title="Pobierz zdjęcie"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Download size={18} />
          </a>

          <button
            className="btn-icon"
            onClick={onClose}
            title="Zamknij (Esc)"
            style={{ borderColor: 'rgba(255,255,255,0.2)' }}
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Main Viewport */}
      <div className="lightbox-viewport" onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}>
        {currentIndex > 0 && (
          <button
            className="lightbox-nav-btn lightbox-prev"
            onClick={(e) => {
              e.stopPropagation();
              onNavigate(currentIndex - 1);
            }}
            title="Poprzednie zdjęcie (←)"
          >
            <ChevronLeft size={28} />
          </button>
        )}

        <div 
          className="lightbox-img-wrapper"
          style={{
            transform: `scale(${zoom})`,
            cursor: zoom > 1 ? 'grab' : 'default'
          }}
        >
          {loading && (
            <div style={{ position: 'absolute', color: 'var(--accent-blue)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Loader2 size={32} className="spin" style={{ animation: 'spin 1s linear infinite' }} />
            </div>
          )}
          <img
            src={currentPhoto.full}
            alt={currentPhoto.name}
            className="lightbox-img"
            onLoad={() => setLoading(false)}
            style={{ opacity: loading ? 0.3 : 1, transition: 'opacity 0.2s ease' }}
          />
        </div>

        {currentIndex < photos.length - 1 && (
          <button
            className="lightbox-nav-btn lightbox-next"
            onClick={(e) => {
              e.stopPropagation();
              onNavigate(currentIndex + 1);
            }}
            title="Następne zdjęcie (→)"
          >
            <ChevronRight size={28} />
          </button>
        )}
      </div>

      {/* Bottom Filmstrip Carousel */}
      <div className="lightbox-filmstrip" ref={filmstripRef}>
        {photos.map((p, idx) => (
          <div
            key={p.id || idx}
            className={`filmstrip-thumb ${idx === currentIndex ? 'active' : ''}`}
            onClick={() => onNavigate(idx)}
            title={`Zdjęcie ${idx + 1}`}
          >
            <img src={p.thumb} alt={p.name} loading="lazy" />
          </div>
        ))}
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
