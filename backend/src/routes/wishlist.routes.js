/**
 * =============================================================================
 *  AuraGlow — Wishlist Routes (backend/src/routes/wishlist.routes.js)
 *  Module 3: Shopping Cart & Wishlist (Achani)
 * =============================================================================
 */

const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/wishlist.controller');

router.get('/', wishlistController.getWishlist);
router.post('/toggle', wishlistController.toggleWishlist);

module.exports = router;
