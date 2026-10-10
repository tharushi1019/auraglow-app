import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCurrency } from '@/context/CurrencyContext';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

const NAV_LINKS = [
  { label: 'All Products',    path: '/products' },
  { label: 'Skincare',        path: '/products?category=skincare' },
  { label: 'Makeup',          path: '/products?category=makeup' },
  { label: 'Fragrance',       path: '/products?category=fragrance' },
  { label: 'Routine Advisor', path: '/recommendations' },
];

export default function Navbar() {
  const { user } = useAuth();
  const isAdmin = user && user.role === 'admin';
  const { currency, setCurrency, availableCurrencies } = useCurrency();
  const { cart, wishlist } = useCart();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname, location.search]);

  // Intensify navbar background when user scrolls down
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isActive = (path) => {
    const [basePath, queryString] = path.split('?');
    if (queryString) {
      return location.pathname === basePath && location.search === `?${queryString}`;
    }
    return location.pathname === basePath && !location.search;
  };

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
        height: 'var(--nav-height)',
        background: scrolled ? 'rgba(13,13,15,0.97)' : 'rgba(13,13,15,0.85)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderBottom: scrolled
          ? '1px solid rgba(232, 180, 160, 0.15)'
          : '1px solid var(--color-border)',
        boxShadow: scrolled ? '0 4px 24px rgba(0,0,0,0.5)' : 'none',
        display: 'flex', alignItems: 'center',
        padding: '0 clamp(12px, 3vw, 40px)',
        gap: 'clamp(8px, 2vw, 32px)',
        transition: 'background 300ms ease, border-color 300ms ease, box-shadow 300ms ease',
      }}>
        {/* Mobile Hamburger toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle mobile menu"
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            color: 'var(--color-text-primary)',
            fontSize: '22px',
            cursor: 'pointer',
            padding: '4px',
          }}
          className="mobile-nav-toggle"
        >
          {mobileMenuOpen ? '✕' : '☰'}
        </button>

        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none', flexShrink: 0 }}>
          <div style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'var(--text-xl)',
            fontWeight: '800',
            background: 'var(--gradient-text)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.02em',
          }}>
            AuraGlow
          </div>
        </Link>

        {/* Nav Links (Desktop) */}
        <div className="desktop-nav-links" style={{ display: 'flex', gap: 'var(--space-6)', flex: 1, justifyContent: 'center' }}>
          {NAV_LINKS.map(item => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.label}
                to={item.path}
                style={{
                  color: active ? 'var(--color-accent-rose)' : 'var(--color-text-secondary)',
                  textDecoration: 'none',
                  fontSize: 'var(--text-sm)',
                  fontWeight: active ? '600' : '500',
                  transition: 'color 150ms ease',
                  position: 'relative',
                  paddingBottom: '4px',
                }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.color = 'var(--color-text-primary)'; }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.color = 'var(--color-text-secondary)'; }}
              >
                {item.label}
                {active && (
                  <span style={{
                    position: 'absolute',
                    bottom: 0, left: 0, right: 0,
                    height: '2px',
                    borderRadius: '2px',
                    background: 'var(--gradient-brand)',
                  }} />
                )}
              </Link>
            );
          })}
        </div>

        {/* Right-side actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(8px, 1.5vw, 16px)', flexShrink: 0, marginLeft: 'auto' }}>
          {/* Currency Selector */}
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid var(--color-border)',
              color: 'var(--color-text-secondary)',
              borderRadius: 'var(--radius-full)',
              padding: '4px 8px',
              fontSize: 'var(--text-xs)',
              cursor: 'pointer',
              outline: 'none',
              width: 'auto',
              transition: 'border-color 150ms ease',
            }}
          >
            {availableCurrencies.map(c => (
              <option key={c} value={c} style={{ background: 'var(--color-bg-secondary)', color: 'var(--color-text-primary)' }}>
                {c}
              </option>
            ))}
          </select>

          {/* Skin Quiz CTA */}
          <Link to="/skin-quiz" className="btn btn-primary btn-sm btn-pill glow-pulse nav-quiz-btn" style={{ padding: '6px 14px', fontSize: '12px' }}>
            ✨ Skin Quiz
          </Link>

          {/* Orders with badge (Only shown if user is logged in) */}
          {user && (
            <Link
              to="/orders"
              title="My Orders & Tracking"
              style={{ color: 'var(--color-text-secondary)', textDecoration: 'none', fontSize: '18px', position: 'relative', display: 'flex', alignItems: 'center', transition: 'color 150ms ease' }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--color-accent-rose)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--color-text-secondary)'}
            >
              <span>📦</span>
            </Link>
          )}

          {/* Wishlist with badge (Only shown if user is logged in) */}
          <Link
            to="/wishlist"
            title="Wishlist"
            style={{ color: 'var(--color-text-secondary)', textDecoration: 'none', fontSize: '18px', position: 'relative', display: 'flex', alignItems: 'center', transition: 'color 150ms ease' }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--color-accent-rose)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--color-text-secondary)'}
          >
            <span>🤍</span>
            {user && wishlist.length > 0 && (
              <span style={{
                position: 'absolute', top: '-6px', right: '-8px',
                background: 'var(--gradient-brand-vibrant)',
                color: '#0d0d0f',
                fontSize: '9px', fontWeight: '700', borderRadius: '50%',
                width: '16px', height: '16px', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 2px 6px rgba(232,180,160,0.4)',
              }}>
                {wishlist.length}
              </span>
            )}
          </Link>

          {/* Cart with badge (Only shown if user is logged in) */}
          <Link
            to="/cart"
            title="Shopping Bag"
            style={{ color: 'var(--color-text-secondary)', textDecoration: 'none', fontSize: '18px', position: 'relative', display: 'flex', alignItems: 'center', transition: 'color 150ms ease' }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--color-accent-rose)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--color-text-secondary)'}
          >
            <span>🛒</span>
            {user && cart.length > 0 && (
              <span style={{
                position: 'absolute', top: '-6px', right: '-8px',
                background: 'var(--gradient-brand-vibrant)',
                color: '#0d0d0f',
                fontSize: '9px', fontWeight: '700', borderRadius: '50%',
                width: '16px', height: '16px', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 2px 6px rgba(232,180,160,0.4)',
              }}>
                {cart.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            )}
          </Link>

          {/* Profile / Account */}
          <Link
            to="/profile"
            title={user ? `${user.name} (${user.role})` : 'Sign In / Profile'}
            style={{ color: 'var(--color-text-secondary)', textDecoration: 'none', fontSize: '18px', transition: 'color 150ms ease' }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--color-accent-rose)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--color-text-secondary)'}
          >
            👤
          </Link>

          {/* Admin Dashboard Quick Action (Admin Only) */}
          {isAdmin && (
            <Link
              to="/admin"
              className="btn btn-secondary btn-sm btn-pill"
              style={{
                fontSize: '11px',
                padding: '4px 8px',
                borderColor: 'var(--color-accent-lavender)',
                color: 'var(--color-accent-lavender)',
                fontWeight: '600',
                textDecoration: 'none',
              }}
              title="AuraGlow Executive Admin Portal"
            >
              👑 Admin
            </Link>
          )}
        </div>
      </nav>

      {/* Mobile Nav Drawer */}
      {mobileMenuOpen && (
        <div style={{
          position: 'fixed',
          top: 'var(--nav-height)',
          left: 0,
          right: 0,
          background: 'rgba(13,13,15,0.98)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid var(--color-border)',
          padding: 'var(--space-6) var(--space-6)',
          zIndex: 199,
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-4)',
          animation: 'fadeIn 0.2s ease',
        }}>
          {NAV_LINKS.map(item => (
            <Link
              key={item.label}
              to={item.path}
              onClick={() => setMobileMenuOpen(false)}
              style={{
                color: isActive(item.path) ? 'var(--color-accent-rose)' : 'var(--color-text-primary)',
                textDecoration: 'none',
                fontSize: 'var(--text-base)',
                fontWeight: '600',
                padding: '8px 0',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
              }}
            >
              {item.label}
            </Link>
          ))}
          <Link
            to="/skin-quiz"
            onClick={() => setMobileMenuOpen(false)}
            className="btn btn-primary btn-pill btn-sm"
            style={{ textAlign: 'center', marginTop: 'var(--space-2)' }}
          >
            ✨ Take Skin Quiz
          </Link>
        </div>
      )}
    </>
  );
}
