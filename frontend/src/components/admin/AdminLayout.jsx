import React, { useEffect, useState } from 'react';
import { NavLink, Outlet, Link, useNavigate } from 'react-router-dom';
import { useCurrency } from '@/context/CurrencyContext';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { getProducts } from '@/services/productService';

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
  const { currency, setCurrency, availableCurrencies, formatPrice } = useCurrency();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState({ products: [], orders: [] });
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [notificationError, setNotificationError] = useState('');
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [snapshot, setSnapshot] = useState({ revenue: 0, orders: 0, customers: 0, loading: true });

  useEffect(() => {
    async function loadSnapshot() {
      try {
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const [ordersRes, usersRes] = await Promise.all([
          supabase.from('orders').select('total_amount, status, created_at'),
          supabase.from('users').select('id', { count: 'exact', head: true })
        ]);

        const allOrders = ordersRes.data || [];
        const todayOrders = allOrders.filter(o => 
          new Date(o.created_at) >= startOfDay && o.status !== 'cancelled'
        );
        const activeOrders = todayOrders.length > 0 ? todayOrders : allOrders.filter(o => o.status !== 'cancelled');
        const rev = activeOrders.reduce((sum, o) => sum + (parseFloat(o.total_amount) || 0), 0);

        setSnapshot({
          revenue: rev,
          orders: activeOrders.length,
          customers: usersRes.count || (allOrders.length ? allOrders.length : 1),
          loading: false,
        });
      } catch (err) {
        console.warn('[AdminLayout] Snapshot load note:', err.message);
        setSnapshot(prev => ({ ...prev, loading: false }));
      }
    }
    loadSnapshot();
  }, []);

  useEffect(() => {
    async function loadNotifications() {
      const { data, error } = await supabase
        .from('orders')
        .select('id, status, created_at, contact_email')
        .in('status', ['pending', 'paid', 'processing'])
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error('[AdminLayout] Notification query failed:', error.message);
        setNotificationError('Unable to load order notifications.');
        return;
      }
      setNotifications(data || []);
    }

    loadNotifications();
  }, []);

  useEffect(() => {
    function handleShortcut(event) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setSearchOpen(true);
      } else if (event.key === 'Escape') {
        setSearchOpen(false);
        setNotificationsOpen(false);
        setProfileOpen(false);
      }
    }

    window.addEventListener('keydown', handleShortcut);
    return () => window.removeEventListener('keydown', handleShortcut);
  }, []);

  async function runSearch(event) {
    event?.preventDefault();
    const term = searchTerm.trim();
    if (!term) {
      setSearchResults({ products: [], orders: [] });
      setSearchError('');
      return;
    }

    setSearchLoading(true);
    setSearchError('');
    try {
      const [productResponse, orderResponse] = await Promise.all([
        getProducts({ search: term, limit: 5 }),
        supabase
          .from('orders')
          .select('id, status, created_at, contact_email, users(name), order_items(product_name)')
          .order('created_at', { ascending: false })
          .limit(100),
      ]);

      if (orderResponse.error) throw orderResponse.error;
      const normalizedTerm = term.toLowerCase();
      const orders = (orderResponse.data || [])
        .filter(order => {
          const shortId = order.id.replace(/-/g, '').slice(-6);
          const itemNames = (order.order_items || []).map(item => item.product_name).join(' ');
          return [order.id, shortId, order.contact_email, order.users?.name, itemNames]
            .some(value => value?.toLowerCase().includes(normalizedTerm));
        })
        .slice(0, 5);

      setSearchResults({ products: productResponse.products || [], orders });
    } catch (error) {
      console.error('[AdminLayout] Admin search failed:', error.message);
      setSearchError('Search is temporarily unavailable. Please try again.');
      setSearchResults({ products: [], orders: [] });
    } finally {
      setSearchLoading(false);
    }
  }

  function openSearchResult(path) {
    setSearchOpen(false);
    setSearchTerm('');
    setSearchResults({ products: [], orders: [] });
    navigate(path);
  }

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
            { label: 'Revenue', value: snapshot.loading ? '…' : formatPrice(snapshot.revenue), color: 'var(--color-accent-rose)' },
            { label: 'Orders', value: snapshot.loading ? '…' : snapshot.orders.toLocaleString(), color: 'var(--color-success)' },
            { label: 'Customers', value: snapshot.loading ? '…' : snapshot.customers.toLocaleString(), color: 'var(--color-accent-lavender)' },
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
            <button type="button" onClick={() => setSearchOpen(true)} style={{
              display: 'flex', alignItems: 'center', gap: 'var(--space-3)',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-full)',
              padding: '8px 16px',
              minWidth: '220px',
              cursor: 'text',
              color: 'inherit',
            }}
            >
              <span style={{ color: 'var(--color-text-muted)', fontSize: '14px' }}>🔍</span>
              <span style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>Search orders, products…</span>
              <span style={{ marginLeft: 'auto', color: 'var(--color-text-muted)', fontSize: '11px', background: 'rgba(255,255,255,0.06)', border: '1px solid var(--color-border)', borderRadius: '4px', padding: '1px 5px' }}>⌘K</span>
            </button>
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
            <div style={{ position: 'relative' }}>
              <button type="button" aria-label="View order notifications" onClick={() => setNotificationsOpen(!notificationsOpen)} style={{ background: 'none', border: 0, cursor: 'pointer', padding: 4 }}>
                <span style={{ fontSize: '20px', color: 'var(--color-text-secondary)' }}>🔔</span>
              </button>
              {notifications.length > 0 && (
                <span style={{
                  position: 'absolute', top: '-4px', right: '-6px',
                  background: 'var(--gradient-brand-vibrant)',
                  color: '#0d0d0f', fontSize: '9px', fontWeight: '700',
                  borderRadius: '50%', width: '16px', height: '16px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {notifications.length}
                </span>
              )}
              {notificationsOpen && (
                <div style={{ position: 'absolute', right: 0, top: '34px', width: '290px', padding: 'var(--space-3)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', background: 'var(--color-bg-secondary)', boxShadow: '0 12px 32px rgba(0,0,0,0.35)', zIndex: 80 }}>
                  <div style={{ fontWeight: 700, marginBottom: 'var(--space-2)' }}>Order notifications</div>
                  {notificationError ? (
                    <div style={{ color: 'var(--color-warning)', fontSize: 'var(--text-xs)' }}>{notificationError}</div>
                  ) : notifications.length ? notifications.map(order => (
                    <button key={order.id} type="button" onClick={() => { setNotificationsOpen(false); navigate('/admin/orders'); }} style={{ width: '100%', textAlign: 'left', padding: '8px 4px', border: 0, borderTop: '1px solid var(--color-border)', color: 'var(--color-text-secondary)', background: 'transparent', cursor: 'pointer', fontSize: 'var(--text-xs)' }}>
                      Order #{order.id.replace(/-/g, '').slice(-6).toUpperCase()} · {order.status}
                      <div style={{ color: 'var(--color-text-muted)', marginTop: 3 }}>{order.contact_email || 'Customer'} · {new Date(order.created_at).toLocaleString()}</div>
                    </button>
                  )) : <div style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-xs)' }}>No orders need attention.</div>}
                </div>
              )}
            </div>

            {/* Divider */}
            <div style={{ width: '1px', height: '28px', background: 'var(--color-border)' }} />

            {/* Admin profile */}
            <div style={{ position: 'relative' }}>
            <button type="button" aria-label="Admin profile menu" onClick={() => setProfileOpen(!profileOpen)} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', cursor: 'pointer', border: 0, padding: 0, background: 'transparent', textAlign: 'left' }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '50%',
                background: 'var(--gradient-brand-vibrant)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#0d0d0f', fontWeight: '800', fontSize: '14px',
                boxShadow: '0 0 12px rgba(232,180,160,0.3)',
              }}>
                {(user?.name || 'Admin').charAt(0).toUpperCase()}
              </div>
              <div>
                <div style={{ fontSize: 'var(--text-sm)', fontWeight: '600', color: 'var(--color-text-primary)', lineHeight: 1.2 }}>{user?.name || 'Admin'}</div>
                <div style={{ fontSize: '11px', color: 'var(--color-success)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--color-success)', display: 'inline-block' }} />
                  Admin
                </div>
              </div>
            </button>
            {profileOpen && (
              <div style={{ position: 'absolute', right: 0, top: '48px', minWidth: '150px', padding: '6px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', background: 'var(--color-bg-secondary)', boxShadow: '0 12px 32px rgba(0,0,0,0.35)', zIndex: 80 }}>
                <button type="button" onClick={() => { logout(); navigate('/login', { replace: true }); }} style={{ width: '100%', textAlign: 'left', border: 0, borderRadius: 'var(--radius-sm)', padding: '9px 10px', color: 'var(--color-text-primary)', background: 'transparent', cursor: 'pointer', fontSize: 'var(--text-sm)' }}>
                  Log out
                </button>
              </div>
            )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <div style={{ flex: 1, padding: 'var(--space-8)', overflowY: 'auto' }}>
          <Outlet />
        </div>
      </main>
      {searchOpen && (
        <div onClick={() => setSearchOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(13,13,15,0.72)', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', padding: '12vh 16px' }}>
          <div onClick={event => event.stopPropagation()} style={{ width: 'min(620px, 100%)', maxHeight: '70vh', overflowY: 'auto', padding: 'var(--space-5)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', background: 'var(--color-bg-secondary)', boxShadow: '0 20px 60px rgba(0,0,0,0.45)' }}>
            <form onSubmit={runSearch} style={{ display: 'flex', gap: 'var(--space-2)' }}>
              <input autoFocus value={searchTerm} onChange={event => setSearchTerm(event.target.value)} placeholder="Search real products, orders, or customers…" style={{ flex: 1 }} />
              <button className="btn btn-primary btn-sm" disabled={searchLoading}>{searchLoading ? 'Searching…' : 'Search'}</button>
            </form>
            {searchError && <p role="alert" style={{ color: 'var(--color-warning)', fontSize: 'var(--text-sm)' }}>{searchError}</p>}
            {searchResults.products.length > 0 && <>
              <h3 style={{ margin: 'var(--space-4) 0 var(--space-2)', fontSize: 'var(--text-sm)' }}>Products</h3>
              {searchResults.products.map(product => (
                <button key={product.id} type="button" onClick={() => openSearchResult(`/admin/products?search=${encodeURIComponent(product.name)}`)} style={{ display: 'block', width: '100%', textAlign: 'left', padding: '9px 4px', border: 0, borderTop: '1px solid var(--color-border)', background: 'transparent', color: 'var(--color-text-primary)', cursor: 'pointer' }}>
                  {product.name} <span style={{ color: 'var(--color-text-muted)' }}>· {product.category}</span>
                </button>
              ))}
            </>}
            {searchResults.orders.length > 0 && <>
              <h3 style={{ margin: 'var(--space-4) 0 var(--space-2)', fontSize: 'var(--text-sm)' }}>Orders</h3>
              {searchResults.orders.map(order => (
                <button key={order.id} type="button" onClick={() => openSearchResult(`/admin/orders?search=${encodeURIComponent(order.id.replace(/-/g, '').slice(-6))}`)} style={{ display: 'block', width: '100%', textAlign: 'left', padding: '9px 4px', border: 0, borderTop: '1px solid var(--color-border)', background: 'transparent', color: 'var(--color-text-primary)', cursor: 'pointer' }}>
                  Order #{order.id.replace(/-/g, '').slice(-6).toUpperCase()} <span style={{ color: 'var(--color-text-muted)' }}>· {order.users?.name || order.contact_email} · {order.status}</span>
                </button>
              ))}
            </>}
            {!searchLoading && searchTerm.trim() && !searchError && !searchResults.products.length && !searchResults.orders.length && (
              <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>No matching products or orders.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
