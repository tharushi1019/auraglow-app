/**
 * =============================================================================
 *  AuraGlow — Checkout Routes (backend/src/routes/checkout.routes.js)
 *  Module 5: Checkout, Payment & Order Tracking (Kaveesha)
 * =============================================================================
 */

const express = require('express');
const router = express.Router();
const checkoutController = require('../controllers/checkout.controller');

// POST /api/v1/checkout — Place a new order
router.post('/', checkoutController.createOrder);

// GET /api/v1/orders — List all orders
router.get('/orders', checkoutController.getOrders);

// GET /api/v1/orders/:orderId — Get specific order + tracking
router.get('/orders/:orderId', checkoutController.getOrderById);

module.exports = router;
