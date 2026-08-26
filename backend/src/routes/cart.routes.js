/**
 * =============================================================================
 *  AuraGlow — Cart Routes (backend/src/routes/cart.routes.js)
 *  Module 3: Shopping Cart & Wishlist (Achani)
 * =============================================================================
 */

const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart.controller');

router.get('/', cartController.getCart);
router.post('/', cartController.addToCart);
router.delete('/:productId', cartController.removeFromCart);
router.post('/clear', cartController.clearCart);

module.exports = router;
