import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [joined, setJoined] = useState(false);
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleJoin = (e) => {
    e.preventDefault();
    if (email.trim()) { setJoined(true); setEmail(''); }
  };

  return (
    <>
      {/* Scroll to top button */}
      {showTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          title="Back to top"
          style={{
            position: 'fixed', bottom: '2rem', right: '2rem',
            width: '44px', height: '44px',
            borderRadius: '50%',
            background: 'var(--gradient-brand-vibrant)',
            border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '18px',
            boxShadow: '0 4px 20px rgba(232,180,160,0.4)',
            zIndex: 150,
            transition: 'transform 200ms ease, box-shadow 200ms ease',
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(232,180,160,0.55)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(232,180,160,0.4)'; }}
        >
          ↑
        </button>
      )}
    <footer style={{
      background: 'var(--color-bg-secondary)',
      borderTop: '1px solid var(--color-border)',
      padding: 'var(--space-16) var(--space-10) var(--space-8)',
      marginTop: 'auto',
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: 'var(--space-10)',
        marginBottom: 'var(--space-12)',
      }}>
        {/* Brand Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'var(--text-2xl)',
            fontWeight: '800',
            background: 'var(--gradient-text)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            AuraGlow
          </div>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', lineHeight: 1.6 }}>
            Personalized Clean Beauty & Skincare. Formulated with 100% vegan, cruelty-free botanical actives tailored to your skin type.
          </p>
          <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-2)' }}>
            <span style={{ fontSize: '18px', cursor: 'pointer', opacity: 0.8 }} title="Instagram">📸</span>
            <span style={{ fontSize: '18px', cursor: 'pointer', opacity: 0.8 }} title="TikTok">🎵</span>
            <span style={{ fontSize: '18px', cursor: 'pointer', opacity: 0.8 }} title="Twitter">🐦</span>
            <span style={{ fontSize: '18px', cursor: 'pointer', opacity: 0.8 }} title="YouTube">▶️</span>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 style={{ color: 'var(--color-text-primary)', fontSize: 'var(--text-sm)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 'var(--space-4)' }}>
            Explore Shop
          </h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            <li><Link to="/products" style={{ color: 'var(--color-text-secondary)', textDecoration: 'none', fontSize: 'var(--text-sm)' }}>All Products</Link></li>
            <li><Link to="/products?category=skincare" style={{ color: 'var(--color-text-secondary)', textDecoration: 'none', fontSize: 'var(--text-sm)' }}>Skincare & Serums</Link></li>
            <li><Link to="/products?category=makeup" style={{ color: 'var(--color-text-secondary)', textDecoration: 'none', fontSize: 'var(--text-sm)' }}>Clean Makeup</Link></li>
            <li><Link to="/products?category=fragrance" style={{ color: 'var(--color-text-secondary)', textDecoration: 'none', fontSize: 'var(--text-sm)' }}>Luxury Fragrance</Link></li>
            <li><Link to="/products?category=tools" style={{ color: 'var(--color-text-secondary)', textDecoration: 'none', fontSize: 'var(--text-sm)' }}>Beauty Tools</Link></li>
          </ul>
        </div>

        {/* Experience */}
        <div>
          <h4 style={{ color: 'var(--color-text-primary)', fontSize: 'var(--text-sm)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 'var(--space-4)' }}>
            Personalization
          </h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            <li><Link to="/skin-quiz" style={{ color: 'var(--color-accent-rose)', textDecoration: 'none', fontSize: 'var(--text-sm)', fontWeight: '600' }}>✨ Take Skin Quiz</Link></li>
            <li><Link to="/profile" style={{ color: 'var(--color-text-secondary)', textDecoration: 'none', fontSize: 'var(--text-sm)' }}>My Skin Profile</Link></li>
            <li><Link to="/cart" style={{ color: 'var(--color-text-secondary)', textDecoration: 'none', fontSize: 'var(--text-sm)' }}>Shopping Bag</Link></li>
            <li><Link to="/admin" style={{ color: 'var(--color-text-muted)', textDecoration: 'none', fontSize: 'var(--text-xs)' }}>Admin Portal</Link></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h4 style={{ color: 'var(--color-text-primary)', fontSize: 'var(--text-sm)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 'var(--space-4)' }}>
            Join the Glow Club
          </h4>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-xs)', marginBottom: 'var(--space-3)' }}>
            Receive personalized beauty tips, secret drops & 15% off your first order.
          </p>
          {joined ? (
            <p style={{ color: 'var(--color-success)', fontSize: 'var(--text-sm)', fontWeight: '600' }}>
              ✅ You're in the Glow Club!
            </p>
          ) : (
            <form onSubmit={handleJoin} style={{ display: 'flex', gap: 'var(--space-2)' }}>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="form-input"
                style={{ fontSize: 'var(--text-xs)', padding: '8px 12px' }}
                required
              />
              <button type="submit" className="btn btn-primary btn-sm" style={{ flexShrink: 0 }}>
                Join
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Bottom Bar */}
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        borderTop: '1px solid var(--color-border)',
        paddingTop: 'var(--space-6)',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 'var(--space-4)',
        color: 'var(--color-text-muted)',
        fontSize: 'var(--text-xs)',
      }}>
        <div>
          &copy; {new Date().getFullYear()} AuraGlow Inc. All rights reserved. Clean Beauty & Personalized Skincare.
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-6)' }}>
          <span>100% Cruelty Free</span>
          <span>•</span>
          <span>Eco-Conscious Packaging</span>
          <span>•</span>
          <span>Dermatologist Tested</span>
        </div>
      </div>
    </footer>
    </>
  );
}
