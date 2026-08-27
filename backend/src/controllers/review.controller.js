/**
 * =============================================================================
 *  AuraGlow — Review & Recommendation Controller (backend/src/controllers/review.controller.js)
 *  Module 4: Reviews & Recommendations (Maduni)
 * =============================================================================
 */

let initialReviews = [
  {
    id: 'rev-001',
    productId: 'prod-001',
    userId: 'usr-1',
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
    votedUsers: [],
    createdAt: '2026-08-10T14:32:00Z',
  },
  {
    id: 'rev-002',
    productId: 'prod-001',
    userId: 'usr-2',
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
    votedUsers: [],
    createdAt: '2026-08-05T09:15:00Z',
  },
  {
    id: 'rev-003',
    productId: 'prod-003',
    userId: 'usr-3',
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
    votedUsers: [],
    createdAt: '2026-07-29T11:20:00Z',
  },
  {
    id: 'rev-004',
    productId: 'prod-002',
    userId: 'usr-1',
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
    votedUsers: [],
    createdAt: '2026-08-12T16:45:00Z',
  },
  {
    id: 'rev-005',
    productId: 'prod-008',
    userId: 'usr-2',
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
    votedUsers: [],
    createdAt: '2026-08-15T18:00:00Z',
  },
  {
    id: 'rev-006',
    productId: 'prod-005',
    userId: 'usr-3',
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
    votedUsers: [],
    createdAt: '2026-08-01T10:00:00Z',
  },
];

/**
 * GET /api/v1/reviews/product/:productId
 */
exports.getProductReviews = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { star, skinType, verifiedOnly, sort = 'recent', page = 1, limit = 10 } = req.query;

    let reviews = initialReviews.filter(r => r.productId === productId);

    // If no reviews found for this specific product, provide sample seeded ones so UI is rich
    if (reviews.length === 0) {
      reviews = [
        {
          id: `rev-sample-${productId}-1`,
          productId,
          userId: 'usr-sample-1',
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
          votedUsers: [],
          createdAt: '2026-08-16T10:30:00Z',
        },
        {
          id: `rev-sample-${productId}-2`,
          productId,
          userId: 'usr-sample-2',
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
          votedUsers: [],
          createdAt: '2026-08-08T12:00:00Z',
        },
      ];
    }

    // Star filter
    if (star && star !== 'all') {
      reviews = reviews.filter(r => r.rating === parseInt(star, 10));
    }

    // Skin type filter
    if (skinType && skinType !== 'all') {
      reviews = reviews.filter(r => r.skinType?.toLowerCase() === skinType.toLowerCase());
    }

    // Verified only filter
    if (verifiedOnly === 'true') {
      reviews = reviews.filter(r => r.verified);
    }

    // Sorting
    switch (sort) {
      case 'highest':
        reviews.sort((a, b) => b.rating - a.rating);
        break;
      case 'lowest':
        reviews.sort((a, b) => a.rating - b.rating);
        break;
      case 'helpful':
        reviews.sort((a, b) => b.helpfulVotes - a.helpfulVotes);
        break;
      case 'recent':
      default:
        reviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
    }

    const total = reviews.length;
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const startIndex = (pageNum - 1) * limitNum;
    const paginated = reviews.slice(startIndex, startIndex + limitNum);

    res.json({
      success: true,
      total,
      count: paginated.length,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum) || 1,
      reviews: paginated,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/v1/reviews/stats/:productId
 */
exports.getReviewStats = async (req, res, next) => {
  try {
    const { productId } = req.params;
    let reviews = initialReviews.filter(r => r.productId === productId);

    if (reviews.length === 0) {
      reviews = [
        { rating: 5, recommend: true },
        { rating: 5, recommend: true },
        { rating: 4, recommend: true },
      ];
    }

    const total = reviews.length;
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    const average = total > 0 ? (sum / total).toFixed(1) : '5.0';

    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    let recommendCount = 0;

    reviews.forEach(r => {
      if (distribution[r.rating] !== undefined) distribution[r.rating]++;
      if (r.recommend) recommendCount++;
    });

    const breakdown = Object.keys(distribution).reverse().map(stars => {
      const count = distribution[stars];
      const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
      return { stars: Number(stars), count, percentage };
    });

    const recommendPercentage = total > 0 ? Math.round((recommendCount / total) * 100) : 96;

    res.json({
      success: true,
      stats: {
        totalReviews: total,
        averageRating: Number(average),
        recommendPercentage,
        breakdown,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/v1/reviews
 */
exports.createReview = async (req, res, next) => {
  try {
    const { productId, rating, title, comment, skinType, skinConcern, recommend = true } = req.body;

    if (!productId || !rating || !comment || comment.trim().length < 10) {
      return res.status(400).json({
        success: false,
        message: 'Product ID, valid star rating (1-5), and a review comment (min 10 chars) are required.',
      });
    }

    const newReview = {
      id: `rev-${Date.now()}`,
      productId,
      userId: req.user?.id || 'usr-guest',
      userName: req.user?.name || 'Verified Customer',
      userAvatar: req.user?.avatar || 'https://randomuser.me/api/portraits/women/17.jpg',
      skinType: skinType || 'Normal / Combination',
      skinConcern: skinConcern || 'General Glow',
      rating: Number(rating),
      title: title || 'Loving this product!',
      comment,
      verified: true,
      recommend: Boolean(recommend),
      helpfulVotes: 0,
      votedUsers: [],
      createdAt: new Date().toISOString(),
    };

    initialReviews.unshift(newReview);

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully 🌸',
      review: newReview,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/v1/reviews/:id/vote
 */
exports.voteHelpful = async (req, res, next) => {
  try {
    const { id } = req.params;
    const review = initialReviews.find(r => r.id === id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found',
      });
    }

    review.helpfulVotes = (review.helpfulVotes || 0) + 1;

    res.json({
      success: true,
      helpfulVotes: review.helpfulVotes,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/v1/recommendations/skin-profile
 */
exports.getRecommendationsBySkinProfile = async (req, res, next) => {
  try {
    const { skinType = 'Combination', concern = 'Dullness & Uneven Tone' } = req.query;

    const routineMap = {
      Dry: {
        am: [
          { step: 1, name: 'Green Tea Cleansing Foam', id: 'prod-005', type: 'Cleanse', icon: '🧴' },
          { step: 2, name: 'Radiant Glow Serum', id: 'prod-001', type: 'Brighten & Treat', icon: '✨' },
          { step: 3, name: 'Petal Hydra Cream', id: 'prod-003', type: 'Deep Hydration', icon: '🌸' },
          { step: 4, name: 'SPF 50 Sunscreen Fluid', id: 'prod-008', type: 'UV Shield', icon: '☀️' },
        ],
        pm: [
          { step: 1, name: 'Green Tea Cleansing Foam', id: 'prod-005', type: 'Double Cleanse', icon: '🧴' },
          { step: 2, name: 'Radiant Glow Serum', id: 'prod-001', type: 'Cellular Repair', icon: '✨' },
          { step: 3, name: 'Petal Hydra Cream', id: 'prod-003', type: 'Overnight Moisture Lock', icon: '🌸' },
        ],
        matchScore: 98,
        reason: 'Formulated with Hyaluronic Acid, Rose Hip Oil, and Botanical Ceramides to quench chronic dryness and fortify moisture barrier.',
      },
      Oily: {
        am: [
          { step: 1, name: 'Green Tea Cleansing Foam', id: 'prod-005', type: 'Deep Pore Cleanse', icon: '🧴' },
          { step: 2, name: 'Radiant Glow Serum', id: 'prod-001', type: 'Niacinamide Balance', icon: '✨' },
          { step: 3, name: 'SPF 50 Sunscreen Fluid', id: 'prod-008', type: 'Invisible Matte UV Shield', icon: '☀️' },
        ],
        pm: [
          { step: 1, name: 'Green Tea Cleansing Foam', id: 'prod-005', type: 'Purifying Cleanse', icon: '🧴' },
          { step: 2, name: 'Radiant Glow Serum', id: 'prod-001', type: 'Sebum Control & Tone', icon: '✨' },
        ],
        matchScore: 96,
        reason: 'Green Tea polyphenols and lightweight Vitamin C balance sebum production without clogging pores.',
      },
      Combination: {
        am: [
          { step: 1, name: 'Green Tea Cleansing Foam', id: 'prod-005', type: 'Gentle Cleanse', icon: '🧴' },
          { step: 2, name: 'Radiant Glow Serum', id: 'prod-001', type: 'Radiance & Balance', icon: '✨' },
          { step: 3, name: 'Petal Hydra Cream', id: 'prod-003', type: 'Light Hydration', icon: '🌸' },
          { step: 4, name: 'SPF 50 Sunscreen Fluid', id: 'prod-008', type: 'Daily Protection', icon: '☀️' },
        ],
        pm: [
          { step: 1, name: 'Green Tea Cleansing Foam', id: 'prod-005', type: 'Purify', icon: '🧴' },
          { step: 2, name: 'Radiant Glow Serum', id: 'prod-001', type: 'Skin Tone Balance', icon: '✨' },
          { step: 3, name: 'Petal Hydra Cream', id: 'prod-003', type: 'Night Hydration', icon: '🌸' },
        ],
        matchScore: 97,
        reason: 'Delivers targeted hydration to dry cheek areas while keeping the T-zone matte and balanced.',
      },
      Sensitive: {
        am: [
          { step: 1, name: 'Green Tea Cleansing Foam', id: 'prod-005', type: 'Calming Cleanse', icon: '🧴' },
          { step: 2, name: 'Petal Hydra Cream', id: 'prod-003', type: 'Barrier Soothe', icon: '🌸' },
          { step: 3, name: 'SPF 50 Sunscreen Fluid', id: 'prod-008', type: 'Physical Mineral UV Shield', icon: '☀️' },
        ],
        pm: [
          { step: 1, name: 'Green Tea Cleansing Foam', id: 'prod-005', type: 'Gentle Cleanse', icon: '🧴' },
          { step: 2, name: 'Petal Hydra Cream', id: 'prod-003', type: 'Overnight Barrier Restore', icon: '🌸' },
        ],
        matchScore: 99,
        reason: '100% fragrance-free, hypoallergenic soothing botanicals with Centella and Ceramides to prevent irritation.',
      },
    };

    const profileData = routineMap[skinType] || routineMap.Combination;

    res.json({
      success: true,
      skinType,
      concern,
      routine: profileData,
    });
  } catch (error) {
    next(error);
  }
};
