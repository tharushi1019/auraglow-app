/**
 * =============================================================================
 *  AuraGlow — Recommendation Service (frontend/src/services/recommendationService.js)
 *  Module 4: Reviews & Recommendations (Maduni)
 * =============================================================================
 */

import { products } from '@/data/mockData';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api/v1';

const routinePresets = {
  Dry: {
    title: 'Intense Deep Hydration & Barrier Fortification',
    description: 'A deeply replenishing routine designed to quench parched skin cells, prevent trans-epidermal water loss, and restore healthy lipid elasticity.',
    matchScore: 98,
    am: [
      { step: 1, stepName: 'Gentle Cleanse', productId: 'prod-005', note: 'Leaves natural lipid barrier undisturbed.' },
      { step: 2, stepName: 'Vitamin C & Tone', productId: 'prod-001', note: 'Brightens and floods with antioxidants.' },
      { step: 3, stepName: '72h Moisture Lock', productId: 'prod-003', note: 'Hyaluronic & botanical squalane matrix.' },
      { step: 4, stepName: 'Broad-Spectrum UV', productId: 'prod-008', note: 'Invisible daily sunscreen protection.' },
    ],
    pm: [
      { step: 1, stepName: 'Deep Melt Cleanse', productId: 'prod-005', note: 'Removes daily impurities and pollution.' },
      { step: 2, stepName: 'Cellular Restoration', productId: 'prod-001', note: 'Rose Hip Oil repair complex.' },
      { step: 3, stepName: 'Overnight Barrier Mask', productId: 'prod-003', note: 'Wake up to supple, glowing skin.' },
    ],
    keyActives: ['Hyaluronic Acid', 'Rose Hip Oil', 'Ceramides', 'Vitamin C'],
  },
  Oily: {
    title: 'Sebum Balancing & Pore Refining Protocol',
    description: 'A clarifying regimen powered by Green Tea polyphenols and Niacinamide to decongest pores and restore clean equilibrium without stripping.',
    matchScore: 96,
    am: [
      { step: 1, stepName: 'Purifying Foam', productId: 'prod-005', note: 'Antioxidant green tea foam.' },
      { step: 2, stepName: 'Blemish & Tone Serum', productId: 'prod-001', note: 'Niacinamide balances sebum output.' },
      { step: 3, stepName: 'Weightless SPF 50', productId: 'prod-008', note: 'Matte fluid finish, zero shine.' },
    ],
    pm: [
      { step: 1, stepName: 'Purifying Cleanse', productId: 'prod-005', note: 'Thoroughly washes away excess sebum.' },
      { step: 2, stepName: 'Clarifying Treatment', productId: 'prod-001', note: 'Evens tone and refines texture.' },
    ],
    keyActives: ['Green Tea Extract', 'Niacinamide', 'Zinc Oxide', 'Salicylic Acid'],
  },
  Combination: {
    title: 'Dual-Action Balance & Radiance Regimen',
    description: 'Targeted botanical formulation delivering deep hydration to dry cheeks while minimizing sheen in the T-zone.',
    matchScore: 97,
    am: [
      { step: 1, stepName: 'Balancing Cleanse', productId: 'prod-005', note: 'Clean surface without tightening.' },
      { step: 2, stepName: 'Radiant Glow Serum', productId: 'prod-001', note: 'Unified cellular tone.' },
      { step: 3, stepName: 'Hydra Cloud Cream', productId: 'prod-003', note: 'Lightweight peptide moisture.' },
      { step: 4, stepName: 'Invisible SPF 50', productId: 'prod-008', note: 'Non-comedogenic daily shield.' },
    ],
    pm: [
      { step: 1, stepName: 'Refresh Cleanse', productId: 'prod-005', note: 'Cleanses pollutants.' },
      { step: 2, stepName: 'Overnight Serum', productId: 'prod-001', note: 'Targeted hydration.' },
      { step: 3, stepName: 'Hydra Cloud Cream', productId: 'prod-003', note: 'Softens dry patches.' },
    ],
    keyActives: ['Hyaluronic Acid', 'Vitamin C', 'Green Tea Extract', 'Centella'],
  },
  Sensitive: {
    title: 'Calming Barrier Rescue & Soothing Routine',
    description: 'Ultra-gentle, fragrance-free formula with Centella Asiatica and Petal Extracts to calm hyper-reactive skin and fortify immunity.',
    matchScore: 99,
    am: [
      { step: 1, stepName: 'Gentle Calming Cleanse', productId: 'prod-005', note: 'Soothing Aloe & Green Tea.' },
      { step: 2, stepName: 'Barrier Comfort Cream', productId: 'prod-003', note: 'Ceramide infusion.' },
      { step: 3, stepName: 'Mineral SPF 50', productId: 'prod-008', note: 'Gentle on sensitized skin.' },
    ],
    pm: [
      { step: 1, stepName: 'Gentle Cleanse', productId: 'prod-005', note: 'Non-stripping cleansing.' },
      { step: 2, stepName: 'Barrier Comfort Cream', productId: 'prod-003', note: 'Overnight redness recovery.' },
    ],
    keyActives: ['Ceramides', 'Centella Asiatica', 'Zinc Oxide', 'Rose Petal Extract'],
  },
};

/**
 * Get tailored routine based on skin profile
 */
export async function getRoutineBySkinProfile(skinType = 'Combination', concern = 'Dullness') {
  try {
    const res = await fetch(`${API_BASE}/recommendations/skin-profile?skinType=${skinType}&concern=${encodeURIComponent(concern)}`);
    if (!res.ok) throw new Error('Recommendation API failed');
    const data = await res.json();
    if (data && data.success && data.routine) {
      return enrichRoutineWithProducts(data.routine);
    }
    throw new Error('Fallback needed');
  } catch {
    const matched = routinePresets[skinType] || routinePresets.Combination;
    return enrichRoutineWithProducts(matched);
  }
}

/**
 * Calculate compatibility match score between a product and a user skin profile
 */
export function calculateSkinMatchScore(product, userSkinType = 'Dry') {
  if (!product) return 92;
  const matchFactors = {
    'prod-001': { Dry: 98, Combination: 96, Normal: 95, Sensitive: 91, Oily: 94 },
    'prod-002': { Dry: 90, Combination: 95, Normal: 96, Sensitive: 92, Oily: 95 },
    'prod-003': { Dry: 99, Sensitive: 98, Combination: 94, Normal: 96, Oily: 84 },
    'prod-004': { Dry: 92, Combination: 94, Normal: 95, Sensitive: 93, Oily: 93 },
    'prod-005': { Oily: 99, Combination: 97, Sensitive: 95, Dry: 91, Normal: 96 },
    'prod-006': { Dry: 95, Combination: 95, Normal: 95, Sensitive: 92, Oily: 95 },
    'prod-007': { Dry: 97, Combination: 97, Normal: 97, Sensitive: 97, Oily: 97 },
    'prod-008': { Dry: 97, Sensitive: 98, Oily: 96, Combination: 98, Normal: 98 },
  };

  const productScores = matchFactors[product.id];
  if (productScores && productScores[userSkinType]) {
    return productScores[userSkinType];
  }
  return 95;
}

/**
 * Helper to link actual product objects to routine step items
 */
function enrichRoutineWithProducts(routine) {
  const enrichSteps = (steps) => {
    return (steps || []).map(step => {
      const prod = products.find(p => p.id === step.productId || p.id === step.id) || products[0];
      return {
        ...step,
        product: prod,
      };
    });
  };

  return {
    ...routine,
    am: enrichSteps(routine.am),
    pm: enrichSteps(routine.pm),
  };
}
