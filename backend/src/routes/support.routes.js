/**
 * =============================================================================
 *  AuraGlow — Support Routes (backend/src/routes/support.routes.js)
 * =============================================================================
 */

const express = require('express');
const router = express.Router();
const supportController = require('../controllers/support.controller');

router.post('/', supportController.submitInquiry);
router.get('/', supportController.getInquiries);

module.exports = router;
