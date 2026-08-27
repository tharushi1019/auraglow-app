/**
 * =============================================================================
 *  AuraGlow — Checkout Controller (backend/src/controllers/checkout.controller.js)
 *  Module 5: Checkout, Payment & Order Tracking (Kaveesha)
 * =============================================================================
 */

const crypto = require('crypto');

// In-memory order store (until Supabase is seeded)
const ordersStore = {};

/**
 * POST /api/v1/checkout
 * Validate cart, apply discounts, generate Order ID & save order
 */
exports.createOrder = async (req, res, next) => {
  try {
    const {
      items = [],
      shippingAddress,
      paymentMethod,
      promoCode,
      subtotal,
      discountAmount = 0,
      shippingFee = 0,
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart is empty.' });
    }
    if (!shippingAddress || !shippingAddress.firstName || !shippingAddress.email) {
      return res.status(400).json({ success: false, message: 'Shipping address is required.' });
    }

    // Generate order ID: AG-XXXX-YYYY
    const rand = () => Math.floor(1000 + Math.random() * 9000);
    const orderId = `AG-${rand()}-${rand()}`;

    // Estimated delivery: 3-5 business days
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 5);

    const total = (subtotal || 0) - discountAmount + shippingFee;

    const order = {
      orderId,
      status: 'confirmed',
      placedAt: new Date().toISOString(),
      estimatedDelivery: deliveryDate.toISOString(),
      items,
      shippingAddress,
      paymentMethod: {
        type: paymentMethod?.type || 'card',
        lastFour: paymentMethod?.lastFour || '****',
        brand: paymentMethod?.brand || 'Visa',
      },
      promoCode: promoCode || null,
      subtotal: subtotal || 0,
      discountAmount,
      shippingFee,
      total,
      trackingSteps: [
        { stage: 'Order Confirmed', date: new Date().toISOString(), done: true },
        { stage: 'Processing', date: null, done: false },
        { stage: 'Dispatched', date: null, done: false },
        { stage: 'Out for Delivery', date: null, done: false },
        { stage: 'Delivered', date: null, done: false },
      ],
    };

    ordersStore[orderId] = order;

    res.status(201).json({ success: true, order });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/v1/orders
 * List all orders for current session
 */
exports.getOrders = async (req, res, next) => {
  try {
    const orders = Object.values(ordersStore);
    res.json({ success: true, orders });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/v1/orders/:orderId
 * Get single order details + tracking timeline
 */
exports.getOrderById = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const order = ordersStore[orderId];

    if (!order) {
      // Return a demo order if not found (for demo/test)
      const demoOrder = {
        orderId,
        status: 'processing',
        placedAt: new Date(Date.now() - 86400000).toISOString(),
        estimatedDelivery: new Date(Date.now() + 4 * 86400000).toISOString(),
        items: [],
        shippingAddress: { firstName: 'Demo', lastName: 'Customer', city: 'Colombo', country: 'Sri Lanka' },
        paymentMethod: { type: 'card', lastFour: '4242', brand: 'Visa' },
        total: 12800,
        trackingSteps: [
          { stage: 'Order Confirmed', date: new Date(Date.now() - 86400000).toISOString(), done: true },
          { stage: 'Processing', date: new Date(Date.now() - 43200000).toISOString(), done: true },
          { stage: 'Dispatched', date: null, done: false },
          { stage: 'Out for Delivery', date: null, done: false },
          { stage: 'Delivered', date: null, done: false },
        ],
      };
      return res.json({ success: true, order: demoOrder });
    }

    res.json({ success: true, order });
  } catch (error) {
    next(error);
  }
};
