import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { submitSkinQuiz } from '../api/authApi';
import { useAuth } from '../context/AuthContext';
import CosmeticDoodles from '../components/CosmeticDoodles';

const SKIN_TYPES = ['Oily', 'Dry', 'Combination', 'Normal', 'Sensitive'];
const CONCERNS = ['Acne', 'Aging', 'Dark Spots', 'Redness', 'Dullness', 'Dehydration'];
const ALLERGENS = ['Fragrance', 'Nut Oils', 'Gluten', 'Sulfates', 'Silicones', 'None'];
const SKIN_TONES = ['Light', 'Medium', 'Tan', 'Dark', 'Deep'];
const UNDERTONES = ['Cool', 'Warm', 'Neutral'];

const STEPS = ['skinType', 'concerns', 'allergens', 'shadeTone'];

/* Inline glow-enhanced styles */
const glassCard = {
  backdropFilter: 'blur(20px)',
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(232,180,160,0.15)',
  boxShadow: '0 8px 32px rgba(0,0,0,0.3), 0 0 60px rgba(232,180,160,0.06)',
};

export default function SkinQuiz() {
  const navigate = useNavigate();
  const { setSkinProfile, user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login?redirect=/skin-quiz', { replace: true });
    }
  }, [user, authLoading, navigate]);

  const [step, setStep] = useState(0);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [answers, setAnswers] = useState({
    skinType: '',
    concerns: [],
    allergens: [],
    skinTone: 'Medium',
    undertone: 'Warm',
  });

  function selectSkinType(type) {
    setAnswers({ ...answers, skinType: type });
  }

  function toggleMulti(field, value) {
    setAnswers((prev) => {
      const current = prev[field];
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return { ...prev, [field]: next };
    });
  }

  function goNext() {
    setError('');
    if (step === 0 && !answers.skinType) {
      setError('Please select your skin type to continue.');
      return;
    }
    if (step < STEPS.length - 1) setStep(step + 1);
    else handleSubmit();
  }

  function goBack() {
    setError('');
    if (step > 0) setStep(step - 1);
  }

  async function handleSubmit() {
    setLoading(true);
    setError('');
    try {
      const profileObj = {
        skin_type: answers.skinType ? answers.skinType.toLowerCase() : 'combination',
        concerns: answers.concerns || [],
        allergens: answers.allergens || [],
        skin_tone: answers.skinTone ? answers.skinTone.toLowerCase() : 'medium',
        undertone: answers.undertone ? answers.undertone.toLowerCase() : 'warm',
      };

      // Save locally for instant UI responsiveness
      localStorage.setItem('auraglow_skin_profile', JSON.stringify(profileObj));
      setSkinProfile(profileObj);

      const token = localStorage.getItem('auraglow_token');
      if (token) {
        try {
          const payload = {
            skinType: answers.skinType,
            skin_type: profileObj.skin_type,
            concerns: profileObj.concerns,
            allergens: profileObj.allergens,
            skinTone: answers.skinTone,
            skin_tone: profileObj.skin_tone,
            undertone: answers.undertone || 'Warm',
          };
          const data = await submitSkinQuiz(payload);
          if (data && data.skinProfile) {
            setSkinProfile(data.skinProfile);
          }
        } catch (apiErr) {
          console.warn('Backend profile sync note:', apiErr.message);
        }
      }

      // Smoothly navigate to recommendations page with quiz success flag
      setTimeout(() => {
        navigate('/recommendations?quiz=success', { state: { fromQuiz: true, profile: profileObj } });
      }, 500);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save your quiz. Please try again.');
      setLoading(false);
    }
  }


  return (
    <>
      <CosmeticDoodles />
      <div className="auth-container">
        <h1 className="page-title">Discover Your Skin</h1>
        <p className="page-subtitle">A 4-step personalized quiz for custom skincare & shade matching.</p>

        <div className="auth-card">
          <div className="quiz-progress">
            {STEPS.map((_, i) => (
              <div key={i} className={`quiz-progress-dot ${i <= step ? 'active' : ''}`} />
            ))}
          </div>

          {error && <div className="alert-banner">{error}</div>}

          {step === 0 && (
            <>
              <h3 style={{ marginBottom: '1rem', fontFamily: 'var(--font-heading)' }}>What's your skin type?</h3>
              <div className="option-grid">
                {SKIN_TYPES.map((type) => (
                  <div
                    key={type}
                    className={`option-chip ${answers.skinType === type ? 'selected' : ''}`}
                    onClick={() => selectSkinType(type)}
                  >
                    {type}
                  </div>
                ))}
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <h3 style={{ marginBottom: '1rem', fontFamily: 'var(--font-heading)' }}>Any skin concerns? (pick any)</h3>
              <div className="option-grid">
                {CONCERNS.map((c) => (
                  <div
                    key={c}
                    className={`option-chip ${answers.concerns.includes(c) ? 'selected' : ''}`}
                    onClick={() => toggleMulti('concerns', c)}
                  >
                    {c}
                  </div>
                ))}
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <h3 style={{ marginBottom: '1rem', fontFamily: 'var(--font-heading)' }}>Any allergies to avoid?</h3>
              <div className="option-grid">
                {ALLERGENS.map((a) => (
                  <div
                    key={a}
                    className={`option-chip ${answers.allergens.includes(a) ? 'selected' : ''}`}
                    onClick={() => toggleMulti('allergens', a)}
                  >
                    {a}
                  </div>
                ))}
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <h3 style={{ marginBottom: '0.5rem', fontFamily: 'var(--font-heading)' }}>Shade Match Assistant: Tone & Undertone</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
                Helps us recommend perfect cosmetics & foundation shades for your complexion.
              </p>
              
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--color-accent-rose)' }}>
                  Skin Tone Range:
                </label>
                <div className="option-grid">
                  {SKIN_TONES.map((t) => (
                    <div
                      key={t}
                      className={`option-chip ${answers.skinTone === t ? 'selected' : ''}`}
                      onClick={() => setAnswers({ ...answers, skinTone: t })}
                    >
                      {t}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--color-accent-lavender)' }}>
                  Undertone:
                </label>
                <div className="option-grid">
                  {UNDERTONES.map((u) => (
                    <div
                      key={u}
                      className={`option-chip ${answers.undertone === u ? 'selected' : ''}`}
                      onClick={() => setAnswers({ ...answers, undertone: u })}
                    >
                      {u}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          <div className="quiz-nav">
            {step > 0 && (
              <button className="btn btn-ghost" onClick={goBack} disabled={loading}>
                Back
              </button>
            )}
            <button className="btn btn-primary" onClick={goNext} disabled={loading}>
              {loading ? <span className="spinner" /> : step === STEPS.length - 1 ? 'Finish' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

