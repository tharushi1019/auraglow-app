/**
 * =============================================================================
 *  AuraGlow — AI Controller (backend/src/controllers/ai.controller.js)
 * =============================================================================
 */

const { generateAiRoutine, consultAiDermatologist } = require('../services/aiService');

/**
 * POST /api/v1/ai/routine
 * Generate tailored routine based on skin profile
 */
async function getRoutine(req, res, next) {
  try {
    const { skinType, concerns, allergens, skinTone, undertone, userNotes } = req.body;

    const result = await generateAiRoutine({
      skinType: skinType || 'Combination',
      concerns: concerns || [],
      allergens: allergens || [],
      skinTone: skinTone || 'Medium',
      undertone: undertone || 'Warm',
      userNotes: userNotes || '',
    });

    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/v1/ai/consult
 * Interactive question answering for skincare consultation
 */
async function consult(req, res, next) {
  try {
    const { question, message, skinProfile } = req.body;
    const query = (question || message || '').trim();

    if (!query) {
      return res.status(400).json({ success: false, message: 'Question is required.' });
    }

    const result = await consultAiDermatologist({
      question: query,
      skinProfile: skinProfile || {},
    });

    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getRoutine,
  consult,
};
