import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/common/Navbar';
import { useCurrency } from '@/context/CurrencyContext';
import { getFeaturedProducts } from '@/data/mockData';

// ─── Data ────────────────────────────────────────────────────────────────────

const categories = [
  {
    name: 'Skincare',
    desc: 'Serums, moisturizers & treatments',
    emoji: '✨',
    img: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=600&q=80',
    color: 'rgba(232,180,160,0.15)',
    border: 'rgba(232,180,160,0.3)',
  },
  {
    name: 'Makeup',
    desc: 'Lips, eyes, face & more',
    emoji: '💄',
    img: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=600&q=80',
    color: 'rgba(212,168,199,0.15)',
    border: 'rgba(212,168,199,0.3)',
  },
  {
    name: 'Fragrance',
    desc: 'Perfumes & body mists',
    emoji: '🌸',
    img: 'https://images.unsplash.com/photo-1557170334-a9632e77c6e4?auto=format&fit=crop&w=600&q=80',
    color: 'rgba(184,169,217,0.15)',
    border: 'rgba(184,169,217,0.3)',
  },
  {
    name: 'Tools',
    desc: 'Brushes, devices & accessories',
    emoji: '🪄',
    img: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80',
    color: 'rgba(212,175,130,0.15)',
    border: 'rgba(212,175,130,0.3)',
  },
];

// Featured products come from the shared data file
const featured = getFeaturedProducts();

const ingredients = [
  { icon: '🌹', name: 'Rose Hip Oil', benefit: 'Brightens & evens skin tone' },
  { icon: '🍃', name: 'Green Tea Extract', benefit: 'Powerful antioxidant protection' },
  { icon: '💧', name: 'Hyaluronic Acid', benefit: 'Deep 72-hour hydration' },
  { icon: '☀️', name: 'Vitamin C', benefit: 'Fades dark spots & boosts glow' },
];

const reviews = [
  {
    name: 'Sasha R.',
    rating: 5,
    text: 'The Radiant Serum changed my skin completely. I get compliments every single day now. AuraGlow is the only brand I trust!',
    skin: 'Dry Skin',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
  },
  {
    name: 'Anika P.',
    rating: 5,
    text: 'I love that everything is vegan and cruelty-free. The skin quiz matched me with products that actually work for my combination skin.',
    skin: 'Combination',
    avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
  },
  {
    name: 'Leila M.',
    rating: 4,
    text: 'Beautiful packaging, even better results. The Petal Hydra Cream is so lightweight yet so moisturizing. Will buy again!',
    skin: 'Sensitive',
    avatar: 'https://randomuser.me/api/portraits/women/55.jpg',
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function Stars({ count }) {
  return (
    <div style={{ display: 'flex', gap: '2px' }}>
      {[1, 2, 3, 4, 5].map(i => (
        <span key={i} style={{ color: i <= Math.round(count) ? 'var(--color-accent-gold)' : 'var(--color-text-muted)', fontSize: '12px' }}>★</span>
      ))}
    </div>
  );
}

function ProductCard({ p }) {
  const [hovered, setHovered] = useState(false);
  const { formatPrice } = useCurrency();
  return (
    <div
      className="product-card"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ position: 'relative' }}
    >
      {/* Match badge */}
      <div style={{ position: 'absolute', top: '12px', left: '12px', zIndex: 2, background: 'rgba(13,13,15,0.8)', backdropFilter: 'blur(8px)', border: '1px solid rgba(184,169,217,0.4)', borderRadius: 'var(--radius-full)', padding: '3px 10px', fontSize: 'var(--text-xs)', fontWeight: '600', color: 'var(--color-accent-lavender)' }}>
        ✨ Top Rated
      </div>
      {p.oldPrice && (
        <div style={{ position: 'absolute', top: '12px', right: '12px', zIndex: 2, background: 'rgba(232,122,122,0.9)', borderRadius: 'var(--radius-full)', padding: '3px 10px', fontSize: 'var(--text-xs)', fontWeight: '700', color: '#fff' }}>
          SALE
        </div>
      )}
      <div className="product-card__image-wrap" style={{ aspectRatio: '1/1', position: 'relative', width: '100%', overflow: 'hidden' }}>
        <img src={p.image} alt={p.name} className="product-card__image" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
        {hovered && (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(13,13,15,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-3)', transition: 'all 0.3s ease' }}>
            <button className="btn btn-primary btn-sm" style={{ backdropFilter: 'blur(8px)' }}>Add to Cart</button>
            <button className="btn btn-ghost btn-sm btn-icon" style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.2)' }}>♡</button>
          </div>
        )}
      </div>
      <div className="product-card__body">
        <p className="product-card__brand">{p.brand}</p>
        <h3 className="product-card__name">{p.name}</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-3)' }}>
          <Stars count={p.rating} />
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>{p.rating} ({(p.reviewCount ?? p.reviews ?? 0).toLocaleString()})</span>
        </div>
        <div className="product-card__footer">
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--space-2)' }}>
            <span className="product-card__price">{formatPrice(p.price)}</span>
            {p.oldPrice && <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', textDecoration: 'line-through' }}>{formatPrice(p.oldPrice)}</span>}
          </div>
          <span className={`badge ${p.badgeClass}`}>{p.badge}</span>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function Home() {
  const [quizSkinType, setQuizSkinType] = useState(null);
  const skinTypes = ['Dry', 'Oily', 'Combination', 'Sensitive'];

  return (
    <div style={{ paddingBottom: 'var(--space-12)' }}>

      {/* ── 1. NAVBAR ──────────────────────────────────────────────────────── */}
      <Navbar />

      {/* ── 2. HERO ────────────────────────────────────────────────────────── */}
      <section style={{
        marginTop: 'var(--nav-height)',
        minHeight: 'calc(100vh - var(--nav-height))',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        alignItems: 'center',
        gap: 0,
        overflow: 'hidden',
      }}>
        {/* Left copy */}
        <div style={{ padding: 'var(--space-16) var(--space-12)', background: 'var(--gradient-hero)' }}>
          <div style={{ marginBottom: 'var(--space-4)', display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)', background: 'rgba(232,180,160,0.1)', border: '1px solid rgba(232,180,160,0.3)', borderRadius: 'var(--radius-full)', padding: '6px 16px', fontSize: 'var(--text-xs)', fontWeight: '600', color: 'var(--color-accent-rose)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            ✨ New Arrivals — Summer Glow Collection
          </div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2.8rem, 5vw, 4.5rem)', fontWeight: '800', lineHeight: 1.05, marginBottom: 'var(--space-6)', letterSpacing: '-0.02em' }}>
            <span style={{ color: 'var(--color-text-primary)' }}>Beauty that</span><br />
            <span style={{ background: 'var(--gradient-text)', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>knows your skin.</span>
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-md)', marginBottom: 'var(--space-8)', maxWidth: '480px', lineHeight: 1.7 }}>
            Personalized clean beauty powered by your unique skin profile. Vegan, cruelty-free, and made with ingredients your skin will love.
          </p>
          <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap', marginBottom: 'var(--space-10)' }}>
            <Link to="/skin-quiz" className="btn btn-primary btn-lg btn-pill">
              ✨ Take the Skin Quiz
            </Link>
            <Link to="/products" className="btn btn-secondary btn-lg btn-pill">
              Shop All Products
            </Link>
          </div>
          {/* Trust Badges */}
          <div style={{ display: 'flex', gap: 'var(--space-6)', flexWrap: 'wrap' }}>
            {['🌱 100% Vegan', '🐰 Cruelty-Free', '♻️ Eco Packaging', '🔬 Dermatologist Tested'].map(badge => (
              <div key={badge} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', fontWeight: '500' }}>
                {badge}
              </div>
            ))}
          </div>
        </div>

        {/* Right hero image collage */}
        <div style={{ position: 'relative', height: 'calc(100vh - var(--nav-height))', overflow: 'hidden' }}>
          <img
            src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=900&q=85"
            alt="AuraGlow Hero"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          {/* Gradient overlay on right */}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, var(--color-bg-primary) 0%, transparent 20%), linear-gradient(to top, rgba(13,13,15,0.6) 0%, transparent 50%)' }} />
          {/* Floating stat card */}
          <div style={{ position: 'absolute', bottom: '80px', left: '32px', background: 'rgba(13,13,15,0.85)', backdropFilter: 'blur(20px)', border: '1px solid rgba(232,180,160,0.3)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-4) var(--space-5)' }}>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginBottom: '4px' }}>SKIN MATCH SCORE</p>
            <p style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-2xl)', fontWeight: '800', background: 'var(--gradient-text)', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>96%</p>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>Matched to your skin profile ✨</p>
          </div>
          {/* Floating review card */}
          <div style={{ position: 'absolute', top: '80px', right: '32px', background: 'rgba(13,13,15,0.85)', backdropFilter: 'blur(20px)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-4) var(--space-5)', maxWidth: '220px' }}>
            <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
              {[1,2,3,4,5].map(i => <span key={i} style={{ color: 'var(--color-accent-gold)', fontSize: '12px' }}>★</span>)}
            </div>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', lineHeight: 1.5, marginBottom: 'var(--space-2)' }}>"My skin has never looked better! Genuinely obsessed."</p>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>— Sasha R.</p>
          </div>
        </div>
      </section>

      {/* ── 3. SOCIAL PROOF BAR ────────────────────────────────────────────── */}
      <section style={{ borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)', background: 'var(--color-bg-secondary)', padding: 'var(--space-4) var(--space-10)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-12)', flexWrap: 'wrap' }}>
        {[
          { value: '50K+', label: 'Happy Customers' },
          { value: '4.9 ★', label: 'Average Rating' },
          { value: '200+', label: 'Clean Products' },
          { value: 'Free', label: 'Shipping Over RM150' },
        ].map(s => (
          <div key={s.label} style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-xl)', fontWeight: '700', background: 'var(--gradient-text)', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{s.value}</div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{s.label}</div>
          </div>
        ))}
      </section>

      {/* ── 4. SHOP BY CATEGORY ────────────────────────────────────────────── */}
      <section className="container" style={{ paddingTop: 'var(--space-16)' }}>
        <div className="section-heading">
          <p className="section-heading__eyebrow">Collections</p>
          <h2 className="section-heading__title">Shop by Category</h2>
          <p className="section-heading__subtitle">Curated formulas for every aspect of your beauty routine</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-4)' }}>
          {categories.map(cat => (
            <Link key={cat.name} to="/products" style={{ textDecoration: 'none', borderRadius: 'var(--radius-xl)', overflow: 'hidden', position: 'relative', aspectRatio: '3/4', display: 'block', border: `1px solid ${cat.border}`, transition: 'transform 250ms ease, box-shadow 250ms ease' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 20px 60px rgba(0,0,0,0.4)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              <img src={cat.img} alt={cat.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 400ms ease' }} />
              <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to top, rgba(13,13,15,0.92) 30%, ${cat.color} 100%)` }} />
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 'var(--space-5)' }}>
                <div style={{ fontSize: '28px', marginBottom: 'var(--space-2)' }}>{cat.emoji}</div>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-xl)', fontWeight: '700', color: 'var(--color-text-primary)', marginBottom: '4px' }}>{cat.name}</h3>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>{cat.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── 5. FEATURED PRODUCTS ───────────────────────────────────────────── */}
      <section className="container" style={{ paddingTop: 'var(--space-16)' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 'var(--space-8)' }}>
          <div>
            <p className="section-heading__eyebrow" style={{ textAlign: 'left', marginBottom: 'var(--space-2)' }}>Best Sellers</p>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-2xl)', fontWeight: '700' }}>Trending Right Now</h2>
          </div>
          <Link to="/products" className="btn btn-ghost btn-sm btn-pill">View All Products →</Link>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-6)' }}>
          {featured.map((p, i) => <ProductCard key={i} p={p} />)}
        </div>
      </section>

      {/* ── 6. SKIN QUIZ PROMO BANNER ──────────────────────────────────────── */}
      <section style={{ margin: 'var(--space-16) 0', background: 'linear-gradient(135deg, rgba(232,180,160,0.08) 0%, rgba(184,169,217,0.08) 100%)', border: 'none', borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)', padding: 'var(--space-16) var(--space-10)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-50%', left: '50%', transform: 'translateX(-50%)', width: '600px', height: '600px', background: 'radial-gradient(ellipse, rgba(232,180,160,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <p style={{ fontSize: 'var(--text-xs)', fontWeight: '600', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--color-accent-rose)', marginBottom: 'var(--space-4)', position: 'relative' }}>Personalized for You</p>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: '800', marginBottom: 'var(--space-4)', position: 'relative' }}>
          <span style={{ background: 'var(--gradient-text)', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Find Your Perfect Routine</span>
        </h2>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-md)', maxWidth: '560px', margin: '0 auto var(--space-8)', lineHeight: 1.7, position: 'relative' }}>
          Answer 5 quick questions about your skin and we'll match you with the products that actually work for <em>your</em> unique skin type, concerns, and tone.
        </p>
        <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', flexWrap: 'wrap', marginBottom: 'var(--space-8)', position: 'relative' }}>
          {skinTypes.map(type => (
            <button key={type} onClick={() => setQuizSkinType(type)} style={{ padding: 'var(--space-3) var(--space-5)', borderRadius: 'var(--radius-full)', border: `1px solid ${quizSkinType === type ? 'var(--color-accent-rose)' : 'var(--color-border)'}`, background: quizSkinType === type ? 'rgba(232,180,160,0.15)' : 'transparent', color: quizSkinType === type ? 'var(--color-accent-rose)' : 'var(--color-text-secondary)', cursor: 'pointer', fontSize: 'var(--text-sm)', fontWeight: '500', transition: 'all 200ms ease' }}>
              {type} Skin
            </button>
          ))}
        </div>
        <Link to="/skin-quiz" className="btn btn-primary btn-xl btn-pill" style={{ position: 'relative' }}>
          {quizSkinType ? `Start Quiz for ${quizSkinType} Skin →` : 'Take the Free Skin Quiz'}
        </Link>
      </section>

      {/* ── 7. CLEAN BEAUTY INGREDIENTS ───────────────────────────────────── */}
      <section className="container" style={{ paddingTop: 'var(--space-4)', paddingBottom: 'var(--space-16)' }}>
        <div className="section-heading">
          <p className="section-heading__eyebrow">Our Promise</p>
          <h2 className="section-heading__title">Powered by Nature's Best</h2>
          <p className="section-heading__subtitle">Every ingredient is carefully chosen for efficacy, safety, and sustainability.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-6)' }}>
          {ingredients.map(ing => (
            <div key={ing.name} className="card" style={{ textAlign: 'center', cursor: 'default' }}>
              <div style={{ fontSize: '40px', marginBottom: 'var(--space-4)' }}>{ing.icon}</div>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-base)', fontWeight: '600', marginBottom: 'var(--space-2)', color: 'var(--color-text-primary)' }}>{ing.name}</h3>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>{ing.benefit}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 8. BEFORE / AFTER PROMISE ─────────────────────────────────────── */}
      <section style={{ background: 'var(--color-bg-secondary)', borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)', padding: 'var(--space-16) var(--space-10)' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-16)', alignItems: 'center' }}>
          <div>
            <p className="section-heading__eyebrow" style={{ textAlign: 'left', marginBottom: 'var(--space-3)' }}>Why AuraGlow</p>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-3xl)', fontWeight: '700', marginBottom: 'var(--space-6)', lineHeight: 1.2 }}>
              The clean beauty standard <span style={{ background: 'var(--gradient-text)', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>you deserve.</span>
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              {[
                { icon: '🔬', title: 'Dermatologist Approved', desc: 'Every formula tested by certified dermatologists before launch.' },
                { icon: '🌍', title: 'Sustainably Sourced', desc: 'Ingredients ethically sourced from responsible global suppliers.' },
                { icon: '📦', title: 'Eco Packaging', desc: '90% of our packaging is recyclable or made from recycled materials.' },
                { icon: '🎯', title: 'Skin-Personalized', desc: 'Our AI matches each product to your unique skin profile and needs.' },
              ].map(point => (
                <div key={point.title} style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'flex-start' }}>
                  <div style={{ fontSize: '22px', flexShrink: 0, marginTop: '2px' }}>{point.icon}</div>
                  <div>
                    <h4 style={{ fontWeight: '600', color: 'var(--color-text-primary)', marginBottom: '4px', fontSize: 'var(--text-base)' }}>{point.title}</h4>
                    <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>{point.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Image Side */}
          <div style={{ position: 'relative', borderRadius: 'var(--radius-2xl)', overflow: 'hidden', aspectRatio: '4/5' }}>
            <img src="https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=700&q=85" alt="Clean Beauty Promise" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(13,13,15,0.6) 0%, transparent 60%)' }} />
          </div>
        </div>
      </section>

      {/* ── 9. CUSTOMER REVIEWS ────────────────────────────────────────────── */}
      <section className="container" style={{ paddingTop: 'var(--space-16)' }}>
        <div className="section-heading">
          <p className="section-heading__eyebrow">Community Love</p>
          <h2 className="section-heading__title">Real Results, Real Reviews</h2>
          <p className="section-heading__subtitle">From thousands of happy customers who found their glow with AuraGlow.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-6)' }}>
          {reviews.map((r, i) => (
            <div key={i} className="card">
              <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
                {[1,2,3,4,5].map(i => <span key={i} style={{ color: i <= r.rating ? 'var(--color-accent-gold)' : 'var(--color-text-muted)', fontSize: '16px' }}>★</span>)}
              </div>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', lineHeight: 1.8, marginBottom: 'var(--space-5)', fontStyle: 'italic' }}>"{r.text}"</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--color-border)' }}>
                <img src={r.avatar} alt={r.name} style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--color-border-accent)' }} />
                <div>
                  <p style={{ fontWeight: '600', fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)' }}>{r.name}</p>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-accent-rose)' }}>{r.skin}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 10. NEWSLETTER ─────────────────────────────────────────────────── */}
      <section className="container" style={{ paddingTop: 'var(--space-16)' }}>
        <div style={{ background: 'linear-gradient(135deg, rgba(232,180,160,0.08), rgba(184,169,217,0.08))', border: '1px solid var(--color-border-accent)', borderRadius: 'var(--radius-2xl)', padding: 'var(--space-12)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-40%', right: '-10%', width: '400px', height: '400px', background: 'radial-gradient(ellipse, rgba(184,169,217,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />
          <p className="section-heading__eyebrow" style={{ marginBottom: 'var(--space-3)' }}>Stay in the glow</p>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-2xl)', fontWeight: '700', marginBottom: 'var(--space-4)' }}>
            Join the AuraGlow Community
          </h2>
          <p style={{ color: 'var(--color-text-secondary)', maxWidth: '440px', margin: '0 auto var(--space-8)', fontSize: 'var(--text-sm)' }}>
            Get personalized skincare tips, first access to new launches, and exclusive member discounts delivered to your inbox.
          </p>
          <div style={{ display: 'flex', gap: 'var(--space-3)', maxWidth: '460px', margin: '0 auto', position: 'relative' }}>
            <input type="email" placeholder="your@email.com" className="form-input" style={{ flex: 1 }} />
            <button className="btn btn-primary btn-pill" style={{ flexShrink: 0 }}>Subscribe</button>
          </div>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginTop: 'var(--space-4)' }}>No spam, ever. Unsubscribe any time.</p>
        </div>
      </section>

      {/* ── 11. FOOTER ─────────────────────────────────────────────────────── */}
      <footer style={{ marginTop: 'var(--space-16)', borderTop: '1px solid var(--color-border)', padding: 'var(--space-12) var(--space-10) var(--space-6)', background: 'var(--color-bg-secondary)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 'var(--space-10)', marginBottom: 'var(--space-10)' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-xl)', fontWeight: '800', background: 'var(--gradient-text)', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: 'var(--space-4)' }}>AuraGlow</div>
            <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)', lineHeight: 1.7, maxWidth: '280px' }}>
              Personalized clean beauty, powered by your skin. 100% vegan, cruelty-free, and sustainably made.
            </p>
          </div>
          {[
            { title: 'Shop', links: ['Skincare', 'Makeup', 'Fragrance', 'Tools', 'Best Sellers'] },
            { title: 'Learn', links: ['Skin Quiz', 'Ingredients', 'Blog', 'Routines'] },
            { title: 'Support', links: ['My Orders', 'Returns', 'FAQ', 'Contact Us'] },
          ].map(col => (
            <div key={col.title}>
              <h4 style={{ fontSize: 'var(--text-xs)', fontWeight: '700', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-4)' }}>{col.title}</h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                {col.links.map(link => (
                  <li key={link}><Link to="/products" style={{ color: 'var(--color-text-muted)', textDecoration: 'none', fontSize: 'var(--text-sm)', transition: 'color 150ms ease' }}
                    onMouseEnter={e => e.target.style.color = 'var(--color-accent-rose)'}
                    onMouseLeave={e => e.target.style.color = 'var(--color-text-muted)'}
                  >{link}</Link></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div style={{ paddingTop: 'var(--space-6)', borderTop: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>© 2026 AuraGlow. All rights reserved.</p>
          <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
            {['Privacy', 'Terms', 'Cookies'].map(item => (
              <span key={item} style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', cursor: 'pointer' }}>{item}</span>
            ))}
          </div>
        </div>
      </footer>

    </div>
  );
}
