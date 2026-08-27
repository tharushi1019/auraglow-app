import React, { useState } from 'react';
import { NavLink, Outlet, Link } from 'react-router-dom';
import { useCurrency } from '@/context/CurrencyContext';

const NAV_SECTIONS = [
  {
    label: 'Overview',
    links: [
      { to: '/admin', end: true, icon: '▦', label: 'Dashboard' },
    ],
  },
  {
    label: 'Catalogue',
    links: [
      { to: '/admin/products', icon: '🧴', label: 'Products & Inventory' },
    ],
  },
  {
    label: 'Commerce',
    links: [
      { to: '/admin/orders', icon: '📦', label: 'Orders' },
    ],
  },
];

const navLinkStyle = (isActive) => ({
  padding: '10px 14px',
  borderRadius: 'var(--radius-md)',
  textDecoration: 'none',
  color: isActive ? 'var(--color-accent-rose)' : 'var(--color-text-secondary)',
  background: isActive ? 'rgba(232,180,160,0.12)' : 'transparent',
  fontWeight: isActive ? '600' : '400',
  fontSize: 'var(--text-sm)',
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  transition: 'all 200ms ease',
  borderLeft: isActive ? '3px solid var(--color-accent-rose)' : '3px solid transparent',
});

export default function AdminLayout() {
  const { currency, setCurrency, availableCurrencies } = useCurrency();
  const [notifications] = useState(3);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--color-bg-primary)' }}>

      {/* ── Sidebar ────────────────────────────────────────────── */}
      <aside style={{
        width: '260px',
        minWidth: '260px',
        background: 'var(--color-bg-secondary)',
        borderRight: '1px solid var(--color-border)',
        display: 'flex',
        flexDirection: 'column',
        position: 'sticky',
        top: 0,
        height: '100vh',
        overflowY: 'auto',
      }}>
        {/* Brand */}
        <div style={{
          padding: 'var(--space-6) var(--space-5)',
          borderBottom: '1px solid var(--color-border)',
        }}>
          <div style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'var(--text-lg)',
            fontWeight: '800',
            background: 'var(--gradient-text)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            AuraGlow
          </div>
          <div style={{
            fontSize: 'var(--text-xs)',
            color: 'var(--color-text-muted)',
            marginTop: '2px',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}>
            Admin Control Centre
          </div>
        </div>

        {/* Sidebar KPIs */}
        <div style={{
          margin: 'var(--space-4) var(--space-4)',
          padding: 'var(--space-4)',
          background: 'rgba(232,180,160,0.06)',
          border: '1px solid rgba(232,180,160,0.15)',
          borderRadius: 'var(--radius-lg)',
        }}>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 'var(--space-3)' }}>
            Today's Snapshot
          </div>
          {[
            { label: 'Revenue', value: 'Rs. 1.24M', color: 'var(--color-accent-rose)' },
            { label: 'Orders', value: '142', color: 'var(--color-success)' },
            { label: 'Visitors', value: '3,810', color: 'var(--color-accent-lavender)' },
          ].map(kpi => (
            <div key={kpi.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 0' }}>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>{kpi.label}</span>
              <span style={{ fontSize: 'var(--text-xs)', fontWeight: '700', color: kpi.color }}>{kpi.value}</span>
            </div>
          ))}
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, padding: '0 var(--space-3) var(--space-4)' }}>
          {NAV_SECTIONS.map(section => (
            <div key={section.label} style={{ marginBottom: 'var(--space-4)' }}>
              <div style={{
                fontSize: '10px',
                fontWeight: '700',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--color-text-muted)',
                padding: '0 12px',
                marginBottom: 'var(--space-2)',
              }}>
                {section.label}
              </div>
              {section.links.map(link => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.end}
                  style={({ isActive }) => navLinkStyle(isActive)}
                >
                  <span style={{ fontSize: '15px', width: '20px', textAlign: 'center', flexShrink: 0 }}>{link.icon}</span>
                  {link.label}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        {/* Bottom actions */}
        <div style={{
          padding: 'var(--space-4)',
          borderTop: '1px solid var(--color-border)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-2)',
        }}>
          <Link
            to="/"
            style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '10px 14px',
              borderRadius: 'var(--radius-md)',
              color: 'var(--color-text-muted)',
              textDecoration: 'none',
              fontSize: 'var(--text-sm)',
              transition: 'color 150ms ease, background 150ms ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--color-text-primary)'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--color-text-muted)'; e.currentTarget.style.background = 'transparent'; }}
          >
            <span>←</span> Back to Store
          </Link>
        </div>
      </aside>

      {/* ── Main Area ──────────────────────────────────────────── */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>

        {/* Top Header */}
        <header style={{
          height: 'var(--nav-height)',
          background: 'rgba(18,18,24,0.95)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid var(--color-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 var(--space-8)',
          position: 'sticky',
          top: 0,
          zIndex: 50,
        }}>
          {/* Search bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 'var(--space-3)',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-full)',
              padding: '8px 16px',
              minWidth: '220px',
              cursor: 'text',
            }}
              onClick={() => setSearchOpen(true)}
            >
              <span style={{ color: 'var(--color-text-muted)', fontSize: '14px' }}>🔍</span>
              <span style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>Search orders, products…</span>
              <span style={{ marginLeft: 'auto', color: 'var(--color-text-muted)', fontSize: '11px', background: 'rgba(255,255,255,0.06)', border: '1px solid var(--color-border)', borderRadius: '4px', padding: '1px 5px' }}>⌘K</span>
            </div>
          </div>

          {/* Right side */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
            {/* Currency */}
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
              }}
            >
              {availableCurrencies.map(c => (
                <option key={c} value={c} style={{ background: 'var(--color-bg-secondary)' }}>{c}</option>
              ))}
            </select>

            {/* Notification bell */}
            <div style={{ position: 'relative', cursor: 'pointer' }}>
              <span style={{ fontSize: '20px', color: 'var(--color-text-secondary)' }}>🔔</span>
              {notifications > 0 && (
                <span style={{
                  position: 'absolute', top: '-4px', right: '-6px',
                  background: 'var(--gradient-brand-vibrant)',
                  color: '#0d0d0f', fontSize: '9px', fontWeight: '700',
                  borderRadius: '50%', width: '16px', height: '16px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {notifications}
                </span>
              )}
            </div>

            {/* Divider */}
            <div style={{ width: '1px', height: '28px', background: 'var(--color-border)' }} />

            {/* Admin profile */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', cursor: 'pointer' }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '50%',
                background: 'var(--gradient-brand-vibrant)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#0d0d0f', fontWeight: '800', fontSize: '14px',
                boxShadow: '0 0 12px rgba(232,180,160,0.3)',
              }}>
                T
              </div>
              <div>
                <div style={{ fontSize: 'var(--text-sm)', fontWeight: '600', color: 'var(--color-text-primary)', lineHeight: 1.2 }}>Tharushi</div>
                <div style={{ fontSize: '11px', color: 'var(--color-success)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--color-success)', display: 'inline-block' }} />
                  Admin
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <div style={{ flex: 1, padding: 'var(--space-8)', overflowY: 'auto' }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
