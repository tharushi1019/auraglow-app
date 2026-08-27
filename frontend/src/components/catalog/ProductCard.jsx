import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCurrency } from '@/context/CurrencyContext';
import { useCart } from '@/context/CartContext';

export default function ProductCard({
  product,
  viewMode = 'grid',
  onQuickView,
  onAddToCart,
}) {
  const [hovered, setHovered] = useState(false);
  const [added, setAdded] = useState(false);
  const { formatPrice } = useCurrency();
  const { addToCart, toggleWishlist, isInWishlist } = useCart();

  const isWishlisted = isInWishlist(product.id);
  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock <= 15;
  const hasDiscount = product.oldPrice && product.oldPrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;
    setAdded(true);
    addToCart(product, 1);
    if (onAddToCart) onAddToCart(product);
    setTimeout(() => setAdded(false), 1800);
  };

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const handleQuickView = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onQuickView) onQuickView(product);
  };

  if (viewMode === 'list') {
    return (
      <div
        className="card-hover-glow"
        style={{
          background: 'var(--color-bg-card)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-xl)',
          padding: 'var(--space-5)',
          display: 'grid',
          gridTemplateColumns: '240px 1fr auto',
          gap: 'var(--space-6)',
          alignItems: 'center',
          transition: 'all var(--transition-base)',
          position: 'relative',
          overflow: 'hidden',
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Product Image */}
        <Link
          to={`/products/${product.id}`}
          style={{
            position: 'relative',
            width: '100%',
            height: '180px',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            background: 'var(--color-bg-secondary)',
            display: 'block',
            textDecoration: 'none',
          }}
        >
          <img
            src={product.image}
            alt={product.name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transform: hovered ? 'scale(1.08)' : 'scale(1)',
              transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          />
          {/* Badge Overlay */}
          <div style={{ position: 'absolute', top: '10px', left: '10px', display: 'flex', flexDirection: 'column', gap: '4px', zIndex: 2 }}>
            {product.badge && (
              <span className={`badge ${product.badgeClass || 'badge-vegan'}`} style={{ fontSize: '11px' }}>
                {product.badge}
              </span>
            )}
            {hasDiscount && (
              <span className="badge badge-sale" style={{ fontSize: '11px', background: 'var(--color-accent-rose)', color: '#fff' }}>
                Save {discountPercent}%
              </span>
            )}
          </div>
        </Link>

        {/* Product Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: '600' }}>
              {product.brand || 'AuraGlow'}
            </span>
            <span style={{ color: 'var(--color-text-muted)' }}>•</span>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-accent-lavender)', textTransform: 'capitalize' }}>
              {product.category}
            </span>
          </div>

          <Link
            to={`/products/${product.id}`}
            style={{
              fontSize: 'var(--text-lg)',
              fontWeight: '700',
              color: 'var(--color-text-primary)',
              textDecoration: 'none',
              lineHeight: 1.3,
            }}
          >
            {product.name}
          </Link>

          <p style={{
            fontSize: 'var(--text-sm)',
            color: 'var(--color-text-secondary)',
            lineHeight: 1.5,
            margin: 0,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}>
            {product.description}
          </p>

          {/* Rating */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginTop: 'var(--space-1)' }}>
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

          {/* Key tags */}
          {product.ingredients && product.ingredients.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: 'var(--space-1)' }}>
              {product.ingredients.slice(0, 3).map(ing => (
                <span key={ing} style={{ fontSize: '10px', background: 'rgba(255,255,255,0.06)', padding: '2px 8px', borderRadius: 'var(--radius-full)', color: 'var(--color-text-muted)' }}>
                  🌿 {ing}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Price & Action Column */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          height: '100%',
          minWidth: '160px',
          gap: 'var(--space-4)',
        }}>
          {/* Wishlist button */}
          <button
            onClick={handleToggleWishlist}
            aria-label="Wishlist"
            style={{
              background: isWishlisted ? 'rgba(232, 114, 150, 0.2)' : 'rgba(255,255,255,0.05)',
              border: isWishlisted ? '1px solid var(--color-accent-rose)' : '1px solid var(--color-border)',
              borderRadius: 'var(--radius-full)',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              fontSize: '15px',
              transition: 'all var(--transition-fast)',
            }}
          >
            {isWishlisted ? '❤️' : '🤍'}
          </button>

          {/* Pricing */}
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 'var(--text-xl)', fontWeight: '800', color: 'var(--color-text-primary)' }}>
              {formatPrice(product.price)}
            </div>
            {hasDiscount && (
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', textDecoration: 'line-through' }}>
                {formatPrice(product.oldPrice)}
              </div>
            )}
            {isOutOfStock ? (
              <span className="badge badge-error" style={{ fontSize: '10px', marginTop: '4px', display: 'inline-block' }}>
                Out of Stock
              </span>
            ) : isLowStock ? (
              <span className="badge badge-warning" style={{ fontSize: '10px', marginTop: '4px', display: 'inline-block' }}>
                Only {product.stock} left
              </span>
            ) : (
              <span style={{ fontSize: '10px', color: 'var(--color-accent-sage)', marginTop: '4px', display: 'block' }}>
                ● In Stock ({product.stock})
              </span>
            )}
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            <button
              onClick={handleQuickView}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: 'var(--text-xs)', padding: '6px 12px' }}
            >
              👁️ View
            </button>
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={`btn btn-sm ${added ? 'btn-success' : 'btn-primary'}`}
              style={{ fontSize: 'var(--text-xs)', padding: '6px 14px' }}
            >
              {added ? '✓ Added' : isOutOfStock ? 'Sold Out' : '+ Bag'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Grid View Mode ────────────────────────────────────────────────────────
  return (
    <div
      className="card-hover-glow"
      style={{
        background: 'var(--color-bg-card)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-xl)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        transform: hovered ? 'translateY(-6px)' : 'translateY(0)',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Top Image Container */}
      <div style={{ position: 'relative', width: '100%', paddingTop: '100%', overflow: 'hidden', background: 'var(--color-bg-secondary)' }}>
        <Link to={`/products/${product.id}`} style={{ position: 'absolute', inset: 0, display: 'block' }}>
          <img
            src={product.image}
            alt={product.name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transform: hovered ? 'scale(1.09)' : 'scale(1)',
              transition: 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          />
        </Link>

        {/* Badges Overlay */}
        <div style={{ position: 'absolute', top: '10px', left: '10px', display: 'flex', flexDirection: 'column', gap: '5px', zIndex: 2 }}>
          {product.badge && (
            <span className={`badge ${product.badgeClass || 'badge-vegan'}`} style={{ fontSize: '11px', backdropFilter: 'blur(8px)' }}>
              {product.badge}
            </span>
          )}
          {hasDiscount && (
            <span className="badge badge-sale" style={{ fontSize: '11px', background: 'var(--color-accent-rose)', color: '#fff' }}>
              -{discountPercent}%
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleToggleWishlist}
          aria-label="Wishlist"
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            zIndex: 3,
            background: isWishlisted ? 'rgba(232, 114, 150, 0.85)' : 'rgba(13, 13, 15, 0.75)',
            backdropFilter: 'blur(8px)',
            border: isWishlisted ? '1px solid var(--color-accent-rose)' : '1px solid rgba(255,255,255,0.15)',
            borderRadius: 'var(--radius-full)',
            width: '34px',
            height: '34px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            fontSize: '14px',
            transition: 'all var(--transition-fast)',
          }}
        >
          {isWishlisted ? '❤️' : '🤍'}
        </button>

        {/* Quick View Hover Bar */}
        <div
          style={{
            position: 'absolute',
            bottom: '10px',
            left: '10px',
            right: '10px',
            zIndex: 3,
            opacity: hovered ? 1 : 0,
            transform: hovered ? 'translateY(0)' : 'translateY(10px)',
            transition: 'all 0.25s ease',
            display: 'flex',
            gap: '8px',
          }}
        >
          <button
            onClick={handleQuickView}
            className="btn btn-secondary btn-sm"
            style={{
              flex: 1,
              background: 'rgba(13,13,15,0.85)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.2)',
              fontSize: '11px',
              padding: '6px 8px',
            }}
          >
            👁️ Quick View
          </button>
        </div>
      </div>

      {/* Product Body */}
      <div style={{ padding: 'var(--space-4)', display: 'flex', flexDirection: 'column', flex: 1, gap: 'var(--space-2)' }}>
        {/* Category & Brand */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '11px', color: 'var(--color-accent-lavender)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: '600' }}>
            {product.category}
          </span>
          {isOutOfStock ? (
            <span style={{ fontSize: '10px', color: 'var(--color-accent-rose)', fontWeight: '600' }}>
              Sold Out
            </span>
          ) : isLowStock ? (
            <span style={{ fontSize: '10px', color: 'var(--color-accent-gold)', fontWeight: '600' }}>
              Only {product.stock} left
            </span>
          ) : null}
        </div>

        {/* Product Title */}
        <Link
          to={`/products/${product.id}`}
          style={{
            fontSize: 'var(--text-base)',
            fontWeight: '700',
            color: 'var(--color-text-primary)',
            textDecoration: 'none',
            lineHeight: 1.3,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            display: 'block',
          }}
          title={product.name}
        >
          {product.name}
        </Link>

        {/* Rating Stars */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <div style={{ display: 'flex', gap: '2px', color: 'var(--color-accent-gold)', fontSize: '11px' }}>
            {[1, 2, 3, 4, 5].map(i => (
              <span key={i} style={{ opacity: i <= Math.round(product.rating) ? 1 : 0.25 }}>★</span>
            ))}
          </div>
          <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
            {product.rating} ({product.reviewCount?.toLocaleString()})
          </span>
        </div>

        {/* Pricing and Cart Action Footer */}
        <div style={{
          marginTop: 'auto',
          paddingTop: 'var(--space-3)',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div>
            <div style={{ fontSize: 'var(--text-base)', fontWeight: '800', color: 'var(--color-text-primary)' }}>
              {formatPrice(product.price)}
            </div>
            {hasDiscount && (
              <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', textDecoration: 'line-through' }}>
                {formatPrice(product.oldPrice)}
              </div>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`btn btn-sm btn-pill ${added ? 'btn-success' : 'btn-primary'}`}
            style={{
              padding: '6px 12px',
              fontSize: '11px',
              opacity: isOutOfStock ? 0.4 : 1,
            }}
          >
            {added ? '✓ Added' : isOutOfStock ? 'Sold' : '+ Add'}
          </button>
        </div>
      </div>
    </div>
  );
}
