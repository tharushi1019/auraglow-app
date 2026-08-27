import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import { useCurrency } from '@/context/CurrencyContext';

/* ─── Confetti Particle ─────────────────────────────────────────────────── */
function Confetti() {
  const colors = ['var(--color-accent-rose)', 'var(--color-accent-lavender)', 'var(--color-accent-gold)', 'var(--color-accent-sage)', '#fff'];
  const particles = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    animDelay: `${Math.random() * 2}s`,
    size: `${6 + Math.random() * 8}px`,
    color: colors[Math.floor(Math.random() * colors.length)],
    duration: `${2 + Math.random() * 2}s`,
  }));

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '300px', overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
      {particles.map(p => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            left: p.left,
            top: '-20px',
            width: p.size,
            height: p.size,
            background: p.color,
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
            animation: `confettiFall ${p.duration} ${p.animDelay} ease-in forwards`,
            opacity: 0.8,
          }}
        />
      ))}
      <style>{`
        @keyframes confettiFall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(350px) rotate(720deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

export default function OrderConfirmationPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { formatPrice } = useCurrency();
  const [show, setShow] = useState(false);

  const order = location.state?.order || {
    orderId: 'AG-2847-5391',
    estimatedDelivery: new Date(Date.now() + 5 * 86400000).toISOString(),
    total: 15800,
    shippingAddress: { firstName: 'Nimesha', lastName: 'Perera', city: 'Colombo', country: 'Sri Lanka' },
    paymentMethod: { lastFour: '4242', brand: 'Visa' },
  };

  useEffect(() => {
    // Entrance animation
    setTimeout(() => setShow(true), 100);
  }, []);

  const deliveryDate = new Date(order.estimatedDelivery).toLocaleDateString('en-US', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--color-bg-primary)' }}>
      <Navbar />

      <main style={{
        flex: 1,
        maxWidth: '680px',
        margin: 'var(--nav-height) auto 0',
        padding: 'var(--space-12) var(--space-8)',
        width: '100%',
        boxSizing: 'border-box',
        position: 'relative',
      }}>
        <Confetti />

        <div style={{
          position: 'relative', zIndex: 1,
          textAlign: 'center',
          opacity: show ? 1 : 0,
          transform: show ? 'translateY(0)' : 'translateY(30px)',
          transition: 'all 600ms cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}>
          {/* Success Check Animation */}
          <div style={{
            width: '100px', height: '100px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(100,196,157,0.3), rgba(100,196,157,0.1))',
            border: '3px solid var(--color-accent-sage)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '50px',
            margin: '0 auto var(--space-6)',
            boxShadow: '0 0 40px rgba(100, 196, 157, 0.4)',
            animation: 'pulseGlow 2s ease-in-out infinite',
          }}>
            ✅
          </div>

          <h1 style={{
            fontSize: 'var(--text-3xl)',
            fontWeight: '800',
            fontFamily: 'var(--font-heading)',
            color: 'var(--color-text-primary)',
            marginBottom: 'var(--space-3)',
          }}>
            Order Placed! 🌸
          </h1>

          <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-base)', marginBottom: 'var(--space-2)', lineHeight: 1.6, wordBreak: 'break-word' }}>
            Thank you, <strong style={{ color: 'var(--color-accent-rose)' }}>{order.shippingAddress?.firstName}</strong>! Your AuraGlow order is confirmed.
          </p>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)', margin: 0 }}>
            A confirmation email has been sent to your registered email address.
          </p>

          {/* Order Details Card */}
          <div style={{
            background: 'var(--color-bg-card)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-2xl)',
            padding: 'var(--space-8)',
            textAlign: 'left',
            marginTop: 'var(--space-8)',
          }}>
            {/* Order ID */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-4)',
              paddingBottom: 'var(--space-5)', borderBottom: '1px solid var(--color-border)',
              marginBottom: 'var(--space-5)',
            }}>
              <div style={{ wordBreak: 'break-word' }}>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 4px 0' }}>Order Number</p>
                <p style={{ fontSize: 'var(--text-xl)', fontWeight: '800', fontFamily: 'var(--font-heading)', color: 'var(--color-accent-rose)', margin: 0, letterSpacing: '1px' }}>
                  {order.orderId}
                </p>
              </div>
              <div style={{
                background: 'rgba(100, 196, 157, 0.15)',
                border: '1px solid rgba(100, 196, 157, 0.4)',
                borderRadius: 'var(--radius-full)',
                padding: '4px 14px',
                fontSize: 'var(--text-xs)',
                fontWeight: '700',
                color: 'var(--color-accent-sage)',
              }}>
                ✓ Confirmed
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-6)' }}>

              {/* Left Column */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
                <div>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 6px 0' }}>📦 Ship To</p>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.6, wordBreak: 'break-word' }}>
                    {order.shippingAddress?.firstName} {order.shippingAddress?.lastName}<br />
                    {order.shippingAddress?.city}, {order.shippingAddress?.country}
                  </p>
                </div>

                <div>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 6px 0' }}>💳 Payment</p>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', margin: 0 }}>
                    {order.paymentMethod?.brand} ···· {order.paymentMethod?.lastFour}
                  </p>
                </div>
              </div>

              {/* Right Column */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
                <div>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 6px 0' }}>📅 Est. Delivery</p>
                  <p style={{ fontSize: 'var(--text-sm)', fontWeight: '600', color: 'var(--color-text-primary)', margin: 0 }}>
                    {deliveryDate}
                  </p>
                </div>

                <div>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 6px 0' }}>💰 Total Paid</p>
                  <p style={{ fontSize: 'var(--text-base)', fontWeight: '800', color: 'var(--color-accent-rose)', margin: 0 }}>
                    {order.total ? formatPrice(order.total) : '—'}
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* Loyalty Points Banner */}
          {order.total && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 'var(--space-4)', flexWrap: 'wrap',
              background: 'linear-gradient(135deg, rgba(232,200,114,0.15), rgba(232,200,114,0.05))',
              border: '1px solid rgba(232,200,114,0.35)',
              borderRadius: 'var(--radius-xl)',
              padding: 'var(--space-4) var(--space-6)',
              marginTop: 'var(--space-6)',
              textAlign: 'left',
              wordBreak: 'break-word',
            }}>
              <span style={{ fontSize: '32px' }}>⭐</span>
              <div>
                <p style={{ fontSize: 'var(--text-sm)', fontWeight: '700', color: 'var(--color-accent-gold)', margin: 0 }}>
                  +{Math.floor(order.total / 100)} AuraGlow Points Earned!
                </p>
                <p style={{ fontSize: '11px', color: 'var(--color-text-muted)', margin: 0 }}>
                  Points will be credited after delivery confirmation.
                </p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: 'var(--space-4)', marginTop: 'var(--space-8)', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              to={`/orders/${order.orderId}`}
              className="btn btn-primary btn-pill"
              style={{ padding: '12px 32px', textDecoration: 'none', fontWeight: '700' }}
            >
              📍 Track My Order
            </Link>
            <Link
              to="/products"
              className="btn btn-secondary btn-pill"
              style={{ padding: '12px 32px', textDecoration: 'none' }}
            >
              Continue Shopping →
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
