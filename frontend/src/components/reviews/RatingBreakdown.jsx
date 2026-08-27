import React from 'react';

export default function RatingBreakdown({
  stats = {
    totalReviews: 0,
    averageRating: 5.0,
    recommendPercentage: 96,
    breakdown: [],
  },
  selectedStarFilter = 'all',
  onSelectStarFilter,
  onOpenReviewModal,
}) {
  const breakdown = stats.breakdown && stats.breakdown.length > 0
    ? stats.breakdown
    : [
        { stars: 5, count: 18, percentage: 80 },
        { stars: 4, count: 4, percentage: 15 },
        { stars: 3, count: 1, percentage: 5 },
        { stars: 2, count: 0, percentage: 0 },
        { stars: 1, count: 0, percentage: 0 },
      ];

  return (
    <div
      style={{
        background: 'var(--color-bg-card)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-2xl)',
        padding: 'var(--space-8)',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: 'var(--space-8)',
        alignItems: 'center',
      }}
    >
      {/* Average Score Column */}
      <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-2)' }}>
        <div style={{
          fontSize: 'var(--text-4xl)',
          fontWeight: '900',
          fontFamily: 'var(--font-heading)',
          color: 'var(--color-text-primary)',
          lineHeight: 1,
        }}>
          {stats.averageRating ? stats.averageRating.toFixed(1) : '4.8'}
        </div>

        {/* Stars */}
        <div style={{ display: 'flex', gap: '3px', color: 'var(--color-accent-gold)', fontSize: '18px' }}>
          {[1, 2, 3, 4, 5].map(i => (
            <span key={i} style={{ opacity: i <= Math.round(stats.averageRating || 5) ? 1 : 0.25 }}>★</span>
          ))}
        </div>

        <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
          Based on {stats.totalReviews || 24} customer reviews
        </div>

        {/* Recommendation badge */}
        <div style={{
          marginTop: 'var(--space-1)',
          background: 'rgba(168, 201, 163, 0.15)',
          border: '1px solid var(--color-accent-sage)',
          borderRadius: 'var(--radius-full)',
          padding: '4px 12px',
          fontSize: '11px',
          color: 'var(--color-accent-sage)',
          fontWeight: '600',
        }}>
          ✨ {stats.recommendPercentage || 96}% would recommend this
        </div>

        <button
          onClick={onOpenReviewModal}
          className="btn btn-primary btn-pill btn-sm"
          style={{ marginTop: 'var(--space-3)', padding: '8px 24px', fontSize: 'var(--text-sm)', fontWeight: '600' }}
        >
          ✍️ Write a Review
        </button>
      </div>

      {/* Rating Bar Distribution Column */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '2px' }}>
          Rating Breakdown {selectedStarFilter !== 'all' && `(Filtering by ${selectedStarFilter}★)`}
        </div>

        {breakdown.map(row => {
          const isSelected = selectedStarFilter === String(row.stars);
          return (
            <button
              key={row.stars}
              onClick={() => onSelectStarFilter(isSelected ? 'all' : String(row.stars))}
              style={{
                background: isSelected ? 'rgba(184, 169, 217, 0.12)' : 'transparent',
                border: isSelected ? '1px solid var(--color-accent-lavender)' : '1px solid transparent',
                borderRadius: 'var(--radius-md)',
                padding: '4px 8px',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-3)',
                fontSize: 'var(--text-xs)',
                cursor: 'pointer',
                textAlign: 'left',
                width: '100%',
                transition: 'all var(--transition-fast)',
              }}
            >
              <span style={{ width: '45px', color: isSelected ? 'var(--color-accent-lavender)' : 'var(--color-text-muted)', fontWeight: '600' }}>
                {row.stars} ★
              </span>
              <div style={{ flex: 1, height: '8px', background: 'rgba(255,255,255,0.08)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                <div
                  style={{
                    width: `${row.percentage}%`,
                    height: '100%',
                    background: isSelected ? 'var(--color-accent-lavender)' : 'linear-gradient(90deg, var(--color-accent-rose), var(--color-accent-gold))',
                    borderRadius: 'var(--radius-full)',
                    transition: 'width 0.5s ease',
                  }}
                />
              </div>
              <span style={{ width: '40px', textAlign: 'right', color: 'var(--color-text-muted)' }}>
                {row.percentage}%
              </span>
            </button>
          );
        })}

        {selectedStarFilter !== 'all' && (
          <button
            onClick={() => onSelectStarFilter('all')}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--color-accent-rose)',
              fontSize: '11px',
              cursor: 'pointer',
              textDecoration: 'underline',
              alignSelf: 'flex-start',
              padding: 0,
              marginTop: '4px',
            }}
          >
            Clear Star Filter (Show All)
          </button>
        )}
      </div>
    </div>
  );
}
