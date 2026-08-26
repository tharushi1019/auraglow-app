import React, { useState, useEffect } from 'react';
import RatingBreakdown from './RatingBreakdown';
import ReviewCard from './ReviewCard';
import ReviewFormModal from './ReviewFormModal';
import { getProductReviews, getReviewStats, submitReview } from '@/services/reviewService';

export default function ReviewsSection({ productId, productName = 'Product' }) {
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Filter & Sort State
  const [starFilter, setStarFilter] = useState('all');
  const [skinTypeFilter, setSkinTypeFilter] = useState('all');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [sortBy, setSortBy] = useState('recent');
  const [searchReviewTerm, setSearchReviewTerm] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Load reviews & stats
  useEffect(() => {
    async function loadReviewsData() {
      setLoading(true);
      const [revData, statsData] = await Promise.all([
        getProductReviews(productId, {
          star: starFilter,
          skinType: skinTypeFilter,
          verifiedOnly,
          sort: sortBy,
        }),
        getReviewStats(productId),
      ]);

      setReviews(revData.reviews || []);
      setStats(statsData);
      setLoading(false);
    }

    loadReviewsData();
  }, [productId, starFilter, skinTypeFilter, verifiedOnly, sortBy]);

  const handleReviewSubmit = async (formData) => {
    const newRev = await submitReview(formData);
    setReviews(prev => [newRev, ...prev]);
    // Refresh stats
    const updatedStats = await getReviewStats(productId);
    setStats(updatedStats);
  };

  const filteredReviews = reviews.filter(r => {
    if (!searchReviewTerm.trim()) return true;
    const q = searchReviewTerm.toLowerCase();
    return (
      (r.title && r.title.toLowerCase().includes(q)) ||
      (r.comment && r.comment.toLowerCase().includes(q)) ||
      (r.userName && r.userName.toLowerCase().includes(q))
    );
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
      {/* 1. Rating Overview & Breakdown */}
      <RatingBreakdown
        stats={stats || undefined}
        selectedStarFilter={starFilter}
        onSelectStarFilter={setStarFilter}
        onOpenReviewModal={() => setIsModalOpen(true)}
      />

      {/* 2. Filter & Sort Toolbar */}
      <div
        style={{
          background: 'var(--color-bg-card)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-xl)',
          padding: 'var(--space-4) var(--space-6)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 'var(--space-4)',
        }}
      >
        {/* Left: Star Filter Pills & Skin Type Dropdown */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 'var(--space-3)' }}>
          {/* Star Filter */}
          <div style={{ display: 'flex', gap: '4px' }}>
            {['all', '5', '4', '3'].map(s => (
              <button
                key={s}
                onClick={() => setStarFilter(s)}
                style={{
                  background: starFilter === s ? 'rgba(232, 114, 150, 0.2)' : 'var(--color-bg-secondary)',
                  border: starFilter === s ? '1px solid var(--color-accent-rose)' : '1px solid var(--color-border)',
                  color: starFilter === s ? 'var(--color-accent-rose)' : 'var(--color-text-secondary)',
                  borderRadius: 'var(--radius-full)',
                  padding: '4px 10px',
                  fontSize: '11px',
                  cursor: 'pointer',
                  fontWeight: starFilter === s ? '700' : '500',
                  transition: 'all var(--transition-fast)',
                }}
              >
                {s === 'all' ? 'All Ratings' : `${s} ★`}
              </button>
            ))}
          </div>

          {/* Skin Type Filter */}
          <select
            value={skinTypeFilter}
            onChange={e => setSkinTypeFilter(e.target.value)}
            style={{
              background: 'var(--color-bg-secondary)',
              border: '1px solid var(--color-border)',
              color: 'var(--color-text-secondary)',
              borderRadius: 'var(--radius-lg)',
              padding: '4px 10px',
              fontSize: '11px',
              cursor: 'pointer',
              outline: 'none',
            }}
          >
            <option value="all">All Skin Types</option>
            <option value="Dry">Dry Skin</option>
            <option value="Oily">Oily Skin</option>
            <option value="Combination">Combination</option>
            <option value="Sensitive">Sensitive</option>
          </select>

          {/* Verified Only Checkbox */}
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--color-text-secondary)', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={verifiedOnly}
              onChange={e => setVerifiedOnly(e.target.checked)}
              style={{ accentColor: 'var(--color-accent-sage)', cursor: 'pointer' }}
            />
            Verified Buyers Only
          </label>
        </div>

        {/* Right: Search & Sort Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          {/* Keyword Search */}
          <input
            type="text"
            value={searchReviewTerm}
            onChange={e => setSearchReviewTerm(e.target.value)}
            placeholder="Search reviews..."
            style={{
              background: 'var(--color-bg-secondary)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-full)',
              color: 'var(--color-text-primary)',
              padding: '4px 12px',
              fontSize: '11px',
              outline: 'none',
              width: '130px',
            }}
          />

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            style={{
              background: 'var(--color-bg-secondary)',
              border: '1px solid var(--color-border)',
              color: 'var(--color-text-primary)',
              borderRadius: 'var(--radius-lg)',
              padding: '4px 10px',
              fontSize: '11px',
              cursor: 'pointer',
              outline: 'none',
            }}
          >
            <option value="recent">Most Recent</option>
            <option value="helpful">Most Helpful</option>
            <option value="highest">Highest Rated</option>
            <option value="lowest">Lowest Rated</option>
          </select>
        </div>
      </div>

      {/* 3. Review Cards List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>
          Loading community reviews...
        </div>
      ) : filteredReviews.length === 0 ? (
        <div style={{
          background: 'var(--color-bg-card)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-xl)',
          padding: 'var(--space-10)',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 'var(--space-3)',
        }}>
          <div style={{ fontSize: '2.5rem' }}>💬</div>
          <h4 style={{ fontSize: 'var(--text-base)', color: 'var(--color-text-primary)', fontWeight: '700', margin: 0 }}>
            No reviews match your filters
          </h4>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', margin: 0 }}>
            Be the first to share your experience with this clean beauty formula!
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn btn-secondary btn-sm btn-pill"
            style={{ marginTop: 'var(--space-2)' }}
          >
            Write First Review 🌸
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {filteredReviews.map(rev => (
            <ReviewCard key={rev.id} review={rev} />
          ))}
        </div>
      )}

      {/* 4. Write Review Modal Dialog */}
      <ReviewFormModal
        productId={productId}
        productName={productName}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleReviewSubmit}
      />
    </div>
  );
}
