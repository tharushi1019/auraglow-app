import React, { useState, useEffect } from 'react';
import { useCurrency } from '@/context/CurrencyContext';

const initialProducts = [
  { id: '101', name: 'Radiant Glow Serum',      category: 'Skincare',   price: 8900,  stock: 45, status: 'Active' },
  { id: '102', name: 'Velvet Matte Lipstick',   category: 'Makeup',     price: 4500,  stock: 12, status: 'Low Stock' },
  { id: '103', name: 'Petal Hydra Cream',        category: 'Skincare',   price: 7200,  stock: 0,  status: 'Out of Stock' },
  { id: '104', name: 'Rose Gold Eye Palette',    category: 'Makeup',     price: 11000, stock: 85, status: 'Active' },
  { id: '105', name: 'Green Tea Cleansing Foam', category: 'Skincare',   price: 3200,  stock: 120,status: 'Active' },
  { id: '106', name: 'Midnight Bloom Perfume',   category: 'Fragrance',  price: 15500, stock: 30, status: 'Active' },
  { id: '107', name: 'Pro Blending Brush Set',   category: 'Tools',      price: 6800,  stock: 55, status: 'Active' },
  { id: '108', name: 'SPF 50 Sunscreen Fluid',   category: 'Skincare',   price: 5500,  stock: 90, status: 'Active' },
];

export default function AdminProducts() {
  const [products, setProducts]       = useState(initialProducts);
  const [showAddModal, setShowAddModal] = useState(false);
  const [search, setSearch]           = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const { formatPrice }               = useCurrency();
  const [newProduct, setNewProduct]   = useState({ name: '', category: 'Skincare', price: '', stock: '' });

  // Update page title
  useEffect(() => { document.title = 'AuraGlow Admin — Inventory'; }, []);

  const handleAddProduct = (e) => {
    e.preventDefault();
    const newId   = (100 + products.length + 1).toString();
    const stock   = parseInt(newProduct.stock) || 0;
    const status  = stock === 0 ? 'Out of Stock' : (stock < 20 ? 'Low Stock' : 'Active');
    setProducts([...products, { id: newId, name: newProduct.name, category: newProduct.category, price: parseFloat(newProduct.price) || 0, stock, status }]);
    setShowAddModal(false);
    setNewProduct({ name: '', category: 'Skincare', price: '', stock: '' });
  };

  const handleDelete = (id) => setProducts(products.filter(p => p.id !== id));

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Active':       return <span className="badge badge-vegan">Active</span>;
      case 'Low Stock':    return <span className="badge badge-low-stock">Low Stock</span>;
      case 'Out of Stock': return <span className="badge badge-out-of-stock">Out of Stock</span>;
      default:             return null;
    }
  };

  // Filtered product list
  const categories  = ['All', ...new Set(initialProducts.map(p => p.category))];
  const visible     = products.filter(p => {
    const matchSearch   = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCategory = filterCategory === 'All' || p.category === filterCategory;
    return matchSearch && matchCategory;
  });

  return (
    <div>
      {/* Header row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-2xl)' }}>Inventory Management</h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', marginTop: '2px' }}>
            {products.length} products &nbsp;·&nbsp;
            <span style={{ color: 'var(--color-warning)' }}>{products.filter(p => p.status === 'Low Stock').length} low stock</span> &nbsp;·&nbsp;
            <span style={{ color: 'var(--color-error)' }}>{products.filter(p => p.status === 'Out of Stock').length} out of stock</span>
          </p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => setShowAddModal(true)}>+ Add Product</button>
      </div>

      {/* Search & Filter bar */}
      <div style={{ display: 'flex', gap: 'var(--space-3)', marginBottom: 'var(--space-4)', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="🔍  Search products..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ flex: 1, minWidth: '200px' }}
        />
        <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)} style={{ width: 'auto' }}>
          {categories.map(c => <option key={c}>{c}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="card glass" style={{ padding: '0', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--color-border)', background: 'rgba(255,255,255,0.02)' }}>
              {['ID','Product Name','Category','Price','Stock','Status','Actions'].map((h, i) => (
                <th key={h} style={{ padding: 'var(--space-4)', color: 'var(--color-text-secondary)', fontWeight: '600', fontSize: 'var(--text-sm)', textAlign: i === 6 ? 'right' : 'left' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visible.map(p => (
              <tr key={p.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                <td style={{ padding: 'var(--space-4)', fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>#{p.id}</td>
                <td style={{ padding: 'var(--space-4)', fontSize: 'var(--text-sm)', fontWeight: '500' }}>{p.name}</td>
                <td style={{ padding: 'var(--space-4)', fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>{p.category}</td>
                <td style={{ padding: 'var(--space-4)', fontSize: 'var(--text-sm)' }}>{formatPrice(p.price)}</td>
                <td style={{ padding: 'var(--space-4)', fontSize: 'var(--text-sm)' }}>{p.stock}</td>
                <td style={{ padding: 'var(--space-4)' }}>{getStatusBadge(p.status)}</td>
                <td style={{ padding: 'var(--space-4)', textAlign: 'right' }}>
                  <button className="btn btn-ghost btn-sm" style={{ marginRight: 'var(--space-2)' }}>Edit</button>
                  <button className="btn btn-ghost btn-sm" style={{ color: 'var(--color-error)' }} onClick={() => handleDelete(p.id)}>Delete</button>
                </td>
              </tr>
            ))}
            {visible.length === 0 && (
              <tr>
                <td colSpan="7" style={{ padding: 'var(--space-8)', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                  No products match your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(13,13,15,0.8)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="card glass-strong" style={{ width: '100%', maxWidth: '500px', padding: 'var(--space-6)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-6)' }}>
              <h3>Add New Product</h3>
              <button className="btn btn-ghost btn-sm btn-icon" onClick={() => setShowAddModal(false)}>✕</button>
            </div>
            <form onSubmit={handleAddProduct} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <div>
                <label style={{ display: 'block', fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>Product Name</label>
                <input type="text" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} required placeholder="e.g., Hydrating Mist" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>Category</label>
                <select value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})}>
                  <option>Skincare</option><option>Makeup</option><option>Fragrance</option><option>Tools</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>Base Price (LKR)</label>
                  <input type="number" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} required placeholder="4500" />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>Initial Stock</label>
                  <input type="number" value={newProduct.stock} onChange={e => setNewProduct({...newProduct, stock: e.target.value})} required placeholder="100" />
                </div>
              </div>
              <div style={{ marginTop: 'var(--space-4)', display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
                <button type="button" className="btn btn-ghost" onClick={() => setShowAddModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Product</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
