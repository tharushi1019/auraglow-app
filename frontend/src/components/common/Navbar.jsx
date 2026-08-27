import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCurrency } from '@/context/CurrencyContext';
import { useCart } from '@/context/CartContext';

const NAV_LINKS = [
  { label: 'All Products',    path: '/products' },
  { label: 'Skincare',        path: '/products?category=skincare' },
  { label: 'Makeup',          path: '/products?category=makeup' },
  { label: 'Fragrance',       path: '/products?category=fragrance' },
  { label: 'Routine Advisor', path: '/recommendations' },
];

export default function Navbar() {
  const { currency, setCurrency, availableCurrencies } = useCurrency();
  const { cart, wishlist } = useCart();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  // Intensify navbar background when user scrolls down
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isActive = (path) => {
    const [basePath, queryString] = path.split('?');
    if (queryString) {
      // Category links: must match BOTH pathname AND the exact query param
      return location.pathname === basePath && location.search === `?${queryString}`;
    }
    // "All Products" link: only active when on /products with NO category filter
    return location.pathname === basePath && !location.search;
  };

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
      height: 'var(--nav-height)',
      background: scrolled ? 'rgba(13,13,15,0.97)' : 'rgba(13,13,15,0.80)',
      backdropFilter: 'blur(24px)',
      WebkitBackdropFilter: 'blur(24px)',
      borderBottom: scrolled
        ? '1px solid rgba(232, 180, 160, 0.15)'
        : '1px solid var(--color-border)',
      boxShadow: scrolled ? '0 4px 24px rgba(0,0,0,0.5)' : 'none',
      display: 'flex', alignItems: 'center',
      padding: '0 var(--space-10)',
      gap: 'var(--space-8)',
      transition: 'background 300ms ease, border-color 300ms ease, box-shadow 300ms ease',
    }}>
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

      {/* Nav Links */}
      <div style={{ display: 'flex', gap: 'var(--space-6)', flex: 1, justifyContent: 'center' }}>
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
              {/* Active underline indicator */}
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
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', flexShrink: 0 }}>
        {/* Currency Selector */}
        <select
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid var(--color-border)',
            color: 'var(--color-text-secondary)',
            borderRadius: 'var(--radius-full)',
            padding: '5px 10px',
            fontSize: 'var(--text-xs)',
            cursor: 'pointer',
            outline: 'none',
            width: 'auto',
            transition: 'border-color 150ms ease',
          }}
          onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--color-border-accent)'}
          onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--color-border)'}
        >
          {availableCurrencies.map(c => (
            <option key={c} value={c} style={{ background: 'var(--color-bg-secondary)', color: 'var(--color-text-primary)' }}>
              {c}
            </option>
          ))}
        </select>

        <Link to="/skin-quiz" className="btn btn-primary btn-sm btn-pill glow-pulse">
          ✨ Skin Quiz
        </Link>

        {/* Wishlist with badge */}
        <Link
          to="/wishlist"
          title="Wishlist"
          style={{ color: 'var(--color-text-secondary)', textDecoration: 'none', fontSize: '20px', position: 'relative', display: 'flex', alignItems: 'center', transition: 'color 150ms ease' }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--color-accent-rose)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--color-text-secondary)'}
        >
          <span>🤍</span>
          {wishlist.length > 0 && (
            <span style={{
              position: 'absolute', top: '-6px', right: '-8px',
              background: 'var(--gradient-brand-vibrant)',
              color: '#0d0d0f',
              fontSize: '9px', fontWeight: '700', borderRadius: '50%',
              width: '17px', height: '17px', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 2px 6px rgba(232,180,160,0.4)',
            }}>
              {wishlist.length}
            </span>
          )}
        </Link>

        {/* Cart with badge */}
        <Link
          to="/cart"
          title="Shopping Bag"
          style={{ color: 'var(--color-text-secondary)', textDecoration: 'none', fontSize: '20px', position: 'relative', display: 'flex', alignItems: 'center', transition: 'color 150ms ease' }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--color-accent-rose)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--color-text-secondary)'}
        >
          <span>🛒</span>
          {cart.length > 0 && (
            <span style={{
              position: 'absolute', top: '-6px', right: '-8px',
              background: 'var(--gradient-brand-vibrant)',
              color: '#0d0d0f',
              fontSize: '9px', fontWeight: '700', borderRadius: '50%',
              width: '17px', height: '17px', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 2px 6px rgba(232,180,160,0.4)',
            }}>
              {cart.reduce((sum, item) => sum + item.quantity, 0)}
            </span>
          )}
        </Link>

        {/* Profile */}
        <Link
          to="/profile"
          title="My Profile"
          style={{ color: 'var(--color-text-secondary)', textDecoration: 'none', fontSize: '20px', transition: 'color 150ms ease' }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--color-accent-rose)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--color-text-secondary)'}
        >
          👤
        </Link>
      </div>
    </nav>
  );
}
