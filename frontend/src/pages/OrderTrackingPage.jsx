import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import { useCurrency } from '@/context/CurrencyContext';

const TRACKING_STAGES = [
  { icon: '✅', label: 'Order Confirmed', desc: 'Your order has been received and confirmed.' },
  { icon: '⚙️', label: 'Processing', desc: 'Our team is picking and packing your items.' },
  { icon: '🚚', label: 'Dispatched', desc: 'Your parcel has left our warehouse.' },
  { icon: '📍', label: 'Out for Delivery', desc: 'Your parcel is with the courier for final delivery.' },
  { icon: '🎉', label: 'Delivered', desc: 'Your AuraGlow order has been delivered!' },
];

function formatDate(isoString) {
  if (!isoString) return null;
  return new Date(isoString).toLocaleDateString('en-US', {
    weekday: 'short', day: 'numeric', month: 'short', year: 'numeric',
  });
}

export default function OrderTrackingPage() {
  const { id: orderId } = useParams();
  const { formatPrice } = useCurrency();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrder() {
      try {
        const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api/v1';
        const res = await fetch(`${API}/orders/${orderId}`);
        if (res.ok) {
          const data = await res.json();
          setOrder(data.order);
          setLoading(false);
          return;
        }
      } catch (_) {/* fall through */}

      // Demo order fallback
      setOrder({
        orderId: orderId || 'AG-2847-5391',
        status: 'processing',
        placedAt: new Date(Date.now() - 86400000).toISOString(),
        estimatedDelivery: new Date(Date.now() + 4 * 86400000).toISOString(),
        shippingAddress: { firstName: 'Nimesha', lastName: 'Perera', address1: '45 Galle Road', city: 'Colombo', country: 'Sri Lanka' },
        paymentMethod: { brand: 'Visa', lastFour: '4242' },
        total: 15800,
        trackingSteps: [
          { stage: 'Order Confirmed', date: new Date(Date.now() - 86400000).toISOString(), done: true },
          { stage: 'Processing', date: new Date(Date.now() - 43200000).toISOString(), done: true },
          { stage: 'Dispatched', date: null, done: false },
          { stage: 'Out for Delivery', date: null, done: false },
          { stage: 'Delivered', date: null, done: false },
        ],
      });
      setLoading(false);
    }
    loadOrder();
  }, [orderId]);

  const currentStageIndex = order?.trackingSteps?.filter(s => s.done).length - 1 || 0;

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--color-bg-primary)' }}>
        <Navbar />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-4)', marginTop: 'var(--nav-height)' }}>
          <div style={{ fontSize: '3rem', animation: 'spin 2s linear infinite' }}>🌸</div>
          <p style={{ color: 'var(--color-text-secondary)' }}>Loading your tracking info...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--color-bg-primary)' }}>
      <Navbar />

      <main style={{ maxWidth: '860px', margin: 'var(--nav-height) auto 0', padding: 'var(--space-10) var(--space-8)', width: '100%', boxSizing: 'border-box', flex: 1 }}>

        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-6)' }}>
          <Link to="/" style={{ color: 'var(--color-text-muted)', textDecoration: 'none' }}>Home</Link>
          <span>/</span>
          <span style={{ color: 'var(--color-accent-rose)', fontWeight: '600' }}>Order Tracking</span>
        </div>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-8)', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
          <div>
            <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: '800', fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)', margin: 0 }}>
              📍 Track Your Order
            </h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)', margin: '4px 0 0 0' }}>
              Order <span style={{ color: 'var(--color-accent-rose)', fontWeight: '700', fontFamily: 'var(--font-heading)' }}>{order?.orderId}</span>
            </p>
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
            <Link to="/products" className="btn btn-secondary btn-sm btn-pill" style={{ textDecoration: 'none' }}>
              🛍️ Shop Again
            </Link>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>

          {/* Tracking Timeline */}
          <div style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-2xl)', padding: 'var(--space-8)' }}>
            <h3 style={{ fontSize: 'var(--text-base)', fontWeight: '700', color: 'var(--color-text-primary)', margin: '0 0 var(--space-8) 0' }}>
              Shipment Status
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {(order?.trackingSteps || []).map((step, i) => {
                const stageInfo = TRACKING_STAGES[i];
                const isLast = i === (order.trackingSteps.length - 1);
                const isCurrent = step.done && (isLast || !order.trackingSteps[i + 1]?.done);

                return (
                  <div key={i} style={{ display: 'flex', gap: 'var(--space-5)', position: 'relative' }}>
                    {/* Timeline line */}
                    {!isLast && (
                      <div style={{
                        position: 'absolute',
                        left: '19px',
                        top: '40px',
                        bottom: '-16px',
                        width: '2px',
                        background: step.done ? 'var(--color-accent-sage)' : 'var(--color-border)',
                        transition: 'background 400ms ease',
                        zIndex: 0,
                      }} />
                    )}

                    {/* Icon circle */}
                    <div style={{
                      width: '40px', height: '40px',
                      borderRadius: '50%',
                      background: step.done ? (isCurrent ? 'var(--gradient-primary)' : 'rgba(100,196,157,0.2)') : 'var(--color-bg-secondary)',
                      border: step.done ? (isCurrent ? 'none' : '2px solid var(--color-accent-sage)') : '2px solid var(--color-border)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '18px',
                      flexShrink: 0,
                      position: 'relative', zIndex: 1,
                      boxShadow: isCurrent ? '0 0 20px rgba(232,114,150,0.4)' : 'none',
                      transition: 'all 300ms ease',
                    }}>
                      {step.done ? stageInfo.icon : <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--color-border)', display: 'block' }} />}
                    </div>

                    {/* Stage details */}
                    <div style={{ paddingBottom: isLast ? 0 : 'var(--space-8)', flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
                        <p style={{
                          fontSize: 'var(--text-sm)',
                          fontWeight: '700',
                          color: step.done ? 'var(--color-text-primary)' : 'var(--color-text-muted)',
                          margin: 0,
                          transition: 'color 300ms ease',
                        }}>
                          {stageInfo.label}
                        </p>
                        {isCurrent && (
                          <span style={{ fontSize: '10px', fontWeight: '700', color: 'var(--color-accent-rose)', background: 'rgba(232,114,150,0.15)', border: '1px solid rgba(232,114,150,0.3)', borderRadius: 'var(--radius-full)', padding: '2px 10px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                            Current
                          </span>
                        )}
                      </div>
                      {step.date && (
                        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', margin: '4px 0 0 0' }}>
                          {formatDate(step.date)}
                        </p>
                      )}
                      {step.done && (
                        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', margin: '4px 0 0 0' }}>
                          {stageInfo.desc}
                        </p>
                      )}
                      {!step.done && (
                        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', margin: '4px 0 0 0', fontStyle: 'italic' }}>
                          Pending...
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Order Details Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-6)' }}>

            {/* Delivery Details */}
            <div style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-2xl)', padding: 'var(--space-6)' }}>
              <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: '700', color: 'var(--color-text-primary)', margin: '0 0 var(--space-4) 0' }}>📦 Delivery Details</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
                <div>
                  <span style={{ color: 'var(--color-text-muted)', display: 'block', marginBottom: '2px' }}>Recipient</span>
                  <span style={{ fontWeight: '600', color: 'var(--color-text-primary)' }}>{order?.shippingAddress?.firstName} {order?.shippingAddress?.lastName}</span>
                </div>
                <div>
                  <span style={{ color: 'var(--color-text-muted)', display: 'block', marginBottom: '2px' }}>Address</span>
                  <span>{order?.shippingAddress?.address1}<br />{order?.shippingAddress?.city}, {order?.shippingAddress?.country}</span>
                </div>
                <div>
                  <span style={{ color: 'var(--color-text-muted)', display: 'block', marginBottom: '2px' }}>Est. Delivery</span>
                  <span style={{ fontWeight: '700', color: 'var(--color-accent-rose)' }}>{formatDate(order?.estimatedDelivery)}</span>
                </div>
              </div>
            </div>

            {/* Payment Summary */}
            <div style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-2xl)', padding: 'var(--space-6)' }}>
              <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: '700', color: 'var(--color-text-primary)', margin: '0 0 var(--space-4) 0' }}>💳 Payment</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
                <div>
                  <span style={{ color: 'var(--color-text-muted)', display: 'block', marginBottom: '2px' }}>Method</span>
                  <span style={{ fontWeight: '600', color: 'var(--color-text-primary)' }}>{order?.paymentMethod?.brand} ···· {order?.paymentMethod?.lastFour}</span>
                </div>
                <div>
                  <span style={{ color: 'var(--color-text-muted)', display: 'block', marginBottom: '2px' }}>Total Paid</span>
                  <span style={{ fontSize: 'var(--text-base)', fontWeight: '800', color: 'var(--color-accent-rose)' }}>{order?.total ? formatPrice(order.total) : '—'}</span>
                </div>
                <div>
                  <span style={{ color: 'var(--color-text-muted)', display: 'block', marginBottom: '2px' }}>Points Earned</span>
                  <span style={{ fontWeight: '700', color: 'var(--color-accent-gold)' }}>+{Math.floor((order?.total || 0) / 100)} ⭐</span>
                </div>
              </div>
            </div>

          </div>

          {/* Help / Re-Order actions */}
          <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/support" className="btn btn-secondary btn-pill" style={{ textDecoration: 'none', padding: '10px 24px' }}>
              💬 Need Help?
            </Link>
            <Link to="/products" className="btn btn-primary btn-pill" style={{ textDecoration: 'none', padding: '10px 28px' }}>
              🔄 Re-Order Items
            </Link>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
