import React, { useState } from 'react';

export default function ReviewFormModal({
  productId,
  productName = 'Product',
  isOpen,
  onClose,
  onSubmit,
}) {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [userName, setUserName] = useState('');
  const [skinType, setSkinType] = useState('Combination');
  const [skinConcern, setSkinConcern] = useState('Dullness & Uneven Tone');
  const [recommend, setRecommend] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !comment.trim() || comment.length < 10) return;

    setIsSubmitting(true);
    const payload = {
      productId,
      rating,
      title: title.trim(),
      comment: comment.trim(),
      userName: userName.trim() || 'Verified Customer',
      skinType,
      skinConcern,
      recommend,
    };

    if (onSubmit) {
      await onSubmit(payload);
    }

    setIsSubmitting(false);
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
      setTitle('');
      setComment('');
    }, 1600);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        background: 'rgba(0,0,0,0.8)',
        backdropFilter: 'blur(10px)',
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
          maxWidth: '560px',
          maxHeight: '90vh',
          overflowY: 'auto',
          position: 'relative',
          padding: 'var(--space-8)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
        }}
        onClick={e => e.stopPropagation()}
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
            width: '32px',
            height: '32px',
            color: 'var(--color-text-secondary)',
            fontSize: '16px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          aria-label="Close"
        >
          ✕
        </button>

        {isSuccess ? (
          <div style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
            <div style={{ fontSize: '3.5rem', marginBottom: 'var(--space-3)' }}>🌸</div>
            <h3 style={{ fontSize: 'var(--text-2xl)', fontWeight: '800', color: 'var(--color-text-primary)', marginBottom: 'var(--space-2)' }}>
              Thank You For Your Review!
            </h3>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', lineHeight: 1.6 }}>
              Your feedback is now live. It empowers the clean beauty community to find their exact skin match.
            </p>
          </div>
        ) : (
          <div>
            <div style={{ marginBottom: 'var(--space-6)' }}>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-accent-rose)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: '700' }}>
                Community Feedback
              </span>
              <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: '800', color: 'var(--color-text-primary)', margin: '4px 0 0 0' }}>
                Review: {productName}
              </h3>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              {/* Star Rating Picker */}
              <div>
                <label style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 'var(--space-2)' }}>
                  Overall Rating *
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ display: 'flex', gap: '4px', fontSize: '28px', cursor: 'pointer' }}>
                    {[1, 2, 3, 4, 5].map(star => {
                      const activeStar = hoverRating || rating;
                      return (
                        <span
                          key={star}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          onClick={() => setRating(star)}
                          style={{
                            color: star <= activeStar ? 'var(--color-accent-gold)' : 'rgba(255,255,255,0.2)',
                            transform: star <= activeStar ? 'scale(1.1)' : 'scale(1)',
                            transition: 'all 0.15s ease',
                          }}
                        >
                          ★
                        </span>
                      );
                    })}
                  </div>
                  <span style={{ fontSize: 'var(--text-sm)', fontWeight: '700', color: 'var(--color-accent-gold)', marginLeft: '8px' }}>
                    {rating === 5 ? '5.0 — Excellent' : rating === 4 ? '4.0 — Very Good' : rating === 3 ? '3.0 — Average' : rating === 2 ? '2.0 — Not Great' : '1.0 — Poor'}
                  </span>
                </div>
              </div>

              {/* Review Headline */}
              <div>
                <label style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 'var(--space-1)' }}>
                  Review Headline *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. My holy grail serum for hydration!"
                  className="input"
                />
              </div>

              {/* Review Comment */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-1)' }}>
                  <label style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Detailed Experience *
                  </label>
                  <span style={{ fontSize: '11px', color: comment.length < 10 ? 'var(--color-accent-rose)' : 'var(--color-text-muted)' }}>
                    {comment.length} / 10 min chars
                  </span>
                </div>
                <textarea
                  rows={4}
                  required
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  placeholder="How does it feel? How long did it take to notice a difference? Scent, texture, and results..."
                  className="input"
                  style={{ resize: 'vertical' }}
                />
              </div>

              {/* Skin Profile Selectors Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                <div>
                  <label style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 'var(--space-1)' }}>
                    Your Skin Type
                  </label>
                  <select
                    value={skinType}
                    onChange={e => setSkinType(e.target.value)}
                    className="input"
                    style={{ background: 'var(--color-bg-secondary)', cursor: 'pointer' }}
                  >
                    <option value="Dry">Dry Skin</option>
                    <option value="Oily">Oily Skin</option>
                    <option value="Combination">Combination Skin</option>
                    <option value="Sensitive">Sensitive Skin</option>
                    <option value="Normal">Normal Skin</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 'var(--space-1)' }}>
                    Primary Skin Concern
                  </label>
                  <select
                    value={skinConcern}
                    onChange={e => setSkinConcern(e.target.value)}
                    className="input"
                    style={{ background: 'var(--color-bg-secondary)', cursor: 'pointer' }}
                  >
                    <option value="Dullness & Uneven Tone">Dullness & Tone</option>
                    <option value="Dryness & Dehydration">Dryness & Hydration</option>
                    <option value="Acne & Breakouts">Acne & Breakouts</option>
                    <option value="Fine Lines & Wrinkles">Aging & Fine Lines</option>
                    <option value="Dark Spots & Pigmentation">Dark Spots</option>
                  </select>
                </div>
              </div>

              {/* Display Name */}
              <div>
                <label style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 'var(--space-1)' }}>
                  Your Name / Nickname
                </label>
                <input
                  type="text"
                  value={userName}
                  onChange={e => setUserName(e.target.value)}
                  placeholder="e.g. Sasha R. (optional)"
                  className="input"
                />
              </div>

              {/* Recommend Checkbox */}
              <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', cursor: 'pointer', fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginTop: 'var(--space-1)' }}>
                <input
                  type="checkbox"
                  checked={recommend}
                  onChange={e => setRecommend(e.target.checked)}
                  style={{ width: '16px', height: '16px', accentColor: 'var(--color-accent-sage)' }}
                />
                <span>I recommend this clean beauty product to a friend 👍</span>
              </label>

              {/* Form Buttons */}
              <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end', marginTop: 'var(--space-4)' }}>
                <button
                  type="button"
                  onClick={onClose}
                  className="btn btn-secondary btn-sm"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || comment.length < 10}
                  className="btn btn-primary btn-sm btn-pill"
                  style={{ padding: '8px 24px' }}
                >
                  {isSubmitting ? 'Posting...' : 'Submit Review 🌸'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
