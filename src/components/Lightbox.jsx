import React, { useEffect, useRef, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Lightbox({ photos, currentIndex, onClose, onNavigate }) {
  const currentPhoto = photos[currentIndex];
  const barRef = useRef(null);

  // Scroll active thumb into view
  useEffect(() => {
    if (barRef.current && barRef.current.children[currentIndex]) {
      barRef.current.children[currentIndex].scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      });
    }
  }, [currentIndex]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') onClose();
    if (e.key === 'ArrowLeft' && currentIndex > 0) onNavigate(currentIndex - 1);
    if (e.key === 'ArrowRight' && currentIndex < photos.length - 1) onNavigate(currentIndex + 1);
  }, [currentIndex, photos.length, onClose, onNavigate]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [handleKeyDown]);

  if (!currentPhoto) return null;

  return (
    <div className="lightbox-overlay">
      {/* Floating close button */}
      <button 
        className="lightbox-close-btn" 
        onClick={onClose} 
        title="Zamknij (Esc)"
      >
        <X size={26} />
      </button>

      {/* Main Image Viewport */}
      <div className="lightbox-main" onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}>
        {currentIndex > 0 && (
          <button
            className="lightbox-arrow lightbox-arrow-left"
            onClick={(e) => {
              e.stopPropagation();
              onNavigate(currentIndex - 1);
            }}
            title="Poprzednie (←)"
          >
            <ChevronLeft size={30} />
          </button>
        )}

        <img
          src={currentPhoto.full}
          alt={currentPhoto.name}
          className="lightbox-image"
        />

        {currentIndex < photos.length - 1 && (
          <button
            className="lightbox-arrow lightbox-arrow-right"
            onClick={(e) => {
              e.stopPropagation();
              onNavigate(currentIndex + 1);
            }}
            title="Następne (→)"
          >
            <ChevronRight size={30} />
          </button>
        )}
      </div>

      {/* Miniaturki na dole */}
      <div className="lightbox-thumbs-bar" ref={barRef}>
        {photos.map((p, idx) => (
          <div
            key={p.id || idx}
            className={`lightbox-bar-thumb ${idx === currentIndex ? 'active' : ''}`}
            onClick={() => onNavigate(idx)}
          >
            <img src={p.thumb} alt={p.name} loading="lazy" />
          </div>
        ))}
      </div>
    </div>
  );
}
