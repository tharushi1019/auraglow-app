/**
 * =============================================================================
 *  AuraGlow — AI Routes (backend/src/routes/ai.routes.js)
 * =============================================================================
 */

const express = require('express');
const router = express.Router();
const aiController = require('../controllers/ai.controller');

// POST /api/v1/ai/routine — Generate routine based on skin profile
router.post('/routine', aiController.getRoutine);

// POST /api/v1/ai/consult — AI Dermatologist consultation chat
router.post('/consult', aiController.consult);

module.exports = router;
