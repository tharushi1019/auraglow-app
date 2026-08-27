import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCurrency } from '@/context/CurrencyContext';

export default function ProductQuickViewModal({ product, onClose, onAddToCart }) {
  const [selectedImg, setSelectedImg] = useState(product?.image);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const { formatPrice } = useCurrency();

  if (!product) return null;

  const images = product.imageGallery && product.imageGallery.length > 0
    ? product.imageGallery
    : [product.image];

  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock <= 15;
  const hasDiscount = product.oldPrice && product.oldPrice > product.price;

  const handleAdd = () => {
    if (isOutOfStock) return;
    setAdded(true);
    if (onAddToCart) onAddToCart({ ...product, qty: quantity });
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 1200);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 999,
        background: 'rgba(0,0,0,0.75)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--space-4)',
        animation: 'modalFadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'var(--color-bg-card)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-2xl)',
          width: '100%',
          maxWidth: '850px',
          maxHeight: '90vh',
          overflowY: 'auto',
          position: 'relative',
          padding: 'var(--space-8)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'rgba(255,255,255,0.08)',
            border: 'none',
            borderRadius: 'var(--radius-full)',
            width: '36px',
            height: '36px',
            color: 'var(--color-text-secondary)',
            fontSize: '18px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all var(--transition-fast)',
            zIndex: 10,
          }}
          aria-label="Close modal"
        >
          ✕
        </button>

        {/* Content Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--space-8)' }}>
          {/* Left: Images */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div style={{
              width: '100%',
              height: '360px',
              borderRadius: 'var(--radius-xl)',
              overflow: 'hidden',
              background: 'var(--color-bg-secondary)',
              position: 'relative',
            }}>
              <img
                src={selectedImg || product.image}
                alt={product.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{ position: 'absolute', top: '12px', left: '12px', display: 'flex', gap: '6px' }}>
                {product.badge && (
                  <span className={`badge ${product.badgeClass || 'badge-vegan'}`}>
                    {product.badge}
                  </span>
                )}
              </div>
            </div>

            {/* Gallery Thumbnails */}
            {images.length > 1 && (
              <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImg(img)}
                    style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: 'var(--radius-md)',
                      overflow: 'hidden',
                      border: selectedImg === img ? '2px solid var(--color-accent-rose)' : '1px solid var(--color-border)',
                      padding: 0,
                      cursor: 'pointer',
                      background: 'none',
                    }}
                  >
                    <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 'var(--space-1)' }}>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: '600' }}>
                  {product.brand || 'AuraGlow'}
                </span>
                <span style={{ color: 'var(--color-text-muted)' }}>•</span>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-accent-lavender)', textTransform: 'capitalize' }}>
                  {product.category}
                </span>
              </div>

              <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: '800', color: 'var(--color-text-primary)', margin: '0 0 var(--space-2) 0', lineHeight: 1.2 }}>
                {product.name}
              </h2>

              {/* Stars */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <div style={{ display: 'flex', gap: '2px', color: 'var(--color-accent-gold)', fontSize: '13px' }}>
                  {[1, 2, 3, 4, 5].map(i => (
                    <span key={i} style={{ opacity: i <= Math.round(product.rating) ? 1 : 0.25 }}>★</span>
                  ))}
                </div>
                <span style={{ fontSize: 'var(--text-xs)', fontWeight: '600', color: 'var(--color-text-primary)' }}>
                  {product.rating}
                </span>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                  ({product.reviewCount?.toLocaleString()} reviews)
                </span>
              </div>
            </div>

            {/* Price */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--space-3)' }}>
              <span style={{ fontSize: 'var(--text-2xl)', fontWeight: '800', color: 'var(--color-text-primary)' }}>
                {formatPrice(product.price)}
              </span>
              {hasDiscount && (
                <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', textDecoration: 'line-through' }}>
                  {formatPrice(product.oldPrice)}
                </span>
              )}
            </div>

            {/* Stock indicator */}
            <div>
              {isOutOfStock ? (
                <span className="badge badge-error">Out of Stock</span>
              ) : isLowStock ? (
                <span className="badge badge-warning">Only {product.stock} left in stock</span>
              ) : (
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-accent-sage)', fontWeight: '600' }}>
                  ● In Stock & Ready to Ship
                </span>
              )}
            </div>

            {/* Description */}
            <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', lineHeight: 1.6, margin: 0 }}>
              {product.description}
            </p>

            {/* Ingredients pill list */}
            {product.ingredients && product.ingredients.length > 0 && (
              <div>
                <h5 style={{ fontSize: 'var(--text-xs)', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: 'var(--space-2)' }}>
                  Key Actives:
                </h5>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {product.ingredients.map(ing => (
                    <span key={ing} style={{ fontSize: '11px', background: 'rgba(255,255,255,0.06)', border: '1px solid var(--color-border)', padding: '3px 10px', borderRadius: 'var(--radius-full)', color: 'var(--color-text-secondary)' }}>
                      🌿 {ing}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity + Add to Bag */}
            <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center', marginTop: 'var(--space-2)' }}>
              {/* Qty Selector */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-full)',
                padding: '4px 8px',
                background: 'var(--color-bg-secondary)',
              }}>
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1 || isOutOfStock}
                  style={{ background: 'none', border: 'none', color: 'var(--color-text-primary)', cursor: 'pointer', padding: '4px 8px', fontSize: '14px' }}
                >
                  -
                </button>
                <span style={{ padding: '0 8px', fontSize: 'var(--text-sm)', fontWeight: '600', color: 'var(--color-text-primary)' }}>
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock || 10, quantity + 1))}
                  disabled={isOutOfStock || quantity >= product.stock}
                  style={{ background: 'none', border: 'none', color: 'var(--color-text-primary)', cursor: 'pointer', padding: '4px 8px', fontSize: '14px' }}
                >
                  +
                </button>
              </div>

              {/* Add to Cart button */}
              <button
                onClick={handleAdd}
                disabled={isOutOfStock}
                className={`btn btn-primary btn-pill ${added ? 'btn-success' : ''}`}
                style={{ flex: 1, padding: '12px 24px', fontSize: 'var(--text-sm)', fontWeight: '600' }}
              >
                {added ? '✓ Added to Bag' : isOutOfStock ? 'Sold Out' : 'Add to Bag'}
              </button>
            </div>

            {/* View Full Product Link */}
            <div style={{ textAlign: 'center', marginTop: 'var(--space-2)' }}>
              <Link
                to={`/products/${product.id}`}
                onClick={onClose}
                style={{
                  color: 'var(--color-accent-rose)',
                  fontSize: 'var(--text-xs)',
                  fontWeight: '600',
                  textDecoration: 'none',
                }}
              >
                View Full Product Details & Customer Reviews →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
