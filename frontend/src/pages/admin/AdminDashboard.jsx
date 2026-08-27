import React from 'react';
import { useCurrency } from '@/context/CurrencyContext';

const recentOrders = [
  { id: 'ORD-8941', customer: 'Jane Doe',     status: 'Processing', amount: 14500, badgeClass: 'badge-warning' },
  { id: 'ORD-8940', customer: 'Kamal Silva',  status: 'Shipped',    amount: 32000, badgeClass: 'badge-info' },
  { id: 'ORD-8939', customer: 'Sara Lee',     status: 'Delivered',  amount: 8500,  badgeClass: 'badge-vegan' },
  { id: 'ORD-8938', customer: 'Ashan Perera', status: 'Processing', amount: 21000, badgeClass: 'badge-warning' },
];

export default function AdminDashboard() {
  const { formatPrice } = useCurrency();

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 'var(--space-8)' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-3xl)', fontWeight: '700', marginBottom: 'var(--space-2)' }}>Dashboard Overview</h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>Welcome back, Tharushi. Here's what's happening with AuraGlow today.</p>
        </div>
        <button className="btn btn-primary">Download Report</button>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-6)', marginBottom: 'var(--space-10)' }}>
        {/* Stat 1 — Revenue */}
        <div style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-6)', display: 'flex', gap: 'var(--space-4)', transition: 'border-color 250ms ease' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', background: 'rgba(232,180,160,0.1)', border: '1px solid rgba(232,180,160,0.2)', flexShrink: 0 }}>
            💰
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)', background: 'var(--gradient-text)', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              {formatPrice(1245000)}
            </div>
            <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>TODAY'S REVENUE</div>
          </div>
        </div>

        {/* Stat 2 — Orders */}
        <div style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-6)', display: 'flex', gap: 'var(--space-4)' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', background: 'rgba(126,200,160,0.1)', border: '1px solid rgba(126,200,160,0.2)', flexShrink: 0 }}>
            📦
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)', color: 'var(--color-success)' }}>
              142
            </div>
            <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>NEW ORDERS</div>
          </div>
        </div>

        {/* Stat 3 — Low Stock */}
        <div style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-6)', display: 'flex', gap: 'var(--space-4)' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', background: 'rgba(240,200,122,0.1)', border: '1px solid rgba(240,200,122,0.2)', flexShrink: 0 }}>
            ⚠️
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)', color: 'var(--color-warning)' }}>
              8
            </div>
            <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>LOW STOCK ITEMS</div>
          </div>
        </div>

        {/* Stat 4 — Users */}
        <div style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-6)', display: 'flex', gap: 'var(--space-4)' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', background: 'rgba(184,169,217,0.1)', border: '1px solid rgba(184,169,217,0.2)', flexShrink: 0 }}>
            👥
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)', color: 'var(--color-accent-lavender)' }}>
              1,842
            </div>
            <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>ACTIVE USERS</div>
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-6)' }}>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-xl)', fontWeight: '600', marginBottom: 'var(--space-6)' }}>Recent Orders</h2>

        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--color-border)', color: 'var(--color-text-muted)', fontSize: 'var(--text-xs)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <th style={{ padding: 'var(--space-3) 0' }}>Order ID</th>
              <th style={{ padding: 'var(--space-3) 0' }}>Customer</th>
              <th style={{ padding: 'var(--space-3) 0' }}>Status</th>
              <th style={{ padding: 'var(--space-3) 0', textAlign: 'right' }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.map((order, i) => (
              <tr key={i} style={{ borderBottom: i !== recentOrders.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                <td style={{ padding: 'var(--space-4) 0', fontFamily: 'monospace', color: 'var(--color-text-secondary)' }}>{order.id}</td>
                <td style={{ padding: 'var(--space-4) 0', color: 'var(--color-text-primary)' }}>{order.customer}</td>
                <td style={{ padding: 'var(--space-4) 0' }}><span className={`badge ${order.badgeClass}`}>{order.status}</span></td>
                <td style={{ padding: 'var(--space-4) 0', textAlign: 'right', fontWeight: 'var(--font-semibold)' }}>{formatPrice(order.amount)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
