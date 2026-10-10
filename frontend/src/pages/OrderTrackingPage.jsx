import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import { useCurrency } from '@/context/CurrencyContext';
import { useAuth } from '@/context/AuthContext';

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
  const { id: routeOrderId } = useParams();
  const { user, loading: authLoading } = useAuth();
  const { formatPrice } = useCurrency();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // If auth state is still loading, wait
    if (authLoading) return;

    // If user is not logged in, stop loading and render auth prompt
    if (!user) {
      setLoading(false);
      return;
    }

    async function loadUserOrders() {
      setLoading(true);
      const rawApi = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const API = rawApi.endsWith('/api/v1') ? rawApi : `${rawApi}/api/v1`;
      const token = localStorage.getItem('auraglow_token');

      try {
        // Fetch all orders placed by this user (check by token and by email)
        const userEmail = user?.email || '';
        const res = await fetch(`${API}/orders?email=${encodeURIComponent(userEmail)}`, {
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });

        if (res.ok) {
          const data = await res.json();
          const userOrders = data.orders || [];
          setOrders(userOrders);

          if (userOrders.length > 0) {
            // If route specified a specific order ID (e.g. /orders/AG-1234 or /orders/<uuid>)
            if (routeOrderId && routeOrderId !== 'demo') {
              const matched = userOrders.find(o =>
                o.orderId?.toLowerCase() === routeOrderId.toLowerCase() ||
                o._uuid?.toLowerCase() === routeOrderId.toLowerCase()
              );
              setSelectedOrder(matched || userOrders[0]);
            } else {
              setSelectedOrder(userOrders[0]);
            }
          } else {
            setSelectedOrder(null);
          }
          setLoading(false);
          return;
        }
      } catch (err) {
        console.warn('Orders fetch note:', err.message);
      }

      setLoading(false);
    }

    loadUserOrders();
  }, [user, authLoading, routeOrderId]);

  // Loading state
  if (authLoading || loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--color-bg-primary)' }}>
        <Navbar />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-4)', marginTop: 'var(--nav-height)' }}>
          <div style={{ fontSize: '3rem', animation: 'spin 2s linear infinite' }}>🌸</div>
          <p style={{ color: 'var(--color-text-secondary)' }}>Loading your orders & shipment status...</p>
        </div>
        <Footer />
      </div>
    );
  }

  // Guard 1: User not logged in (Real e-commerce requirement)
  if (!user) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--color-bg-primary)' }}>
        <Navbar />
        <main style={{ maxWidth: '640px', margin: 'var(--nav-height) auto 0', padding: 'var(--space-12) var(--space-6)', width: '100%', boxSizing: 'border-box', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(232, 114, 150, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '36px', marginBottom: 'var(--space-6)' }}>
            🔒
          </div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-3xl)', fontWeight: '800', color: 'var(--color-text-primary)', margin: '0 0 var(--space-3) 0' }}>
            Account Required to Track Orders
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-base)', lineHeight: 1.6, margin: '0 0 var(--space-8) 0', maxWidth: '480px' }}>
            For privacy and real-time shipment updates, please log in or create an account to view and track your AuraGlow orders.
          </p>
          <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap', justifyContent: 'center' }}>
            <Link to="/login" className="btn btn-primary btn-pill" style={{ padding: '12px 36px', textDecoration: 'none', fontWeight: '700' }}>
              Log In to Continue
            </Link>
            <Link to="/register" className="btn btn-secondary btn-pill" style={{ padding: '12px 32px', textDecoration: 'none' }}>
              Create an Account
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Guard 2: Logged in, but 0 prior orders (Real e-commerce requirement)
  if (orders.length === 0) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--color-bg-primary)' }}>
        <Navbar />
        <main style={{ maxWidth: '640px', margin: 'var(--nav-height) auto 0', padding: 'var(--space-12) var(--space-6)', width: '100%', boxSizing: 'border-box', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(100, 196, 157, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '36px', marginBottom: 'var(--space-6)' }}>
            🛍️
          </div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-3xl)', fontWeight: '800', color: 'var(--color-text-primary)', margin: '0 0 var(--space-3) 0' }}>
            No Orders Placed Yet
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-base)', lineHeight: 1.6, margin: '0 0 var(--space-4) 0', maxWidth: '480px' }}>
            Hi <strong style={{ color: 'var(--color-text-primary)' }}>{user.name || user.email}</strong>, you haven't placed any orders with AuraGlow yet.
          </p>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)', margin: '0 0 var(--space-8) 0', maxWidth: '440px' }}>
            Explore our curated clean skincare collection, place your first order, and your live delivery updates will appear right here!
          </p>
          <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap', justifyContent: 'center' }}>
            <Link to="/products" className="btn btn-primary btn-pill" style={{ padding: '12px 36px', textDecoration: 'none', fontWeight: '700' }}>
              ✨ Start Shopping
            </Link>
            <Link to="/quiz" className="btn btn-secondary btn-pill" style={{ padding: '12px 32px', textDecoration: 'none' }}>
              Take Skin Quiz
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Active view when user has placed orders
  const activeOrder = selectedOrder || orders[0];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--color-bg-primary)' }}>
      <Navbar />

      <main style={{ maxWidth: '960px', margin: 'var(--nav-height) auto 0', padding: 'var(--space-10) var(--space-8)', width: '100%', boxSizing: 'border-box', flex: 1 }}>

        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-6)' }}>
          <Link to="/" style={{ color: 'var(--color-text-muted)', textDecoration: 'none' }}>Home</Link>
          <span>/</span>
          <Link to="/profile" style={{ color: 'var(--color-text-muted)', textDecoration: 'none' }}>Account</Link>
          <span>/</span>
          <span style={{ color: 'var(--color-accent-rose)', fontWeight: '600' }}>Order Tracking</span>
        </div>

        {/* Header & Order Selector */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-8)', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
          <div>
            <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: '800', fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)', margin: 0 }}>
              📍 Live Order Tracking
            </h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)', margin: '4px 0 0 0' }}>
              Tracking Order <span style={{ color: 'var(--color-accent-rose)', fontWeight: '700', fontFamily: 'var(--font-heading)' }}>{activeOrder?.orderId}</span> · Status: <span style={{ textTransform: 'capitalize', fontWeight: '700', color: 'var(--color-accent-sage)' }}>{activeOrder?.status}</span>
            </p>
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}>
            {orders.length > 1 && (
              <select
                value={activeOrder?.orderId || ''}
                onChange={e => {
                  const sel = orders.find(o => o.orderId === e.target.value);
                  if (sel) setSelectedOrder(sel);
                }}
                className="input"
                style={{ padding: '8px 16px', fontSize: 'var(--text-xs)', cursor: 'pointer', maxWidth: '200px' }}
              >
                {orders.map(o => (
                  <option key={o.orderId} value={o.orderId}>
                    {o.orderId} ({formatDate(o.placedAt)})
                  </option>
                ))}
              </select>
            )}
            <Link to="/products" className="btn btn-secondary btn-sm btn-pill" style={{ textDecoration: 'none' }}>
              🛍️ Shop Again
            </Link>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>

          {/* Tracking Timeline */}
          <div style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-2xl)', padding: 'var(--space-8)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-8)' }}>
              <h3 style={{ fontSize: 'var(--text-base)', fontWeight: '700', color: 'var(--color-text-primary)', margin: 0 }}>
                Shipment Status
              </h3>
              <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                Placed: {formatDate(activeOrder?.placedAt)}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {(activeOrder?.trackingSteps || TRACKING_STAGES.map((s, idx) => ({ stage: s.label, done: idx === 0, date: activeOrder?.placedAt }))).map((step, i) => {
                const stageInfo = TRACKING_STAGES[i] || { icon: '📦', label: step.stage, desc: '' };
                const isLast = i === ((activeOrder?.trackingSteps?.length || 5) - 1);
                const isCurrent = step.done && (isLast || !activeOrder?.trackingSteps?.[i + 1]?.done);

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
                            Current Stage
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
                          Pending dispatch...
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Ordered Items summary */}
          {activeOrder?.items && activeOrder.items.length > 0 && (
            <div style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-2xl)', padding: 'var(--space-6)' }}>
              <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: '700', color: 'var(--color-text-primary)', margin: '0 0 var(--space-4) 0' }}>
                🌸 Items in this Shipment ({activeOrder.items.length})
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                {activeOrder.items.map((it, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 'var(--space-2)', borderBottom: idx !== activeOrder.items.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                    <div>
                      <p style={{ fontSize: 'var(--text-sm)', fontWeight: '600', color: 'var(--color-text-primary)', margin: 0 }}>
                        {it.name || it.product_name}
                      </p>
                      <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Quantity: {it.quantity}</span>
                    </div>
                    <span style={{ fontSize: 'var(--text-sm)', fontWeight: '700', color: 'var(--color-accent-rose)' }}>
                      {formatPrice(it.price * it.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Order Details Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-6)' }}>

            {/* Delivery Details */}
            <div style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-2xl)', padding: 'var(--space-6)' }}>
              <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: '700', color: 'var(--color-text-primary)', margin: '0 0 var(--space-4) 0' }}>📦 Delivery Details</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
                <div>
                  <span style={{ color: 'var(--color-text-muted)', display: 'block', marginBottom: '2px' }}>Recipient</span>
                  <span style={{ fontWeight: '600', color: 'var(--color-text-primary)' }}>
                    {activeOrder?.shippingAddress?.firstName ? `${activeOrder.shippingAddress.firstName} ${activeOrder.shippingAddress.lastName || ''}` : user.name || 'Valued Customer'}
                  </span>
                </div>
                <div>
                  <span style={{ color: 'var(--color-text-muted)', display: 'block', marginBottom: '2px' }}>Address</span>
                  <span>
                    {activeOrder?.shippingAddress?.address1 || activeOrder?.shippingAddress?.street || 'Standard Delivery'}<br />
                    {activeOrder?.shippingAddress?.city || 'Colombo'}, {activeOrder?.shippingAddress?.country || 'Sri Lanka'}
                  </span>
                </div>
                <div>
                  <span style={{ color: 'var(--color-text-muted)', display: 'block', marginBottom: '2px' }}>Est. Delivery</span>
                  <span style={{ fontWeight: '700', color: 'var(--color-accent-rose)' }}>{formatDate(activeOrder?.estimatedDelivery)}</span>
                </div>
              </div>
            </div>

            {/* Payment Summary */}
            <div style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-2xl)', padding: 'var(--space-6)' }}>
              <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: '700', color: 'var(--color-text-primary)', margin: '0 0 var(--space-4) 0' }}>💳 Payment</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
                <div>
                  <span style={{ color: 'var(--color-text-muted)', display: 'block', marginBottom: '2px' }}>Method</span>
                  <span style={{ fontWeight: '600', color: 'var(--color-text-primary)' }}>
                    {activeOrder?.paymentMethod?.brand || 'Stripe / Card'} ···· {activeOrder?.paymentMethod?.lastFour || '4242'}
                  </span>
                </div>
                <div>
                  <span style={{ color: 'var(--color-text-muted)', display: 'block', marginBottom: '2px' }}>Total Paid</span>
                  <span style={{ fontSize: 'var(--text-base)', fontWeight: '800', color: 'var(--color-accent-rose)' }}>
                    {activeOrder?.total ? formatPrice(activeOrder.total) : '—'}
                  </span>
                </div>
                <div>
                  <span style={{ color: 'var(--color-text-muted)', display: 'block', marginBottom: '2px' }}>Points Earned</span>
                  <span style={{ fontWeight: '700', color: 'var(--color-accent-gold)' }}>
                    +{Math.floor((activeOrder?.total || 0) / 100)} ⭐
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* Help / Re-Order actions */}
          <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', flexWrap: 'wrap', marginTop: 'var(--space-4)' }}>
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
