import React, { useState } from 'react';
import { Mail, Copy, Check, X, Send } from 'lucide-react';
import InstagramIcon from './InstagramIcon.jsx';

export default function ContactModal({ onClose }) {
  const [copied, setCopied] = useState(false);
  const email = 'kontaktdokrzysia@gmail.com';

  const handleCopy = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="modal-overlay" onClick={(e) => {
      if (e.target === e.currentTarget) onClose();
    }}>
      <div className="modal-card">
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className="nav-logo-badge" style={{ width: '38px', height: '38px' }}>
              <Mail size={18} />
            </div>
            <h2 className="modal-title">Kontakt</h2>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', fontSize: '0.95rem' }}>
          Jeśli chcesz porozmawiać o zdjęciach, zapytać o sesję lub nawiązać współpracę, 
          śmiało napisz do mnie wiadomość!
        </p>

        {/* Email Box */}
        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-medium)',
          borderRadius: 'var(--radius-lg)',
          padding: '20px',
          marginBottom: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
              Adres e-mail
            </span>
            <button 
              className="btn btn-secondary" 
              onClick={handleCopy}
              style={{ padding: '6px 12px', fontSize: '0.8rem' }}
            >
              {copied ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
              <span>{copied ? 'Skopiowano!' : 'Kopiuj'}</span>
            </button>
          </div>

          <div style={{ 
            fontFamily: 'monospace', 
            fontSize: '1.05rem', 
            fontWeight: 600, 
            color: 'var(--text-main)', 
            wordBreak: 'break-all' 
          }}>
            {email}
          </div>

          <a 
            href={`mailto:${email}`}
            className="btn btn-primary"
            style={{ width: '100%' }}
          >
            <Send size={16} />
            <span>Wyślij wiadomość teraz</span>
          </a>
        </div>

        {/* Instagram Box */}
        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-medium)',
          borderRadius: 'var(--radius-lg)',
          padding: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          flexWrap: 'wrap'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff'
            }}>
              <InstagramIcon size={20} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Instagram</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>@zdjeciakrzysia</div>
            </div>
          </div>

          <a 
            href="https://www.instagram.com/zdjeciakrzysia"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary"
            style={{ padding: '8px 16px', fontSize: '0.85rem' }}
          >
            <span>Odwiedź profil</span>
          </a>
        </div>
      </div>
    </div>
  );
}
