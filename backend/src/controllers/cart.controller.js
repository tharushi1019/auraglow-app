/**
 * =============================================================================
 *  AuraGlow — Cart Controller (backend/src/controllers/cart.controller.js)
 *  Module 3: Shopping Cart & Wishlist (Achani)
 * =============================================================================
 */

let initialCarts = {}; // Memory storage: userId -> [cartItems]

/**
 * GET /api/v1/cart
 */
exports.getCart = async (req, res, next) => {
  try {
    const userId = req.user?.id || 'guest-session';
    const items = initialCarts[userId] || [];
    res.json({
      success: true,
      items,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/v1/cart
 * Add/update item quantity
 */
exports.addToCart = async (req, res, next) => {
  try {
    const userId = req.user?.id || 'guest-session';
    const { productId, quantity = 1, price } = req.body;

    if (!productId) {
      return res.status(400).json({ success: false, message: 'Product ID is required.' });
    }

    if (!initialCarts[userId]) {
      initialCarts[userId] = [];
    }

    const cart = initialCarts[userId];
    const existingIndex = cart.findIndex(item => item.productId === productId);

    if (existingIndex > -1) {
      cart[existingIndex].quantity = Number(quantity);
    } else {
      cart.push({
        productId,
        quantity: Number(quantity),
        price: Number(price || 0),
        addedAt: new Date().toISOString(),
      });
    }

    res.json({
      success: true,
      items: cart,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/v1/cart/:productId
 */
exports.removeFromCart = async (req, res, next) => {
  try {
    const userId = req.user?.id || 'guest-session';
    const { productId } = req.params;

    if (!initialCarts[userId]) {
      initialCarts[userId] = [];
    }

    initialCarts[userId] = initialCarts[userId].filter(item => item.productId !== productId);

    res.json({
      success: true,
      items: initialCarts[userId],
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/v1/cart/clear
 */
exports.clearCart = async (req, res, next) => {
  try {
    const userId = req.user?.id || 'guest-session';
    initialCarts[userId] = [];
    res.json({
      success: true,
      message: 'Cart cleared successfully',
      items: [],
    });
  } catch (error) {
    next(error);
  }
};
