/**
 * =============================================================================
 *  AuraGlow — Review & Recommendation Controller (backend/src/controllers/review.controller.js)
 *  Module 4: Reviews & Recommendations (Maduni)
 * =============================================================================
 */

const supabase = require('../config/supabaseClient');
const { resolveProductId } = require('./product.controller');

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function mapDatabaseReview(review) {
  return {
    id: review.id,
    productId: review.product_id,
    userId: review.user_id,
    userName: review.users?.name || 'Verified Customer',
    userAvatar: review.users?.avatar_url || null,
    skinType: undefined,
    skinConcern: undefined,
    rating: Number(review.rating),
    title: review.title || '',
    comment: review.comment,
    verified: Boolean(review.order_id),
    recommend: undefined,
    helpfulVotes: 0,
    votedUsers: [],
    createdAt: review.created_at,
  };
}

function calculateReviewStats(reviews) {
  const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  let sum = 0;

  reviews.forEach(review => {
    const rating = Number(review.rating);
    if (distribution[rating] !== undefined) {
      distribution[rating]++;
      sum += rating;
    }
  });

  const total = reviews.length;
  const breakdown = Object.keys(distribution).map(stars => {
    const count = distribution[stars];
    return {
      stars: Number(stars),
      count,
      percentage: total ? Math.round((count / total) * 100) : 0,
    };
  });

  return {
    totalReviews: total,
    averageRating: total ? Number((sum / total).toFixed(1)) : 0,
    recommendPercentage: null,
    breakdown,
  };
}

let initialReviews = [
  {
    id: 'rev-001',
    productId: 'b2000000-0000-0000-0000-000000000001',
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
    productId: 'b2000000-0000-0000-0000-000000000001',
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
    productId: 'b2000000-0000-0000-0000-000000000003',
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
    productId: 'b2000000-0000-0000-0000-000000000002',
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
    productId: 'b2000000-0000-0000-0000-000000000008',
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
    productId: 'b2000000-0000-0000-0000-000000000005',
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
    const canonicalProductId = resolveProductId(productId);
    const { star, skinType, verifiedOnly, sort = 'recent', page = 1, limit = 10 } = req.query;

    if (!UUID_REGEX.test(canonicalProductId)) {
      return res.status(400).json({ success: false, message: 'A valid product ID is required.' });
    }
    if (!supabase) {
      return res.status(503).json({ success: false, message: 'Review database is unavailable.' });
    }

    const { data: product, error: productError } = await supabase
      .from('products')
      .select('id')
      .eq('id', canonicalProductId)
      .eq('is_active', true)
      .maybeSingle();
    if (productError) {
      return res.status(502).json({ success: false, message: 'Could not verify the product.' });
    }
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    const { data: databaseReviews, error: reviewError } = await supabase
      .from('reviews')
      .select('id, user_id, product_id, order_id, rating, title, comment, created_at, users(name, avatar_url)')
      .eq('product_id', canonicalProductId)
      .order('created_at', { ascending: false });
    if (reviewError) {
      return res.status(502).json({ success: false, message: 'Could not load product reviews.' });
    }

    let reviews = (databaseReviews || []).map(mapDatabaseReview);
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
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 10));
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
    console.error('[Reviews] Database read failed:', error.message);
    res.status(502).json({ success: false, message: 'Could not load product reviews.' });
  }
};

/**
 * GET /api/v1/reviews/stats/:productId
 */
exports.getReviewStats = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const canonicalProductId = resolveProductId(productId);
    if (!UUID_REGEX.test(canonicalProductId)) {
      return res.status(400).json({ success: false, message: 'A valid product ID is required.' });
    }
    if (!supabase) {
      return res.status(503).json({ success: false, message: 'Review database is unavailable.' });
    }

    const { data: product, error: productError } = await supabase
      .from('products')
      .select('id')
      .eq('id', canonicalProductId)
      .eq('is_active', true)
      .maybeSingle();
    if (productError) {
      return res.status(502).json({ success: false, message: 'Could not verify the product.' });
    }
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    const { data: reviews, error: reviewError } = await supabase
      .from('reviews')
      .select('rating')
      .eq('product_id', canonicalProductId);
    if (reviewError) {
      return res.status(502).json({ success: false, message: 'Could not load review statistics.' });
    }

    res.json({
      success: true,
      stats: calculateReviewStats(reviews || []),
    });
  } catch (error) {
    console.error('[Reviews] Database stats read failed:', error.message);
    res.status(502).json({ success: false, message: 'Could not load review statistics.' });
  }
};

/**
 * POST /api/v1/reviews
 */
exports.createReview = async (req, res, next) => {
  try {
    const { productId, rating, title, comment } = req.body || {};
    const canonicalProductId = resolveProductId(productId);
    const numericRating = typeof rating === 'number'
      ? rating
      : (typeof rating === 'string' && rating.trim() ? Number(rating) : NaN);
    const normalizedComment = typeof comment === 'string' ? comment.trim() : '';
    const normalizedTitle = typeof title === 'string' ? title.trim() : '';

    if (!UUID_REGEX.test(canonicalProductId)) {
      return res.status(400).json({
        success: false,
        message: 'A valid product ID is required.',
      });
    }
    if (!Number.isInteger(numericRating) || numericRating < 1 || numericRating > 5) {
      return res.status(400).json({ success: false, message: 'Rating must be an integer from 1 to 5.' });
    }
    if (!normalizedComment || normalizedComment.length < 10 || normalizedTitle.length > 255) {
      return res.status(400).json({
        success: false,
        message: 'A review comment of at least 10 characters and a title of at most 255 characters are required.',
      });
    }

    const authenticatedUserId = req.user?.id;
    if (!UUID_REGEX.test(authenticatedUserId || '')) {
      return res.status(401).json({ success: false, message: 'A valid authenticated user is required.' });
    }
    if (!supabase) {
      return res.status(503).json({ success: false, message: 'Review database is unavailable.' });
    }

    const { data: product, error: productError } = await supabase
      .from('products')
      .select('id')
      .eq('id', canonicalProductId)
      .eq('is_active', true)
      .maybeSingle();
    if (productError) {
      return res.status(502).json({ success: false, message: 'Could not verify the product.' });
    }
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    const { data: insertedReview, error: insertError } = await supabase
      .from('reviews')
      .insert([{
        user_id: authenticatedUserId,
        product_id: canonicalProductId,
        rating: numericRating,
        title: normalizedTitle || null,
        comment: normalizedComment,
      }])
      .select('id, user_id, product_id, order_id, rating, title, comment, created_at, users(name, avatar_url)')
      .single();

    if (insertError) {
      if (insertError.code === '23505') {
        return res.status(409).json({ success: false, message: 'You have already reviewed this product.' });
      }
      if (insertError.code === '23503') {
        return res.status(409).json({ success: false, message: 'The product or authenticated user no longer exists.' });
      }
      console.error('[Reviews] Database insert failed:', insertError.message);
      return res.status(502).json({ success: false, message: 'Review could not be saved.' });
    }
    if (!insertedReview) {
      return res.status(502).json({ success: false, message: 'Review was not returned after database insertion.' });
    }

    return res.status(201).json({
      success: true,
      message: 'Review submitted successfully 🌸',
      review: mapDatabaseReview(insertedReview),
    });
  } catch (error) {
    console.error('[Reviews] Database insert failed:', error.message);
    return res.status(502).json({ success: false, message: 'Review could not be saved.' });
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
