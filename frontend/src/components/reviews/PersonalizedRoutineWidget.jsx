import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCurrency } from '@/context/CurrencyContext';
import { getRoutineBySkinProfile } from '@/services/recommendationService';

export default function PersonalizedRoutineWidget({
  initialSkinType = 'Dry',
  initialConcern = 'Dullness & Uneven Tone',
  onAddToCart,
}) {
  const [skinType, setSkinType] = useState(initialSkinType);
  const [concern, setConcern] = useState(initialConcern);
  const [timeOfDay, setTimeOfDay] = useState('am'); // 'am' | 'pm'
  const [routineData, setRoutineData] = useState(null);
  const [bundleAdded, setBundleAdded] = useState(false);
  const { formatPrice } = useCurrency();

  useEffect(() => {
    async function loadRoutine() {
      const data = await getRoutineBySkinProfile(skinType, concern);
      setRoutineData(data);
    }
    loadRoutine();
  }, [skinType, concern]);

  const currentSteps = routineData ? (timeOfDay === 'am' ? routineData.am : routineData.pm) || [] : [];

  // Calculate bundle total price
  const bundleTotalPrice = currentSteps.reduce((acc, step) => acc + (step.product?.price || 0), 0);
  const bundleDiscountPrice = Math.round(bundleTotalPrice * 0.85); // 15% routine bundle discount

  const handleAddBundle = () => {
    setBundleAdded(true);
    if (onAddToCart) {
      currentSteps.forEach(s => {
        if (s.product) onAddToCart(s.product);
      });
    }
    setTimeout(() => setBundleAdded(false), 2200);
  };

  return (
    <div
      style={{
        background: 'var(--color-bg-card)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-2xl)',
        padding: 'var(--space-8)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-6)',
      }}
    >
      {/* Header: Title & Skin Profile Selector */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: 'var(--space-4)' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(232, 114, 150, 0.15)', border: '1px solid var(--color-accent-rose)', borderRadius: 'var(--radius-full)', padding: '3px 10px', fontSize: '11px', fontWeight: '700', color: 'var(--color-accent-rose)', textTransform: 'uppercase', marginBottom: 'var(--space-2)' }}>
            ✨ AI Beauty Advisor
          </div>
          <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: '800', color: 'var(--color-text-primary)', margin: '0 0 var(--space-1) 0' }}>
            {routineData?.title || 'Personalized Clean Routine'}
          </h3>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', margin: 0, maxWidth: '640px', lineHeight: 1.5 }}>
            {routineData?.description}
          </p>
        </div>

        {/* Diagnostic Selectors */}
        <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
          <select
            value={skinType}
            onChange={e => setSkinType(e.target.value)}
            style={{
              background: 'var(--color-bg-secondary)',
              border: '1px solid var(--color-border)',
              color: 'var(--color-text-primary)',
              borderRadius: 'var(--radius-lg)',
              padding: '6px 12px',
              fontSize: 'var(--text-xs)',
              cursor: 'pointer',
              outline: 'none',
            }}
          >
            <option value="Dry">Dry Skin</option>
            <option value="Oily">Oily Skin</option>
            <option value="Combination">Combination Skin</option>
            <option value="Sensitive">Sensitive Skin</option>
          </select>

          <select
            value={concern}
            onChange={e => setConcern(e.target.value)}
            style={{
              background: 'var(--color-bg-secondary)',
              border: '1px solid var(--color-border)',
              color: 'var(--color-text-primary)',
              borderRadius: 'var(--radius-lg)',
              padding: '6px 12px',
              fontSize: 'var(--text-xs)',
              cursor: 'pointer',
              outline: 'none',
            }}
          >
            <option value="Dullness & Uneven Tone">Dullness & Tone</option>
            <option value="Dryness & Dehydration">Dryness & Hydration</option>
            <option value="Acne & Breakouts">Acne & Breakouts</option>
            <option value="Fine Lines & Wrinkles">Aging & Fine Lines</option>
          </select>
        </div>
      </div>

      {/* AM / PM Toggle Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)', paddingBottom: 'var(--space-4)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display: 'flex', background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-full)', padding: '3px' }}>
          <button
            onClick={() => setTimeOfDay('am')}
            style={{
              background: timeOfDay === 'am' ? 'var(--color-accent-rose)' : 'transparent',
              color: timeOfDay === 'am' ? '#fff' : 'var(--color-text-secondary)',
              border: 'none',
              borderRadius: 'var(--radius-full)',
              padding: '6px 18px',
              fontSize: 'var(--text-xs)',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all var(--transition-fast)',
            }}
          >
            <span>☀️</span> AM Routine (Day)
          </button>

          <button
            onClick={() => setTimeOfDay('pm')}
            style={{
              background: timeOfDay === 'pm' ? 'var(--color-accent-lavender)' : 'transparent',
              color: timeOfDay === 'pm' ? '#fff' : 'var(--color-text-secondary)',
              border: 'none',
              borderRadius: 'var(--radius-full)',
              padding: '6px 18px',
              fontSize: 'var(--text-xs)',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all var(--transition-fast)',
            }}
          >
            <span>🌙</span> PM Routine (Night)
          </button>
        </div>

        {/* Compatibility Match badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: 'var(--text-xs)', color: 'var(--color-accent-sage)', fontWeight: '600' }}>
          <span style={{ fontSize: '16px' }}>🎯</span> {routineData?.matchScore || 98}% Skin Synergy Compatibility Score
        </div>
      </div>

      {/* Routine Steps Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: 'var(--space-4)',
      }}>
        {currentSteps.map((step, idx) => {
          const prod = step.product;
          if (!prod) return null;
          return (
            <div
              key={idx}
              className="card-hover-glow"
              style={{
                background: 'var(--color-bg-secondary)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-xl)',
                padding: 'var(--space-4)',
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-3)',
                position: 'relative',
              }}
            >
              {/* Step indicator tag */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{
                  fontSize: '10px',
                  fontWeight: '800',
                  textTransform: 'uppercase',
                  background: 'rgba(232, 114, 150, 0.2)',
                  color: 'var(--color-accent-rose)',
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-full)',
                }}>
                  Step {step.step}: {step.stepName || step.type}
                </span>
                <span style={{ fontSize: '14px' }}>{step.icon || '✨'}</span>
              </div>

              {/* Product Thumbnail */}
              <Link to={`/products/${prod.id}`} style={{ width: '100%', height: '120px', borderRadius: 'var(--radius-lg)', overflow: 'hidden', display: 'block' }}>
                <img src={prod.image} alt={prod.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </Link>

              {/* Product info */}
              <div>
                <Link to={`/products/${prod.id}`} style={{ textDecoration: 'none' }}>
                  <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: '700', color: 'var(--color-text-primary)', margin: '0 0 2px 0', lineHeight: 1.3 }}>
                    {prod.name}
                  </h4>
                </Link>
                <div style={{ fontSize: 'var(--text-xs)', fontWeight: '800', color: 'var(--color-accent-gold)' }}>
                  {formatPrice(prod.price)}
                </div>
              </div>

              {/* Step Benefit note */}
              {step.note && (
                <p style={{ fontSize: '11px', color: 'var(--color-text-muted)', margin: 0, lineHeight: 1.4 }}>
                  {step.note}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Routine Bundle Checkout Footer */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(232, 114, 150, 0.12) 0%, rgba(184, 169, 217, 0.12) 100%)',
        border: '1px solid rgba(232, 114, 150, 0.25)',
        borderRadius: 'var(--radius-xl)',
        padding: 'var(--space-4) var(--space-6)',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 'var(--space-4)',
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: 'var(--text-sm)', fontWeight: '700', color: 'var(--color-text-primary)' }}>
              Complete {timeOfDay.toUpperCase()} Routine Bundle ({currentSteps.length} items)
            </span>
            <span className="badge badge-sale" style={{ background: 'var(--color-accent-rose)', color: '#fff', fontSize: '10px' }}>
              Bundle 15% OFF
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '2px' }}>
            <span style={{ fontSize: 'var(--text-lg)', fontWeight: '900', color: 'var(--color-text-primary)' }}>
              {formatPrice(bundleDiscountPrice)}
            </span>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', textDecoration: 'line-through' }}>
              {formatPrice(bundleTotalPrice)}
            </span>
          </div>
        </div>

        <button
          onClick={handleAddBundle}
          className={`btn btn-primary btn-pill ${bundleAdded ? 'btn-success' : ''}`}
          style={{ padding: '10px 24px', fontSize: 'var(--text-sm)', fontWeight: '700' }}
        >
          {bundleAdded ? '✓ Added Complete Routine!' : `Add Full Routine to Bag 🌸`}
        </button>
      </div>
    </div>
  );
}
