/**
 * =============================================================================
 *  AuraGlow — Dynamic Recommendation Service (100% Live DB Integration)
 *  Module 4: Reviews & Recommendations
 *  Matches products dynamically based on user quiz skin profile,
 *  complexion tone, undertone, skin type, and allergen avoidance.
 * =============================================================================
 */

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

// Cache for live products fetched from database
let cachedCatalog = null;

async function getLiveCatalog(passedCatalog = null) {
  if (Array.isArray(passedCatalog) && passedCatalog.length > 0) {
    return passedCatalog;
  }
  if (cachedCatalog && cachedCatalog.length > 0) {
    return cachedCatalog;
  }
  try {
    const res = await fetch(`${API_BASE}/products?limit=100`);
    if (res.ok) {
      const data = await res.json();
      if (data && Array.isArray(data.products) && data.products.length > 0) {
        cachedCatalog = data.products;
        return cachedCatalog;
      }
    }
  } catch (err) {
    console.warn('[recommendationService] Could not prefetch catalog:', err.message);
  }
  return cachedCatalog || [];
}

const routinePresets = {
  Dry: {
    title: 'Intense Hydro-Lipid & Ceramide Barrier Fortification',
    description: 'A deeply replenishing routine formulated with colloidal oatmeal, 5 bio-identical ceramides, and multi-depth hyaluronic acid to stop trans-epidermal moisture loss.',
    matchScore: 99,
    am: [
      { step: 1, stepName: 'Oat Milk Soothing Cleanse', keyword: 'Cleanser', note: 'Non-stripping colloidal oatmeal cushion.' },
      { step: 2, stepName: 'Radiant Glow Serum', keyword: 'Serum', note: 'Stabilized Vitamin C & Rose Hip Oil antioxidant flood.' },
      { step: 3, stepName: 'Ceramide Barrier Balm', keyword: 'Ceramide', note: 'Locks in cellular lipids for 72-hour suppleness.' },
      { step: 4, stepName: 'Invisible Shield SPF 50', keyword: 'SPF', note: 'Broad-spectrum hydration shield, zero white cast.' },
    ],
    pm: [
      { step: 1, stepName: 'Oat Milk Gentle Cleanse', keyword: 'Cleanser', note: 'Melt away daily pollutants without dryness.' },
      { step: 2, stepName: 'Bakuchiol Firming Elixir', keyword: 'Bakuchiol', note: 'Plant-based peptide repair without retinol irritation.' },
      { step: 3, stepName: 'Ceramide Barrier Balm', keyword: 'Barrier', note: 'Overnight lipid matrix restoration.' },
    ],
    keyActives: ['Ceramides NP/AP/EOP', 'Colloidal Oatmeal', 'Rose Hip Oil', 'Bakuchiol'],
  },
  Oily: {
    title: 'Sebum Clarifying & Micro-Pore Refining Protocol',
    description: 'A high-potency balancing regimen powered by 2% BHA Salicylic Acid, 10% Niacinamide, and Zinc PCA to regulate sebum and clear pore congestion without stripping.',
    matchScore: 98,
    am: [
      { step: 1, stepName: 'Green Tea Purifying Foam', keyword: 'Cleanser', note: 'Antioxidant EGCG washes away excess sebum.' },
      { step: 2, stepName: 'Niacinamide 10% + Zinc', keyword: 'Niacinamide', note: 'Clinically minimizes pore diameter & regulates shine.' },
      { step: 3, stepName: 'Weightless SPF 50 Fluid', keyword: 'SPF', note: 'Ultra-light invisible finish, zero greasiness.' },
    ],
    pm: [
      { step: 1, stepName: 'Green Tea Purifying Cleanse', keyword: 'Cleanse', note: 'Thoroughly decongests pores of daily grime.' },
      { step: 2, stepName: 'BHA 2% Salicylic Exfoliant', keyword: 'Salicylic', note: 'Dissolves inside pore linings to banish blackheads.' },
      { step: 3, stepName: 'Niacinamide Pore Serum', keyword: 'Niacinamide', note: 'Overnight cellular clarity & blemish prevention.' },
    ],
    keyActives: ['Salicylic Acid 2%', 'Niacinamide 10%', 'Zinc PCA', 'Green Tea Polyphenols'],
  },
  Combination: {
    title: 'Dual-Zone Harmony & Radiance Balancing Regimen',
    description: 'Precision clean formulations delivering weightless hydration to parched cheeks while neutralizing shine and congestion in the T-zone.',
    matchScore: 97,
    am: [
      { step: 1, stepName: 'Green Tea Cleansing Foam', keyword: 'Cleanser', note: 'Gentle surface refresh preserving natural lipids.' },
      { step: 2, stepName: 'Radiant Glow Serum', keyword: 'Serum', note: 'Even tone and cellular antioxidant defense.' },
      { step: 3, stepName: 'Petal Hydra Cream', keyword: 'Cream', note: 'Weightless peptide cloud hydration.' },
      { step: 4, stepName: 'Invisible Shield SPF 50', keyword: 'SPF', note: 'Non-comedogenic broad-spectrum UV protection.' },
    ],
    pm: [
      { step: 1, stepName: 'Green Tea Cleansing Foam', keyword: 'Cleanser', note: 'Rinses clean with no tight residue.' },
      { step: 2, stepName: 'Niacinamide 10% Serum', keyword: 'Niacinamide', note: 'Balances T-zone sebum secretion.' },
      { step: 3, stepName: 'Petal Hydra Cream', keyword: 'Cream', note: 'Soothes dry perimeter patches.' },
    ],
    keyActives: ['Niacinamide', 'Hyaluronic Acid', 'Vitamin C', 'Green Tea Extract'],
  },
  Sensitive: {
    title: 'Neuro-Sensory Calming & Cica Barrier Rescue',
    description: 'Ultra-gentle, 100% fragrance-free formulas loaded with 70% Centella Asiatica, Madecassoside, and Colloidal Oat to suppress flushing and calm sensitized reactivity.',
    matchScore: 99,
    am: [
      { step: 1, stepName: 'Oat Milk Soothing Cleanse', keyword: 'Oat', note: 'Soap-free, hypoallergenic cream wash.' },
      { step: 2, stepName: 'Centella Cica Calming Cream', keyword: 'Cica', note: 'Instant relief from facial flushing & burning.' },
      { step: 3, stepName: 'Mineral SPF 50 Fluid', keyword: 'SPF', note: 'Non-nano Zinc Oxide shield gentle on sensitized skin.' },
    ],
    pm: [
      { step: 1, stepName: 'Oat Milk Soothing Cleanse', keyword: 'Oat', note: 'Melt impurities with zero friction or redness.' },
      { step: 2, stepName: 'Centella Cica Calming Cream', keyword: 'Cica', note: 'Overnight barrier rebuilding & redness recovery.' },
    ],
    keyActives: ['Centella Asiatica 70%', 'Madecassoside', 'Colloidal Oatmeal', 'Zinc Oxide'],
  },
  Normal: {
    title: 'Bio-Vitality Radiance & Environmental Shield Protocol',
    description: 'Antioxidant-dense botanical synergy formulated to preserve peak barrier function and impart an all-day, illuminated glass-skin glow.',
    matchScore: 98,
    am: [
      { step: 1, stepName: 'Botanical Gentle Cleanse', keyword: 'Cleanser', note: 'Refreshes and clears night cellular debris.' },
      { step: 2, stepName: 'Radiant Glow Serum', keyword: 'Serum', note: '15% Vitamin C collagen synthesis booster.' },
      { step: 3, stepName: 'Petal Hydra Cream', keyword: 'Cream', note: 'Multi-molecular hyaluronic bounce.' },
      { step: 4, stepName: 'Invisible Shield SPF 50', keyword: 'SPF', note: 'Daily UVA/UVB & pollution defense.' },
    ],
    pm: [
      { step: 1, stepName: 'Botanical Cleansing Foam', keyword: 'Cleanser', note: 'Removes daily particulate matter.' },
      { step: 2, stepName: 'Bakuchiol Firming Elixir', keyword: 'Bakuchiol', note: 'Overnight cellular elasticity renewal.' },
      { step: 3, stepName: 'Petal Hydra Cream', keyword: 'Cream', note: 'Deep nighttime lipid hydration.' },
    ],
    keyActives: ['Vitamin C 15%', 'Bakuchiol 2%', 'Peptides', 'Squalane'],
  },
};

/**
 * Match an actual product object from catalog to a routine step
 */
function findBestProductMatch(catalog, step) {
  if (!catalog || catalog.length === 0) return null;

  // 1. Direct ID match
  if (step.productId || step.id) {
    const targetId = step.productId || step.id;
    const matchById = catalog.find(p => 
      p.id === targetId || 
      (typeof p.id === 'string' && targetId && p.id.toLowerCase().endsWith(targetId.replace('prod-', '').toLowerCase()))
    );
    if (matchById) return matchById;
  }

  // 2. Keyword or name match
  const kw = (step.keyword || step.stepName || '').toLowerCase();
  const nameMatch = catalog.find(p => p.name && p.name.toLowerCase().includes(kw));
  if (nameMatch) return nameMatch;

  // 3. Category match
  const catMatch = catalog.find(p => p.category && p.category.toLowerCase().includes(kw));
  if (catMatch) return catMatch;

  return catalog[0];
}

/**
 * Link real catalog products to routine step items
 */
function enrichRoutineWithProducts(routine, catalog = []) {
  const enrichSteps = (steps) => {
    return (steps || []).map(step => {
      const prod = findBestProductMatch(catalog, step);
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
 * Get tailored routine based on skin profile — calls backend AI Service (Google Gemini / Clinical Diagnostic)
 */
export async function getRoutineBySkinProfile(skinType = 'Combination', concern = 'Dullness', fullProfile = null, catalog = null) {
  const liveCatalog = await getLiveCatalog(catalog);

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
          ...enrichRoutineWithProducts(data.routine, liveCatalog),
          isRealAI: data.isRealAI,
          model: data.model,
          notice: data.notice,
        };
      }
    }
  } catch (err) {
    console.warn('⚠️ [recommendationService] AI backend request note, using fallback preset:', err.message);
  }

  // Fallback to local clinical preset
  const matched = routinePresets[skinType] || routinePresets.Combination;
  return {
    ...enrichRoutineWithProducts(matched, liveCatalog),
    isRealAI: false,
    model: 'AuraGlow Clinical Presets',
  };
}

/**
 * Calculate dynamic compatibility match score between a product and a user skin profile
 */
export function calculateSkinMatchScore(product, userSkinType = 'Combination', userProfile = null) {
  if (!product) return 90;

  let baseScore = 75;

  // 1. Skin type match evaluation
  const targetType = (userSkinType || 'Combination').toLowerCase();
  const compatibleTypes = (product.skinTypes || product.skin_types_compatible || []).map(t => String(t).toLowerCase());

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

  // 3. User concerns match
  if (userProfile && userProfile.concerns && Array.isArray(userProfile.concerns)) {
    const productConcerns = (product.concerns_addressed || product.tags || []).map(c => String(c).toLowerCase());
    const matchedConcerns = userProfile.concerns.filter(c => 
      productConcerns.some(pc => pc.includes(String(c).toLowerCase()))
    );
    baseScore += Math.min(matchedConcerns.length * 3, 9);
  }

  // 4. Allergen penalty check
  if (userProfile && userProfile.allergens && Array.isArray(userProfile.allergens)) {
    const productIngredients = (product.ingredients || []).map(i => String(i).toLowerCase());
    const hasAllergen = userProfile.allergens.some(a => 
      a !== 'None' && productIngredients.some(ing => ing.includes(String(a).toLowerCase()))
    );
    if (hasAllergen) {
      baseScore -= 25;
    }
  }

  // Cap between 60% and 99%
  return Math.max(60, Math.min(99, Math.round(baseScore)));
}

/**
 * Match complexion cosmetics (foundation, skin tint, concealer, blush, lip oil)
 * based on the user's skin quiz tone and undertone from the real catalog.
 */
export function getMatchingCosmetics(userProfile = {}, catalog = []) {
  const tone = (userProfile?.skin_tone || userProfile?.skinTone || 'medium').toLowerCase();
  const undertone = (userProfile?.undertone || 'warm').toLowerCase();

  const productList = Array.isArray(catalog) && catalog.length > 0 ? catalog : (cachedCatalog || []);

  const findProductBySearch = (terms) => {
    return productList.find(p => {
      const name = (p.name || '').toLowerCase();
      const desc = (p.description || '').toLowerCase();
      return terms.some(t => name.includes(t) || desc.includes(t));
    }) || null;
  };

  const foundation = findProductBySearch(['foundation', 'silk serum']) || productList[0] || null;
  let matchedFoundationShade = null;
  if (foundation && Array.isArray(foundation.shades) && foundation.shades.length > 0) {
    matchedFoundationShade = foundation.shades.find(s => 
      s.tone?.toLowerCase() === tone && s.undertone?.toLowerCase() === undertone
    ) || foundation.shades.find(s => s.tone?.toLowerCase() === tone) || foundation.shades[0];
  }

  const concealer = findProductBySearch(['concealer', 'creaseless']) || null;
  let matchedConcealerShade = null;
  if (concealer && Array.isArray(concealer.shades) && concealer.shades.length > 0) {
    matchedConcealerShade = concealer.shades.find(s => 
      s.tone?.toLowerCase() === tone && s.undertone?.toLowerCase() === undertone
    ) || concealer.shades.find(s => s.tone?.toLowerCase() === tone) || concealer.shades[0];
  }

  const skinTint = findProductBySearch(['skin tint', 'radiant glow skin tint', 'tint']) || null;
  let matchedSkinTintShade = null;
  if (skinTint && Array.isArray(skinTint.shades) && skinTint.shades.length > 0) {
    matchedSkinTintShade = skinTint.shades.find(s => s.tone?.toLowerCase() === tone) || skinTint.shades[0];
  }

  const blush = findProductBySearch(['blush', 'petal dew', 'cheek']) || null;
  let matchedBlushShade = null;
  if (blush && Array.isArray(blush.shades) && blush.shades.length > 0) {
    matchedBlushShade = blush.shades.find(s => s.undertone?.toLowerCase() === undertone) || blush.shades[0];
  }

  const lipOil = findProductBySearch(['lip oil', 'peptide glaze', 'lip']) || null;

  return {
    foundation: { product: foundation, shade: matchedFoundationShade },
    concealer: { product: concealer, shade: matchedConcealerShade },
    skinTint: { product: skinTint, shade: matchedSkinTintShade },
    blush: { product: blush, shade: matchedBlushShade },
    lipOil: { product: lipOil, shade: lipOil?.shades?.[0] || null },
  };
}
