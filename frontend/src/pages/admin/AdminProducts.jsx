import React, { useState, useEffect } from 'react';
import { useCurrency } from '@/context/CurrencyContext';
import { supabase } from '@/lib/supabase';
import { products as mockProducts } from '@/data/mockData';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getStatus(stock) {
  if (stock === 0) return 'Out of Stock';
  if (stock < 20)  return 'Low Stock';
  return 'Active';
}

function getStatusBadge(status) {
  switch (status) {
    case 'Active':       return <span className="badge badge-vegan">Active</span>;
    case 'Low Stock':    return <span className="badge badge-low-stock">Low Stock</span>;
    case 'Out of Stock': return <span className="badge badge-out-of-stock">Out of Stock</span>;
    default:             return null;
  }
}

// Map Supabase product row → table-friendly shape
function normalize(p) {
  return {
    id:       p.id,
    name:     p.name,
    category: p.category ? p.category.charAt(0).toUpperCase() + p.category.slice(1) : '—',
    price:    parseFloat(p.price) || 0,
    stock:    p.stock_quantity ?? 0,
    status:   getStatus(p.stock_quantity ?? 0),
    brand:    p.brand,
  };
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function AdminProducts() {
  const { formatPrice } = useCurrency();
  const [products, setProducts]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);
  const [search, setSearch]         = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [showAddModal, setShowAddModal]      = useState(false);
  const [saving, setSaving]                 = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '', category: 'skincare', price: '', stock: '', description: '',
  });

  // Page title
  useEffect(() => { document.title = 'AuraGlow Admin — Inventory'; }, []);

  // ── Fetch products from Supabase ──────────────────────────────────────────
  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    setLoading(true);
    setError(null);
    const { data, error: err } = await supabase
      .from('products')
      .select('id, name, brand, category, price, stock_quantity')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (err) {
      console.error('[AdminProducts] Supabase error:', err.message);
      // Graceful fallback to mockData so the UI never breaks
      setProducts(mockProducts.map(normalize));
      setError('Could not reach database — showing demo data.');
    } else {
      setProducts((data || []).map(normalize));
    }
    setLoading(false);
  }

  // ── Add product ───────────────────────────────────────────────────────────
  async function handleAddProduct(e) {
    e.preventDefault();
    setSaving(true);
    const stockVal = parseInt(newProduct.stock) || 0;
    const payload = {
      name:           newProduct.name,
      brand:          'AuraGlow',
      category:       newProduct.category,
      description:    newProduct.description || 'New AuraGlow product.',
      price:          parseFloat(newProduct.price) || 0,
      stock_quantity: stockVal,
      is_vegan:       false,
      is_cruelty_free: true,
      is_active:      true,
      images:         [],
    };

    const { data, error: err } = await supabase
      .from('products')
      .insert([payload])
      .select('id, name, brand, category, price, stock_quantity')
      .single();

    if (err) {
      alert('Failed to save product: ' + err.message);
    } else {
      setProducts(prev => [normalize(data), ...prev]);
      setShowAddModal(false);
      setNewProduct({ name: '', category: 'skincare', price: '', stock: '', description: '' });
    }
    setSaving(false);
  }

  // ── Delete product (soft delete) ──────────────────────────────────────────
  async function handleDelete(id) {
    if (!window.confirm('Remove this product from the catalog?')) return;
    const { error: err } = await supabase
      .from('products')
      .update({ is_active: false })
      .eq('id', id);

    if (err) { alert('Delete failed: ' + err.message); return; }
    setProducts(prev => prev.filter(p => p.id !== id));
  }

  // ── Filtered view ─────────────────────────────────────────────────────────
  const categories = ['All', ...new Set(products.map(p => p.category))];
  const visible = products.filter(p => {
    const matchSearch   = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCategory = filterCategory === 'All' || p.category === filterCategory;
    return matchSearch && matchCategory;
  });

  // ── Stats ─────────────────────────────────────────────────────────────────
  const lowCount  = products.filter(p => p.status === 'Low Stock').length;
  const outCount  = products.filter(p => p.status === 'Out of Stock').length;

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-6)' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-2xl)' }}>Inventory Management</h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', marginTop: '4px' }}>
            {loading ? 'Loading…' : `${products.length} products`}
            {!loading && lowCount > 0 && <> &nbsp;·&nbsp; <span style={{ color: 'var(--color-warning)' }}>{lowCount} low stock</span></>}
            {!loading && outCount > 0 && <> &nbsp;·&nbsp; <span style={{ color: 'var(--color-error)' }}>{outCount} out of stock</span></>}
          </p>
          {error && <p style={{ color: 'var(--color-warning)', fontSize: 'var(--text-xs)', marginTop: '4px' }}>⚠ {error}</p>}
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => setShowAddModal(true)}>+ Add Product</button>
      </div>

      {/* Search & Filter */}
      <div style={{ display: 'flex', gap: 'var(--space-3)', marginBottom: 'var(--space-4)', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="🔍  Search products…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ flex: 1, minWidth: '200px' }}
        />
        <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)} style={{ width: 'auto' }}>
          {categories.map(c => <option key={c}>{c}</option>)}
        </select>
        <button className="btn btn-ghost btn-sm" onClick={fetchProducts} title="Refresh from database">↻ Refresh</button>
      </div>

      {/* Table */}
      <div className="card glass fade-in-up delay-2" style={{ padding: 0, overflowX: 'auto' }}>
        {loading ? (
          <div style={{ padding: 'var(--space-12)', textAlign: 'center', color: 'var(--color-text-muted)' }}>
            <div style={{ fontSize: '24px', marginBottom: 'var(--space-3)' }}>⏳</div>
            Loading products from database…
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-border)', background: 'rgba(255,255,255,0.02)' }}>
                {['ID', 'Product Name', 'Category', 'Price', 'Stock', 'Status', 'Actions'].map((h, i) => (
                  <th key={h} style={{ padding: 'var(--space-4)', color: 'var(--color-text-secondary)', fontWeight: '600', fontSize: 'var(--text-sm)', textAlign: i === 6 ? 'right' : 'left' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visible.map(p => (
                <tr key={p.id} style={{ borderBottom: '1px solid var(--color-border)', transition: 'background 0.15s ease' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <td style={{ padding: 'var(--space-4)', fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', fontFamily: 'monospace' }}>
                    {String(p.id).slice(0, 8)}…
                  </td>
                  <td style={{ padding: 'var(--space-4)', fontSize: 'var(--text-sm)', fontWeight: '500' }}>{p.name}</td>
                  <td style={{ padding: 'var(--space-4)', fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>{p.category}</td>
                  <td style={{ padding: 'var(--space-4)', fontSize: 'var(--text-sm)' }}>{formatPrice(p.price)}</td>
                  <td style={{ padding: 'var(--space-4)', fontSize: 'var(--text-sm)', fontWeight: p.stock < 20 ? '700' : '400' }}>{p.stock}</td>
                  <td style={{ padding: 'var(--space-4)' }}>{getStatusBadge(p.status)}</td>
                  <td style={{ padding: 'var(--space-4)', textAlign: 'right' }}>
                    <button className="btn btn-ghost btn-sm" style={{ marginRight: 'var(--space-2)' }}>Edit</button>
                    <button className="btn btn-ghost btn-sm" style={{ color: 'var(--color-error)' }} onClick={() => handleDelete(p.id)}>Delete</button>
                  </td>
                </tr>
              ))}
              {visible.length === 0 && !loading && (
                <tr>
                  <td colSpan="7" style={{ padding: 'var(--space-10)', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                    No products match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fade-in" style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(13,13,15,0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-4)' }}>
          <div className="card glass-strong scale-in" style={{ width: '100%', maxWidth: '520px', padding: 'var(--space-6)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-5)' }}>
              <h3 style={{ fontFamily: 'var(--font-heading)' }}>Add New Product</h3>
              <button className="btn btn-ghost btn-sm btn-icon" onClick={() => setShowAddModal(false)}>✕</button>
            </div>
            <form onSubmit={handleAddProduct} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <div>
                <label style={{ display: 'block', fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>Product Name *</label>
                <input type="text" value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} required placeholder="e.g., Hydrating Mist" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>Description</label>
                <input type="text" value={newProduct.description} onChange={e => setNewProduct({ ...newProduct, description: e.target.value })} placeholder="Brief product description" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>Category *</label>
                <select value={newProduct.category} onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}>
                  <option value="skincare">Skincare</option>
                  <option value="makeup">Makeup</option>
                  <option value="fragrance">Fragrance</option>
                  <option value="tools">Tools</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>Base Price (LKR) *</label>
                  <input type="number" value={newProduct.price} onChange={e => setNewProduct({ ...newProduct, price: e.target.value })} required placeholder="4500" min="1" />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>Initial Stock *</label>
                  <input type="number" value={newProduct.stock} onChange={e => setNewProduct({ ...newProduct, stock: e.target.value })} required placeholder="100" min="0" />
                </div>
              </div>
              <div style={{ marginTop: 'var(--space-2)', display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
                <button type="button" className="btn btn-ghost" onClick={() => setShowAddModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Saving…' : 'Save to Database'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
