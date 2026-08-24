import React from 'react';
import { Link } from 'react-router-dom';
import { useCurrency } from '@/context/CurrencyContext';

export default function Navbar() {
  const { currency, setCurrency, availableCurrencies } = useCurrency();

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      height: 'var(--nav-height)',
      background: 'rgba(13,13,15,0.85)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid var(--color-border)',
      display: 'flex', alignItems: 'center',
      padding: '0 var(--space-10)',
      gap: 'var(--space-8)',
    }}>
      <Link to="/" style={{ textDecoration: 'none' }}>
        <div style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-xl)', fontWeight: '800', background: 'var(--gradient-text)', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent', flexShrink: 0 }}>
          AuraGlow
        </div>
      </Link>
      
      <div style={{ display: 'flex', gap: 'var(--space-6)', flex: 1, justifyContent: 'center' }}>
        {['Skincare', 'Makeup', 'Fragrance', 'Tools', 'Best Sellers'].map(item => (
          <Link key={item} to="/products" style={{ color: 'var(--color-text-secondary)', textDecoration: 'none', fontSize: 'var(--text-sm)', fontWeight: '500', transition: 'color 150ms ease' }}
            onMouseEnter={e => e.target.style.color = 'var(--color-accent-rose)'}
            onMouseLeave={e => e.target.style.color = 'var(--color-text-secondary)'}
          >{item}</Link>
        ))}
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', flexShrink: 0 }}>
        {/* Currency Selector */}
        <select 
          value={currency} 
          onChange={(e) => setCurrency(e.target.value)}
          style={{ 
            background: 'transparent', 
            border: '1px solid var(--color-border)', 
            color: 'var(--color-text-secondary)', 
            borderRadius: 'var(--radius-full)', 
            padding: '4px 8px',
            fontSize: 'var(--text-xs)',
            cursor: 'pointer',
            outline: 'none',
            width: 'auto'
          }}
        >
          {availableCurrencies.map(c => (
            <option key={c} value={c} style={{ background: 'var(--color-bg-secondary)', color: 'var(--color-text-primary)' }}>
              {c}
            </option>
          ))}
        </select>

        <Link to="/skin-quiz" className="btn btn-primary btn-sm btn-pill">Take Skin Quiz</Link>
        <Link to="/cart" style={{ color: 'var(--color-text-secondary)', textDecoration: 'none', fontSize: '20px' }}>🛒</Link>
        <Link to="/profile" style={{ color: 'var(--color-text-secondary)', textDecoration: 'none', fontSize: '20px' }}>👤</Link>
      </div>
    </nav>
  );
}
