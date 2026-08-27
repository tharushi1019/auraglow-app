import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  useEffect(() => { document.title = 'AuraGlow — Page Not Found'; }, []);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--color-bg-primary)',
      textAlign: 'center',
      padding: 'var(--space-8)',
    }}>
      {/* Glowing number */}
      <div style={{
        fontFamily: 'var(--font-heading)',
        fontSize: '120px',
        fontWeight: '900',
        lineHeight: 1,
        background: 'var(--gradient-text)',
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        marginBottom: 'var(--space-4)',
        filter: 'drop-shadow(0 0 40px rgba(232,180,160,0.3))',
      }}>
        404
      </div>

      <h1 style={{
        fontFamily: 'var(--font-heading)',
        fontSize: 'var(--text-2xl)',
        fontWeight: '700',
        marginBottom: 'var(--space-3)',
      }}>
        Oops! Page Not Found
      </h1>

      <p style={{
        color: 'var(--color-text-secondary)',
        maxWidth: '400px',
        marginBottom: 'var(--space-8)',
        lineHeight: 1.6,
      }}>
        The page you're looking for doesn't exist or has been moved.
        Let's get you back to something beautiful.
      </p>

      {/* Decorative dots */}
      <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-8)' }}>
        {['var(--color-accent-rose)', 'var(--color-accent-lavender)', 'var(--color-accent-gold)'].map((c, i) => (
          <div key={i} style={{ width: '8px', height: '8px', borderRadius: '50%', background: c }} />
        ))}
      </div>

      <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link to="/" className="btn btn-primary btn-pill">
          ← Back to Home
        </Link>
        <Link to="/admin" className="btn btn-ghost btn-pill">
          Admin Dashboard
        </Link>
      </div>
    </div>
  );
}
