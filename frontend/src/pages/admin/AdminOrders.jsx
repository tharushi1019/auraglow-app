import React, { useState, useEffect } from 'react';
import { useCurrency } from '@/context/CurrencyContext';

const initialOrders = [
  { id: 'ORD-8901', customer: 'Sasha R.', date: '2026-08-24', amount: 14500, status: 'Processing' },
  { id: 'ORD-8900', customer: 'Anika P.', date: '2026-08-23', amount: 8900, status: 'Shipped' },
  { id: 'ORD-8899', customer: 'Leila M.', date: '2026-08-21', amount: 23200, status: 'Delivered' },
  { id: 'ORD-8898', customer: 'Keshara D.', date: '2026-08-20', amount: 4500, status: 'Pending' },
];

const statusOptions = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

export default function AdminOrders() {
  const [orders, setOrders] = useState(initialOrders);
  const { formatPrice } = useCurrency();

  useEffect(() => { document.title = 'AuraGlow Admin — Orders'; }, []);

  const handleStatusChange = (id, newStatus) => {
    setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered': return 'var(--color-success)';
      case 'Shipped': return 'var(--color-accent-lavender)';
      case 'Processing': return 'var(--color-accent-peach)';
      case 'Pending': return 'var(--color-accent-gold)';
      case 'Cancelled': return 'var(--color-error)';
      default: return 'var(--color-text-secondary)';
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-2xl)' }}>Order Management</h1>
        <p style={{ color: 'var(--color-text-secondary)' }}>View and update customer orders.</p>
      </div>

      <div className="card glass fade-in-up delay-2" style={{ padding: '0', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--color-border)', background: 'rgba(255,255,255,0.02)' }}>
              <th style={{ padding: 'var(--space-4)', color: 'var(--color-text-secondary)', fontWeight: '600', fontSize: 'var(--text-sm)' }}>Order ID</th>
              <th style={{ padding: 'var(--space-4)', color: 'var(--color-text-secondary)', fontWeight: '600', fontSize: 'var(--text-sm)' }}>Customer</th>
              <th style={{ padding: 'var(--space-4)', color: 'var(--color-text-secondary)', fontWeight: '600', fontSize: 'var(--text-sm)' }}>Date</th>
              <th style={{ padding: 'var(--space-4)', color: 'var(--color-text-secondary)', fontWeight: '600', fontSize: 'var(--text-sm)' }}>Amount</th>
              <th style={{ padding: 'var(--space-4)', color: 'var(--color-text-secondary)', fontWeight: '600', fontSize: 'var(--text-sm)' }}>Status</th>
              <th style={{ padding: 'var(--space-4)', color: 'var(--color-text-secondary)', fontWeight: '600', fontSize: 'var(--text-sm)', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(o => (
              <tr key={o.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                <td style={{ padding: 'var(--space-4)', fontSize: 'var(--text-sm)', fontWeight: '600', color: 'var(--color-text-primary)' }}>{o.id}</td>
                <td style={{ padding: 'var(--space-4)', fontSize: 'var(--text-sm)' }}>{o.customer}</td>
                <td style={{ padding: 'var(--space-4)', fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>{o.date}</td>
                <td style={{ padding: 'var(--space-4)', fontSize: 'var(--text-sm)' }}>{formatPrice(o.amount)}</td>
                <td style={{ padding: 'var(--space-4)' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px', borderRadius: 'var(--radius-full)', background: 'rgba(255,255,255,0.05)', border: `1px solid ${getStatusColor(o.status)}33` }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: getStatusColor(o.status) }} />
                    <span style={{ fontSize: 'var(--text-xs)', fontWeight: '500', color: getStatusColor(o.status) }}>{o.status}</span>
                  </div>
                </td>
                <td style={{ padding: 'var(--space-4)', textAlign: 'right' }}>
                  <select 
                    value={o.status}
                    onChange={(e) => handleStatusChange(o.id, e.target.value)}
                    style={{ 
                      padding: '4px 8px', 
                      fontSize: 'var(--text-xs)', 
                      borderRadius: 'var(--radius-sm)',
                      background: 'var(--color-bg-input)',
                      border: '1px solid var(--color-border)',
                      color: 'var(--color-text-primary)',
                      cursor: 'pointer'
                    }}
                  >
                    {statusOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
