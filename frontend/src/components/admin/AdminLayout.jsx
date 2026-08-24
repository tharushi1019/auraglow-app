import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useCurrency } from '@/context/CurrencyContext';

export default function AdminLayout() {
  const { currency, setCurrency, availableCurrencies } = useCurrency();
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--color-bg-primary)' }}>
      {/* Sidebar */}
      <aside style={{
        width: '260px',
        background: 'var(--color-bg-secondary)',
        borderRight: '1px solid var(--color-border)',
        display: 'flex',
        flexDirection: 'column',
        padding: 'var(--space-6) var(--space-4)'
      }}>
        <div style={{ marginBottom: 'var(--space-10)', textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-xl)', fontWeight: '800', background: 'var(--gradient-text)', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            AuraGlow Admin
          </h2>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          <NavLink 
            to="/admin" 
            end
            style={({ isActive }) => ({
              padding: 'var(--space-3) var(--space-4)',
              borderRadius: 'var(--radius-md)',
              textDecoration: 'none',
              color: isActive ? 'var(--color-accent-rose)' : 'var(--color-text-secondary)',
              background: isActive ? 'rgba(232,180,160,0.1)' : 'transparent',
              fontWeight: isActive ? 'var(--font-semibold)' : 'var(--font-regular)',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-3)',
              transition: 'background var(--transition-fast)'
            })}
          >
            <span>📊</span> Dashboard
          </NavLink>
          
          <NavLink 
            to="/admin/products"
            style={({ isActive }) => ({
              padding: 'var(--space-3) var(--space-4)',
              borderRadius: 'var(--radius-md)',
              textDecoration: 'none',
              color: isActive ? 'var(--color-accent-rose)' : 'var(--color-text-secondary)',
              background: isActive ? 'rgba(232,180,160,0.1)' : 'transparent',
              fontWeight: isActive ? 'var(--font-semibold)' : 'var(--font-regular)',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-3)',
              transition: 'background var(--transition-fast)'
            })}
          >
            <span>🧴</span> Products (Inventory)
          </NavLink>

          <NavLink 
            to="/admin/orders"
            style={({ isActive }) => ({
              padding: 'var(--space-3) var(--space-4)',
              borderRadius: 'var(--radius-md)',
              textDecoration: 'none',
              color: isActive ? 'var(--color-accent-rose)' : 'var(--color-text-secondary)',
              background: isActive ? 'rgba(232,180,160,0.1)' : 'transparent',
              fontWeight: isActive ? 'var(--font-semibold)' : 'var(--font-regular)',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-3)',
              transition: 'background var(--transition-fast)'
            })}
          >
            <span>📦</span> Orders
          </NavLink>
        </nav>

        <div style={{ marginTop: 'auto', paddingTop: 'var(--space-6)', borderTop: '1px solid var(--color-border)' }}>
          <NavLink to="/" style={{ color: 'var(--color-text-muted)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--text-sm)' }}>
            <span>←</span> Back to Store
          </NavLink>
        </div>
      </aside>

      {/* Main Content Area */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Top Header */}
        <header style={{
          height: 'var(--nav-height)',
          background: 'var(--color-bg-secondary)',
          borderBottom: '1px solid var(--color-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          padding: '0 var(--space-8)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
            {/* Currency Selector */}
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              style={{
                background: 'transparent',
                border: '1px solid var(--color-border)',
                color: 'var(--color-text-secondary)',
                borderRadius: 'var(--radius-full)',
                padding: '4px 10px',
                fontSize: 'var(--text-xs)',
                cursor: 'pointer',
                outline: 'none',
                width: 'auto',
              }}
            >
              {availableCurrencies.map(c => (
                <option key={c} value={c} style={{ background: 'var(--color-bg-secondary)', color: 'var(--color-text-primary)' }}>
                  {c}
                </option>
              ))}
            </select>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', color: 'var(--color-text-primary)' }}>Tharushi (Admin)</p>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-success)' }}>● Online</p>
            </div>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--gradient-brand-vibrant)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0d0d0f', fontWeight: 'bold' }}>
              T
            </div>
          </div>
        </header>

        {/* Content Outlet */}
        <div style={{ flex: 1, padding: 'var(--space-8)', overflowY: 'auto' }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
