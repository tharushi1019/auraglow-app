import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';
import CosmeticDoodles from '../components/CosmeticDoodles';

const SKIN_TYPE_EMOJI = {
  dry: '💧', oily: '✨', combination: '⚖️', sensitive: '🌿', normal: '🌸',
};

const SKIN_TYPE_COLOR = {
  dry: '#6AADE4', oily: '#D4A76A', combination: '#9D7AB8', sensitive: '#7ABD8E', normal: '#D47A6A',
};

export default function Profile() {
  const { user, skinProfile, logout, loading } = useAuth();
  const { formatPrice } = useCurrency();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login?redirect=/profile', { replace: true });
    }
  }, [user, loading, navigate]);

  // Load user's live orders to display on profile
  useEffect(() => {
    if (!user) return;
    async function fetchOrders() {
      setLoadingOrders(true);
      try {
        const rawApi = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const API = rawApi.endsWith('/api/v1') ? rawApi : `${rawApi}/api/v1`;
        const token = localStorage.getItem('auraglow_token');

        const res = await fetch(`${API}/orders?email=${encodeURIComponent(user.email || '')}`, {
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });

        if (res.ok) {
          const data = await res.json();
          setOrders(data.orders || []);
        }
      } catch (err) {
        console.warn('Profile orders load warning:', err.message);
      } finally {
        setLoadingOrders(false);
      }
    }
    fetchOrders();
  }, [user]);

  function handleLogout() {
    logout();
    navigate('/login');
  }

  const skinType = skinProfile?.skin_type || '';
  const skinEmoji = SKIN_TYPE_EMOJI[skinType.toLowerCase()] || '🌸';
  const skinColor = SKIN_TYPE_COLOR[skinType.toLowerCase()] || 'var(--color-accent-rose)';

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
    : '?';

  // Format Member Since with fallback to today's date if user row is brand new
  const memberDate = user?.created_at || user?.createdAt;
  const memberSince = memberDate
    ? new Date(memberDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
    : new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <>
      <CosmeticDoodles />
      <div className="auth-container-wide" style={{ maxWidth: '780px', margin: '0 auto', padding: '2rem 1.5rem 4rem' }}>

        <h1 className="page-title">My Profile</h1>
        <p className="page-subtitle">Your account details, skin profile &amp; order history.</p>

        {/* ── Avatar + Account Card ──────────────────────────────────────── */}
        <div className="auth-card" style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '1.5rem' }}>
            <div style={{
              width: '68px', height: '68px', borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--color-accent-rose), var(--color-accent-gold))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.5rem', fontWeight: '700', color: '#fff', flexShrink: 0,
              boxShadow: '0 4px 20px rgba(212,122,106,0.35)',
            }}>
              {initials}
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.3rem', fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}>
                {user?.name || 'AuraGlow Member'}
              </h2>
              <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                {user?.role === 'admin' ? '👑 Admin Account' : '🌸 Member Account'}
              </p>
            </div>
          </div>

          <div className="profile-row">
            <span className="profile-label">Email</span>
            <span className="profile-value">{user?.email || '—'}</span>
          </div>
          <div className="profile-row">
            <span className="profile-label">Member Since</span>
            <span className="profile-value" style={{ fontWeight: '600', color: 'var(--color-accent-rose)' }}>{memberSince}</span>
          </div>
          <div className="profile-row" style={{ border: 'none', paddingBottom: 0 }}>
            <span className="profile-label">Account Role</span>
            <span className="profile-value" style={{ textTransform: 'capitalize' }}>{user?.role || 'customer'}</span>
          </div>
        </div>

        {/* ── My Orders Card (List View like Wishlist & Cart) ─────────────── */}
        <div className="auth-card" style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.3rem' }}>📦</span>
              <h3 style={{ margin: 0, fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)', fontSize: '1.15rem' }}>
                My Orders
              </h3>
              {orders.length > 0 && (
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  background: 'rgba(232,180,160,0.15)',
                  color: 'var(--color-accent-rose)',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  border: '1px solid rgba(232,180,160,0.3)',
                }}>
                  {orders.length}
                </span>
              )}
            </div>

            <Link
              to="/orders"
              className="btn btn-secondary btn-sm"
              style={{ padding: '6px 14px', fontSize: '0.8rem', textDecoration: 'none' }}
            >
              📍 Track Live Shipment →
            </Link>
          </div>

          {loadingOrders ? (
            <div style={{ textAlign: 'center', padding: '1.5rem 0', color: 'var(--color-text-muted)' }}>
              <span style={{ display: 'inline-block', animation: 'spin 1.5s linear infinite', fontSize: '1.5rem', marginBottom: '6px' }}>🌸</span>
              <p style={{ margin: 0, fontSize: '0.85rem' }}>Loading your orders...</p>
            </div>
          ) : orders.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '2rem 1rem',
              background: 'rgba(255,255,255,0.02)',
              borderRadius: '12px',
              border: '1px dashed var(--color-border)',
            }}>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', margin: '0 0 1rem 0' }}>
                You haven't placed any orders yet.
              </p>
              <Link to="/products" className="btn btn-primary btn-sm btn-pill" style={{ textDecoration: 'none', padding: '8px 24px' }}>
                🛍️ Browse Clean Products
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {orders.map((order) => {
                const badgeColor =
                  order.status === 'delivered' ? 'var(--color-accent-sage)' :
                  order.status === 'shipped' ? 'var(--color-accent-lavender)' :
                  order.status === 'processing' ? 'var(--color-accent-gold)' : 'var(--color-accent-rose)';

                const dateStr = order.placedAt
                  ? new Date(order.placedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
                  : 'Recent';

                return (
                  <div
                    key={order.orderId || order._uuid}
                    style={{
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid var(--color-border)',
                      borderRadius: '12px',
                      padding: '1rem 1.25rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '12px',
                      transition: 'border-color 0.2s ease',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <span style={{ fontFamily: 'monospace', fontWeight: '700', color: 'var(--color-text-primary)', fontSize: '0.95rem' }}>
                          {order.orderId}
                        </span>
                        <span style={{
                          fontSize: '0.72rem',
                          fontWeight: '700',
                          textTransform: 'uppercase',
                          letterSpacing: '0.04em',
                          color: badgeColor,
                          background: `${badgeColor}15`,
                          border: `1px solid ${badgeColor}40`,
                          padding: '2px 8px',
                          borderRadius: '12px',
                        }}>
                          {order.status || 'Pending'}
                        </span>
                      </div>
                      <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                        Placed on {dateStr} · {order.items ? order.items.length : 1} item{order.items && order.items.length > 1 ? 's' : ''}
                      </p>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <span style={{ fontSize: '1.05rem', fontWeight: '800', color: 'var(--color-accent-rose)' }}>
                        {formatPrice(order.total)}
                      </span>
                      <Link
                        to={`/orders/${order.orderId}`}
                        className="btn btn-secondary btn-sm"
                        style={{ padding: '6px 14px', fontSize: '0.78rem', textDecoration: 'none', borderRadius: '20px' }}
                      >
                        Track ➔
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Skin Profile Card ─────────────────────────────────────────── */}
        <div className="auth-card" style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ margin: 0, fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}>
              🔬 Skin Profile
            </h3>
            <Link to="/skin-quiz" style={{
              fontSize: '0.8rem', color: 'var(--color-accent-rose)', textDecoration: 'none',
              border: '1px solid rgba(212,122,106,0.4)', borderRadius: '20px', padding: '4px 12px',
            }}>
              {skinProfile ? 'Retake Quiz' : 'Take Quiz'}
            </Link>
          </div>

          {skinProfile ? (
            <>
              {/* Skin Type Badge */}
              <div style={{
                background: `${skinColor}18`, border: `1px solid ${skinColor}40`,
                borderRadius: '12px', padding: '1rem 1.25rem', marginBottom: '1rem',
                display: 'flex', alignItems: 'center', gap: '0.75rem',
              }}>
                <span style={{ fontSize: '1.75rem' }}>{skinEmoji}</span>
                <div>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Skin Type</p>
                  <p style={{ margin: '2px 0 0', fontSize: '1.1rem', fontWeight: '700', color: skinColor, textTransform: 'capitalize' }}>
                    {skinType || 'Not set'}
                  </p>
                </div>
                {skinProfile.skin_tone && (
                  <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Skin Tone</p>
                    <p style={{ margin: '2px 0 0', fontSize: '0.95rem', fontWeight: '600', color: 'var(--color-text-primary)', textTransform: 'capitalize' }}>
                      🎨 {skinProfile.skin_tone} ({skinProfile.undertone})
                    </p>
                  </div>
                )}
              </div>

              {/* Concerns */}
              {skinProfile.concerns?.length > 0 && (
                <div className="profile-row">
                  <span className="profile-label">Skin Concerns</span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', justifyContent: 'flex-end' }}>
                    {skinProfile.concerns.map(c => (
                      <span key={c} style={{
                        background: 'rgba(212,122,106,0.12)', color: 'var(--color-accent-rose)',
                        border: '1px solid rgba(212,122,106,0.3)', borderRadius: '20px',
                        padding: '2px 10px', fontSize: '0.78rem', fontWeight: '600',
                      }}>{c}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Allergens */}
              {skinProfile.allergens?.length > 0 && skinProfile.allergens[0] !== 'None' && (
                <div className="profile-row" style={{ border: 'none', paddingBottom: 0 }}>
                  <span className="profile-label">Avoid Ingredients</span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', justifyContent: 'flex-end' }}>
                    {skinProfile.allergens.map(a => (
                      <span key={a} style={{
                        background: 'rgba(180,100,100,0.1)', color: '#C47070',
                        border: '1px solid rgba(180,100,100,0.3)', borderRadius: '20px',
                        padding: '2px 10px', fontSize: '0.78rem', fontWeight: '600',
                      }}>{a}</span>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
              <p style={{ color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
                You haven't taken the Skin Quiz yet. Take it to unlock personalized product recommendations!
              </p>
              <Link to="/skin-quiz" className="btn btn-primary" style={{ textDecoration: 'none', display: 'inline-block' }}>
                Take Skin Quiz ✨
              </Link>
            </div>
          )}
        </div>

        {/* ── Quick Actions ────────────────────────────────────────────────── */}
        <div className="auth-card" style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ margin: '0 0 1rem', fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}>
            Quick Actions
          </h3>
          <div className="profile-actions-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            {[
              { icon: '🛍️', label: 'Browse Products', href: '/products' },
              { icon: '🤖', label: 'AI Routine Advisor', href: '/recommendations' },
              { icon: '❤️', label: 'My Wishlist', href: '/wishlist' },
              { icon: '📦', label: 'Track My Orders', href: '/orders' },
            ].map(action => (
              <Link key={action.href} to={action.href} style={{
                display: 'flex', alignItems: 'center', gap: '0.6rem',
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(232,180,160,0.12)',
                borderRadius: '10px', padding: '0.75rem 1rem', textDecoration: 'none',
                color: 'var(--color-text-primary)', fontSize: '0.88rem', fontWeight: '600',
                transition: 'all 0.2s ease',
              }}>
                <span style={{ fontSize: '1.2rem' }}>{action.icon}</span>
                {action.label}
              </Link>
            ))}
          </div>
        </div>

        {/* ── Logout ───────────────────────────────────────────────────────── */}
        <button
          className="btn btn-secondary"
          onClick={handleLogout}
          style={{ width: '100%', marginTop: '0.5rem' }}
        >
          Log Out
        </button>

      </div>
    </>
  );
}
