import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function AuthRequiredModal({ isOpen, onClose, actionName = 'perform this action' }) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(8px)',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      animation: 'fadeIn 0.25s ease-out',
    }}>
      <div style={{
        background: 'var(--color-bg-card, #1A1821)',
        border: '1px solid var(--color-accent-rose, #E87296)',
        borderRadius: '24px',
        padding: '32px',
        maxWidth: '420px',
        width: '100%',
        textAlign: 'center',
        boxShadow: '0 20px 50px rgba(0,0,0,0.6), 0 0 40px rgba(232, 114, 150, 0.15)',
        position: 'relative',
      }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'rgba(255,255,255,0.1)',
            border: 'none',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            color: '#fff',
            cursor: 'pointer',
            fontSize: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          ✕
        </button>

        <div style={{ fontSize: '3.5rem', marginBottom: '16px' }}>🔒</div>
        
        <h3 style={{
          fontSize: '1.5rem',
          fontWeight: '800',
          fontFamily: 'var(--font-heading)',
          color: 'var(--color-text-primary, #FFF)',
          margin: '0 0 12px 0',
        }}>
          Sign In Required
        </h3>

        <p style={{
          color: 'var(--color-text-secondary, #A098AA)',
          fontSize: '0.95rem',
          lineHeight: '1.6',
          margin: '0 0 24px 0',
        }}>
          You can freely browse and explore AuraGlow! However, to <strong>{actionName}</strong>, please log in or create a free member account.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <button
            onClick={() => {
              onClose();
              navigate('/login');
            }}
            className="btn btn-primary btn-pill"
            style={{ width: '100%', padding: '14px 28px', fontWeight: '700', fontSize: '1rem' }}
          >
            🔑 Log In to Account
          </button>

          <button
            onClick={() => {
              onClose();
              navigate('/register');
            }}
            className="btn btn-secondary btn-pill"
            style={{ width: '100%', padding: '12px 24px', fontWeight: '600', fontSize: '0.9rem' }}
          >
            ✨ Create Free Account
          </button>
        </div>
      </div>
    </div>
  );
}
