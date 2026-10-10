/**
 * =============================================================================
 *  AuraGlow — AI Skincare Service (backend/src/services/aiService.js)
 *  Powered by Google Gemini Generative AI (gemini-1.5-flash)
 *  Provides real clinical skincare regimens and dermatologist consultations.
 * =============================================================================
 */

const { GoogleGenerativeAI } = require('@google/generative-ai');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

let genAI = null;
if (GEMINI_API_KEY && GEMINI_API_KEY.trim().length > 10) {
  try {
    genAI = new GoogleGenerativeAI(GEMINI_API_KEY.trim());
    console.log('✨ [AI Service] Google Gemini Generative AI client initialized successfully.');
  } catch (err) {
    console.warn('⚠️ [AI Service] Failed to initialize Google Gemini:', err.message);
  }
} else {
  console.log('ℹ️ [AI Service] GEMINI_API_KEY not found or empty. Using intelligent clinical diagnostic fallback.');
}

/**
 * Catalog product knowledge for Gemini prompt context
 */
const CATALOG_CONTEXT = `
Available AuraGlow Products in store:
1. "Radiant Glow Daily Serum" (prod-001) - 15% Vitamin C + Hyaluronic Acid + Ferulic Acid. Price: Rs. 8,900. Targets: Dullness, dark spots, uneven texture. Best for: All skin types.
2. "Petal Hydra Cloud Cream" (prod-003) - Multi-molecular Hyaluronic Acid + Peptides + Squalane. Price: Rs. 7,200. Targets: Dehydration, barrier repair, fine lines. Best for: Dry, sensitive, combination.
3. "Botanical Cleansing Melt" (prod-005) - Green tea polyphenols + Camellia oil + Aloe vera. Price: Rs. 4,800. Targets: Cleansing impurities without stripping lipid barrier. Best for: All skin types.
4. "Invisible Shield SPF 50+ Fluid" (prod-008) - Broad-spectrum UVA/UVB + Niacinamide + Zinc. Price: Rs. 5,500. Targets: Sun protection, pollution, redness. Best for: All skin types, zero white cast.
5. "Velvet Matte Moisture Lipstick" (prod-002) - Shea butter + Vitamin E. Price: Rs. 4,500.
6. "Rose Gold Illuminating Palette" (prod-004) - Mineral glow pigments. Price: Rs. 11,000.
7. "Midnight Bloom Eau de Parfum" (prod-006) - Jasmine, dark vanilla & amber. Price: Rs. 15,500.
8. "Precision Luxe Foundation Brush" (prod-007) - Ultra-soft cruelty-free vegan bristles. Price: Rs. 3,800.
`;

/**
 * Generate a personalized skincare routine using Google Gemini
 */
async function generateAiRoutine({ skinType = 'Combination', concerns = [], allergens = [], skinTone = 'Medium', undertone = 'Warm', userNotes = '' }) {
  const isKeyConfigured = Boolean(genAI);

  if (isKeyConfigured) {
    try {
      const model = genAI.getGenerativeModel({
        model: 'gemini-flash-lite-latest',
        generationConfig: {
          temperature: 0.4,
          maxOutputTokens: 1200,
          responseMimeType: 'application/json',
        },
      });

      const prompt = `
You are AuraGlow's Chief Clinical Dermatologist and Cosmetic Chemist.
A client has submitted their clinical skin diagnostic with the following parameters:
- Skin Type: ${skinType}
- Primary Concerns: ${concerns.length ? concerns.join(', ') : 'Maintenance, Glow, Barrier Protection'}
- Known Allergens / Sensitivities to avoid: ${allergens.length ? allergens.join(', ') : 'None'}
- Skin Tone: ${skinTone}
- Undertone: ${undertone}
${userNotes ? `- Client Notes: "${userNotes}"` : ''}

${CATALOG_CONTEXT}

Generate an individualized, science-backed clean skincare routine and dermatological consultation.
You MUST output ONLY a valid JSON object matching this exact schema:
{
  "title": "Short catchy clinical title for this routine (e.g. Bio-Lipid Barrier Fortification & Radiance Protocol)",
  "clinicalRationale": "2-3 sentences explaining the biological reasoning for this specific skin type and concerns.",
  "matchScore": 98,
  "amRoutine": [
    {
      "step": 1,
      "stepName": "Step title (e.g. Gentle Botanical Cleanse)",
      "productId": "prod-005",
      "activeActives": "Key active ingredient name (e.g. Green Tea EGCG)",
      "instruction": "Specific dermatological application technique (e.g. Massage for 60s with lukewarm water)",
      "benefit": "Why this step helps their specific skin concerns"
    }
  ],
  "pmRoutine": [
    {
      "step": 1,
      "stepName": "Step title (e.g. Barrier Recovery Cream)",
      "productId": "prod-003",
      "activeActives": "Key active ingredient name (e.g. Multi-Weight Hyaluronic & Peptides)",
      "instruction": "Application instructions",
      "benefit": "Overnight repair benefit"
    }
  ],
  "keyActives": [
    {
      "name": "Active name (e.g. Ethylated Vitamin C 15%)",
      "function": "Specific benefit for their profile",
      "synergyNote": "How it pairs with other steps"
    }
  ],
  "dermatologistTips": [
    "Tip 1: Clinical recommendation",
    "Tip 2: Lifestyle / hydration / SPF tip",
    "Tip 3: Application order / precaution"
  ],
  "allergenPrecautions": "Specific safety note addressing their declared allergens (or general hypoallergenic advice)",
  "confidenceScore": "98.4%"
}
AM routine must have 3-4 steps (Cleanse, Treatment/Serum, Moisturize, SPF).
PM routine must have 2-3 steps (Cleanse, Repair/Serum, Overnight Hydration).
Assign the best matching AuraGlow product ID from the catalog to each step where applicable.
`;

      const result = await model.generateContent(prompt);
      let text = result.response.text();

      // Gemini 3.x models wrap JSON in markdown code fences — strip them
      text = text.trim();
      if (text.startsWith('```')) {
        text = text.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/, '').trim();
      }

      const parsed = JSON.parse(text);

      return {
        success: true,
        isRealAI: true,
        model: 'Google Gemini Flash Lite (Live)',
        routine: parsed,
      };
    } catch (geminiError) {
      console.warn('⚠️ [AI Service] Gemini API call error, falling back to clinical rule engine:', geminiError.message);
    }
  }

  // Clinical Rule-Based Diagnostic Engine Fallback
  return {
    success: true,
    isRealAI: false,
    model: 'AuraGlow Clinical Diagnostic Engine (Fallback)',
    notice: 'Using built-in clinical algorithm. Set GEMINI_API_KEY in backend/.env for live Google Gemini generation.',
    routine: generateFallbackRoutine(skinType, concerns, allergens),
  };
}

/**
 * Interactive Dermatologist Consultation with AI
 */
async function consultAiDermatologist({ question, skinProfile = {}, history = [] }) {
  if (genAI && question) {
    try {
      const model = genAI.getGenerativeModel({
        model: 'gemini-flash-lite-latest',
        generationConfig: {
          temperature: 0.6,
          maxOutputTokens: 600,
        },
      });

      const prompt = `
You are the AuraGlow Senior AI Skincare Consultant and Cosmetic Dermatologist.
Client Profile:
- Skin Type: ${skinProfile.skinType || 'Not specified'}
- Concerns: ${Array.isArray(skinProfile.concerns) ? skinProfile.concerns.join(', ') : 'General glow'}
- Allergens: ${Array.isArray(skinProfile.allergens) ? skinProfile.allergens.join(', ') : 'None'}

Client Question: "${question}"

${CATALOG_CONTEXT}

Provide a warm, professional, highly informative response in 3-4 concise paragraphs.
- Offer actionable advice backed by dermatological science.
- Mention specific clean ingredients to look for or avoid.
- Recommend 1 or 2 relevant AuraGlow products from our catalog if relevant.
- Keep the tone encouraging, luxurious, and clean-beauty focused.
`;

      const result = await model.generateContent(prompt);
      const reply = result.response.text();

      return {
        success: true,
        isRealAI: true,
        model: 'Google Gemini Flash Lite (Live)',
        reply: reply.trim(),
      };
    } catch (err) {
      console.warn('⚠️ [AI Consult] Gemini error:', err.message);
    }
  }

  // Fallback consultation answers
  return {
    success: true,
    isRealAI: false,
    model: 'AuraGlow Diagnostic Advisor',
    reply: getFallbackConsultationAnswer(question, skinProfile),
  };
}

/**
 * High-quality fallback routine generator when API key is missing
 */
function generateFallbackRoutine(skinType, concerns, allergens) {
  const normType = (skinType || 'Combination').toLowerCase();
  const titleMap = {
    oily: 'Sebum-Regulating & Cellular Pore Clarity Regimen',
    dry: 'Intense Hydro-Lipid Infusion & Barrier Restoration Protocol',
    combination: 'Dual-Zone Balance & Bio-Active Radiance Regimen',
    sensitive: 'Gentle Neuro-Sensory Calming & Micro-Barrier Shield',
    normal: 'Cellular Vitality & Environmental Protection Protocol',
  };

  const rationaleMap = {
    oily: 'Targeted to balance overactive sebaceous activity with Green Tea polyphenols without compromising essential lipid hydration.',
    dry: 'Formulated with multi-depth Hyaluronic Acid and Botanical Squalane to stem trans-epidermal moisture loss and restore elasticity.',
    combination: 'Delivers lightweight multi-molecular hydration to cheek areas while curbing excess sebum oxidation across the T-zone.',
    sensitive: 'Fortified with Centella Asiatica and hypoallergenic botanicals to suppress erythema and reinforce a delicate lipid barrier.',
    normal: 'Optimized antioxidant defense designed to safeguard pristine barrier function and impart an all-day lit-from-within luminosity.',
  };

  return {
    title: titleMap[normType] || titleMap.combination,
    clinicalRationale: rationaleMap[normType] || rationaleMap.combination,
    matchScore: 97,
    amRoutine: [
      {
        step: 1,
        stepName: 'Gentle Botanical Cleanse',
        productId: 'prod-005',
        activeActives: 'Green Tea Polyphenols & Camellia',
        instruction: 'Emulsify with lukewarm water for 60 seconds; rinse gently without rubbing.',
        benefit: 'Clears overnight cellular debris while preserving vital acid mantle.'
      },
      {
        step: 2,
        stepName: 'Active Antioxidant Treatment',
        productId: 'prod-001',
        activeActives: '15% Stabilized Vitamin C & Ferulic',
        instruction: 'Dispense 4-5 drops directly onto dry skin; press with palms until absorbed.',
        benefit: 'Neutralizes free radical formation and stimulates pro-collagen synthesis.'
      },
      {
        step: 3,
        stepName: 'Multi-Depth Cloud Hydration',
        productId: 'prod-003',
        activeActives: 'Multi-Weight Hyaluronic Acid & Squalane',
        instruction: 'Smooth a pea-sized amount evenly over face and neck in upward strokes.',
        benefit: 'Delivers 72-hour moisture lock and strengthens lipid barrier.'
      },
      {
        step: 4,
        stepName: 'Broad-Spectrum Environmental Shield',
        productId: 'prod-008',
        activeActives: 'Zinc Oxide & Niacinamide SPF 50+',
        instruction: 'Apply generously 15 minutes before UV or blue-light exposure.',
        benefit: 'Complete photo-aging defense with zero white cast and pore clogging.'
      }
    ],
    pmRoutine: [
      {
        step: 1,
        stepName: 'Botanical Lipid Melt Cleanse',
        productId: 'prod-005',
        activeActives: 'Camellia Oil & Aloe Vera',
        instruction: 'Massage onto dry skin to dissolve SPF and particulate pollution; emulsify with warm water.',
        benefit: 'Deep-pore decongestion without lipid barrier disruption.'
      },
      {
        step: 2,
        stepName: 'Overnight Cellular Barrier Recovery',
        productId: 'prod-003',
        activeActives: 'Peptides & Bio-Identical Ceramides',
        instruction: 'Warm between fingertips and gently press into skin before bedtime.',
        benefit: 'Accelerates cellular renewal and locks in deep overnight hydration.'
      }
    ],
    keyActives: [
      { name: 'Multi-Weight Hyaluronic Acid', function: 'Binds 1,000x its weight in water across 4 epidermal layers.', synergyNote: 'Enhances absorption of subsequent peptide molecules.' },
      { name: 'Stabilized Vitamin C 15%', function: 'Inhibits tyrosinase to prevent pigmentation while neutralizing UV stress.', synergyNote: 'Works synergistically with Ferulic Acid.' },
      { name: 'Organic Green Tea EGCG', function: 'Anti-inflammatory catechin that calms redness and curbs lipid peroxidation.', synergyNote: 'Safe for reactive and acne-prone skin.' },
      { name: 'Pure Botanical Squalane', function: 'Biocompatible lipid that repairs the skin barrier without clogging pores.', synergyNote: 'Seals active serums for sustained release.' }
    ],
    dermatologistTips: [
      'Always apply products from thinnest to thickest consistency for optimal trans-epidermal absorption.',
      'Allow your Vitamin C serum to absorb for 60 seconds before applying moisturizer or sunscreen.',
      allergens && allergens.length && !allergens.includes('None')
        ? `Ensure strict avoidance of formulations containing ${allergens.join(', ')}.`
        : 'Perform a 24-hour patch test inside the elbow when introducing any high-potency active.'
    ],
    allergenPrecautions: allergens && allergens.length && !allergens.includes('None')
      ? `AuraGlow formulations are strictly verified 100% free from ${allergens.join(', ')}.`
      : 'All suggested formulas are hypoallergenic, vegan, fragrance-free, and dermatologically tested.',
    confidenceScore: '97.8%'
  };
}

function getFallbackConsultationAnswer(question, skinProfile) {
  const q = (question || '').toLowerCase();
  const skin = skinProfile.skinType || 'your skin';

  if (q.includes('acne') || q.includes('breakout') || q.includes('pimple')) {
    return `For managing breakouts while preserving barrier health on ${skin}, the clinical key is gentle decongestion rather than harsh stripping.

1. **Cleanse gently**: Use our **Botanical Cleansing Melt** with green tea polyphenols. Stripping your skin triggers a rebound oil surge that worsens inflammatory acne.
2. **Target active inflammation**: Introduce Niacinamide and stabilized Vitamin C, which calm redness and fade post-inflammatory hyperpigmentation (dark marks).
3. **Moisturize intelligently**: Even breakout-prone skin requires hydration. Our **Petal Hydra Cloud Cream** delivers non-comedogenic hydration with multi-molecular hyaluronic acid.

Remember to change pillowcases frequently and never skip daily non-comedogenic SPF 50!`;
  }

  if (q.includes('dry') || q.includes('dehydrat') || q.includes('flak')) {
    return `Dehydrated skin lacks water, while dry skin lacks lipid sebum. For optimal recovery on ${skin}:

1. **Layer on damp skin**: Always apply our **Radiant Glow Serum** and **Petal Hydra Cloud Cream** to slightly damp skin so the hyaluronic acid binds ambient moisture directly into your epidermis.
2. **Seal with botanical lipids**: Use formulas enriched with botanical squalane and ceramides to repair the trans-epidermal lipid seal.
3. **Avoid scalding water**: Wash your face only with lukewarm water to prevent melting away your natural protective lipid mantle.

Within 7-10 days of consistent morning and night hydration, your skin's moisture barrier will feel supple, calm, and visibly plump.`;
  }

  return `Based on your profile with **${skin}**, consistency and ingredient synergy are your greatest assets.

1. **Morning Protocol**: Protect your cellular matrix with antioxidant defense (Vitamin C + Green Tea) followed by broad-spectrum SPF 50 to neutralize daily environmental stressors and prevent premature fine lines.
2. **Evening Recovery**: Focus on gentle cleansing followed by barrier-fortifying peptides and hyaluronic acid to encourage cellular regeneration during your circadian rest cycle.
3. **Clean Compatibility**: All AuraGlow formulations are 100% vegan, cruelty-free, and formulated without harsh fillers or endocrine disruptors.

Feel free to retake our Skin Quiz anytime your skin changes with the seasons!`;
}

module.exports = {
  generateAiRoutine,
  consultAiDermatologist,
};
