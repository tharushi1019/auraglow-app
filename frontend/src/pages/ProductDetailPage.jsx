import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import ProductImageGallery from '@/components/catalog/ProductImageGallery';
import ReviewsSection from '@/components/reviews/ReviewsSection';
import SkinMatchBadge from '@/components/reviews/SkinMatchBadge';
import PersonalizedRoutineWidget from '@/components/reviews/PersonalizedRoutineWidget';
import ProductCard from '@/components/catalog/ProductCard';
import { useCurrency } from '@/context/CurrencyContext';
import { useCart } from '@/context/CartContext';
import { getProductById, getRelatedProducts } from '@/services/productService';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const { formatPrice } = useCurrency();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [toastMessage, setToastMessage] = useState(null);
  const [added, setAdded] = useState(false);

  const isWishlisted = product ? isInWishlist(product.id) : false;

  useEffect(() => {
    async function loadProduct() {
      setLoading(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      const data = await getProductById(id);
      if (!data) {
        setProduct(null);
      } else {
        setProduct(data);
        const related = await getRelatedProducts(data.id);
        setRelatedProducts(related);
      }
      setLoading(false);
    }
    loadProduct();
  }, [id]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleAddToCart = () => {
    if (!product || product.stock === 0) return;
    setAdded(true);
    addToCart(product, quantity);
    showToast(`🌸 Added ${quantity} × "${product.name}" to your shopping bag!`);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    if (!product || product.stock === 0) return;
    addToCart(product, quantity);
    showToast(`🛍️ Proceeding to checkout with "${product.name}"...`);
    setTimeout(() => navigate('/checkout'), 800);
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--color-bg-primary)' }}>
        <Navbar />
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 'var(--space-4)', marginTop: 'var(--nav-height)' }}>
          <div style={{ fontSize: '3rem', animation: 'spin 2s linear infinite' }}>🌸</div>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-base)' }}>Loading product details...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--color-bg-primary)' }}>
        <Navbar />
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 'var(--space-4)', marginTop: 'var(--nav-height)', padding: 'var(--space-10)' }}>
          <div style={{ fontSize: '3.5rem' }}>🍃</div>
          <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: '800', color: 'var(--color-text-primary)' }}>Product Not Found</h2>
          <p style={{ color: 'var(--color-text-secondary)', maxWidth: '400px', textAlign: 'center' }}>
            The clean beauty formula you are looking for might be out of season or renamed.
          </p>
          <Link to="/products" className="btn btn-primary btn-pill">
            Explore All Products 🌸
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock <= 15;
  const hasDiscount = product.oldPrice && product.oldPrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--color-bg-primary)' }}>
      <Navbar />

      {/* Toast Notification */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 9999,
            background: 'rgba(23, 23, 27, 0.95)',
            backdropFilter: 'blur(12px)',
            border: '1px solid var(--color-accent-rose)',
            borderRadius: 'var(--radius-xl)',
            padding: '12px 20px',
            color: '#fff',
            fontSize: 'var(--text-sm)',
            fontWeight: '600',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            animation: 'slideUp 0.3s ease',
          }}
        >
          <span>{toastMessage}</span>
          <Link to="/cart" style={{ color: 'var(--color-accent-rose)', textDecoration: 'underline', fontSize: 'var(--text-xs)' }}>
            View Bag
          </Link>
        </div>
      )}

      {/* Breadcrumb Navigation */}
      <div style={{
        marginTop: 'var(--nav-height)',
        padding: 'var(--space-6) var(--space-10) 0',
        maxWidth: '1280px',
        margin: 'var(--nav-height) auto 0',
        width: '100%',
        boxSizing: 'border-box',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
          <Link to="/" style={{ color: 'var(--color-text-muted)', textDecoration: 'none' }}>Home</Link>
          <span>/</span>
          <Link to="/products" style={{ color: 'var(--color-text-muted)', textDecoration: 'none' }}>Shop</Link>
          <span>/</span>
          <Link to={`/products?category=${product.category}`} style={{ color: 'var(--color-text-muted)', textDecoration: 'none', textTransform: 'capitalize' }}>
            {product.category}
          </Link>
          <span>/</span>
          <span style={{ color: 'var(--color-accent-rose)', fontWeight: '600' }}>{product.name}</span>
        </div>
      </div>

      {/* Product Hero Showcase */}
      <main style={{ maxWidth: '1280px', margin: '0 auto', padding: 'var(--space-8) var(--space-10)', width: '100%', boxSizing: 'border-box' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: 'var(--space-12)',
          alignItems: 'start',
          marginBottom: 'var(--space-16)',
        }}>
          {/* Left Column: Image Gallery */}
          <ProductImageGallery
            images={product.imageGallery || [product.image]}
            name={product.name}
            badge={product.badge}
            badgeClass={product.badgeClass}
          />

          {/* Right Column: Product Core Info & Buying Actions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
            {/* Header: Brand, Category, Title */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 'var(--space-2)' }}>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: '700' }}>
                  {product.brand || 'AuraGlow'}
                </span>
                <span style={{ color: 'var(--color-text-muted)' }}>•</span>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-accent-lavender)', textTransform: 'capitalize', fontWeight: '600' }}>
                  {product.category}
                </span>
              </div>

              <h1 style={{
                fontSize: 'var(--text-3xl)',
                fontWeight: '800',
                fontFamily: 'var(--font-heading)',
                color: 'var(--color-text-primary)',
                lineHeight: 1.2,
                margin: '0 0 var(--space-3) 0',
              }}>
                {product.name}
              </h1>

              {/* Rating Summary */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                <div style={{ display: 'flex', gap: '2px', color: 'var(--color-accent-gold)', fontSize: '15px' }}>
                  {[1, 2, 3, 4, 5].map(i => (
                    <span key={i} style={{ opacity: i <= Math.round(product.rating) ? 1 : 0.25 }}>★</span>
                  ))}
                </div>
                <span style={{ fontSize: 'var(--text-sm)', fontWeight: '700', color: 'var(--color-text-primary)' }}>
                  {product.rating}
                </span>
                <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
                  ({product.reviewCount?.toLocaleString()} verified customer reviews)
                </span>
              </div>
            </div>

            {/* Price & Savings */}
            <div style={{
              background: 'var(--color-bg-card)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-xl)',
              padding: 'var(--space-5)',
              display: 'flex',
              alignItems: 'baseline',
              gap: 'var(--space-4)',
            }}>
              <span style={{ fontSize: 'var(--text-3xl)', fontWeight: '900', color: 'var(--color-text-primary)' }}>
                {formatPrice(product.price)}
              </span>
              {hasDiscount && (
                <>
                  <span style={{ fontSize: 'var(--text-base)', color: 'var(--color-text-muted)', textDecoration: 'line-through' }}>
                    {formatPrice(product.oldPrice)}
                  </span>
                  <span className="badge badge-sale" style={{ background: 'var(--color-accent-rose)', color: '#fff' }}>
                    Save {discountPercent}%
                  </span>
                </>
              )}
            </div>

            {/* Stock Tracker */}
            <div>
              {isOutOfStock ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-accent-rose)' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--color-accent-rose)' }} />
                  <span style={{ fontSize: 'var(--text-sm)', fontWeight: '600' }}>Out of Stock — Join waitlist below</span>
                </div>
              ) : isLowStock ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-accent-gold)' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--color-accent-gold)', animation: 'pulse 1.5s infinite' }} />
                  <span style={{ fontSize: 'var(--text-sm)', fontWeight: '600' }}>Low Stock Alert: Only {product.stock} items remaining!</span>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-accent-sage)' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--color-accent-sage)' }} />
                  <span style={{ fontSize: 'var(--text-sm)', fontWeight: '600' }}>In Stock ({product.stock} units) — Fast Delivery</span>
                </div>
              )}
            </div>

            {/* AI Skin Compatibility Match Badge */}
            <SkinMatchBadge product={product} initialSkinType={product.skinTypes ? product.skinTypes[0] : 'Dry'} />

            {/* Short Excerpt */}
            <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-base)', lineHeight: 1.6, margin: 0 }}>
              {product.description}
            </p>

            {/* Actions: Quantity + Add to Bag + Buy Now + Wishlist */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}>
                {/* Quantity Controls */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-full)',
                  padding: '6px 12px',
                  background: 'var(--color-bg-secondary)',
                }}>
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1 || isOutOfStock}
                    style={{ background: 'none', border: 'none', color: 'var(--color-text-primary)', cursor: 'pointer', fontSize: '18px', padding: '0 6px' }}
                  >
                    -
                  </button>
                  <span style={{ padding: '0 12px', fontSize: 'var(--text-base)', fontWeight: '700', color: 'var(--color-text-primary)' }}>
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock || 10, quantity + 1))}
                    disabled={isOutOfStock || quantity >= product.stock}
                    style={{ background: 'none', border: 'none', color: 'var(--color-text-primary)', cursor: 'pointer', fontSize: '18px', padding: '0 6px' }}
                  >
                    +
                  </button>
                </div>

                {/* Add to Bag Button */}
                <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className={`btn btn-primary btn-pill ${added ? 'btn-success' : ''}`}
                  style={{ flex: 1, padding: '14px 28px', fontSize: 'var(--text-base)', fontWeight: '700' }}
                >
                  {added ? '✓ Added to Bag' : isOutOfStock ? 'Sold Out' : `Add to Bag • ${formatPrice(product.price * quantity)}`}
                </button>

                {/* Wishlist Button */}
                <button
                  onClick={() => toggleWishlist(product)}
                  aria-label="Wishlist"
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: 'var(--radius-full)',
                    background: isWishlisted ? 'rgba(232, 114, 150, 0.2)' : 'var(--color-bg-secondary)',
                    border: isWishlisted ? '1px solid var(--color-accent-rose)' : '1px solid var(--color-border)',
                    cursor: 'pointer',
                    fontSize: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all var(--transition-fast)',
                  }}
                >
                  {isWishlisted ? '❤️' : '🤍'}
                </button>
              </div>

              {/* Instant Buy Now Button */}
              {!isOutOfStock && (
                <button
                  onClick={handleBuyNow}
                  className="btn btn-secondary btn-pill"
                  style={{ width: '100%', padding: '12px 24px', fontSize: 'var(--text-sm)', fontWeight: '600' }}
                >
                  ⚡ Instant Buy Now
                </button>
              )}
            </div>

            {/* Trust Badges Feature Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 'var(--space-3)',
              paddingTop: 'var(--space-4)',
              borderTop: '1px solid var(--color-border)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
                <span>🌱</span> 100% Vegan & Botanical Actives
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
                <span>🐰</span> Certified Cruelty-Free
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
                <span>🚚</span> Islandwide 2-3 Day Delivery
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
                <span>🔄</span> 30-Day Radiance Guarantee
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Tabs: Description, Ingredients, How to Use, Skin Compatibility */}
        <section style={{ marginBottom: 'var(--space-16)' }}>
          {/* Tab Navigation Header */}
          <div style={{
            display: 'flex',
            borderBottom: '1px solid var(--color-border)',
            gap: 'var(--space-6)',
            marginBottom: 'var(--space-8)',
            overflowX: 'auto',
          }}>
            {[
              { key: 'description', label: '📖 Description & Benefits' },
              { key: 'ingredients', label: '🌿 Clean Ingredients' },
              { key: 'howToUse', label: '✨ How to Apply' },
              { key: 'skinCompatibility', label: '🎯 Skin Type Match' },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                style={{
                  background: 'none',
                  border: 'none',
                  borderBottom: activeTab === tab.key ? '2px solid var(--color-accent-rose)' : '2px solid transparent',
                  color: activeTab === tab.key ? 'var(--color-accent-rose)' : 'var(--color-text-secondary)',
                  padding: 'var(--space-3) 0',
                  fontSize: 'var(--text-base)',
                  fontWeight: activeTab === tab.key ? '700' : '500',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all var(--transition-fast)',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab 1: Description & Key Benefits */}
          {activeTab === 'description' && (
            <div style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-2xl)', padding: 'var(--space-8)' }}>
              <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: '700', color: 'var(--color-text-primary)', marginBottom: 'var(--space-4)' }}>
                About the Formula
              </h3>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-base)', lineHeight: 1.8, marginBottom: 'var(--space-6)' }}>
                {product.description} Formulated at the optimal pH balance to ensure deep cellular absorption without disrupting your skin's natural moisture barrier. Free from parabens, synthetic sulfates, artificial fragrances, and mineral oils.
              </p>

              <h4 style={{ fontSize: 'var(--text-base)', fontWeight: '700', color: 'var(--color-text-primary)', marginBottom: 'var(--space-3)' }}>
                Clinical & Botanical Highlights:
              </h4>
              <ul style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8, paddingLeft: 'var(--space-5)' }}>
                <li>Visible improvement in skin luminosity and clarity in clinical user trials.</li>
                <li>Fortifies barrier integrity against environmental pollutants and blue-light stress.</li>
                <li>Dermatologist-tested, hypoallergenic, and non-comedogenic.</li>
              </ul>
            </div>
          )}

          {/* Tab 2: Ingredients */}
          {activeTab === 'ingredients' && (
            <div style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-2xl)', padding: 'var(--space-8)' }}>
              <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: '700', color: 'var(--color-text-primary)', marginBottom: 'var(--space-4)' }}>
                Active & Supporting Ingredients
              </h3>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-6)' }}>
                We believe in 100% ingredient transparency. Every botanical extract is ethically sourced and rigorously screened.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-4)' }}>
                {(product.ingredients || ['Hyaluronic Acid', 'Rose Extract', 'Vitamin C', 'Aloe Vera']).map(ing => (
                  <div
                    key={ing}
                    style={{
                      background: 'var(--color-bg-secondary)',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-xl)',
                      padding: 'var(--space-4)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--space-3)',
                    }}
                  >
                    <span style={{ fontSize: '20px' }}>🌿</span>
                    <div>
                      <h5 style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)', fontWeight: '700' }}>{ing}</h5>
                      <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Pure Botanical Active</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 3: How to Apply */}
          {activeTab === 'howToUse' && (
            <div style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-2xl)', padding: 'var(--space-8)' }}>
              <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: '700', color: 'var(--color-text-primary)', marginBottom: 'var(--space-4)' }}>
                Daily Application Ritual
              </h3>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-base)', lineHeight: 1.8, marginBottom: 'var(--space-6)' }}>
                {product.howToUse || 'Apply 3-4 drops or a pea-sized amount onto freshly cleansed and toned skin. Gently press into face and neck in upward sweeping motions. Follow with your favorite moisturizer and SPF during daylight hours.'}
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--space-4)' }}>
                <div style={{ background: 'var(--color-bg-secondary)', padding: 'var(--space-4)', borderRadius: 'var(--radius-lg)', textAlign: 'center' }}>
                  <div style={{ fontSize: '24px', marginBottom: '4px' }}>🧴 Step 1</div>
                  <strong style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)' }}>Cleanse</strong>
                </div>
                <div style={{ background: 'var(--color-bg-secondary)', padding: 'var(--space-4)', borderRadius: 'var(--radius-lg)', textAlign: 'center' }}>
                  <div style={{ fontSize: '24px', marginBottom: '4px' }}>✨ Step 2</div>
                  <strong style={{ fontSize: 'var(--text-sm)', color: 'var(--color-accent-rose)' }}>Apply {product.name}</strong>
                </div>
                <div style={{ background: 'var(--color-bg-secondary)', padding: 'var(--space-4)', borderRadius: 'var(--radius-lg)', textAlign: 'center' }}>
                  <div style={{ fontSize: '24px', marginBottom: '4px' }}>💧 Step 3</div>
                  <strong style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)' }}>Lock Hydration</strong>
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: Skin Compatibility */}
          {activeTab === 'skinCompatibility' && (
            <div style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-2xl)', padding: 'var(--space-8)' }}>
              <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: '700', color: 'var(--color-text-primary)', marginBottom: 'var(--space-4)' }}>
                Skin Compatibility & Suitability
              </h3>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-6)' }}>
                Matches identified by our AuraGlow AI Skin Diagnostic Engine.
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
                {(product.skinTypes || ['All Skin Types', 'Sensitive Skin', 'Dry Skin', 'Combination']).map(st => (
                  <span
                    key={st}
                    style={{
                      background: 'rgba(184, 169, 217, 0.15)',
                      border: '1px solid var(--color-accent-lavender)',
                      borderRadius: 'var(--radius-full)',
                      padding: '8px 18px',
                      fontSize: 'var(--text-sm)',
                      fontWeight: '600',
                      color: 'var(--color-text-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <span>✓</span> {st}
                  </span>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Customer Reviews & Feedback Section */}
        <section style={{ marginBottom: 'var(--space-16)' }}>
          <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: '800', fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)', marginBottom: 'var(--space-6)' }}>
            Customer Feedback & Verified Reviews
          </h2>
          <ReviewsSection
            productId={product.id}
            productName={product.name}
          />
        </section>

        {/* Personalized Routine Matcher */}
        <section style={{ marginBottom: 'var(--space-16)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
            <div>
              <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: '800', fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)', margin: 0 }}>
                Synergistic Clean Skincare Regimen
              </h2>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', margin: '4px 0 0 0' }}>
                How to integrate {product.name} with complementary clean beauty steps.
              </p>
            </div>
            <Link to="/recommendations" style={{ color: 'var(--color-accent-rose)', textDecoration: 'none', fontSize: 'var(--text-sm)', fontWeight: '600' }}>
              Full Routine Advisor →
            </Link>
          </div>
          <PersonalizedRoutineWidget
            initialSkinType={product.skinTypes ? product.skinTypes[0] : 'Dry'}
            onAddToCart={p => showToast(`🌸 Added "${p.name}" to your shopping bag!`)}
          />
        </section>

        {/* Related Products / Recommendations */}
        {relatedProducts.length > 0 && (
          <section style={{ marginBottom: 'var(--space-12)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
              <div>
                <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: '800', fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)', margin: 0 }}>
                  You May Also Love
                </h2>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', margin: '4px 0 0 0' }}>
                  Hand-picked formulas that pair perfectly with this routine.
                </p>
              </div>
              <Link to="/products" style={{ color: 'var(--color-accent-rose)', textDecoration: 'none', fontSize: 'var(--text-sm)', fontWeight: '600' }}>
                View All →
              </Link>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 'var(--space-6)' }}>
              {relatedProducts.map(p => (
                <ProductCard
                  key={p.id}
                  product={p}
                  viewMode="grid"
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
