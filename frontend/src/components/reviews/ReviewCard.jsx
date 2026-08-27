import React, { useState } from 'react';
import { voteHelpful } from '@/services/reviewService';

export default function ReviewCard({ review, onHelpfulVote }) {
  const [helpfulCount, setHelpfulCount] = useState(review.helpfulVotes || 0);
  const [hasVoted, setHasVoted] = useState(false);

  const handleVote = async () => {
    if (hasVoted) return;
    setHasVoted(true);
    setHelpfulCount(prev => prev + 1);
    await voteHelpful(review.id);
    if (onHelpfulVote) onHelpfulVote(review.id);
  };

  const formattedDate = review.createdAt
    ? new Date(review.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : 'Recent Review';

  return (
    <div
      className="card-hover-glow"
      style={{
        background: 'var(--color-bg-card)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-xl)',
        padding: 'var(--space-6)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-4)',
        position: 'relative',
      }}
    >
      {/* Header: User Profile, Badges, Date */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          {/* Avatar */}
          {review.userAvatar ? (
            <img
              src={review.userAvatar}
              alt={review.userName}
              style={{
                width: '44px',
                height: '44px',
                borderRadius: 'var(--radius-full)',
                objectFit: 'cover',
                border: '2px solid rgba(232, 114, 150, 0.4)',
              }}
            />
          ) : (
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: 'var(--radius-full)',
                background: 'linear-gradient(135deg, var(--color-accent-rose), var(--color-accent-lavender))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '700',
                color: '#fff',
                fontSize: '16px',
              }}
            >
              {review.userName ? review.userName[0] : 'U'}
            </div>
          )}

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <span style={{ fontWeight: '700', fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)' }}>
                {review.userName || 'Verified Buyer'}
              </span>
              {review.verified && (
                <span className="badge badge-success" style={{ fontSize: '10px', padding: '2px 8px' }}>
                  ✓ Verified Buyer
                </span>
              )}
            </div>

            {/* Skin Profile Tags */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '2px' }}>
              {review.skinType && (
                <span style={{ fontSize: '11px', color: 'var(--color-accent-lavender)', fontWeight: '500' }}>
                  Skin: {review.skinType}
                </span>
              )}
              {review.skinConcern && (
                <>
                  <span style={{ color: 'var(--color-text-muted)', fontSize: '10px' }}>•</span>
                  <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                    Focus: {review.skinConcern}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Rating and Date */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
          <div style={{ display: 'flex', gap: '2px', color: 'var(--color-accent-gold)', fontSize: '14px' }}>
            {[1, 2, 3, 4, 5].map(i => (
              <span key={i} style={{ opacity: i <= review.rating ? 1 : 0.25 }}>★</span>
            ))}
          </div>
          <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
            {formattedDate}
          </span>
        </div>
      </div>

      {/* Review Title */}
      <h4 style={{
        fontSize: 'var(--text-base)',
        fontWeight: '700',
        color: 'var(--color-text-primary)',
        margin: 0,
        lineHeight: 1.3,
      }}>
        {review.title}
      </h4>

      {/* Review Comment */}
      <p style={{
        fontSize: 'var(--text-sm)',
        color: 'var(--color-text-secondary)',
        lineHeight: 1.65,
        margin: 0,
      }}>
        {review.comment || review.body}
      </p>

      {/* Recommendation Tag & Helpful Vote Button */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 'var(--space-3)',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        marginTop: 'auto',
      }}>
        <div>
          {review.recommend !== false ? (
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-accent-sage)', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '500' }}>
              <span>👍</span> Recommends this product
            </span>
          ) : (
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
              Neutral feedback
            </span>
          )}
        </div>

        {/* Helpful vote button */}
        <button
          onClick={handleVote}
          style={{
            background: hasVoted ? 'rgba(232, 114, 150, 0.2)' : 'rgba(255,255,255,0.05)',
            border: hasVoted ? '1px solid var(--color-accent-rose)' : '1px solid var(--color-border)',
            borderRadius: 'var(--radius-full)',
            padding: '4px 12px',
            fontSize: '11px',
            color: hasVoted ? 'var(--color-accent-rose)' : 'var(--color-text-secondary)',
            cursor: hasVoted ? 'default' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'all var(--transition-fast)',
          }}
          disabled={hasVoted}
        >
          <span>{hasVoted ? '❤️' : '🤍'}</span>
          <span>Helpful ({helpfulCount})</span>
        </button>
      </div>
    </div>
  );
}
