import React, { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams, useLocation } from 'react-router-dom';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import PersonalizedRoutineWidget from '@/components/reviews/PersonalizedRoutineWidget';
import ProductCard from '@/components/catalog/ProductCard';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { askAiDermatologist } from '@/api/aiApi';
import { getMatchingCosmetics, calculateSkinMatchScore } from '@/services/recommendationService';
import { getProducts } from '@/services/productService';

export default function RecommendationsPage() {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const { addToCart, requireAuth } = useCart();
  const { skinProfile, user } = useAuth();

  const [catalogProducts, setCatalogProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setLoadingProducts(true);
    getProducts({ limit: 50 })
      .then(res => {
        if (isMounted && res && Array.isArray(res.products)) {
          setCatalogProducts(res.products);
        }
      })
      .catch((err) => {
        console.warn('Could not load live products:', err.message);
      })
      .finally(() => {
        if (isMounted) setLoadingProducts(false);
      });
    return () => { isMounted = false; };
  }, []);

  // Read quiz completion or stored profile once safely
  const isQuizSuccess = searchParams.get('quiz') === 'success' || location.state?.fromQuiz;

  const [activeSkinType, setActiveSkinType] = useState(() => {
    try {
      const p = localStorage.getItem('auraglow_skin_profile');
      const parsed = p ? JSON.parse(p) : null;
      const prof = skinProfile || parsed;
      if (prof?.skin_type) {
        return prof.skin_type.charAt(0).toUpperCase() + prof.skin_type.slice(1);
      }
    } catch {
      // ignore
    }
    return 'Combination';
  });

  const [activeConcern, setActiveConcern] = useState(() => {
    try {
      const p = localStorage.getItem('auraglow_skin_profile');
      const parsed = p ? JSON.parse(p) : null;
      const prof = skinProfile || parsed;
      if (prof?.concerns && prof.concerns.length > 0) {
        return prof.concerns[0];
      }
    } catch {
      // ignore
    }
    return 'Dullness & Uneven Tone';
  });

  const [toastMessage, setToastMessage] = useState(null);
  // Track if user has manually selected a skin type — profile sync should not override it
  const userSelectedSkinType = React.useRef(false);

  // AI Consultant Chat State
  const [aiQuestion, setAiQuestion] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiAnswer, setAiAnswer] = useState(null);
  const [aiModelUsed, setAiModelUsed] = useState(null);

  // Sync when user auth profile loads — only if user hasn't manually selected a skin type
  useEffect(() => {
    if (userSelectedSkinType.current) return;
    if (skinProfile?.skin_type) {
      const t = skinProfile.skin_type.charAt(0).toUpperCase() + skinProfile.skin_type.slice(1);
      setActiveSkinType(t);
    }
    if (skinProfile?.concerns && skinProfile.concerns.length > 0) {
      setActiveConcern(skinProfile.concerns[0]);
    }
  }, [skinProfile?.skin_type]);

  const profileConcerns = skinProfile?.concerns || (() => {
    try {
      const p = localStorage.getItem('auraglow_skin_profile');
      return p ? JSON.parse(p)?.concerns || [] : [];
    } catch { return []; }
  })();

  const profileAllergens = skinProfile?.allergens || (() => {
    try {
      const p = localStorage.getItem('auraglow_skin_profile');
      return p ? JSON.parse(p)?.allergens || [] : [];
    } catch { return []; }
  })();

  const effectiveProfile = useMemo(() => {
    try {
      const p = localStorage.getItem('auraglow_skin_profile');
      const parsed = p ? JSON.parse(p) : null;
      return skinProfile || parsed || { skin_type: 'combination', skin_tone: 'medium', undertone: 'warm', concerns: [] };
    } catch {
      return skinProfile || { skin_type: 'combination', skin_tone: 'medium', undertone: 'warm', concerns: [] };
    }
  }, [skinProfile]);

  const matchedCosmetics = useMemo(() => {
    return getMatchingCosmetics(effectiveProfile, catalogProducts);
  }, [effectiveProfile, catalogProducts]);

  const topRecommendedProducts = useMemo(() => {
    const scored = (catalogProducts || []).map(p => ({
      ...p,
      matchScore: calculateSkinMatchScore(p, activeSkinType, effectiveProfile),
    }));
    return scored.sort((a, b) => b.matchScore - a.matchScore).slice(0, 8);
  }, [catalogProducts, activeSkinType, effectiveProfile]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleAddToCart = async (product) => {
    const success = await addToCart(product, 1);
    if (success) {
      showToast(`🌸 Added "${product.name}" to your shopping bag!`);
    }
  };

  const handleAskAI = async (e) => {
    e.preventDefault();
    if (!user) {
      if (requireAuth) requireAuth('consult with our Senior AI Dermatologist');
      return;
    }
    if (!aiQuestion.trim() || aiLoading) return;

    setAiLoading(true);
    setAiAnswer(null);

    try {
      const res = await askAiDermatologist(aiQuestion.trim(), {
        skinType: activeSkinType,
        concerns: profileConcerns.length ? profileConcerns : [activeConcern],
        allergens: profileAllergens,
      });

      if (res && res.reply) {
        setAiAnswer(res.reply);
        setAiModelUsed(res.model || 'Google Gemini 1.5 Flash');
      }
    } catch (err) {
      setAiAnswer('Our dermatological AI advisor is currently synchronizing. Based on clean beauty science, ensure daily SPF 50 application and gentle barrier hydration with Hyaluronic Acid & Ceramides.');
      setAiModelUsed('AuraGlow Clinical Advisor');
    } finally {
      setAiLoading(false);
    }
  };

  const skinTypeButtons = [
    { label: 'Dry Skin', value: 'Dry', emoji: '💧' },
    { label: 'Oily Skin', value: 'Oily', emoji: '🍃' },
    { label: 'Combination', value: 'Combination', emoji: '⚖️' },
    { label: 'Sensitive', value: 'Sensitive', emoji: '🌸' },
    { label: 'Normal', value: 'Normal', emoji: '✨' },
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

      {/* Quiz Completion Celebratory Banner */}
      {isQuizSuccess && (
        <div style={{
          marginTop: 'var(--nav-height)',
          background: 'linear-gradient(90deg, rgba(232,114,150,0.2) 0%, rgba(184,169,217,0.2) 100%)',
          borderBottom: '1px solid var(--color-accent-rose)',
          padding: '14px 24px',
          textAlign: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          fontSize: 'var(--text-sm)',
          color: '#fff',
          fontWeight: '600',
        }}>
          <span>🎉 <strong>Skin Quiz Completed!</strong> We calibrated your routine for <strong>{activeSkinType} Skin</strong></span>
          {profileConcerns.length > 0 && (
            <span style={{ opacity: 0.9, fontSize: 'var(--text-xs)' }}>
              (Targeting: {profileConcerns.join(', ')})
            </span>
          )}
          <span style={{ background: 'var(--color-accent-rose)', color: '#fff', padding: '2px 8px', borderRadius: 'var(--radius-full)', fontSize: '11px', fontWeight: '700' }}>
            Personalized Routine Ready ↓
          </span>
        </div>
      )}

      {/* Hero Banner */}
      <section style={{
        marginTop: isQuizSuccess ? 0 : 'var(--nav-height)',
        padding: 'var(--space-16) var(--space-10) var(--space-10)',
        background: 'linear-gradient(180deg, rgba(184, 169, 217, 0.12) 0%, rgba(13, 13, 15, 0) 100%)',
        borderBottom: '1px solid var(--color-border)',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: '840px', margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(184, 169, 217, 0.15)', border: '1px solid var(--color-accent-lavender)', borderRadius: 'var(--radius-full)', padding: '6px 18px', fontSize: 'var(--text-xs)', fontWeight: '700', color: 'var(--color-accent-lavender)', textTransform: 'uppercase', marginBottom: 'var(--space-4)' }}>
            <span>✨</span>
            <span>Google Gemini Generative AI Skincare Intelligence</span>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--color-accent-sage)' }} />
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
            No more skincare guesswork. Our AI models scientifically pair bioactive clean ingredients with your biological skin profile and personal goals.
          </p>

          {/* Interactive Skin Type Quick Tabs */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
            {skinTypeButtons.map(st => (
              <button
                key={st.value}
                onClick={() => { userSelectedSkinType.current = true; setActiveSkinType(st.value); }}
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: '800', fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)', margin: 0 }}>
                  Step-by-Step AI Regimen
                </h2>
                <span style={{ background: 'rgba(126, 200, 160, 0.15)', color: 'var(--color-accent-sage)', border: '1px solid rgba(126, 200, 160, 0.3)', borderRadius: 'var(--radius-full)', padding: '2px 8px', fontSize: '11px', fontWeight: '700' }}>
                  AI Powered
                </span>
              </div>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', margin: '4px 0 0 0' }}>
                Scientifically optimized layer-by-layer for peak trans-epidermal absorption.
              </p>
            </div>

            <Link to="/skin-quiz" className="btn btn-secondary btn-sm btn-pill">
              Retake 4-Step Quiz 🌸
            </Link>
          </div>

          <PersonalizedRoutineWidget
            initialSkinType={activeSkinType}
            initialConcern={activeConcern}
            onAddToCart={handleAddToCart}
          />
        </section>

        {/* 2. Interactive AI Skincare Consultation Terminal */}
        <section style={{
          background: 'linear-gradient(135deg, rgba(232, 114, 150, 0.08) 0%, rgba(184, 169, 217, 0.08) 100%)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-2xl)',
          padding: 'var(--space-8)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: 'var(--space-3)' }}>
            <span style={{ fontSize: '24px' }}>🤖</span>
            <div>
              <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: '800', fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)', margin: 0 }}>
                Ask AuraGlow AI Dermatologist
              </h3>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', margin: '2px 0 0 0' }}>
                Instant dermatological consultation for your specific skin type ({activeSkinType})
              </p>
            </div>
          </div>

          <form onSubmit={handleAskAI} style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-4)', flexWrap: 'wrap' }}>
            <input
              type="text"
              value={aiQuestion}
              onChange={(e) => setAiQuestion(e.target.value)}
              placeholder="e.g., Can I combine Vitamin C with Niacinamide? What helps with hormonal acne?"
              className="input"
              style={{ flex: 1, minWidth: '280px', padding: '12px 18px', fontSize: 'var(--text-sm)', borderRadius: 'var(--radius-xl)' }}
            />
            <button
              type="submit"
              disabled={aiLoading || !aiQuestion.trim()}
              className="btn btn-primary btn-pill"
              style={{ padding: '12px 24px', fontWeight: '700', fontSize: 'var(--text-sm)', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              {aiLoading ? (
                <>
                  <span className="spinner" />
                  Consulting AI...
                </>
              ) : (
                <>
                  <span>✨</span> Ask AI
                </>
              )}
            </button>
          </form>

          {/* AI Response Display */}
          {aiAnswer && (
            <div style={{
              marginTop: 'var(--space-6)',
              background: 'var(--color-bg-secondary)',
              border: '1px solid rgba(232, 114, 150, 0.3)',
              borderRadius: 'var(--radius-xl)',
              padding: 'var(--space-6)',
              animation: 'fadeIn 0.3s ease',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-3)' }}>
                <span style={{ fontSize: 'var(--text-xs)', fontWeight: '700', color: 'var(--color-accent-rose)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Clinical AI Consultation Report
                </span>
                {aiModelUsed && (
                  <span style={{ fontSize: '11px', color: 'var(--color-accent-sage)', background: 'rgba(126, 200, 160, 0.15)', padding: '2px 8px', borderRadius: 'var(--radius-full)', fontWeight: '600' }}>
                    🟢 {aiModelUsed}
                  </span>
                )}
              </div>
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: 1.8, whiteSpace: 'pre-line' }}>
                {aiAnswer}
              </div>
            </div>
          )}
        </section>

        {/* 3. Key Actives Deep Dive Matrix */}
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

        {/* 4. Tone-Matched Complexion & Cosmetics Capsule */}
        {matchedCosmetics && (
          <section style={{
            background: 'var(--color-bg-card)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-2xl)',
            padding: 'var(--space-8)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
              <div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(232, 114, 150, 0.15)', border: '1px solid var(--color-accent-rose)', borderRadius: 'var(--radius-full)', padding: '3px 10px', fontSize: '11px', fontWeight: '700', color: 'var(--color-accent-rose)', textTransform: 'uppercase', marginBottom: 'var(--space-2)' }}>
                  🎨 Complexion Diagnostic
                </div>
                <h3 style={{ fontSize: 'var(--text-2xl)', fontWeight: '800', fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)', margin: '0 0 var(--space-1) 0' }}>
                  Precision Tone & Undertone Complexion Matches
                </h3>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', margin: 0 }}>
                  Calibrated for <strong>{(effectiveProfile?.skin_tone || 'Medium').toUpperCase()}</strong> skin with <strong>{(effectiveProfile?.undertone || 'Warm').toUpperCase()}</strong> undertones.
                </p>
              </div>
              <Link to="/skin-quiz" style={{ color: 'var(--color-accent-rose)', textDecoration: 'none', fontSize: 'var(--text-xs)', fontWeight: '600' }}>
                Retake Quiz ↺
              </Link>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: 'var(--space-5)' }}>
              {Object.entries(matchedCosmetics).map(([key, item]) => {
                if (!item || !item.product) return null;
                const p = item.product;
                const shade = item.shade;
                return (
                  <div
                    key={key}
                    className="card-hover-glow"
                    style={{
                      background: 'var(--color-bg-secondary)',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-xl)',
                      padding: 'var(--space-5)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      gap: 'var(--space-3)',
                    }}
                  >
                    <div>
                      <div style={{ position: 'relative', borderRadius: 'var(--radius-lg)', overflow: 'hidden', height: '160px', marginBottom: 'var(--space-3)' }}>
                        <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        {shade?.hex && (
                          <div style={{
                            position: 'absolute',
                            bottom: '8px',
                            right: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            background: 'rgba(0,0,0,0.75)',
                            backdropFilter: 'blur(6px)',
                            padding: '3px 8px',
                            borderRadius: 'var(--radius-full)',
                            fontSize: '11px',
                            color: '#fff',
                            fontWeight: '600',
                          }}>
                            <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: shade.hex, border: '1.5px solid #fff', display: 'inline-block' }} />
                            {shade.name}
                          </div>
                        )}
                      </div>
                      <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-accent-rose)', fontWeight: '700' }}>
                        {p.category.toUpperCase()} • TONE MATCH
                      </span>
                      <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: '700', color: 'var(--color-text-primary)', margin: '4px 0 2px 0', lineHeight: 1.4 }}>
                        {p.name}
                      </h4>
                      {shade && (
                        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', margin: 0 }}>
                          Matched Shade: <strong style={{ color: 'var(--color-text-primary)' }}>{shade.name}</strong>
                        </p>
                      )}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'var(--space-2)' }}>
                      <span style={{ fontSize: 'var(--text-sm)', fontWeight: '800', color: 'var(--color-text-primary)' }}>
                        LKR {p.price?.toLocaleString()}
                      </span>
                      <button
                        onClick={() => handleAddToCart(p)}
                        className="btn btn-primary"
                        style={{ padding: '6px 14px', fontSize: 'var(--text-xs)', borderRadius: 'var(--radius-full)', fontWeight: '700' }}
                      >
                        + Bag
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* 5. Top Recommended Formulas */}
        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
            <div>
              <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: '800', fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)', margin: 0 }}>
                Hero Clean Formulas Matching {activeSkinType} Skin
              </h2>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', margin: '4px 0 0 0' }}>
                Ranked by AI skin compatibility score for your diagnostic concerns.
              </p>
            </div>
            <Link to="/products" style={{ color: 'var(--color-accent-rose)', textDecoration: 'none', fontSize: 'var(--text-sm)', fontWeight: '600' }}>
              View All {catalogProducts.length} Products →
            </Link>
          </div>

          {loadingProducts ? (
            <div style={{ textAlign: 'center', padding: 'var(--space-12)', color: 'var(--color-text-muted)' }}>
              <div style={{ fontSize: '28px', marginBottom: 'var(--space-2)' }}>✨</div>
              <p style={{ fontSize: 'var(--text-sm)' }}>Matching live catalog formulas to your clinical skin profile...</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 'var(--space-6)' }}>
              {topRecommendedProducts.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  viewMode="grid"
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          )}
        </section>

      </main>

      <Footer />
    </div>
  );
}
