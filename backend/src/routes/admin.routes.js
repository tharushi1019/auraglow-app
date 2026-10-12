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

// All admin endpoints require a valid authenticated admin account.
router.get('/analytics', authenticate, authorizeAdmin, adminController.getAnalytics);
router.get('/orders', authenticate, authorizeAdmin, adminController.getAdminOrders);
router.get('/products', authenticate, authorizeAdmin, adminController.getAdminProducts);

// Write operations — require admin JWT
router.post('/products', authenticate, authorizeAdmin, adminController.createProduct);
router.put('/products/:id', authenticate, authorizeAdmin, adminController.updateProduct);
router.delete('/products/:id', authenticate, authorizeAdmin, adminController.deleteProduct);
router.patch('/orders/:id/status', authenticate, authorizeAdmin, adminController.updateOrderStatus);

module.exports = router;

