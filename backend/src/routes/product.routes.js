/**
 * =============================================================================
 *  AuraGlow — Product Routes (backend/src/routes/product.routes.js)
 *  Module 2: Product Catalog & Search (Keshara)
 * =============================================================================
 */

const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');

// Category metadata
router.get('/categories', productController.getCategories);

// Featured / Trending products
router.get('/featured', productController.getFeaturedProducts);

// Catalog list with multi-parameter filtering, search, and sorting
router.get('/', productController.getProducts);

// Single product details
router.get('/:id', productController.getProductById);

// Related products
router.get('/:id/related', productController.getRelatedProducts);

module.exports = router;
