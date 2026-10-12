import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useCurrency } from '@/context/CurrencyContext';
import { supabase } from '@/lib/supabase';
import { products as mockProducts } from '@/data/mockData';
import { uploadImageToImgBB } from '@/services/imgbbService';

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
  const rawImages = Array.isArray(p.images)
    ? p.images
    : (typeof p.images === 'string' && p.images.startsWith('[')
        ? (() => { try { return JSON.parse(p.images); } catch { return [p.images]; } })()
        : (p.images ? [p.images] : []));

  return {
    id:          p.id,
    name:        p.name,
    category:    p.category ? p.category.charAt(0).toUpperCase() + p.category.slice(1) : '—',
    price:       parseFloat(p.price) || 0,
    stock:       p.stock_quantity ?? 0,
    status:      getStatus(p.stock_quantity ?? 0),
    brand:       p.brand || 'AuraGlow',
    description: p.description || '',
    images:      rawImages,
    image:       rawImages[0] || 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=150&q=80',
  };
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function AdminProducts() {
  const [searchParams] = useSearchParams();
  const { formatPrice } = useCurrency();
  const [products, setProducts]             = useState([]);
  const [loading, setLoading]               = useState(true);
  const [error, setError]                   = useState(null);
  const [search, setSearch]                 = useState(() => searchParams.get('search') || '');
  const [filterCategory, setFilterCategory] = useState('All');
  const [page, setPage]                     = useState(1);
  const [pageSize, setPageSize]             = useState(10);
  const [showAddModal, setShowAddModal]     = useState(false);
  const [editProduct, setEditProduct]       = useState(null);
  const [saving, setSaving]                 = useState(false);
  const [uploading, setUploading]           = useState(false);
  const [uploadError, setUploadError]       = useState('');
  const [newProduct, setNewProduct] = useState({
    name: '', category: 'skincare', price: '', stock: '', description: '', image: '', images: [],
  });

  // Page title
  useEffect(() => { document.title = 'AuraGlow Admin — Inventory'; }, []);
  useEffect(() => { setSearch(searchParams.get('search') || ''); }, [searchParams]);
  useEffect(() => { setPage(1); }, [search, filterCategory]);

  // ── Fetch products from Supabase ──────────────────────────────────────────
  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    setLoading(true);
    setError(null);
    const { data, error: err } = await supabase
      .from('products')
      .select('id, name, brand, category, price, stock_quantity, images, description')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (err) {
      console.error('[AdminProducts] Supabase error:', err.message);
      setProducts(mockProducts.map(normalize));
      setError('Could not reach database — showing demo data.');
    } else {
      setProducts((data || []).map(normalize));
    }
    setLoading(false);
  }

  // ── Image Upload via ImgBB ────────────────────────────────────────────────
  async function handleImageUpload(file, target = 'edit') {
    if (!file) return;
    setUploading(true);
    setUploadError('');
    try {
      const res = await uploadImageToImgBB(file);
      if (res && res.url) {
        if (target === 'edit') {
          setEditProduct(prev => ({
            ...prev,
            image: res.url,
            images: [res.url, ...(prev.images || []).filter(u => u !== res.url)],
          }));
        } else {
          setNewProduct(prev => ({
            ...prev,
            image: res.url,
            images: [res.url, ...(prev.images || []).filter(u => u !== res.url)],
          }));
        }
      }
    } catch (err) {
      console.error('[AdminProducts] Upload failed:', err.message);
      setUploadError(err.message || 'Image upload failed. You can also paste an image URL directly.');
    } finally {
      setUploading(false);
    }
  }

  // ── Add product ───────────────────────────────────────────────────────────
  async function handleAddProduct(e) {
    e.preventDefault();
    setSaving(true);
    const stockVal = parseInt(newProduct.stock) || 0;
    const primaryImg = (newProduct.image || (newProduct.images && newProduct.images[0]) || '').trim();
    const imagesToSave = primaryImg ? [primaryImg, ...(newProduct.images || []).filter(u => u !== primaryImg)] : [];

    const payload = {
      name:           newProduct.name,
      brand:          'AuraGlow',
      category:       newProduct.category,
      description:    newProduct.description || 'New AuraGlow product.',
      price:          parseFloat(newProduct.price) || 0,
      stock_quantity: stockVal,
      is_vegan:       true,
      is_cruelty_free: true,
      is_active:      true,
      images:         imagesToSave,
    };

    const { data, error: err } = await supabase
      .from('products')
      .insert([payload])
      .select('id, name, brand, category, price, stock_quantity, images, description')
      .single();

    if (err) {
      const fallbackItem = {
        id: `prod-${Date.now()}`,
        name: payload.name,
        brand: payload.brand,
        category: payload.category.charAt(0).toUpperCase() + payload.category.slice(1),
        price: payload.price,
        stock: payload.stock_quantity,
        status: getStatus(payload.stock_quantity),
        image: imagesToSave[0] || '',
        images: imagesToSave,
        description: payload.description,
      };
      setProducts(prev => [fallbackItem, ...prev]);
    } else {
      setProducts(prev => [normalize(data), ...prev]);
    }
    setShowAddModal(false);
    setNewProduct({ name: '', category: 'skincare', price: '', stock: '', description: '', image: '', images: [] });
    setSaving(false);
  }

  // ── Edit product ──────────────────────────────────────────────────────────
  async function handleUpdateProduct(e) {
    e.preventDefault();
    if (!editProduct) return;
    setSaving(true);
    const updatedStock = parseInt(editProduct.stock) || 0;
    const updatedPrice = parseFloat(editProduct.price) || 0;
    const primaryImg = (editProduct.image || (editProduct.images && editProduct.images[0]) || '').trim();
    const imagesToSave = primaryImg ? [primaryImg, ...(editProduct.images || []).filter(u => u !== primaryImg)] : [];

    // Optimistic UI update
    setProducts(prev => prev.map(p => p.id === editProduct.id ? {
      ...p,
      name: editProduct.name,
      category: editProduct.category ? editProduct.category.charAt(0).toUpperCase() + editProduct.category.slice(1) : p.category,
      price: updatedPrice,
      stock: updatedStock,
      status: getStatus(updatedStock),
      image: primaryImg || p.image,
      images: imagesToSave,
      description: editProduct.description || p.description,
    } : p));

    // Attempt database update
    try {
      await supabase
        .from('products')
        .update({
          name: editProduct.name,
          category: (editProduct.category || '').toLowerCase(),
          price: updatedPrice,
          stock_quantity: updatedStock,
          images: imagesToSave,
          description: editProduct.description || '',
        })
        .eq('id', editProduct.id);
    } catch (err) {
      console.warn('Local update saved (demo mode):', err.message);
    }

    setSaving(false);
    setEditProduct(null);
  }

  // ── Delete product (soft delete) ──────────────────────────────────────────
  async function handleDelete(id) {
    if (!window.confirm('Remove this product from the catalog?')) return;
    try {
      await supabase
        .from('products')
        .update({ is_active: false })
        .eq('id', id);
    } catch (err) {
      console.warn('Local delete performed:', err.message);
    }
    setProducts(prev => prev.filter(p => p.id !== id));
  }

  // ── Filtered view ─────────────────────────────────────────────────────────
  const categories = ['All', ...new Set(products.map(p => p.category))];
  const filteredProducts = products.filter(p => {
    const matchSearch   = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCategory = filterCategory === 'All' || p.category === filterCategory;
    return matchSearch && matchCategory;
  });
  const pageCount = Math.max(1, Math.ceil(filteredProducts.length / pageSize));
  const visible = filteredProducts.slice((page - 1) * pageSize, page * pageSize);

  useEffect(() => {
    if (page > pageCount) setPage(pageCount);
  }, [page, pageCount]);

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
        <button className="btn btn-primary btn-sm" onClick={() => { setUploadError(''); setShowAddModal(true); }}>+ Add Product</button>
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
                {['ID', 'Product', 'Category', 'Price', 'Stock', 'Status', 'Actions'].map((h, i) => (
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
                  <td style={{ padding: 'var(--space-4)', fontSize: 'var(--text-sm)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                      <img
                        src={p.image}
                        alt={p.name}
                        style={{
                          width: 44,
                          height: 44,
                          borderRadius: 8,
                          objectFit: 'cover',
                          border: '1px solid var(--color-border)',
                          background: 'rgba(0,0,0,0.2)',
                          flexShrink: 0
                        }}
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=150&q=80';
                        }}
                      />
                      <div>
                        <div style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{p.name}</div>
                        <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>{p.brand}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: 'var(--space-4)', fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>{p.category}</td>
                  <td style={{ padding: 'var(--space-4)', fontSize: 'var(--text-sm)', fontWeight: 500 }}>{formatPrice(p.price)}</td>
                  <td style={{ padding: 'var(--space-4)', fontSize: 'var(--text-sm)', fontWeight: p.stock < 20 ? '700' : '400' }}>{p.stock}</td>
                  <td style={{ padding: 'var(--space-4)' }}>{getStatusBadge(p.status)}</td>
                  <td style={{ padding: 'var(--space-4)', textAlign: 'right' }}>
                    <button className="btn btn-ghost btn-sm" style={{ marginRight: 'var(--space-2)' }} onClick={() => { setUploadError(''); setEditProduct({ ...p }); }}>Edit</button>
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

      {!loading && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 'var(--space-3)', flexWrap: 'wrap', color: 'var(--color-text-secondary)', fontSize: 'var(--text-xs)', marginTop: 'var(--space-4)' }}>
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
          <span>{filteredProducts.length ? `${(page - 1) * pageSize + 1}–${Math.min(page * pageSize, filteredProducts.length)} of ${filteredProducts.length}` : '0 products'}</span>
        </div>
      )}

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fade-in" style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(13,13,15,0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-4)' }}>
          <div className="card glass-strong scale-in" style={{ width: '100%', maxWidth: '540px', maxHeight: '90vh', overflowY: 'auto', padding: 'var(--space-6)' }}>
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
                <textarea
                  value={newProduct.description}
                  onChange={e => setNewProduct({ ...newProduct, description: e.target.value })}
                  placeholder="Brief product description and key benefits"
                  rows={2}
                  style={{ width: '100%', borderRadius: '8px', padding: '8px 12px', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)', resize: 'vertical' }}
                />
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

              {/* Product Image Section */}
              <div style={{ border: '1px dashed var(--color-border)', borderRadius: '12px', padding: 'var(--space-4)', background: 'rgba(255,255,255,0.02)' }}>
                <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: '600', color: 'var(--color-text-secondary)', marginBottom: '8px' }}>
                  Product Image
                </label>
                <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center' }}>
                  <div style={{
                    width: '68px',
                    height: '68px',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    border: '1px solid var(--color-border)',
                    background: 'rgba(0,0,0,0.25)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    {newProduct.image ? (
                      <img
                        src={newProduct.image}
                        alt="Preview"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <span style={{ fontSize: '24px', opacity: 0.5 }}>📷</span>
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <label
                      className={`btn btn-secondary btn-sm ${uploading ? 'disabled' : ''}`}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        cursor: uploading ? 'wait' : 'pointer',
                        marginBottom: '6px'
                      }}
                    >
                      <span>{uploading ? '⏳ Uploading...' : '📁 Upload Photo'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        disabled={uploading}
                        onChange={e => {
                          if (e.target.files && e.target.files[0]) {
                            handleImageUpload(e.target.files[0], 'add');
                          }
                        }}
                      />
                    </label>
                    <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                      Upload image file directly or paste an image URL below.
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: 'var(--space-3)' }}>
                  <label style={{ display: 'block', fontSize: '11px', color: 'var(--color-text-muted)', marginBottom: '2px' }}>
                    Or Paste Image URL:
                  </label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={newProduct.image || ''}
                    onChange={e => setNewProduct({
                      ...newProduct,
                      image: e.target.value,
                      images: [e.target.value, ...(newProduct.images || []).filter(u => u !== e.target.value)]
                    })}
                    style={{ fontSize: 'var(--text-xs)', padding: '6px 10px' }}
                  />
                </div>
                {uploadError && <p style={{ color: 'var(--color-error)', fontSize: '11px', marginTop: '6px' }}>⚠ {uploadError}</p>}
              </div>

              <div style={{ marginTop: 'var(--space-2)', display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
                <button type="button" className="btn btn-ghost" onClick={() => setShowAddModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving || uploading}>
                  {saving ? 'Saving…' : 'Save to Database'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {editProduct && (
        <div className="fade-in" style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(13,13,15,0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-4)' }}>
          <div className="card glass-strong scale-in" style={{ width: '100%', maxWidth: '540px', maxHeight: '90vh', overflowY: 'auto', padding: 'var(--space-6)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-5)' }}>
              <div>
                <h3 style={{ fontFamily: 'var(--font-heading)' }}>Edit Product</h3>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', fontFamily: 'monospace' }}>ID: {editProduct.id}</span>
              </div>
              <button className="btn btn-ghost btn-sm btn-icon" onClick={() => setEditProduct(null)}>✕</button>
            </div>
            <form onSubmit={handleUpdateProduct} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <div>
                <label style={{ display: 'block', fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>Product Name *</label>
                <input
                  type="text"
                  value={editProduct.name}
                  onChange={e => setEditProduct({ ...editProduct, name: e.target.value })}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>Description</label>
                <textarea
                  value={editProduct.description || ''}
                  onChange={e => setEditProduct({ ...editProduct, description: e.target.value })}
                  placeholder="Product description and skin benefits"
                  rows={2}
                  style={{ width: '100%', borderRadius: '8px', padding: '8px 12px', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)', resize: 'vertical' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>Category *</label>
                <select
                  value={(editProduct.category || '').toLowerCase()}
                  onChange={e => setEditProduct({ ...editProduct, category: e.target.value })}
                >
                  <option value="skincare">Skincare</option>
                  <option value="makeup">Makeup</option>
                  <option value="fragrance">Fragrance</option>
                  <option value="tools">Tools</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>Price (LKR) *</label>
                  <input
                    type="number"
                    value={editProduct.price}
                    onChange={e => setEditProduct({ ...editProduct, price: e.target.value })}
                    required
                    min="1"
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>Stock Quantity *</label>
                  <input
                    type="number"
                    value={editProduct.stock}
                    onChange={e => setEditProduct({ ...editProduct, stock: e.target.value })}
                    required
                    min="0"
                  />
                </div>
              </div>

              {/* Product Image Section */}
              <div style={{ border: '1px dashed var(--color-border)', borderRadius: '12px', padding: 'var(--space-4)', background: 'rgba(255,255,200,0.02)' }}>
                <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: '600', color: 'var(--color-text-secondary)', marginBottom: '8px' }}>
                  Product Photo / Image
                </label>
                <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center' }}>
                  {/* Thumbnail Preview */}
                  <div style={{
                    width: '68px',
                    height: '68px',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    border: '1px solid var(--color-border)',
                    background: 'rgba(0,0,0,0.25)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    {editProduct.image ? (
                      <img
                        src={editProduct.image}
                        alt={editProduct.name || 'Preview'}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <span style={{ fontSize: '24px', opacity: 0.5 }}>📷</span>
                    )}
                  </div>

                  {/* Upload Button */}
                  <div style={{ flex: 1 }}>
                    <label
                      className={`btn btn-secondary btn-sm ${uploading ? 'disabled' : ''}`}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        cursor: uploading ? 'wait' : 'pointer',
                        marginBottom: '6px'
                      }}
                    >
                      <span>{uploading ? '⏳ Uploading...' : '📁 Upload New Photo'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        disabled={uploading}
                        onChange={e => {
                          if (e.target.files && e.target.files[0]) {
                            handleImageUpload(e.target.files[0], 'edit');
                          }
                        }}
                      />
                    </label>
                    <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                      Upload image file directly or paste an image URL below.
                    </div>
                  </div>
                </div>

                {/* Direct URL input */}
                <div style={{ marginTop: 'var(--space-3)' }}>
                  <label style={{ display: 'block', fontSize: '11px', color: 'var(--color-text-muted)', marginBottom: '2px' }}>
                    Or Paste Image URL directly:
                  </label>
                  <input
                    type="url"
                    placeholder="https://i.ibb.co/... or https://..."
                    value={editProduct.image || ''}
                    onChange={e => setEditProduct({
                      ...editProduct,
                      image: e.target.value,
                      images: [e.target.value, ...(editProduct.images || []).filter(u => u !== e.target.value)]
                    })}
                    style={{ fontSize: 'var(--text-xs)', padding: '6px 10px' }}
                  />
                </div>

                {uploadError && (
                  <p style={{ color: 'var(--color-error)', fontSize: '11px', marginTop: '6px' }}>
                    ⚠ {uploadError}
                  </p>
                )}
              </div>

              <div style={{ marginTop: 'var(--space-2)', display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
                <button type="button" className="btn btn-ghost" onClick={() => setEditProduct(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving || uploading}>
                  {saving ? 'Updating…' : 'Update Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
