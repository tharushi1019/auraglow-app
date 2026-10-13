/**
 * =============================================================================
 *  AuraGlow — Admin Product & Inventory Management (100% DYNAMIC)
 *  Directly connected to Supabase PostgreSQL.
 *  Zero hardcoded or mock products. Real-time CRUD, ImgBB photo upload,
 *  stock tracking, and CSV inventory export.
 * =============================================================================
 */

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useCurrency } from '@/context/CurrencyContext';
import { supabase } from '@/lib/supabase';
import { uploadImageToImgBB } from '@/services/imgbbService';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getStatus(stock) {
  if (stock === 0) return 'Out of Stock';
  if (stock < 20)  return 'Low Stock';
  return 'Active';
}

function getStatusBadge(status) {
  switch (status) {
    case 'Active':       return <span className="badge badge-vegan" style={{ fontSize: '11px', padding: '3px 8px' }}>Active</span>;
    case 'Low Stock':    return <span className="badge badge-low-stock" style={{ fontSize: '11px', padding: '3px 8px', background: 'rgba(240, 200, 122, 0.15)', color: 'var(--color-warning)', border: '1px solid rgba(240, 200, 122, 0.3)' }}>Low Stock</span>;
    case 'Out of Stock': return <span className="badge badge-out-of-stock" style={{ fontSize: '11px', padding: '3px 8px', background: 'rgba(232, 122, 122, 0.15)', color: 'var(--color-error)', border: '1px solid rgba(232, 122, 122, 0.3)' }}>Out of Stock</span>;
    default:             return null;
  }
}

function normalize(p) {
  const rawImages = Array.isArray(p.images)
    ? p.images
    : (typeof p.images === 'string' && p.images.startsWith('[')
        ? (() => { try { return JSON.parse(p.images); } catch { return [p.images]; } })()
        : (p.images ? [p.images] : []));

  return {
    id:          p.id,
    name:        p.name || 'Unnamed Product',
    category:    p.category ? p.category.charAt(0).toUpperCase() + p.category.slice(1) : 'Skincare',
    price:       parseFloat(p.price) || 0,
    stock:       p.stock_quantity ?? 0,
    status:      getStatus(p.stock_quantity ?? 0),
    brand:       p.brand || 'AuraGlow',
    description: p.description || '',
    images:      rawImages,
    image:       rawImages[0] || 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=150&q=80',
    created_at:  p.created_at,
  };
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function AdminProducts() {
  const [searchParams] = useSearchParams();
  const { formatPrice } = useCurrency();
  const [products, setProducts]             = useState([]);
  const [loading, setLoading]               = useState(true);
  const [dbError, setDbError]               = useState(null);
  const [search, setSearch]                 = useState(() => searchParams.get('search') || '');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterStatus, setFilterStatus]     = useState('All');
  const [page, setPage]                     = useState(1);
  const [pageSize, setPageSize]             = useState(10);
  const [showAddModal, setShowAddModal]     = useState(false);
  const [editProduct, setEditProduct]       = useState(null);
  const [saving, setSaving]                 = useState(false);
  const [uploading, setUploading]           = useState(false);
  const [uploadError, setUploadError]       = useState('');
  const [actionNotice, setActionNotice]     = useState(null);

  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'skincare',
    price: '',
    stock: '',
    description: '',
    image: '',
    images: [],
    brand: 'AuraGlow',
  });

  // Page title
  useEffect(() => { document.title = 'AuraGlow Admin — Live Inventory'; }, []);
  useEffect(() => { setSearch(searchParams.get('search') || ''); }, [searchParams]);
  useEffect(() => { setPage(1); }, [search, filterCategory, filterStatus]);

  const notify = (msg, type = 'success') => {
    setActionNotice({ msg, type });
    setTimeout(() => setActionNotice(null), 3500);
  };

  // ── Fetch products from Supabase ──────────────────────────────────────────
  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    setLoading(true);
    setDbError(null);
    try {
      const { data, error: err } = await supabase
        .from('products')
        .select('id, name, brand, category, price, stock_quantity, images, description, created_at, is_active')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (err) {
        console.error('[AdminProducts] Supabase fetch failed:', err.message);
        setDbError(`Database error: ${err.message}`);
        setProducts([]);
      } else {
        setProducts((data || []).map(normalize));
      }
    } catch (err) {
      console.error('[AdminProducts] Network/Client exception:', err.message);
      setDbError(`Connection failed: ${err.message}`);
      setProducts([]);
    } finally {
      setLoading(false);
    }
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
        notify('Photo uploaded to ImgBB successfully!');
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
    const stockVal = parseInt(newProduct.stock, 10) || 0;
    const priceVal = parseFloat(newProduct.price) || 0;
    const primaryImg = (newProduct.image || (newProduct.images && newProduct.images[0]) || '').trim();
    const imagesToSave = primaryImg ? [primaryImg, ...(newProduct.images || []).filter(u => u !== primaryImg)] : [];

    const payload = {
      name:           newProduct.name.trim(),
      brand:          newProduct.brand || 'AuraGlow',
      category:       (newProduct.category || 'skincare').toLowerCase(),
      description:    newProduct.description.trim() || 'AuraGlow clean cosmetic formulation.',
      price:          priceVal,
      stock_quantity: stockVal,
      is_vegan:       true,
      is_cruelty_free: true,
      is_active:      true,
      images:         imagesToSave,
    };

    const { data, error: err } = await supabase
      .from('products')
      .insert([payload])
      .select('id, name, brand, category, price, stock_quantity, images, description, created_at')
      .single();

    if (err) {
      alert(`Database rejected product insertion:\n${err.message}`);
      setSaving(false);
      return;
    }

    if (data) {
      setProducts(prev => [normalize(data), ...prev]);
      notify(`Product "${data.name}" successfully added to live catalog!`);
    }

    setShowAddModal(false);
    setNewProduct({ name: '', category: 'skincare', price: '', stock: '', description: '', image: '', images: [], brand: 'AuraGlow' });
    setSaving(false);
  }

  // ── Edit product ──────────────────────────────────────────────────────────
  async function handleUpdateProduct(e) {
    e.preventDefault();
    if (!editProduct) return;
    setSaving(true);

    const updatedStock = parseInt(editProduct.stock, 10) || 0;
    const updatedPrice = parseFloat(editProduct.price) || 0;
    const primaryImg = (editProduct.image || (editProduct.images && editProduct.images[0]) || '').trim();
    const imagesToSave = primaryImg ? [primaryImg, ...(editProduct.images || []).filter(u => u !== primaryImg)] : [];

    const { error: err } = await supabase
      .from('products')
      .update({
        name:           editProduct.name.trim(),
        category:       (editProduct.category || '').toLowerCase(),
        price:          updatedPrice,
        stock_quantity: updatedStock,
        images:         imagesToSave,
        description:    editProduct.description || '',
      })
      .eq('id', editProduct.id);

    if (err) {
      alert(`Failed to update product in database:\n${err.message}`);
      setSaving(false);
      return;
    }

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

    notify(`Updated "${editProduct.name}" in live Supabase database.`);
    setSaving(false);
    setEditProduct(null);
  }

  // ── Delete product (soft delete via is_active = false) ────────────────────
  async function handleDelete(id, name) {
    if (!window.confirm(`Are you sure you want to remove "${name}" from the live catalog?\nThis immediately updates Supabase.`)) return;
    
    const { error: err } = await supabase
      .from('products')
      .update({ is_active: false })
      .eq('id', id);

    if (err) {
      alert(`Could not delete from database: ${err.message}`);
      return;
    }

    setProducts(prev => prev.filter(p => p.id !== id));
    notify(`Product "${name}" removed from active catalog.`);
  }

  // ── Quick Stock Adjust ────────────────────────────────────────────────────
  async function handleQuickStock(productId, currentStock, delta) {
    const newStock = Math.max(0, currentStock + delta);
    const { error: err } = await supabase
      .from('products')
      .update({ stock_quantity: newStock })
      .eq('id', productId);

    if (err) {
      alert(`Failed to update stock: ${err.message}`);
      return;
    }

    setProducts(prev => prev.map(p => p.id === productId ? {
      ...p,
      stock: newStock,
      status: getStatus(newStock),
    } : p));
  }

  // ── Export CSV ────────────────────────────────────────────────────────────
  function handleExportCSV() {
    if (!products.length) return;
    const headers = ['ID', 'Name', 'Brand', 'Category', 'Price (LKR)', 'Stock', 'Status'];
    const rows = products.map(p => [
      `"${p.id}"`,
      `"${p.name.replace(/"/g, '""')}"`,
      `"${p.brand}"`,
      `"${p.category}"`,
      p.price,
      p.stock,
      `"${p.status}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `auraglow_inventory_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    notify('Exported inventory CSV file!');
  }

  // ── Filtered view ─────────────────────────────────────────────────────────
  const categories = ['All', ...new Set(products.map(p => p.category))];
  const filteredProducts = products.filter(p => {
    const matchSearch   = p.name.toLowerCase().includes(search.toLowerCase()) ||
                          p.category.toLowerCase().includes(search.toLowerCase()) ||
                          p.brand.toLowerCase().includes(search.toLowerCase()) ||
                          p.id.toLowerCase().includes(search.toLowerCase());
    const matchCategory = filterCategory === 'All' || p.category === filterCategory;
    const matchStatus   = filterStatus === 'All' || p.status === filterStatus;
    return matchSearch && matchCategory && matchStatus;
  });

  const pageCount = Math.max(1, Math.ceil(filteredProducts.length / pageSize));
  const visible = filteredProducts.slice((page - 1) * pageSize, page * pageSize);

  useEffect(() => {
    if (page > pageCount) setPage(pageCount);
  }, [page, pageCount]);

  // ── Stats ─────────────────────────────────────────────────────────────────
  const lowCount  = products.filter(p => p.status === 'Low Stock').length;
  const outCount  = products.filter(p => p.status === 'Out of Stock').length;
  const activeCount = products.filter(p => p.status === 'Active').length;
  const totalInventoryValue = products.reduce((acc, p) => acc + (p.price * p.stock), 0);

  return (
    <div>
      {/* Toast banner */}
      {actionNotice && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 9999,
          background: actionNotice.type === 'error' ? 'rgba(232, 122, 122, 0.95)' : 'rgba(126, 200, 160, 0.95)',
          color: '#0d0d0f',
          fontWeight: '700',
          padding: '12px 20px',
          borderRadius: 'var(--radius-lg)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
          animation: 'fadeIn 0.2s ease',
        }}>
          {actionNotice.type === 'error' ? '⚠ ' : '✓ '} {actionNotice.msg}
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-6)', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-2xl)' }}>Inventory & Product Management</h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', marginTop: '4px' }}>
            {loading ? 'Connecting to live Supabase database…' : `${products.length} live database products`}
            {!loading && (
              <>
                &nbsp;·&nbsp; <span style={{ color: 'var(--color-success)' }}>{activeCount} active</span>
                {lowCount > 0 && <> &nbsp;·&nbsp; <span style={{ color: 'var(--color-warning)' }}>{lowCount} low stock</span></>}
                {outCount > 0 && <> &nbsp;·&nbsp; <span style={{ color: 'var(--color-error)' }}>{outCount} out of stock</span></>}
                &nbsp;·&nbsp; <span style={{ color: 'var(--color-accent-gold)' }}>Total Asset Value: {formatPrice(totalInventoryValue)}</span>
              </>
            )}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
          <button className="btn btn-ghost btn-sm" onClick={handleExportCSV} disabled={!products.length} title="Export inventory as CSV">
            📥 Export CSV
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => { setUploadError(''); setShowAddModal(true); }}>
            ✨ Add Product
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div style={{ display: 'flex', gap: 'var(--space-3)', marginBottom: 'var(--space-4)', flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          type="text"
          placeholder="🔍  Search by product name, category, brand or UUID…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ flex: 1, minWidth: '240px' }}
        />
        <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)} style={{ width: 'auto' }}>
          {categories.map(c => <option key={c} value={c}>{c === 'All' ? 'All Categories' : c}</option>)}
        </select>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ width: 'auto' }}>
          <option value="All">All Statuses</option>
          <option value="Active">🟢 Active</option>
          <option value="Low Stock">⚠️ Low Stock</option>
          <option value="Out of Stock">🔴 Out of Stock</option>
        </select>
        <button className="btn btn-ghost btn-sm" onClick={fetchProducts} title="Refresh from Supabase">🔄 Refresh</button>
      </div>

      {/* Database Error Banner */}
      {dbError && (
        <div style={{
          background: 'rgba(232, 122, 122, 0.12)',
          border: '1px solid rgba(232, 122, 122, 0.3)',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--space-4)',
          marginBottom: 'var(--space-4)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 'var(--space-4)'
        }}>
          <div>
            <div style={{ fontWeight: '700', color: 'var(--color-error)', fontSize: 'var(--text-sm)' }}>
              ⚠️ Database Connection Alert
            </div>
            <div style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-xs)', marginTop: '2px' }}>
              {dbError} — Please ensure the Supabase schema and credentials are valid.
            </div>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={fetchProducts}>
            Retry Connection
          </button>
        </div>
      )}

      {/* Table Card */}
      <div className="card glass fade-in-up delay-2" style={{ padding: 0, overflowX: 'auto' }}>
        {loading ? (
          <div style={{ padding: 'var(--space-12)', textAlign: 'center', color: 'var(--color-text-muted)' }}>
            <div style={{ fontSize: '28px', marginBottom: 'var(--space-3)', animation: 'spin 1s linear infinite' }}>↻</div>
            Loading live products from Supabase...
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-border)', background: 'rgba(255,255,255,0.02)' }}>
                {['ID', 'Product', 'Category', 'Price', 'Stock', 'Status', 'Quick Adjust', 'Actions'].map((h, i) => (
                  <th key={h} style={{ padding: 'var(--space-4)', color: 'var(--color-text-secondary)', fontWeight: '600', fontSize: 'var(--text-sm)', textAlign: i === 7 ? 'right' : 'left' }}>
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
                  <td style={{ padding: 'var(--space-4)', fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', fontFamily: 'monospace' }} title={p.id}>
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
                  <td style={{ padding: 'var(--space-4)', fontSize: 'var(--text-sm)', fontWeight: 600 }}>{formatPrice(p.price)}</td>
                  <td style={{ padding: 'var(--space-4)', fontSize: 'var(--text-sm)', fontWeight: p.stock < 20 ? '700' : '400', color: p.stock === 0 ? 'var(--color-error)' : p.stock < 20 ? 'var(--color-warning)' : 'inherit' }}>
                    {p.stock}
                  </td>
                  <td style={{ padding: 'var(--space-4)' }}>{getStatusBadge(p.status)}</td>
                  <td style={{ padding: 'var(--space-4)' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <button
                        type="button"
                        className="btn btn-ghost btn-xs"
                        style={{ padding: '2px 6px', fontSize: '12px', minWidth: '24px' }}
                        onClick={() => handleQuickStock(p.id, p.stock, -5)}
                        title="Reduce stock by 5"
                        disabled={p.stock === 0}
                      >
                        🔻 -5
                      </button>
                      <button
                        type="button"
                        className="btn btn-ghost btn-xs"
                        style={{ padding: '2px 6px', fontSize: '12px', minWidth: '24px' }}
                        onClick={() => handleQuickStock(p.id, p.stock, +10)}
                        title="Add 10 units to stock"
                      >
                        🔺 +10
                      </button>
                    </div>
                  </td>
                  <td style={{ padding: 'var(--space-4)', textAlign: 'right', whiteSpace: 'nowrap' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px', whiteSpace: 'nowrap' }}>
                      <button className="btn btn-ghost btn-sm" style={{ fontSize: '15px', padding: '5px 8px', lineHeight: 1 }} onClick={() => { setUploadError(''); setEditProduct({ ...p }); }} title="Edit Product">
                        ✏️
                      </button>
                      <button className="btn btn-ghost btn-sm" style={{ color: 'var(--color-error)', fontSize: '15px', padding: '5px 8px', lineHeight: 1 }} onClick={() => handleDelete(p.id, p.name)} title="Delete Product">
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {visible.length === 0 && !loading && (
                <tr>
                  <td colSpan="8" style={{ padding: 'var(--space-10)', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                    {dbError ? 'Could not load products due to database connection issue.' : 'No products match your search/filter criteria.'}
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
          <div className="card glass-strong scale-in" style={{ width: '100%', maxWidth: '560px', maxHeight: '90vh', overflowY: 'auto', padding: 'var(--space-6)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-5)' }}>
              <div>
                <h3 style={{ fontFamily: 'var(--font-heading)' }}>Add New Product</h3>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>Inserts directly into Supabase catalog table</span>
              </div>
              <button className="btn btn-ghost btn-sm btn-icon" onClick={() => setShowAddModal(false)}>✕</button>
            </div>
            <form onSubmit={handleAddProduct} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <div>
                <label style={{ display: 'block', fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>Product Name *</label>
                <input type="text" value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} required placeholder="e.g., Luminous Velvet Lip Oil" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>Description</label>
                <textarea
                  value={newProduct.description}
                  onChange={e => setNewProduct({ ...newProduct, description: e.target.value })}
                  placeholder="Clinical benefits, ingredients, and finish..."
                  rows={2}
                  style={{ width: '100%', borderRadius: '8px', padding: '8px 12px', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)', resize: 'vertical' }}
                />
              </div>
              <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>Category *</label>
                  <select value={newProduct.category} onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}>
                    <option value="skincare">Skincare</option>
                    <option value="makeup">Makeup</option>
                    <option value="fragrance">Fragrance</option>
                    <option value="tools">Tools</option>
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>Brand</label>
                  <input type="text" value={newProduct.brand} onChange={e => setNewProduct({ ...newProduct, brand: e.target.value })} placeholder="AuraGlow" />
                </div>
              </div>
              <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>Price (LKR) *</label>
                  <input type="number" value={newProduct.price} onChange={e => setNewProduct({ ...newProduct, price: e.target.value })} required placeholder="5500" min="1" />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>Initial Stock *</label>
                  <input type="number" value={newProduct.stock} onChange={e => setNewProduct({ ...newProduct, stock: e.target.value })} required placeholder="50" min="0" />
                </div>
              </div>

              {/* Product Image Section */}
              <div style={{ border: '1px dashed var(--color-border)', borderRadius: '12px', padding: 'var(--space-4)', background: 'rgba(255,255,255,0.02)' }}>
                <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: '600', color: 'var(--color-text-secondary)', marginBottom: '8px' }}>
                  Product Photo / Image
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
                      <span>{uploading ? '⏳ Uploading...' : '📁 Upload Photo via ImgBB'}</span>
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
                      Upload image file or paste an image URL directly below.
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: 'var(--space-3)' }}>
                  <label style={{ display: 'block', fontSize: '11px', color: 'var(--color-text-muted)', marginBottom: '2px' }}>
                    Or Paste Image URL directly:
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
                  {saving ? 'Inserting into Database…' : 'Save to Live Database'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {editProduct && (
        <div className="fade-in" style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(13,13,15,0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-4)' }}>
          <div className="card glass-strong scale-in" style={{ width: '100%', maxWidth: '560px', maxHeight: '90vh', overflowY: 'auto', padding: 'var(--space-6)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-5)' }}>
              <div>
                <h3 style={{ fontFamily: 'var(--font-heading)' }}>Edit Product</h3>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', fontFamily: 'monospace' }}>UUID: {editProduct.id}</span>
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
                  placeholder="Product description and clinical benefits"
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
                      <span>{uploading ? '⏳ Uploading...' : '📁 Upload New Photo via ImgBB'}</span>
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
                      Upload image file or paste an image URL directly below.
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: 'var(--space-3)' }}>
                  <label style={{ display: 'block', fontSize: '11px', color: 'var(--color-text-muted)', marginBottom: '2px' }}>
                    Or Paste Image URL directly:
                  </label>
                  <input
                    type="url"
                    placeholder="https://..."
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
                  {saving ? 'Syncing to Supabase…' : 'Update in Live Database'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
