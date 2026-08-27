/**
 * =============================================================================
 *  AuraGlow — Wishlist Controller (backend/src/controllers/wishlist.controller.js)
 *  Module 3: Shopping Cart & Wishlist (Achani)
 * =============================================================================
 */

let initialWishlists = {}; // Memory storage: userId -> [productIds]

/**
 * GET /api/v1/wishlist
 */
exports.getWishlist = async (req, res, next) => {
  try {
    const userId = req.user?.id || 'guest-session';
    const items = initialWishlists[userId] || [];
    res.json({
      success: true,
      items,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/v1/wishlist/toggle
 */
exports.toggleWishlist = async (req, res, next) => {
  try {
    const userId = req.user?.id || 'guest-session';
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ success: false, message: 'Product ID is required.' });
    }

    if (!initialWishlists[userId]) {
      initialWishlists[userId] = [];
    }

    const wishlist = initialWishlists[userId];
    const index = wishlist.indexOf(productId);

    if (index > -1) {
      // Remove
      wishlist.splice(index, 1);
    } else {
      // Add
      wishlist.push(productId);
    }

    res.json({
      success: true,
      items: wishlist,
    });
  } catch (error) {
    next(error);
  }
};
