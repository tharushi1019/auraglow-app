import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import { useCart } from '@/context/CartContext';
import { useCurrency } from '@/context/CurrencyContext';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const { formatPrice } = useCurrency();
  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState('');

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // Auto 15% routine bundle discount if they buy 3 or more items
  const isEligibleForBundle = cart.length >= 3;
  const bundleDiscount = isEligibleForBundle ? Math.round(subtotal * 0.15) : 0;

  // Coupon discount
  const couponDiscount = Math.round((subtotal - bundleDiscount) * (discountPercent / 100));

  const shipping = subtotal > 0 ? (subtotal - bundleDiscount - couponDiscount > 15000 ? 0 : 500) : 0;
  const total = subtotal - bundleDiscount - couponDiscount + shipping;

  const handleApplyPromo = (e) => {
    e.preventDefault();
    setPromoError('');
    setPromoSuccess('');
    const code = promoCode.trim().toUpperCase();

    if (code === 'GLOW15') {
      setDiscountPercent(15);
      setPromoSuccess('Promo GLOW15 applied! (15% Off)');
    } else if (code === 'CLEANBEAUTY') {
      setDiscountPercent(10);
      setPromoSuccess('Promo CLEANBEAUTY applied! (10% Off)');
    } else {
      setPromoError('Invalid promo code. Try "GLOW15"');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--color-bg-primary)' }}>
      <Navbar />

      <main style={{ maxWidth: '1280px', margin: 'var(--nav-height) auto 0', padding: 'var(--space-10) var(--space-8)', width: '100%', boxSizing: 'border-box', flex: 1 }}>
        
        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-6)' }}>
          <Link to="/" style={{ color: 'var(--color-text-muted)', textDecoration: 'none' }}>Home</Link>
          <span>/</span>
          <span style={{ color: 'var(--color-accent-rose)', fontWeight: '600' }}>Shopping Bag</span>
        </div>

        <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: '800', fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)', marginBottom: 'var(--space-8)' }}>
          Your Shopping Bag 🛍️
        </h1>

        {cart.length === 0 ? (
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
            <div style={{ fontSize: '4rem' }}>🌸</div>
            <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: '700', color: 'var(--color-text-primary)' }}>Your bag is empty</h2>
            <p style={{ color: 'var(--color-text-secondary)', maxWidth: '400px', fontSize: 'var(--text-sm)' }}>
              Explore our custom botanical skincare, makeup, and tools matching your skin diagnostic parameters.
            </p>
            <Link to="/products" className="btn btn-primary btn-pill" style={{ marginTop: 'var(--space-2)' }}>
              Start Shopping
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 'var(--space-8)', alignItems: 'start' }}>
            
            {/* Left: Cart Items List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              {cart.map(item => {
                const prod = item.product;
                return (
                  <div
                    key={item.id}
                    className="card-hover-glow"
                    style={{
                      background: 'var(--color-bg-card)',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-xl)',
                      padding: 'var(--space-5)',
                      display: 'grid',
                      gridTemplateColumns: '100px 1fr auto',
                      gap: 'var(--space-5)',
                      alignItems: 'center',
                    }}
                  >
                    {/* Thumbnail */}
                    <Link to={`/products/${item.id}`} style={{ width: '100px', height: '100px', borderRadius: 'var(--radius-lg)', overflow: 'hidden', display: 'block' }}>
                      <img src={prod.image} alt={prod.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </Link>

                    {/* Meta info */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <span style={{ fontSize: '10px', color: 'var(--color-accent-lavender)', textTransform: 'uppercase', fontWeight: '700' }}>
                        {prod.category}
                      </span>
                      <Link to={`/products/${item.id}`} style={{ fontSize: 'var(--text-base)', fontWeight: '700', color: 'var(--color-text-primary)', textDecoration: 'none' }}>
                        {prod.name}
                      </Link>
                      <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                        Unit: {formatPrice(prod.price)}
                      </span>

                      {/* Stock badge */}
                      {prod.stock <= 5 && (
                        <span style={{ fontSize: '10px', color: 'var(--color-accent-gold)', fontWeight: '600' }}>
                          ⚠️ Only {prod.stock} left in stock
                        </span>
                      )}
                    </div>

                    {/* Quantity & Pricing Controls */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-6)' }}>
                      {/* Qty edit */}
                      <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-full)', padding: '2px 6px', background: 'var(--color-bg-secondary)' }}>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          style={{ background: 'none', border: 'none', color: 'var(--color-text-primary)', cursor: 'pointer', padding: '2px 6px', fontSize: '13px' }}
                        >
                          -
                        </button>
                        <span style={{ padding: '0 6px', fontSize: 'var(--text-xs)', fontWeight: '700', color: 'var(--color-text-primary)' }}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={item.quantity >= (prod.stock || 10)}
                          style={{ background: 'none', border: 'none', color: 'var(--color-text-primary)', cursor: 'pointer', padding: '2px 6px', fontSize: '13px' }}
                        >
                          +
                        </button>
                      </div>

                      {/* Item Total Price */}
                      <div style={{ minWidth: '100px', textAlign: 'right' }}>
                        <div style={{ fontSize: 'var(--text-sm)', fontWeight: '800', color: 'var(--color-text-primary)' }}>
                          {formatPrice(prod.price * item.quantity)}
                        </div>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeFromCart(item.id)}
                        style={{ background: 'none', border: 'none', color: 'var(--color-accent-rose)', cursor: 'pointer', fontSize: '16px', padding: 0 }}
                        title="Remove item"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                );
              })}

              {/* Clear Bag Option */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'var(--space-2)' }}>
                <Link to="/products" style={{ color: 'var(--color-accent-rose)', textDecoration: 'none', fontSize: 'var(--text-sm)', fontWeight: '600' }}>
                  ← Continue Shopping
                </Link>
                <button
                  onClick={clearCart}
                  style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)', textDecoration: 'underline', cursor: 'pointer' }}
                >
                  Empty Bag
                </button>
              </div>
            </div>

            {/* Right: Summary Card */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
              {/* Promo code form */}
              <div style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-5)' }}>
                <h4 style={{ fontSize: 'var(--text-xs)', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-text-muted)', marginBottom: 'var(--space-3)' }}>
                  Promo Code
                </h4>
                <form onSubmit={handleApplyPromo} style={{ display: 'flex', gap: 'var(--space-2)' }}>
                  <input
                    type="text"
                    placeholder="e.g. GLOW15"
                    value={promoCode}
                    onChange={e => setPromoCode(e.target.value)}
                    className="input"
                    style={{ fontSize: 'var(--text-xs)', padding: '8px 12px' }}
                  />
                  <button type="submit" className="btn btn-secondary btn-sm" style={{ padding: '8px 16px' }}>
                    Apply
                  </button>
                </form>
                {promoError && <p style={{ color: 'var(--color-accent-rose)', fontSize: '11px', marginTop: '6px', margin: '6px 0 0 0' }}>{promoError}</p>}
                {promoSuccess && <p style={{ color: 'var(--color-accent-sage)', fontSize: '11px', marginTop: '6px', margin: '6px 0 0 0' }}>{promoSuccess}</p>}
              </div>

              {/* Totals Summary */}
              <div style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-2xl)', padding: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                <h3 style={{ fontSize: 'var(--text-base)', fontWeight: '700', color: 'var(--color-text-primary)', margin: 0, paddingBottom: 'var(--space-3)', borderBottom: '1px solid var(--color-border)' }}>
                  Order Summary
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Subtotal ({cart.length} items)</span>
                    <span style={{ color: 'var(--color-text-primary)', fontWeight: '600' }}>{formatPrice(subtotal)}</span>
                  </div>

                  {/* Routine bundle discount indicator */}
                  {isEligibleForBundle && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-accent-sage)' }}>
                      <span>Routine Bundle (15% Off)</span>
                      <span>-{formatPrice(bundleDiscount)}</span>
                    </div>
                  )}

                  {discountPercent > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-accent-sage)' }}>
                      <span>Promo Discount ({discountPercent}%)</span>
                      <span>-{formatPrice(couponDiscount)}</span>
                    </div>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Shipping Fee</span>
                    <span style={{ color: 'var(--color-text-primary)', fontWeight: '600' }}>
                      {shipping === 0 ? 'FREE' : formatPrice(shipping)}
                    </span>
                  </div>
                </div>

                {/* Final Total */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  paddingTop: 'var(--space-4)',
                  borderTop: '1px solid var(--color-border)',
                  fontSize: 'var(--text-base)',
                  fontWeight: '800',
                  color: 'var(--color-text-primary)',
                }}>
                  <span>Total Amount</span>
                  <span style={{ color: 'var(--color-accent-rose)' }}>{formatPrice(total)}</span>
                </div>

                <Link
                  to="/checkout"
                  className="btn btn-primary btn-pill"
                  style={{ textDecoration: 'none', textAlign: 'center', display: 'block', padding: '12px 24px', fontWeight: '700', fontSize: 'var(--text-sm)', marginTop: 'var(--space-2)' }}
                >
                  Proceed to Checkout 🔒
                </Link>

                {shipping > 0 && (
                  <p style={{ fontSize: '10px', color: 'var(--color-text-muted)', textAlign: 'center', margin: 0 }}>
                    💡 Add {formatPrice(15000 - (subtotal - bundleDiscount - couponDiscount))} more to unlock **FREE SHIPPING**!
                  </p>
                )}
              </div>
            </div>

          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
