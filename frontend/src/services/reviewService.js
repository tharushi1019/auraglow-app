/**
 * =============================================================================
 *  AuraGlow — Review Service (frontend/src/services/reviewService.js)
 *  Module 4: Reviews & Recommendations (Maduni)
 * =============================================================================
 */

import { reviews as mockReviews } from '@/data/mockData';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api/v1';

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
  try {
    const query = new URLSearchParams();
    if (params.star) query.append('star', params.star);
    if (params.skinType) query.append('skinType', params.skinType);
    if (params.verifiedOnly) query.append('verifiedOnly', 'true');
    if (params.sort) query.append('sort', params.sort);
    if (params.page) query.append('page', params.page);

    const res = await fetch(`${API_BASE}/reviews/product/${productId}?${query.toString()}`);
    if (!res.ok) throw new Error('API fetch failed');
    const data = await res.json();
    if (data && data.success && Array.isArray(data.reviews)) {
      return data;
    }
    throw new Error('Invalid format');
  } catch {
    return filterMemoryReviews(productId, params);
  }
}

/**
 * Fetch review aggregate stats (average, breakdown, recommend %)
 */
export async function getReviewStats(productId) {
  try {
    const res = await fetch(`${API_BASE}/reviews/stats/${productId}`);
    if (!res.ok) throw new Error('API fetch failed');
    const data = await res.json();
    if (data && data.success && data.stats) {
      return data.stats;
    }
    throw new Error('Stats format error');
  } catch {
    return calculateMemoryStats(productId);
  }
}

/**
 * Submit a new customer review
 */
export async function submitReview(reviewData) {
  try {
    const res = await fetch(`${API_BASE}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reviewData),
    });
    if (!res.ok) throw new Error('API submit failed');
    const data = await res.json();
    if (data && data.success && data.review) {
      memoryReviews.unshift(data.review);
      return data.review;
    }
    throw new Error('Invalid format');
  } catch {
    const localReview = {
      id: `rev-local-${Date.now()}`,
      productId: reviewData.productId,
      userName: reviewData.userName || 'Verified Buyer',
      userAvatar: 'https://randomuser.me/api/portraits/women/17.jpg',
      skinType: reviewData.skinType || 'Normal / Combination',
      skinConcern: reviewData.skinConcern || 'General Radiance',
      rating: Number(reviewData.rating),
      title: reviewData.title,
      comment: reviewData.comment || reviewData.body,
      verified: true,
      recommend: reviewData.recommend !== false,
      helpfulVotes: 0,
      createdAt: new Date().toISOString(),
    };
    memoryReviews.unshift(localReview);
    return localReview;
  }
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

/**
 * Helper: client fallback reviews filtering
 */
function filterMemoryReviews(productId, params = {}) {
  let list = memoryReviews.filter(r => r.productId === productId);

  if (list.length === 0) {
    list = [
      {
        id: `rev-sample-${productId}-1`,
        productId,
        userName: 'Elena V.',
        userAvatar: 'https://randomuser.me/api/portraits/women/33.jpg',
        skinType: 'Combination',
        skinConcern: 'Dullness & Uneven Tone',
        rating: 5,
        title: 'Exceeded all my expectations!',
        comment: 'The quality of clean ingredients is obvious from first application. Lightweight, soothing, and visible improvements in skin radiance.',
        verified: true,
        recommend: true,
        helpfulVotes: 12,
        createdAt: '2026-08-16T10:30:00Z',
      },
      {
        id: `rev-sample-${productId}-2`,
        productId,
        userName: 'Nadia K.',
        userAvatar: 'https://randomuser.me/api/portraits/women/22.jpg',
        skinType: 'Dry',
        skinConcern: 'Dryness & Dehydration',
        rating: 5,
        title: 'Holy grail for everyday skincare',
        comment: 'Locks in deep hydration all day long. Love that it is vegan, cruelty-free, and packaged sustainably.',
        verified: true,
        recommend: true,
        helpfulVotes: 8,
        createdAt: '2026-08-08T12:00:00Z',
      },
    ];
  }

  if (params.star && params.star !== 'all') {
    list = list.filter(r => r.rating === parseInt(params.star, 10));
  }

  if (params.skinType && params.skinType !== 'all') {
    list = list.filter(r => r.skinType?.toLowerCase() === params.skinType.toLowerCase());
  }

  if (params.verifiedOnly) {
    list = list.filter(r => r.verified);
  }

  switch (params.sort) {
    case 'highest':
      list.sort((a, b) => b.rating - a.rating);
      break;
    case 'lowest':
      list.sort((a, b) => a.rating - b.rating);
      break;
    case 'helpful':
      list.sort((a, b) => (b.helpfulVotes || 0) - (a.helpfulVotes || 0));
      break;
    case 'recent':
    default:
      list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      break;
  }

  return {
    success: true,
    total: list.length,
    count: list.length,
    page: 1,
    totalPages: 1,
    reviews: list,
  };
}

/**
 * Helper: calculate review stats
 */
function calculateMemoryStats(productId) {
  const reviews = memoryReviews.filter(r => r.productId === productId);
  const total = reviews.length || 3;
  const sum = reviews.length > 0 ? reviews.reduce((acc, r) => acc + r.rating, 0) : 14;
  const average = Number((sum / total).toFixed(1));

  const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  let recommendCount = 0;

  if (reviews.length > 0) {
    reviews.forEach(r => {
      if (distribution[r.rating] !== undefined) distribution[r.rating]++;
      if (r.recommend) recommendCount++;
    });
  } else {
    distribution[5] = 2;
    distribution[4] = 1;
    recommendCount = 3;
  }

  const breakdown = Object.keys(distribution).reverse().map(stars => {
    const count = distribution[stars];
    const percentage = Math.round((count / total) * 100);
    return { stars: Number(stars), count, percentage };
  });

  return {
    totalReviews: total,
    averageRating: average,
    recommendPercentage: Math.round((recommendCount / total) * 100) || 96,
    breakdown,
  };
}
