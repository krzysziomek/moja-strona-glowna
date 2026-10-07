import React from 'react';

export default function Header({ onGoHome, title, subtitle }) {
  return (
    <header className="site-header">
      <div className="container">
        <h1
          className="site-title"
          style={{ cursor: 'pointer' }}
          onClick={onGoHome}
        >
          {title || "Zdjęcia Krzysia"}
        </h1>
        <p className="site-subtitle">
          {subtitle || "Fotografia jest moją pasją"}
        </p>
      </div>
    </header>
  );
}
