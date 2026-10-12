/**
 * =============================================================================
 *  AuraGlow — Checkout Routes (backend/src/routes/checkout.routes.js)
 *  Module 5: Checkout, Payment & Order Tracking (Kaveesha)
 * =============================================================================
 */

const express = require('express');
const router = express.Router();
const checkoutController = require('../controllers/checkout.controller');
const { authenticate } = require('../middleware/auth.middleware');

// POST /api/v1/checkout/create-payment-intent — Create Stripe PaymentIntent (sandbox)
router.post('/create-payment-intent', checkoutController.createPaymentIntent);

// POST /api/v1/checkout/confirm-payment-intent — Confirm Stripe PaymentIntent (sandbox)
router.post('/confirm-payment-intent', checkoutController.confirmPaymentIntent);

// POST /api/v1/checkout — Place a new order
router.post('/', checkoutController.createOrder);

// GET /api/v1/checkout/orders — List all orders
router.get('/orders', checkoutController.getOrders);

// GET /api/v1/checkout/orders/:orderId — Get specific order + tracking
router.get('/orders/:orderId', checkoutController.getOrderById);
router.patch('/orders/:orderId/cancel', authenticate, checkoutController.cancelOrder);

module.exports = router;
