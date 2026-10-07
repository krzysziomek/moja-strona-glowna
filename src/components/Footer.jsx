import React from 'react';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#ffffff' }}>
          Cześć, Jestem Krzyś
        </h3>
        <p className="footer-bio">
          Od zawsze lubiłem robić zdjęcia, teraz możecie je zobaczyć.
        </p>

        <div className="footer-copy">
          &copy; {new Date().getFullYear()} Zdjęcia Krzysia
        </div>
      </div>
    </footer>
  );
}
