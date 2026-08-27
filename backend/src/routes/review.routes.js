/**
 * =============================================================================
 *  AuraGlow — Review & Recommendation Routes (backend/src/routes/review.routes.js)
 *  Module 4: Reviews & Recommendations (Maduni)
 * =============================================================================
 */

const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/review.controller');

// Reviews endpoints
router.get('/product/:productId', reviewController.getProductReviews);
router.get('/stats/:productId', reviewController.getReviewStats);
router.post('/', reviewController.createReview);
router.post('/:id/vote', reviewController.voteHelpful);

// Recommendation endpoints
router.get('/recommendations/skin-profile', reviewController.getRecommendationsBySkinProfile);

module.exports = router;
