const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth.middleware');
const {
  register,
  login,
  getProfile,
  submitSkinQuiz,
} = require('../controllers/auth.controller');

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes (need a valid JWT in the Authorization header)
router.get('/me', requireAuth, getProfile);
router.post('/skin-quiz', requireAuth, submitSkinQuiz);

module.exports = router;
