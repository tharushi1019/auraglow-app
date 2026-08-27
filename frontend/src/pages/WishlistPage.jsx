import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import ProductCard from '@/components/catalog/ProductCard';
import { useCart } from '@/context/CartContext';

export default function WishlistPage() {
  const { wishlist, toggleWishlist, addToCart } = useCart();

  const handleAddAllToBag = () => {
    wishlist.forEach(prod => {
      addToCart(prod, 1);
    });
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--color-bg-primary)' }}>
      <Navbar />

      <main style={{ maxWidth: '1280px', margin: 'var(--nav-height) auto 0', padding: 'var(--space-10) var(--space-8)', width: '100%', boxSizing: 'border-box', flex: 1 }}>
        
        {/* Breadcrumbs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-6)' }}>
          <Link to="/" style={{ color: 'var(--color-text-muted)', textDecoration: 'none' }}>Home</Link>
          <span>/</span>
          <span style={{ color: 'var(--color-accent-rose)', fontWeight: '600' }}>My Wishlist</span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-8)', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
          <div>
            <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: '800', fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)', margin: 0 }}>
              My Wishlist Board 🤍
            </h1>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', margin: '4px 0 0 0' }}>
              Your collection of clean beauty favorites & matched skincare formulas.
            </p>
          </div>

          {wishlist.length > 0 && (
            <button
              onClick={handleAddAllToBag}
              className="btn btn-primary btn-pill btn-sm"
              style={{ padding: '8px 24px', fontWeight: '600' }}
            >
              🛍️ Add All to Bag
            </button>
          )}
        </div>

        {wishlist.length === 0 ? (
          <div style={{
            background: 'var(--color-bg-card)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-2xl)',
            padding: 'var(--space-16) var(--space-8)',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 'var(--space-4)',
          }}>
            <div style={{ fontSize: '4rem' }}>🤍</div>
            <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: '700', color: 'var(--color-text-primary)' }}>Your Wishlist is empty</h2>
            <p style={{ color: 'var(--color-text-secondary)', maxWidth: '400px', fontSize: 'var(--text-sm)' }}>
              Start browsing and add items to your wishlist by clicking the heart button on product cards.
            </p>
            <Link to="/products" className="btn btn-primary btn-pill" style={{ marginTop: 'var(--space-2)' }}>
              Explore Products
            </Link>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: 'var(--space-6)',
          }}>
            {wishlist.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                viewMode="grid"
                onAddToCart={(p) => addToCart(p, 1)}
              />
            ))}
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
