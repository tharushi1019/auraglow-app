/**
 * =============================================================================
 *  AuraGlow — Admin Routes (backend/src/routes/admin.routes.js)
 *  Module 6: Admin Dashboard (Tharushi)
 * =============================================================================
 */

const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { authenticate, authorizeAdmin } = require('../middleware/auth.middleware');

// GET endpoints — readable without auth for demo purposes
router.get('/analytics', adminController.getAnalytics);
router.get('/products', adminController.getAdminProducts);

// Write operations — require admin JWT
router.post('/products', authenticate, authorizeAdmin, adminController.createProduct);
router.patch('/orders/:id/status', authenticate, authorizeAdmin, adminController.updateOrderStatus);

module.exports = router;

