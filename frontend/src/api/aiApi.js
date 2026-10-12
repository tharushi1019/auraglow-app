/**
 * =============================================================================
 *  AuraGlow — AI Skincare API (frontend/src/api/aiApi.js)
 *  Calls Google Gemini AI backend endpoints for routines & consultations.
 * =============================================================================
 */

import axios from 'axios';

const rawUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
const API_BASE_URL = rawUrl.endsWith('/api/v1') ? rawUrl : `${rawUrl}/api/v1`;

const client = axios.create({ baseURL: API_BASE_URL });

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('auraglow_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

/**
 * Request a personalized AI routine from Google Gemini / Diagnostic engine
 */
export async function fetchAiRoutine(skinProfile, userNotes = '') {
  try {
    const { data } = await client.post('/ai/routine', {
      skinType: skinProfile.skinType || skinProfile.skin_type || 'Combination',
      concerns: skinProfile.concerns || [],
      allergens: skinProfile.allergens || [],
      skinTone: skinProfile.skinTone || skinProfile.skin_tone || 'Medium',
      undertone: skinProfile.undertone || 'Warm',
      userNotes,
    });
    return data;
  } catch (err) {
    console.warn('⚠️ [aiApi] Error calling /ai/routine, falling back to local:', err.message);
    throw err;
  }
}

/**
 * Ask a custom question to the AI Dermatologist
 */
export async function askAiDermatologist(question, skinProfile = {}) {
  try {
    const { data } = await client.post('/ai/consult', {
      question,
      skinProfile: {
        skinType: skinProfile.skinType || skinProfile.skin_type,
        concerns: skinProfile.concerns,
        allergens: skinProfile.allergens,
      },
    });
    return data;
  } catch (err) {
    console.warn('⚠️ [aiApi] Error calling /ai/consult:', err.message);
    throw err;
  }
}

export default {
  fetchAiRoutine,
  askAiDermatologist,
};
