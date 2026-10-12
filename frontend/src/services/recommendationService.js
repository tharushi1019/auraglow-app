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
    title: 'Intense Hydro-Lipid & Ceramide Barrier Fortification',
    description: 'A deeply replenishing routine formulated with colloidal oatmeal, 5 bio-identical ceramides, and multi-depth hyaluronic acid to stop trans-epidermal moisture loss.',
    matchScore: 99,
    am: [
      { step: 1, stepName: 'Oat Milk Soothing Cleanse', productId: 'prod-019', note: 'Non-stripping colloidal oatmeal cushion.' },
      { step: 2, stepName: 'Radiant Glow Serum', productId: 'prod-001', note: 'Stabilized Vitamin C & Rose Hip Oil antioxidant flood.' },
      { step: 3, stepName: 'Ceramide Barrier Balm', productId: 'prod-015', note: 'Locks in cellular lipids for 72-hour suppleness.' },
      { step: 4, stepName: 'Invisible Shield SPF 50', productId: 'prod-008', note: 'Broad-spectrum hydration shield, zero white cast.' },
    ],
    pm: [
      { step: 1, stepName: 'Oat Milk Gentle Cleanse', productId: 'prod-019', note: 'Melt away daily pollutants without dryness.' },
      { step: 2, stepName: 'Bakuchiol Firming Elixir', productId: 'prod-012', note: 'Plant-based peptide repair without retinol irritation.' },
      { step: 3, stepName: 'Ceramide Barrier Balm', productId: 'prod-015', note: 'Overnight lipid matrix restoration.' },
    ],
    keyActives: ['Ceramides NP/AP/EOP', 'Colloidal Oatmeal', 'Rose Hip Oil', 'Bakuchiol'],
  },
  Oily: {
    title: 'Sebum Clarifying & Micro-Pore Refining Protocol',
    description: 'A high-potency balancing regimen powered by 2% BHA Salicylic Acid, 10% Niacinamide, and Zinc PCA to regulate sebum and clear pore congestion without stripping.',
    matchScore: 98,
    am: [
      { step: 1, stepName: 'Green Tea Purifying Foam', productId: 'prod-005', note: 'Antioxidant EGCG washes away excess sebum.' },
      { step: 2, stepName: 'Niacinamide 10% + Zinc', productId: 'prod-010', note: 'Clinically minimizes pore diameter & regulates shine.' },
      { step: 3, stepName: 'Weightless SPF 50 Fluid', productId: 'prod-008', note: 'Ultra-light invisible finish, zero greasiness.' },
    ],
    pm: [
      { step: 1, stepName: 'Green Tea Purifying Cleanse', productId: 'prod-005', note: 'Thoroughly decongests pores of daily grime.' },
      { step: 2, stepName: 'BHA 2% Salicylic Exfoliant', productId: 'prod-013', note: 'Dissolves inside pore linings to banish blackheads.' },
      { step: 3, stepName: 'Niacinamide Pore Serum', productId: 'prod-010', note: 'Overnight cellular clarity & blemish prevention.' },
    ],
    keyActives: ['Salicylic Acid 2%', 'Niacinamide 10%', 'Zinc PCA', 'Green Tea Polyphenols'],
  },
  Combination: {
    title: 'Dual-Zone Harmony & Radiance Balancing Regimen',
    description: 'Precision clean formulations delivering weightless hydration to parched cheeks while neutralizing shine and congestion in the T-zone.',
    matchScore: 97,
    am: [
      { step: 1, stepName: 'Green Tea Cleansing Foam', productId: 'prod-005', note: 'Gentle surface refresh preserving natural lipids.' },
      { step: 2, stepName: 'Radiant Glow Serum', productId: 'prod-001', note: 'Even tone and cellular antioxidant defense.' },
      { step: 3, stepName: 'Petal Hydra Cream', productId: 'prod-003', note: 'Weightless peptide cloud hydration.' },
      { step: 4, stepName: 'Invisible Shield SPF 50', productId: 'prod-008', note: 'Non-comedogenic broad-spectrum UV protection.' },
    ],
    pm: [
      { step: 1, stepName: 'Green Tea Cleansing Foam', productId: 'prod-005', note: 'Rinses clean with no tight residue.' },
      { step: 2, stepName: 'Niacinamide 10% Serum', productId: 'prod-010', note: 'Balances T-zone sebum secretion.' },
      { step: 3, stepName: 'Petal Hydra Cream', productId: 'prod-003', note: 'Soothes dry perimeter patches.' },
    ],
    keyActives: ['Niacinamide', 'Hyaluronic Acid', 'Vitamin C', 'Green Tea Extract'],
  },
  Sensitive: {
    title: 'Neuro-Sensory Calming & Cica Barrier Rescue',
    description: 'Ultra-gentle, 100% fragrance-free formulas loaded with 70% Centella Asiatica, Madecassoside, and Colloidal Oat to suppress flushing and calm sensitized reactivity.',
    matchScore: 99,
    am: [
      { step: 1, stepName: 'Oat Milk Soothing Cleanse', productId: 'prod-019', note: 'Soap-free, hypoallergenic cream wash.' },
      { step: 2, stepName: 'Centella Cica Calming Cream', productId: 'prod-011', note: 'Instant relief from facial flushing & burning.' },
      { step: 3, stepName: 'Mineral SPF 50 Fluid', productId: 'prod-008', note: 'Non-nano Zinc Oxide shield gentle on sensitized skin.' },
    ],
    pm: [
      { step: 1, stepName: 'Oat Milk Soothing Cleanse', productId: 'prod-019', note: 'Melt impurities with zero friction or redness.' },
      { step: 2, stepName: 'Centella Cica Calming Cream', productId: 'prod-011', note: 'Overnight barrier rebuilding & redness recovery.' },
    ],
    keyActives: ['Centella Asiatica 70%', 'Madecassoside', 'Colloidal Oatmeal', 'Zinc Oxide'],
  },
  Normal: {
    title: 'Bio-Vitality Radiance & Environmental Shield Protocol',
    description: 'Antioxidant-dense botanical synergy formulated to preserve peak barrier function and impart an all-day, illuminated glass-skin glow.',
    matchScore: 98,
    am: [
      { step: 1, stepName: 'Botanical Gentle Cleanse', productId: 'prod-005', note: 'Refreshes and clears night cellular debris.' },
      { step: 2, stepName: 'Radiant Glow Serum', productId: 'prod-001', note: '15% Vitamin C collagen synthesis booster.' },
      { step: 3, stepName: 'Petal Hydra Cream', productId: 'prod-003', note: 'Multi-molecular hyaluronic bounce.' },
      { step: 4, stepName: 'Invisible Shield SPF 50', productId: 'prod-008', note: 'Daily UVA/UVB & pollution defense.' },
    ],
    pm: [
      { step: 1, stepName: 'Botanical Cleansing Foam', productId: 'prod-005', note: 'Removes daily particulate matter.' },
      { step: 2, stepName: 'Bakuchiol Firming Elixir', productId: 'prod-012', note: 'Overnight cellular elasticity renewal.' },
      { step: 3, stepName: 'Petal Hydra Cream', productId: 'prod-003', note: 'Deep nighttime lipid hydration.' },
    ],
    keyActives: ['Vitamin C 15%', 'Bakuchiol 2%', 'Peptides', 'Squalane'],
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

/**
 * Match complexion cosmetics (foundation, skin tint, concealer, blush, lip oil)
 * based on the user's skin quiz tone and undertone.
 */
export function getMatchingCosmetics(userProfile = {}) {
  const tone = (userProfile?.skin_tone || userProfile?.skinTone || 'medium').toLowerCase();
  const undertone = (userProfile?.undertone || 'warm').toLowerCase();

  const foundation = products.find(p => p.id === 'prod-009') || products[0];
  let matchedFoundationShade = null;
  if (foundation && Array.isArray(foundation.shades)) {
    matchedFoundationShade = foundation.shades.find(s => 
      s.tone === tone && s.undertone === undertone
    ) || foundation.shades.find(s => s.tone === tone) || foundation.shades[3];
  }

  const concealer = products.find(p => p.id === 'prod-018');
  let matchedConcealerShade = null;
  if (concealer && Array.isArray(concealer.shades)) {
    matchedConcealerShade = concealer.shades.find(s => 
      s.tone === tone && s.undertone === undertone
    ) || concealer.shades.find(s => s.tone === tone) || concealer.shades[2];
  }

  const skinTint = products.find(p => p.id === 'prod-017');
  let matchedSkinTintShade = null;
  if (skinTint && Array.isArray(skinTint.shades)) {
    matchedSkinTintShade = skinTint.shades.find(s => s.tone === tone) || skinTint.shades[2];
  }

  const blush = products.find(p => p.id === 'prod-016');
  let matchedBlushShade = null;
  if (blush && Array.isArray(blush.shades)) {
    matchedBlushShade = blush.shades.find(s => s.undertone === undertone) || blush.shades[0];
  }

  const lipOil = products.find(p => p.id === 'prod-020');

  return {
    foundation: { product: foundation, shade: matchedFoundationShade },
    concealer: { product: concealer, shade: matchedConcealerShade },
    skinTint: { product: skinTint, shade: matchedSkinTintShade },
    blush: { product: blush, shade: matchedBlushShade },
    lipOil: { product: lipOil, shade: lipOil?.shades?.[1] || null },
  };
}
