import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { submitSkinQuiz } from '../api/authApi';
import { useAuth } from '../context/AuthContext';

const SKIN_TYPES = ['Oily', 'Dry', 'Combination', 'Normal', 'Sensitive'];
const CONCERNS = ['Acne', 'Aging', 'Dark Spots', 'Redness', 'Dullness', 'Dehydration'];
const ALLERGENS = ['Fragrance', 'Nut Oils', 'Gluten', 'Sulfates', 'Silicones', 'None'];

const STEPS = ['skinType', 'concerns', 'allergens'];

export default function SkinQuiz() {
  const navigate = useNavigate();
  const { setSkinProfile } = useAuth();
  const [step, setStep] = useState(0);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [answers, setAnswers] = useState({ skinType: '', concerns: [], allergens: [] });

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
      const data = await submitSkinQuiz(answers);
      setSkinProfile(data.skinProfile);
      navigate('/profile');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save your quiz. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container">
      <h1 className="page-title">Discover Your Skin</h1>
      <p className="page-subtitle">A quick 3-step quiz to personalize your recommendations.</p>

      <div className="card">
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
  );
}
