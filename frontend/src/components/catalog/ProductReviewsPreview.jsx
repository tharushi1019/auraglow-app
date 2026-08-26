import React, { useState } from 'react';
import { reviews as mockReviews } from '@/data/mockData';

export default function ProductReviewsPreview({ productId, rating = 4.8, reviewCount = 120 }) {
  const productReviews = mockReviews.filter(r => r.productId === productId);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newTitle, setNewTitle] = useState('');
  const [newBody, setNewBody] = useState('');
  const [reviewsList, setReviewsList] = useState(
    productReviews.length > 0 ? productReviews : [
      {
        id: 'rev-sample-1',
        productId,
        userId: 'usr-1',
        rating: 5,
        title: 'Absolutely essential in my routine!',
        body: 'Obsessed with the texture and noticeable glow within just 10 days. AuraGlow’s clean formulation is truly top-tier.',
        date: '2026-08-18',
        verified: true,
        userName: 'Elena V.',
        skinType: 'Combination Skin',
      },
      {
        id: 'rev-sample-2',
        productId,
        userId: 'usr-2',
        rating: 5,
        title: 'Gentle on sensitive skin & fast results',
        body: 'No redness or irritation. Smells natural and absorbs into the skin like a dream. Highly recommend to everyone.',
        date: '2026-08-12',
        verified: true,
        userName: 'Sasha R.',
        skinType: 'Dry & Sensitive',
      },
    ]
  );
  const [submitted, setSubmitted] = useState(false);

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newBody.trim()) return;

    const newRev = {
      id: `rev-${Date.now()}`,
      productId,
      userId: 'usr-current',
      rating: newRating,
      title: newTitle,
      body: newBody,
      date: new Date().toISOString().split('T')[0],
      verified: true,
      userName: 'You (Verified Buyer)',
      skinType: 'Normal / Combination',
    };

    setReviewsList([newRev, ...reviewsList]);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setShowReviewModal(false);
      setNewTitle('');
      setNewBody('');
    }, 1500);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
      {/* Top Review Metrics Grid */}
      <div style={{
        background: 'var(--color-bg-card)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-2xl)',
        padding: 'var(--space-8)',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: 'var(--space-8)',
        alignItems: 'center',
      }}>
        {/* Rating Score */}
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-2)' }}>
          <div style={{
            fontSize: 'var(--text-4xl)',
            fontWeight: '900',
            fontFamily: 'var(--font-heading)',
            color: 'var(--color-text-primary)',
            lineHeight: 1,
          }}>
            {rating}
          </div>
          <div style={{ display: 'flex', gap: '3px', color: 'var(--color-accent-gold)', fontSize: '18px' }}>
            {[1, 2, 3, 4, 5].map(i => (
              <span key={i} style={{ opacity: i <= Math.round(rating) ? 1 : 0.25 }}>★</span>
            ))}
          </div>
          <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
            Based on {reviewCount?.toLocaleString()} verified customer reviews
          </div>
          <button
            onClick={() => setShowReviewModal(true)}
            className="btn btn-primary btn-pill btn-sm"
            style={{ marginTop: 'var(--space-2)', padding: '8px 20px' }}
          >
            ✍️ Write a Review
          </button>
        </div>

        {/* Rating Bars */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {[
            { stars: 5, pct: 82 },
            { stars: 4, pct: 14 },
            { stars: 3, pct: 3 },
            { stars: 2, pct: 1 },
            { stars: 1, pct: 0 },
          ].map(row => (
            <div key={row.stars} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', fontSize: 'var(--text-xs)' }}>
              <span style={{ width: '45px', color: 'var(--color-text-muted)', fontWeight: '600' }}>
                {row.stars} ★
              </span>
              <div style={{ flex: 1, height: '8px', background: 'rgba(255,255,255,0.08)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                <div style={{ width: `${row.pct}%`, height: '100%', background: 'linear-gradient(90deg, var(--color-accent-rose), var(--color-accent-gold))', borderRadius: 'var(--radius-full)' }} />
              </div>
              <span style={{ width: '35px', textAlign: 'right', color: 'var(--color-text-muted)' }}>
                {row.pct}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Review List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        {reviewsList.map(rev => (
          <div
            key={rev.id}
            style={{
              background: 'var(--color-bg-card)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-xl)',
              padding: 'var(--space-6)',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-3)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: 'var(--radius-full)',
                  background: 'linear-gradient(135deg, var(--color-accent-rose), var(--color-accent-lavender))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '700',
                  color: '#fff',
                  fontSize: '14px',
                }}>
                  {rev.userName ? rev.userName[0] : 'U'}
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                    <span style={{ fontWeight: '700', fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)' }}>
                      {rev.userName || 'Customer'}
                    </span>
                    {rev.verified && (
                      <span className="badge badge-success" style={{ fontSize: '10px', padding: '2px 6px' }}>
                        ✓ Verified Buyer
                      </span>
                    )}
                  </div>
                  {rev.skinType && (
                    <span style={{ fontSize: '11px', color: 'var(--color-accent-lavender)' }}>
                      Skin: {rev.skinType}
                    </span>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '2px' }}>
                <div style={{ display: 'flex', gap: '2px', color: 'var(--color-accent-gold)', fontSize: '13px' }}>
                  {[1, 2, 3, 4, 5].map(i => (
                    <span key={i} style={{ opacity: i <= rev.rating ? 1 : 0.25 }}>★</span>
                  ))}
                </div>
                <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                  {rev.date}
                </span>
              </div>
            </div>

            <h5 style={{ fontSize: 'var(--text-base)', fontWeight: '700', color: 'var(--color-text-primary)', margin: 0 }}>
              {rev.title}
            </h5>

            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: 1.6, margin: 0 }}>
              {rev.body}
            </p>
          </div>
        ))}
      </div>

      {/* Write Review Modal */}
      {showReviewModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            background: 'rgba(0,0,0,0.8)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 'var(--space-4)',
          }}
          onClick={() => setShowReviewModal(false)}
        >
          <div
            style={{
              background: 'var(--color-bg-card)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-2xl)',
              padding: 'var(--space-8)',
              width: '100%',
              maxWidth: '520px',
              position: 'relative',
            }}
            onClick={e => e.stopPropagation()}
          >
            <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: '800', color: 'var(--color-text-primary)', marginBottom: 'var(--space-4)' }}>
              Write a Review
            </h3>

            {submitted ? (
              <div style={{ textAlign: 'center', padding: 'var(--space-6)' }}>
                <div style={{ fontSize: '3rem', marginBottom: 'var(--space-2)' }}>🌸</div>
                <h4 style={{ color: 'var(--color-accent-sage)', fontWeight: '700' }}>Thank You for Your Review!</h4>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>Your feedback helps our clean beauty community glow.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                {/* Rating Select */}
                <div>
                  <label style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: 'var(--space-1)' }}>
                    Your Rating
                  </label>
                  <div style={{ display: 'flex', gap: '8px', fontSize: '24px', cursor: 'pointer' }}>
                    {[1, 2, 3, 4, 5].map(i => (
                      <span
                        key={i}
                        onClick={() => setNewRating(i)}
                        style={{ color: i <= newRating ? 'var(--color-accent-gold)' : 'var(--color-text-muted)', transition: 'transform 0.15s' }}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: 'var(--space-1)' }}>
                    Headline
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. My favorite serum ever!"
                    value={newTitle}
                    onChange={e => setNewTitle(e.target.value)}
                    className="input"
                  />
                </div>

                {/* Review Body */}
                <div>
                  <label style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: 'var(--space-1)' }}>
                    Review Details
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="How does it feel on your skin? What results did you notice?"
                    value={newBody}
                    onChange={e => setNewBody(e.target.value)}
                    className="input"
                    style={{ resize: 'vertical' }}
                  />
                </div>

                <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end', marginTop: 'var(--space-2)' }}>
                  <button type="button" onClick={() => setShowReviewModal(false)} className="btn btn-secondary btn-sm">
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary btn-sm">
                    Submit Review 🌸
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
