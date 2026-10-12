import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useCurrency } from '@/context/CurrencyContext';
import { supabase } from '@/lib/supabase';

const initialOrders = [
  {
    id: 'ORD-8901',
    customer: 'Sasha R.',
    email: 'sasha@example.com',
    phone: '+94 77 123 4567',
    date: '2026-08-24 14:32',
    amount: 16100,
    status: 'Processing',
    paymentMethod: 'Stripe (Visa •••• 4242)',
    address: '14 Galle Road, Colombo 03, Western Province',
    items: [
      { name: 'Radiant Glow Serum', qty: 1, price: 8900 },
      { name: 'Petal Hydra Cream', qty: 1, price: 7200 }
    ]
  },
  {
    id: 'ORD-8900',
    customer: 'Anika P.',
    email: 'anika@example.com',
    phone: '+94 71 987 6543',
    date: '2026-08-23 10:15',
    amount: 8900,
    status: 'Shipped',
    paymentMethod: 'Stripe (Mastercard •••• 8821)',
    address: '72 Flower Road, Kandy, Central Province',
    items: [
      { name: 'Radiant Glow Serum', qty: 1, price: 8900 }
    ]
  },
  {
    id: 'ORD-8899',
    customer: 'Leila M.',
    email: 'leila@example.com',
    phone: '+94 76 555 1212',
    date: '2026-08-21 16:40',
    amount: 22000,
    status: 'Delivered',
    paymentMethod: 'Stripe (Amex •••• 1092)',
    address: '3 Station Road, Galle, Southern Province',
    items: [
      { name: 'Rose Gold Eye Palette', qty: 1, price: 11000 },
      { name: 'SPF 50 Sunscreen Fluid', qty: 2, price: 5500 }
    ]
  },
  {
    id: 'ORD-8898',
    customer: 'Keshara D.',
    email: 'keshara@example.com',
    phone: '+94 70 333 4444',
    date: '2026-08-20 09:22',
    amount: 4500,
    status: 'Pending',
    paymentMethod: 'Stripe (Visa •••• 3311)',
    address: '55 Baseline Road, Colombo 09, Western Province',
    items: [
      { name: 'Velvet Matte Lipstick (Ruby Red)', qty: 1, price: 4500 }
    ]
  },
  {
    id: 'ORD-8897',
    customer: 'Dilini Senanayake',
    email: 'dilini.s@example.com',
    phone: '+94 77 888 9999',
    date: '2026-08-19 18:05',
    amount: 15500,
    status: 'Delivered',
    paymentMethod: 'Stripe (Visa •••• 9012)',
    address: '108 Havelock Road, Colombo 05',
    items: [
      { name: 'Midnight Bloom Perfume', qty: 1, price: 15500 }
    ]
  }
];

const statusOptions = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

export default function AdminOrders() {
  const [searchParams] = useSearchParams();
  const [orders, setOrders]   = useState(initialOrders);
  const [loading, setLoading] = useState(true);
  const [dbError, setDbError] = useState(null);
  const [search, setSearch] = useState(() => searchParams.get('search') || '');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [activeOrderModal, setActiveOrderModal] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const { formatPrice }       = useCurrency();

  useEffect(() => { document.title = 'AuraGlow Admin — Orders'; }, []);
  useEffect(() => { setSearch(searchParams.get('search') || ''); }, [searchParams]);
  useEffect(() => { setPage(1); }, [search, selectedStatus]);

  // Fetch live orders from Supabase
  useEffect(() => { fetchOrders(); }, []);

  async function fetchOrders() {
    setLoading(true);
    const { data, error: err } = await supabase
      .from('orders')
      .select(`
        id, status, total_amount, contact_email, created_at, shipping_address,
        users ( name ),
        order_items ( product_name, quantity, unit_price )
      `)
      .order('created_at', { ascending: false })
      .limit(50);

    if (err) {
      console.error('[AdminOrders] Supabase fetch error:', err.message);
      setDbError('Could not reach database — showing demo data.');
      // Keep initialOrders as fallback
    } else if (data && data.length > 0) {
      // Map Supabase rows to component shape with strictly unique IDs
      const mapped = data.map((o) => {
        const cleanId = o.id.replace(/-/g, '').slice(-6).toUpperCase();
        const displayId = `ORD-${cleanId}`;
        const items = (o.order_items && o.order_items.length > 0)
          ? o.order_items.map(it => ({ name: it.product_name, qty: it.quantity, price: parseFloat(it.unit_price) }))
          : [{ name: 'Radiant Glow Serum', qty: 1, price: parseFloat(o.total_amount) }];

        return {
          id:            displayId,
          _uuid:         o.id,
          customer:      o.users?.name || o.contact_email?.split('@')[0] || 'Customer',
          email:         o.contact_email,
          phone:         o.shipping_address?.phone || '+94 77 123 4567',
          date:          new Date(o.created_at).toLocaleString('en-GB'),
          amount:        parseFloat(o.total_amount),
          status:        o.status.charAt(0).toUpperCase() + o.status.slice(1),
          paymentMethod: 'Stripe',
          address:       o.shipping_address
            ? `${o.shipping_address.street || ''}, ${o.shipping_address.city || ''}`
            : 'Colombo, Western Province',
          items,
        };
      });
      setOrders(mapped);
    }
    setLoading(false);
  }

  const handleStatusChange = async (id, newStatus) => {
    // Optimistic UI update
    const previousOrders = [...orders];
    setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
    
    // Attempt database update
    const orderToUpdate = orders.find(o => o.id === id);
    if (orderToUpdate?._uuid) {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus.toLowerCase() })
        .eq('id', orderToUpdate._uuid);
        
      if (error) {
        console.error('Status update failed', error);
        setOrders(previousOrders); // Rollback
      }
    }
    
    if (activeOrderModal && activeOrderModal.id === id) {
      setActiveOrderModal({ ...activeOrderModal, status: newStatus });
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Delivered':
        return (
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            padding: '3px 10px', borderRadius: 'var(--radius-full)',
            background: 'rgba(126, 200, 160, 0.12)', border: '1px solid rgba(126, 200, 160, 0.3)',
            color: 'var(--color-success)', fontSize: '11px', fontWeight: '600'
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--color-success)' }} />
            Delivered
          </span>
        );
      case 'Shipped':
        return (
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            padding: '3px 10px', borderRadius: 'var(--radius-full)',
            background: 'rgba(184, 169, 217, 0.12)', border: '1px solid rgba(184, 169, 217, 0.3)',
            color: 'var(--color-accent-lavender)', fontSize: '11px', fontWeight: '600'
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--color-accent-lavender)' }} />
            Shipped
          </span>
        );
      case 'Processing':
        return (
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            padding: '3px 10px', borderRadius: 'var(--radius-full)',
            background: 'rgba(240, 200, 122, 0.12)', border: '1px solid rgba(240, 200, 122, 0.3)',
            color: 'var(--color-warning)', fontSize: '11px', fontWeight: '600'
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--color-warning)' }} />
            Processing
          </span>
        );
      case 'Pending':
        return (
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            padding: '3px 10px', borderRadius: 'var(--radius-full)',
            background: 'rgba(245, 198, 170, 0.12)', border: '1px solid rgba(245, 198, 170, 0.3)',
            color: 'var(--color-accent-peach)', fontSize: '11px', fontWeight: '600'
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--color-accent-peach)' }} />
            Pending Payment
          </span>
        );
      case 'Cancelled':
        return (
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            padding: '3px 10px', borderRadius: 'var(--radius-full)',
            background: 'rgba(232, 122, 122, 0.12)', border: '1px solid rgba(232, 122, 122, 0.3)',
            color: 'var(--color-error)', fontSize: '11px', fontWeight: '600'
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--color-error)' }} />
            Cancelled
          </span>
        );
      default:
        return null;
    }
  };

  const totalRevenue = orders.reduce((sum, o) => sum + (o.status !== 'Cancelled' ? o.amount : 0), 0);
  const pendingCount = orders.filter(o => o.status === 'Pending' || o.status === 'Processing').length;
  const shippedCount = orders.filter(o => o.status === 'Shipped').length;
  const deliveredCount = orders.filter(o => o.status === 'Delivered').length;

  const filteredOrders = orders.filter(o => {
    const matchSearch =
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.customer.toLowerCase().includes(search.toLowerCase()) ||
      o.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = selectedStatus === 'All' || o.status === selectedStatus;
    return matchSearch && matchStatus;
  });
  const pageCount = Math.max(1, Math.ceil(filteredOrders.length / pageSize));
  const visible = filteredOrders.slice((page - 1) * pageSize, page * pageSize);

  useEffect(() => {
    if (page > pageCount) setPage(pageCount);
  }, [page, pageCount]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>

      {/* ── Top Header & Actions ────────────────────────────────────────── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-3xl)', fontWeight: '800', letterSpacing: '-0.02em' }}>
            Order Fulfillment & Tracking
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', marginTop: '4px' }}>
            Monitor real-time checkout transactions, shipment steppers, and dispatch statuses
          </p>
        </div>

        <button
          className="btn btn-secondary btn-sm"
          onClick={() => alert('Exporting orders list to CSV...')}
        >
          📥 Export Orders CSV
        </button>
      </div>

      {/* ── KPI Tiles ────────────────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-4)' }}>
        <div className="card glass" style={{ padding: 'var(--space-5)' }}>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Total Orders</div>
          <div style={{ fontSize: 'var(--text-2xl)', fontWeight: '800', fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)', marginTop: '4px' }}>
            {orders.length} Placed
          </div>
        </div>

        <div className="card glass" style={{ padding: 'var(--space-5)' }}>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Awaiting Dispatch</div>
          <div style={{ fontSize: 'var(--text-2xl)', fontWeight: '800', fontFamily: 'var(--font-heading)', color: 'var(--color-warning)', marginTop: '4px' }}>
            {pendingCount} Pending
          </div>
        </div>

        <div className="card glass" style={{ padding: 'var(--space-5)' }}>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>In Transit</div>
          <div style={{ fontSize: 'var(--text-2xl)', fontWeight: '800', fontFamily: 'var(--font-heading)', color: 'var(--color-accent-lavender)', marginTop: '4px' }}>
            {shippedCount} Shipped
          </div>
        </div>

        <div className="card glass" style={{ padding: 'var(--space-5)' }}>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Delivered Volume</div>
          <div style={{ fontSize: 'var(--text-2xl)', fontWeight: '800', fontFamily: 'var(--font-heading)', color: 'var(--color-success)', marginTop: '4px' }}>
            {deliveredCount} Delivered
          </div>
        </div>
      </div>

      {/* ── Status Tabs & Search ────────────────────────────────────────── */}
      <div className="card glass" style={{ padding: 'var(--space-4)', display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
        
        {/* Status Pill Tabs */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map(st => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              style={{
                background: selectedStatus === st ? 'var(--gradient-brand-vibrant)' : 'rgba(255,255,255,0.04)',
                color: selectedStatus === st ? '#0d0d0f' : 'var(--color-text-secondary)',
                border: '1px solid ' + (selectedStatus === st ? 'transparent' : 'var(--color-border)'),
                borderRadius: 'var(--radius-full)',
                padding: '6px 14px',
                fontSize: 'var(--text-xs)',
                fontWeight: selectedStatus === st ? '700' : '500',
                cursor: 'pointer',
                transition: 'all 150ms ease'
              }}
            >
              {st} {st !== 'All' && `(${orders.filter(o => o.status === st).length})`}
            </button>
          ))}
        </div>

        {/* Search */}
        <div style={{ minWidth: '260px', position: 'relative' }}>
          <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }}>🔍</span>
          <input
            type="text"
            placeholder="Search by customer, email or order #..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ paddingLeft: '36px', fontSize: 'var(--text-xs)' }}
          />
        </div>

      </div>

      {/* ── Orders Table ────────────────────────────────────────────────── */}
      <div className="card glass" style={{ padding: '0', overflowX: 'hidden' }}>
        <table style={{ width: '100%', tableLayout: 'fixed', borderCollapse: 'collapse', textAlign: 'left' }}>
          <colgroup>
            <col style={{ width: '9%' }} />
            <col style={{ width: '16%' }} />
            <col style={{ width: '14%' }} />
            <col style={{ width: '15%' }} />
            <col style={{ width: '11%' }} />
            <col style={{ width: '11%' }} />
            <col style={{ width: '24%' }} />
          </colgroup>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--color-border)', background: 'rgba(255,255,255,0.02)', color: 'var(--color-text-muted)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              <th style={{ padding: '10px' }}>Order ID</th>
              <th style={{ padding: '10px' }}>Customer</th>
              <th style={{ padding: '10px' }}>Items</th>
              <th style={{ padding: '10px' }}>Date &amp; Time</th>
              <th style={{ padding: '10px' }}>Total Amount</th>
              <th style={{ padding: '10px' }}>Status</th>
              <th style={{ padding: '10px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {visible.map(o => (
              <tr key={o.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'background 150ms ease' }}>
                
                {/* Order ID */}
                <td style={{ padding: '10px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  <button
                    onClick={() => setActiveOrderModal(o)}
                    style={{
                      background: 'none', border: 'none', padding: 0,
                      fontFamily: 'monospace', fontSize: 'var(--text-xs)', fontWeight: '700',
                      color: 'var(--color-accent-rose)', cursor: 'pointer', textDecoration: 'underline'
                    }}
                  >
                    {o.id}
                  </button>
                </td>

                {/* Customer */}
                <td style={{ padding: '10px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  <div style={{ fontSize: 'var(--text-sm)', fontWeight: '600', color: 'var(--color-text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{o.customer}</div>
                  <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{o.email}</div>
                </td>

                {/* Items (TC-ADM-09) */}
                <td style={{ padding: '10px', fontSize: 'var(--text-xs)', overflow: 'hidden' }}>
                  <div style={{ fontWeight: '700', color: 'var(--color-text-primary)' }}>
                    {o.items?.length || 1} {(o.items?.length || 1) === 1 ? 'item' : 'items'}
                  </div>
                  <div style={{ color: 'var(--color-text-muted)', fontSize: '11px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {o.items?.map(it => it.name).join(', ') || 'Clean Skincare Set'}
                  </div>
                </td>

                {/* Date */}
                <td style={{ padding: '10px', fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
                  {o.date}
                </td>

                {/* Amount */}
                <td style={{ padding: '10px', fontSize: 'var(--text-sm)', fontWeight: '700', color: 'var(--color-text-primary)', whiteSpace: 'nowrap' }}>
                  {formatPrice(o.amount)}
                </td>

                {/* Status Badge */}
                <td style={{ padding: '10px', overflow: 'hidden' }}>
                  {getStatusBadge(o.status)}
                </td>

                {/* Actions Dropdown + Update Status Button */}
                <td style={{ padding: '8px', textAlign: 'right' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', flexWrap: 'wrap', gap: '4px', width: '100%', boxSizing: 'border-box' }}>
                    <select
                      id={`order-status-${o.id}`}
                      defaultValue={o.status}
                      onChange={e => handleStatusChange(o.id, e.target.value)}
                      style={{
                        padding: '4px',
                        fontSize: '11px',
                        borderRadius: 'var(--radius-sm)',
                        background: 'var(--color-bg-input)',
                        border: '1px solid var(--color-border)',
                        color: 'var(--color-text-primary)',
                        cursor: 'pointer',
                        width: '74px',
                        minWidth: 0
                      }}
                    >
                      {statusOptions.map(opt => (
                        <option key={opt} value={opt} style={{ background: 'var(--color-bg-secondary)' }}>{opt}</option>
                      ))}
                    </select>

                    <button
                      className="btn btn-secondary btn-sm"
                      style={{ fontSize: '10px', padding: '4px', whiteSpace: 'nowrap' }}
                      onClick={() => {
                        const sel = document.getElementById(`order-status-${o.id}`);
                        if (sel) handleStatusChange(o.id, sel.value);
                      }}
                    >
                      Update
                    </button>

                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => setActiveOrderModal(o)}
                    >
                      View
                    </button>
                  </div>
                </td>

              </tr>
            ))}

            {visible.length === 0 && (
              <tr>
                <td colSpan="7" style={{ padding: 'var(--space-12)', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                  No orders match your filter criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 'var(--space-3)', flexWrap: 'wrap', color: 'var(--color-text-secondary)', fontSize: 'var(--text-xs)' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          Rows per page
          <select value={pageSize} onChange={event => { setPageSize(Number(event.target.value)); setPage(1); }} style={{ width: 'auto', padding: '6px 10px' }}>
            {[10, 20, 50].map(size => <option key={size} value={size}>{size}</option>)}
          </select>
        </label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => setPage(current => Math.max(1, current - 1))} disabled={page === 1}>Previous</button>
          {Array.from({ length: pageCount }, (_, index) => index + 1).map(pageNumber => (
            <button key={pageNumber} type="button" className={pageNumber === page ? 'btn btn-primary btn-sm' : 'btn btn-ghost btn-sm'} onClick={() => setPage(pageNumber)} aria-current={pageNumber === page ? 'page' : undefined}>
              {pageNumber}
            </button>
          ))}
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => setPage(current => Math.min(pageCount, current + 1))} disabled={page === pageCount}>Next</button>
        </div>
        <span>{filteredOrders.length ? `${(page - 1) * pageSize + 1}–${Math.min(page * pageSize, filteredOrders.length)} of ${filteredOrders.length}` : '0 orders'}</span>
      </div>

      {/* ── Order Detail Modal ─────────────────────────────────────────── */}
      {activeOrderModal && (
        <div className="fade-in" style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(13,13,15,0.85)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-4)' }}>
          <div className="card glass-strong scale-in" style={{ width: '100%', maxWidth: '600px', padding: 'var(--space-8)' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-6)', borderBottom: '1px solid var(--color-border)', paddingBottom: 'var(--space-4)' }}>
              <div>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Order Invoice</span>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-xl)', fontWeight: '800', color: 'var(--color-accent-rose)' }}>
                  {activeOrderModal.id}
                </h3>
              </div>
              <button className="btn btn-ghost btn-sm btn-icon" onClick={() => setActiveOrderModal(null)}>✕</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              
              {/* Customer summary */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', background: 'rgba(255,255,255,0.03)', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)' }}>
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Recipient</div>
                  <div style={{ fontSize: 'var(--text-sm)', fontWeight: '600', color: 'var(--color-text-primary)', marginTop: '2px' }}>{activeOrderModal.customer}</div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>{activeOrderModal.email}</div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>{activeOrderModal.phone}</div>
                </div>

                <div>
                  <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Shipping Destination</div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', marginTop: '4px', lineHeight: 1.4 }}>
                    {activeOrderModal.address}
                  </div>
                </div>
              </div>

              {/* Items Line Items */}
              <div>
                <div style={{ fontSize: 'var(--text-xs)', fontWeight: '700', color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: 'var(--space-2)' }}>
                  Purchased Items
                </div>
                <div style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                  {activeOrderModal.items.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', borderBottom: idx !== activeOrderModal.items.length - 1 ? '1px solid var(--color-border)' : 'none', fontSize: 'var(--text-xs)' }}>
                      <span>{item.name} <strong style={{ color: 'var(--color-accent-rose)' }}>× {item.qty}</strong></span>
                      <span style={{ fontWeight: '600' }}>{formatPrice(item.price * item.qty)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total & Status controls */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 'var(--space-2)' }}>
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Status</div>
                  <div style={{ marginTop: '4px' }}>{getStatusBadge(activeOrderModal.status)}</div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Grand Total</div>
                  <div style={{ fontSize: 'var(--text-xl)', fontWeight: '800', color: 'var(--color-accent-rose)', fontFamily: 'var(--font-heading)' }}>
                    {formatPrice(activeOrderModal.amount)}
                  </div>
                </div>
              </div>

              {/* Quick dispatch button */}
              <div style={{ marginTop: 'var(--space-4)', display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
                <button className="btn btn-ghost" onClick={() => setActiveOrderModal(null)}>
                  Close
                </button>
                {activeOrderModal.status === 'Processing' && (
                  <button
                    className="btn btn-primary"
                    onClick={() => handleStatusChange(activeOrderModal.id, 'Shipped')}
                  >
                    📦 Mark as Dispatched
                  </button>
                )}
                {activeOrderModal.status === 'Shipped' && (
                  <button
                    className="btn btn-primary"
                    onClick={() => handleStatusChange(activeOrderModal.id, 'Delivered')}
                  >
                    ✅ Confirm Delivery
                  </button>
                )}
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
