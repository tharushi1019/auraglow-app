/**
 * =============================================================================
 *  AuraGlow — Review Service (frontend/src/services/reviewService.js)
 *  Module 4: Reviews & Recommendations (Maduni)
 * =============================================================================
 */

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

// In-memory cache to support seamless client-side instant submissions
let memoryReviews = [
  {
    id: 'rev-001',
    productId: 'prod-001',
    userName: 'Sasha R.',
    userAvatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    skinType: 'Dry',
    skinConcern: 'Dullness & Uneven Tone',
    rating: 5,
    title: 'Game changer for dull skin!',
    comment: 'The Radiant Serum changed my skin completely within 2 weeks. I get compliments every single day now. AuraGlow is the only clean brand I trust!',
    verified: true,
    recommend: true,
    helpfulVotes: 24,
    createdAt: '2026-08-10T14:32:00Z',
  },
  {
    id: 'rev-002',
    productId: 'prod-001',
    userName: 'Anika P.',
    userAvatar: 'https://randomuser.me/api/portraits/women/68.jpg',
    skinType: 'Combination',
    skinConcern: 'Dryness & Dehydration',
    rating: 4,
    title: 'Love the lightweight texture',
    comment: 'The skin quiz matched me with this serum for my combination skin. Absorbs fast without any greasy residue. Sits beautifully under sunscreen.',
    verified: true,
    recommend: true,
    helpfulVotes: 15,
    createdAt: '2026-08-05T09:15:00Z',
  },
  {
    id: 'rev-003',
    productId: 'prod-003',
    userName: 'Leila M.',
    userAvatar: 'https://randomuser.me/api/portraits/women/55.jpg',
    skinType: 'Sensitive',
    skinConcern: 'Dryness & Dehydration',
    rating: 5,
    title: 'Deeply hydrating with zero redness!',
    comment: 'Beautiful packaging, even better results. The Petal Hydra Cream is so lightweight yet provides 72-hour moisture. Will repurchase forever!',
    verified: true,
    recommend: true,
    helpfulVotes: 32,
    createdAt: '2026-07-29T11:20:00Z',
  },
  {
    id: 'rev-004',
    productId: 'prod-002',
    userName: 'Sasha R.',
    userAvatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    skinType: 'Dry',
    skinConcern: 'All Skin Tones',
    rating: 4,
    title: 'Great colour payoff & non-drying',
    comment: 'Stays on all day without crumbling or flaking. The velvet matte finish is comfortable and pigmented.',
    verified: true,
    recommend: true,
    helpfulVotes: 9,
    createdAt: '2026-08-12T16:45:00Z',
  },
  {
    id: 'rev-005',
    productId: 'prod-008',
    userName: 'Anika P.',
    userAvatar: 'https://randomuser.me/api/portraits/women/68.jpg',
    skinType: 'Combination',
    skinConcern: 'Sun Protection',
    rating: 5,
    title: 'Zero white cast on medium skin!',
    comment: 'Finding a clean, vegan SPF that does not leave a white residue was impossible until AuraGlow SPF 50. Super fluid, non-greasy, and smells subtle.',
    verified: true,
    recommend: true,
    helpfulVotes: 18,
    createdAt: '2026-08-15T18:00:00Z',
  },
  {
    id: 'rev-006',
    productId: 'prod-005',
    userName: 'Leila M.',
    userAvatar: 'https://randomuser.me/api/portraits/women/55.jpg',
    skinType: 'Sensitive',
    skinConcern: 'Acne & Breakouts',
    rating: 5,
    title: 'Calming green tea cleanse',
    comment: 'Gently cleanses excess oil without stripping the moisture barrier. Reduced my redness in 1 week.',
    verified: true,
    recommend: true,
    helpfulVotes: 11,
    createdAt: '2026-08-01T10:00:00Z',
  },
];

/**
 * Fetch reviews for a specific product with filtering and sorting
 */
export async function getProductReviews(productId, params = {}) {
  const query = new URLSearchParams();
  if (params.star) query.append('star', params.star);
  if (params.skinType) query.append('skinType', params.skinType);
  if (params.verifiedOnly) query.append('verifiedOnly', 'true');
  if (params.sort) query.append('sort', params.sort);
  if (params.page) query.append('page', params.page);

  const res = await fetch(`${API_BASE}/reviews/product/${productId}?${query.toString()}`);
  const data = await res.json().catch(() => null);
  if (!res.ok || !data?.success || !Array.isArray(data.reviews)) {
    throw new Error(data?.message || 'Could not load product reviews.');
  }
  return data;
}

/**
 * Fetch review aggregate stats (average, breakdown, recommend %)
 */
export async function getReviewStats(productId) {
  const res = await fetch(`${API_BASE}/reviews/stats/${productId}`);
  const data = await res.json().catch(() => null);
  if (!res.ok || !data?.success || !data.stats) {
    throw new Error(data?.message || 'Could not load review statistics.');
  }
  return data.stats;
}

/**
 * Submit a new customer review
 */
export async function submitReview(reviewData) {
  const token = localStorage.getItem('auraglow_token');
  if (!token) {
    throw new Error('Sign in to submit a review.');
  }

  const payload = {
    productId: reviewData.productId,
    rating: reviewData.rating,
    title: reviewData.title,
    comment: reviewData.comment ?? reviewData.body,
  };

  const res = await fetch(`${API_BASE}/reviews`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => null);
  if (!res.ok || !data?.success || !data.review) {
    throw new Error(data?.message || 'Review could not be saved.');
  }

  memoryReviews.unshift(data.review);
  return data.review;
}

/**
 * Vote review as helpful
 */
export async function voteHelpful(reviewId) {
  try {
    const res = await fetch(`${API_BASE}/reviews/${reviewId}/vote`, {
      method: 'POST',
    });
    if (!res.ok) throw new Error('Vote API failed');
    const data = await res.json();
    return data.helpfulVotes;
  } catch {
    const rev = memoryReviews.find(r => r.id === reviewId);
    if (rev) {
      rev.helpfulVotes = (rev.helpfulVotes || 0) + 1;
      return rev.helpfulVotes;
    }
    return 1;
  }
}
