import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import PersonalizedRoutineWidget from '@/components/reviews/PersonalizedRoutineWidget';
import ProductCard from '@/components/catalog/ProductCard';
import { products } from '@/data/mockData';

export default function RecommendationsPage() {
  const [activeSkinType, setActiveSkinType] = useState('Dry');
  const [activeConcern, setActiveConcern] = useState('Dullness & Uneven Tone');
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleAddToCart = (product) => {
    showToast(`🌸 Added "${product.name}" to your shopping bag!`);
  };

  const skinTypeButtons = [
    { label: 'Dry Skin', value: 'Dry', emoji: '💧' },
    { label: 'Oily Skin', value: 'Oily', emoji: '🍃' },
    { label: 'Combination', value: 'Combination', emoji: '⚖️' },
    { label: 'Sensitive', value: 'Sensitive', emoji: '🌸' },
  ];

  const concerns = [
    'Dullness & Uneven Tone',
    'Dryness & Dehydration',
    'Acne & Breakouts',
    'Fine Lines & Wrinkles',
    'Dark Spots & Pigmentation',
  ];

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

      {/* Hero Banner */}
      <section style={{
        marginTop: 'var(--nav-height)',
        padding: 'var(--space-16) var(--space-10) var(--space-10)',
        background: 'linear-gradient(180deg, rgba(184, 169, 217, 0.12) 0%, rgba(13, 13, 15, 0) 100%)',
        borderBottom: '1px solid var(--color-border)',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(184, 169, 217, 0.15)', border: '1px solid var(--color-accent-lavender)', borderRadius: 'var(--radius-full)', padding: '6px 16px', fontSize: 'var(--text-xs)', fontWeight: '700', color: 'var(--color-accent-lavender)', textTransform: 'uppercase', marginBottom: 'var(--space-4)' }}>
            ✨ AuraGlow AI Skincare Intelligence
          </div>

          <h1 style={{
            fontSize: 'clamp(2.4rem, 4vw, 3.8rem)',
            fontWeight: '900',
            fontFamily: 'var(--font-heading)',
            color: 'var(--color-text-primary)',
            margin: '0 0 var(--space-4) 0',
            lineHeight: 1.1,
          }}>
            Your Tailored Beauty <span className="shimmer-text">Routine Advisor</span>
          </h1>

          <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-base)', lineHeight: 1.7, margin: '0 0 var(--space-8) 0' }}>
            No more skincare guesswork. Our algorithm pairs scientifically verified clean actives with your specific skin type and biological goals.
          </p>

          {/* Interactive Skin Type Quick Tabs */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
            {skinTypeButtons.map(st => (
              <button
                key={st.value}
                onClick={() => setActiveSkinType(st.value)}
                style={{
                  background: activeSkinType === st.value ? 'linear-gradient(135deg, var(--color-accent-rose), var(--color-accent-lavender))' : 'var(--color-bg-secondary)',
                  border: activeSkinType === st.value ? '1px solid transparent' : '1px solid var(--color-border)',
                  color: activeSkinType === st.value ? '#fff' : 'var(--color-text-primary)',
                  borderRadius: 'var(--radius-full)',
                  padding: '10px 22px',
                  fontSize: 'var(--text-sm)',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: activeSkinType === st.value ? '0 4px 15px rgba(232, 114, 150, 0.4)' : 'none',
                  transition: 'all var(--transition-fast)',
                }}
              >
                <span>{st.emoji}</span>
                <span>{st.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Advisor Body */}
      <main style={{ maxWidth: '1280px', margin: '0 auto', padding: 'var(--space-12) var(--space-10)', width: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 'var(--space-16)' }}>
        
        {/* 1. Personalized Routine Widget */}
        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
            <div>
              <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: '800', fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)', margin: 0 }}>
                Step-by-Step Custom Regimen
              </h2>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', margin: '4px 0 0 0' }}>
                Scientifically optimized layer-by-layer for peak cellular absorption.
              </p>
            </div>

            <Link to="/skin-quiz" className="btn btn-secondary btn-sm btn-pill">
              Retake 5-Question Quiz 🌸
            </Link>
          </div>

          <PersonalizedRoutineWidget
            initialSkinType={activeSkinType}
            initialConcern={activeConcern}
            onAddToCart={handleAddToCart}
          />
        </section>

        {/* 2. Key Actives Deep Dive Matrix */}
        <section style={{
          background: 'var(--color-bg-card)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-2xl)',
          padding: 'var(--space-10)',
        }}>
          <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto var(--space-8)' }}>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-accent-rose)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: '700' }}>
              Ingredient Intelligence
            </span>
            <h3 style={{ fontSize: 'var(--text-2xl)', fontWeight: '800', fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)', margin: '4px 0 var(--space-2)' }}>
              Why These Actives Work For Your Skin
            </h3>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', margin: 0 }}>
              Formulated without fillers, mineral oils, or harsh sulfates. Only pure bioactive compounds.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 'var(--space-6)' }}>
            {[
              { icon: '🌹', name: 'Rose Hip Seed Oil', benefit: 'Rich in Pro-Vitamin A and Omega-6 fatty acids to regenerate damaged lipid membranes and restore natural elasticity.' },
              { icon: '💧', name: 'Multi-Weight Hyaluronic Acid', benefit: 'Penetrates four cellular epidermal layers to bind 1,000x its weight in water for 72 hours of uninterrupted moisture.' },
              { icon: '☀️', name: 'Ethylated Vitamin C 15%', benefit: 'Stable, non-irritating antioxidant powerhouse that neutralizes free radicals and inhibits melanin overproduction.' },
              { icon: '🍃', name: 'Organic Green Tea EGCG', benefit: 'Potent polyphenols soothe inflammation, reduce sebum oxidation, and protect against UV-induced environmental stress.' },
            ].map(active => (
              <div
                key={active.name}
                className="card-hover-glow"
                style={{
                  background: 'var(--color-bg-secondary)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-xl)',
                  padding: 'var(--space-6)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--space-2)',
                }}
              >
                <div style={{ fontSize: '28px' }}>{active.icon}</div>
                <h4 style={{ fontSize: 'var(--text-base)', fontWeight: '700', color: 'var(--color-text-primary)', margin: 0 }}>
                  {active.name}
                </h4>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', lineHeight: 1.6, margin: 0 }}>
                  {active.benefit}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 3. Top Recommended Formulas */}
        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
            <div>
              <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: '800', fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)', margin: 0 }}>
                Hero Formulas Matching Your Profile
              </h2>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', margin: '4px 0 0 0' }}>
                Individually tailored products with 95%+ skin compatibility scores.
              </p>
            </div>
            <Link to="/products" style={{ color: 'var(--color-accent-rose)', textDecoration: 'none', fontSize: 'var(--text-sm)', fontWeight: '600' }}>
              View Catalog →
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 'var(--space-6)' }}>
            {products.slice(0, 4).map(product => (
              <ProductCard
                key={product.id}
                product={product}
                viewMode="grid"
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
