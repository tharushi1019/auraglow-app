/**
 * =============================================================================
 *  AuraGlow — Recommendation Service (frontend/src/services/recommendationService.js)
 *  Module 4: Reviews & Recommendations (Maduni)
 * =============================================================================
 */

import { products } from '@/data/mockData';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

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
/**
 * Get tailored routine based on skin profile — calls backend AI Service (Google Gemini / Clinical Diagnostic)
 */
export async function getRoutineBySkinProfile(skinType = 'Combination', concern = 'Dullness', fullProfile = null) {
  try {
    const payload = {
      skinType: fullProfile?.skin_type || fullProfile?.skinType || skinType,
      concerns: fullProfile?.concerns || (concern ? [concern] : ['Dullness & Uneven Tone']),
      allergens: fullProfile?.allergens || [],
      skinTone: fullProfile?.skin_tone || fullProfile?.skinTone || 'Medium',
      undertone: fullProfile?.undertone || 'Warm',
    };

    const res = await fetch(`${API_BASE}/ai/routine`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      const data = await res.json();
      if (data && data.success && data.routine) {
        return {
          ...enrichRoutineWithProducts(data.routine),
          isRealAI: data.isRealAI,
          model: data.model,
          notice: data.notice,
        };
      }
    }
  } catch (err) {
    console.warn('⚠️ [recommendationService] AI backend request note, using fallback preset:', err.message);
  }

  // Fallback to local preset if network is down
  const matched = routinePresets[skinType] || routinePresets.Combination;
  return {
    ...enrichRoutineWithProducts(matched),
    isRealAI: false,
    model: 'AuraGlow Clinical Presets',
  };
}

/**
 * Calculate dynamic compatibility match score between a product and a user skin profile
 */
export function calculateSkinMatchScore(product, userSkinType = 'Combination', userProfile = null) {
  if (!product) return 92;

  let baseScore = 75;

  // 1. Skin type match evaluation
  const targetType = (userSkinType || 'Combination').toLowerCase();
  const compatibleTypes = (product.skinTypes || product.skin_types_compatible || []).map(t => t.toLowerCase());

  if (compatibleTypes.includes('all skin types') || compatibleTypes.includes('all skin tones') || compatibleTypes.length === 0) {
    baseScore += 18;
  } else if (compatibleTypes.some(t => t.includes(targetType))) {
    baseScore += 20;
  } else {
    baseScore += 5;
  }

  // 2. Clean beauty / Botanical bonus
  if (product.isVegan || product.is_vegan) baseScore += 2;
  if (product.isCrueltyFree || product.is_cruelty_free) baseScore += 2;

  // 3. User concerns match (if userProfile concerns available)
  if (userProfile && userProfile.concerns && Array.isArray(userProfile.concerns)) {
    const productConcerns = (product.concerns_addressed || product.tags || []).map(c => c.toLowerCase());
    const matchedConcerns = userProfile.concerns.filter(c => 
      productConcerns.some(pc => pc.includes(c.toLowerCase()))
    );
    baseScore += Math.min(matchedConcerns.length * 3, 9);
  }

  // 4. Allergen penalty check
  if (userProfile && userProfile.allergens && Array.isArray(userProfile.allergens)) {
    const productIngredients = (product.ingredients || []).map(i => i.toLowerCase());
    const hasAllergen = userProfile.allergens.some(a => 
      a !== 'None' && productIngredients.some(ing => ing.includes(a.toLowerCase()))
    );
    if (hasAllergen) {
      baseScore -= 25;
    }
  }

  // Cap between 60% and 99%
  return Math.max(60, Math.min(99, Math.round(baseScore)));
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

  const rawAm = routine.amRoutine || routine.am || [];
  const rawPm = routine.pmRoutine || routine.pm || [];

  return {
    ...routine,
    description: routine.description || routine.clinicalRationale || '',
    am: enrichSteps(rawAm),
    pm: enrichSteps(rawPm),
  };
}
