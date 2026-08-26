import React, { useState, useEffect } from 'react';
import { useCurrency } from '@/context/CurrencyContext';
import { products as mockProducts } from '@/data/mockData';

const initialProducts = [
  { id: 'prod-001', name: 'Radiant Glow Serum',      category: 'Skincare',   price: 8900,  stock: 45, image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80', status: 'Active' },
  { id: 'prod-002', name: 'Velvet Matte Lipstick',   category: 'Makeup',     price: 4500,  stock: 12, image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=800&q=80', status: 'Low Stock' },
  { id: 'prod-003', name: 'Petal Hydra Cream',        category: 'Skincare',   price: 7200,  stock: 0,  image: 'https://images.unsplash.com/photo-1599305090598-fe179d501227?auto=format&fit=crop&w=800&q=80', status: 'Out of Stock' },
  { id: 'prod-004', name: 'Rose Gold Eye Palette',    category: 'Makeup',     price: 11000, stock: 85, image: 'https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=800&q=80', status: 'Active' },
  { id: 'prod-005', name: 'Green Tea Cleansing Foam', category: 'Skincare',   price: 3200,  stock: 120,image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=800&q=80', status: 'Active' },
  { id: 'prod-006', name: 'Midnight Bloom Perfume',   category: 'Fragrance',  price: 15500, stock: 30, image: 'https://images.unsplash.com/photo-1557170334-a9632e77c6e4?auto=format&fit=crop&w=800&q=80', status: 'Active' },
  { id: 'prod-007', name: 'Pro Blending Brush Set',   category: 'Tools',      price: 6800,  stock: 55, image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80', status: 'Active' },
  { id: 'prod-008', name: 'SPF 50 Sunscreen Fluid',   category: 'Skincare',   price: 5500,  stock: 90, image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80', status: 'Active' },
];

export default function AdminProducts() {
  const [products, setProducts] = useState(initialProducts);
  const [showAddModal, setShowAddModal] = useState(false);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [sortBy, setSortBy] = useState('name');
  const { formatPrice } = useCurrency();
  
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'Skincare',
    price: '',
    stock: '',
    image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80'
  });

  useEffect(() => {
    document.title = 'AuraGlow Admin — Inventory & Catalog';
  }, []);

  const totalStockUnits = products.reduce((sum, p) => sum + (parseInt(p.stock) || 0), 0);
  const totalValuation = products.reduce((sum, p) => sum + (p.price * (parseInt(p.stock) || 0)), 0);
  const lowStockList = products.filter(p => p.stock > 0 && p.stock < 20);
  const outOfStockList = products.filter(p => p.stock === 0);

  const handleAddProduct = (e) => {
    e.preventDefault();
    const newId = `prod-${(products.length + 1).toString().padStart(3, '0')}`;
    const stock = parseInt(newProduct.stock) || 0;
    const status = stock === 0 ? 'Out of Stock' : (stock < 20 ? 'Low Stock' : 'Active');
    
    setProducts([
      {
        id: newId,
        name: newProduct.name,
        category: newProduct.category,
        price: parseFloat(newProduct.price) || 0,
        stock,
        image: newProduct.image || 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80',
        status
      },
      ...products
    ]);
    
    setShowAddModal(false);
    setNewProduct({ name: '', category: 'Skincare', price: '', stock: '', image: '' });
  };

  const handleStockUpdate = (id, delta) => {
    setProducts(products.map(p => {
      if (p.id === id) {
        const newStock = Math.max(0, p.stock + delta);
        const newStatus = newStock === 0 ? 'Out of Stock' : (newStock < 20 ? 'Low Stock' : 'Active');
        return { ...p, stock: newStock, status: newStatus };
      }
      return p;
    }));
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to remove this SKU from inventory?')) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Active':
        return (
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            padding: '3px 10px', borderRadius: 'var(--radius-full)',
            background: 'rgba(126, 200, 160, 0.12)', border: '1px solid rgba(126, 200, 160, 0.3)',
            color: 'var(--color-success)', fontSize: '11px', fontWeight: '600'
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--color-success)' }} />
            In Stock
          </span>
        );
      case 'Low Stock':
        return (
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            padding: '3px 10px', borderRadius: 'var(--radius-full)',
            background: 'rgba(240, 200, 122, 0.12)', border: '1px solid rgba(240, 200, 122, 0.3)',
            color: 'var(--color-warning)', fontSize: '11px', fontWeight: '600'
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--color-warning)' }} />
            Low Stock
          </span>
        );
      case 'Out of Stock':
        return (
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            padding: '3px 10px', borderRadius: 'var(--radius-full)',
            background: 'rgba(232, 122, 122, 0.12)', border: '1px solid rgba(232, 122, 122, 0.3)',
            color: 'var(--color-error)', fontSize: '11px', fontWeight: '600'
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--color-error)' }} />
            Out of Stock
          </span>
        );
      default:
        return null;
    }
  };

  const categories = ['All', 'Skincare', 'Makeup', 'Fragrance', 'Tools'];

  const visible = products
    .filter(p => {
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.id.toLowerCase().includes(search.toLowerCase());
      const matchCategory = filterCategory === 'All' || p.category === filterCategory;
      const matchStatus = filterStatus === 'All' || p.status === filterStatus;
      return matchSearch && matchCategory && matchStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'stock-low') return a.stock - b.stock;
      if (sortBy === 'stock-high') return b.stock - a.stock;
      return a.name.localeCompare(b.name);
    });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
      
      {/* ── Top Header & Actions ────────────────────────────────────────── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-3xl)', fontWeight: '800', letterSpacing: '-0.02em' }}>
            Products & Inventory Hub
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', marginTop: '4px' }}>
            Catalogue controls, stock adjustments, and clean beauty SKU metadata
          </p>
        </div>

        <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => alert('Exporting inventory valuation & stock report to CSV...')}
          >
            📊 Export CSV
          </button>
          <button className="btn btn-primary btn-sm glow-pulse" onClick={() => setShowAddModal(true)}>
            + Add New SKU
          </button>
        </div>
      </div>

      {/* ── Inventory KPI Tiles ──────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-4)' }}>
        <div className="card glass" style={{ padding: 'var(--space-5)' }}>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Total Active SKUs</div>
          <div style={{ fontSize: 'var(--text-2xl)', fontWeight: '800', fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)', marginTop: '4px' }}>
            {products.length} Items
          </div>
        </div>

        <div className="card glass" style={{ padding: 'var(--space-5)' }}>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Stock On Hand</div>
          <div style={{ fontSize: 'var(--text-2xl)', fontWeight: '800', fontFamily: 'var(--font-heading)', color: 'var(--color-accent-lavender)', marginTop: '4px' }}>
            {totalStockUnits.toLocaleString()} Units
          </div>
        </div>

        <div className="card glass" style={{ padding: 'var(--space-5)' }}>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Inventory Value</div>
          <div style={{ fontSize: 'var(--text-2xl)', fontWeight: '800', fontFamily: 'var(--font-heading)', color: 'var(--color-accent-rose)', marginTop: '4px' }}>
            {formatPrice(totalValuation)}
          </div>
        </div>

        <div className="card glass" style={{ padding: 'var(--space-5)' }}>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Stock Warnings</div>
          <div style={{ fontSize: 'var(--text-2xl)', fontWeight: '800', fontFamily: 'var(--font-heading)', color: (lowStockList.length + outOfStockList.length > 0) ? 'var(--color-warning)' : 'var(--color-success)', marginTop: '4px' }}>
            {lowStockList.length} Low · {outOfStockList.length} Empty
          </div>
        </div>
      </div>

      {/* ── Filters & Controls Bar ──────────────────────────────────────── */}
      <div className="card glass" style={{ padding: 'var(--space-4)', display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap', alignItems: 'center' }}>
        {/* Search */}
        <div style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
          <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }}>🔍</span>
          <input
            type="text"
            placeholder="Search by SKU name or ID..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ paddingLeft: '36px' }}
          />
        </div>

        {/* Category filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Category:</span>
          <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)} style={{ width: 'auto' }}>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {/* Status filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Status:</span>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ width: 'auto' }}>
            <option value="All">All Statuses</option>
            <option value="Active">In Stock</option>
            <option value="Low Stock">Low Stock</option>
            <option value="Out of Stock">Out of Stock</option>
          </select>
        </div>

        {/* Sort */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Sort:</span>
          <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ width: 'auto' }}>
            <option value="name">Name (A-Z)</option>
            <option value="price-high">Price: High to Low</option>
            <option value="price-low">Price: Low to High</option>
            <option value="stock-low">Stock: Lowest First</option>
            <option value="stock-high">Stock: Highest First</option>
          </select>
        </div>
      </div>

      {/* ── Products Table ──────────────────────────────────────────────── */}
      <div className="card glass" style={{ padding: '0', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--color-border)', background: 'rgba(255,255,255,0.02)', color: 'var(--color-text-muted)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              <th style={{ padding: 'var(--space-4)' }}>Product / SKU</th>
              <th style={{ padding: 'var(--space-4)' }}>Category</th>
              <th style={{ padding: 'var(--space-4)' }}>Unit Price</th>
              <th style={{ padding: 'var(--space-4)' }}>Stock Level</th>
              <th style={{ padding: 'var(--space-4)' }}>Status</th>
              <th style={{ padding: 'var(--space-4)', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {visible.map(p => (
              <tr key={p.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'background 150ms ease' }}>
                
                {/* Product Name + Image Thumbnail */}
                <td style={{ padding: 'var(--space-4)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                    <img
                      src={p.image}
                      alt={p.name}
                      style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-md)', objectFit: 'cover', border: '1px solid var(--color-border)' }}
                    />
                    <div>
                      <div style={{ fontSize: 'var(--text-sm)', fontWeight: '600', color: 'var(--color-text-primary)' }}>{p.name}</div>
                      <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontFamily: 'monospace' }}>#{p.id}</div>
                    </div>
                  </div>
                </td>

                {/* Category */}
                <td style={{ padding: 'var(--space-4)', fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
                  <span style={{ padding: '3px 8px', borderRadius: 'var(--radius-sm)', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--color-border)', fontSize: '11px' }}>
                    {p.category}
                  </span>
                </td>

                {/* Price */}
                <td style={{ padding: 'var(--space-4)', fontSize: 'var(--text-sm)', fontWeight: '700', color: 'var(--color-accent-rose)' }}>
                  {formatPrice(p.price)}
                </td>

                {/* Stock Level with +/- Quick Controls */}
                <td style={{ padding: 'var(--space-4)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                    <button
                      onClick={() => handleStockUpdate(p.id, -1)}
                      style={{ width: '24px', height: '24px', borderRadius: '4px', background: 'rgba(255,255,255,0.06)', border: '1px solid var(--color-border)', color: 'var(--color-text-secondary)', cursor: 'pointer' }}
                      title="Decrease stock"
                    >
                      -
                    </button>
                    <span style={{ fontSize: 'var(--text-sm)', fontWeight: '700', minWidth: '32px', textAlign: 'center' }}>
                      {p.stock}
                    </span>
                    <button
                      onClick={() => handleStockUpdate(p.id, +1)}
                      style={{ width: '24px', height: '24px', borderRadius: '4px', background: 'rgba(255,255,255,0.06)', border: '1px solid var(--color-border)', color: 'var(--color-text-secondary)', cursor: 'pointer' }}
                      title="Increase stock"
                    >
                      +
                    </button>
                  </div>
                </td>

                {/* Status */}
                <td style={{ padding: 'var(--space-4)' }}>
                  {getStatusBadge(p.status)}
                </td>

                {/* Actions */}
                <td style={{ padding: 'var(--space-4)', textAlign: 'right' }}>
                  <button
                    className="btn btn-ghost btn-sm"
                    style={{ marginRight: 'var(--space-2)' }}
                    onClick={() => {
                      const newPrice = prompt(`Update price for ${p.name}:`, p.price);
                      if (newPrice) setProducts(products.map(x => x.id === p.id ? { ...x, price: parseFloat(newPrice) || x.price } : x));
                    }}
                  >
                    Edit Price
                  </button>
                  <button
                    className="btn btn-ghost btn-sm"
                    style={{ color: 'var(--color-error)' }}
                    onClick={() => handleDelete(p.id)}
                  >
                    Delete
                  </button>
                </td>

              </tr>
            ))}

            {visible.length === 0 && (
              <tr>
                <td colSpan="6" style={{ padding: 'var(--space-12)', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                  No SKUs match the selected criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ── Add Product Modal ───────────────────────────────────────────── */}
      {showAddModal && (
        <div className="fade-in" style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(13,13,15,0.85)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-4)' }}>
          <div className="card glass-strong scale-in" style={{ width: '100%', maxWidth: '520px', padding: 'var(--space-8)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
              <div>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-xl)', fontWeight: '700' }}>Add New Product SKU</h3>
                <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-xs)', marginTop: '2px' }}>Publish to the live clean beauty storefront</p>
              </div>
              <button className="btn btn-ghost btn-sm btn-icon" onClick={() => setShowAddModal(false)}>✕</button>
            </div>

            <form onSubmit={handleAddProduct} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <div>
                <label className="form-label">Product Name *</label>
                <input
                  type="text"
                  value={newProduct.name}
                  onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
                  required
                  placeholder="e.g. Celestial Night Repair Oil"
                  className="form-input"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                <div>
                  <label className="form-label">Category *</label>
                  <select
                    value={newProduct.category}
                    onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}
                    className="form-input"
                  >
                    <option>Skincare</option>
                    <option>Makeup</option>
                    <option>Fragrance</option>
                    <option>Tools</option>
                  </select>
                </div>

                <div>
                  <label className="form-label">Base Price (LKR) *</label>
                  <input
                    type="number"
                    value={newProduct.price}
                    onChange={e => setNewProduct({ ...newProduct, price: e.target.value })}
                    required
                    placeholder="8500"
                    className="form-input"
                  />
                </div>
              </div>

              <div>
                <label className="form-label">Initial Stock Units *</label>
                <input
                  type="number"
                  value={newProduct.stock}
                  onChange={e => setNewProduct({ ...newProduct, stock: e.target.value })}
                  required
                  placeholder="50"
                  className="form-input"
                />
              </div>

              <div>
                <label className="form-label">Image URL (Unsplash or ImgBB)</label>
                <input
                  type="url"
                  value={newProduct.image}
                  onChange={e => setNewProduct({ ...newProduct, image: e.target.value })}
                  placeholder="https://..."
                  className="form-input"
                />
              </div>

              <div style={{ marginTop: 'var(--space-4)', display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
                <button type="button" className="btn btn-ghost" onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary glow-pulse">
                  Save SKU
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
