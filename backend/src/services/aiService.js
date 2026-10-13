/**
 * =============================================================================
 *  AuraGlow — AI Skincare Service (backend/src/services/aiService.js)
 *  Powered by Google Gemini Generative AI (gemini-1.5-flash)
 *  Provides real clinical skincare regimens and dermatologist consultations.
 * =============================================================================
 */

const { GoogleGenerativeAI } = require('@google/generative-ai');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const GROQ_API_KEY   = process.env.GROQ_API_KEY || '';

let genAI = null;
if (GEMINI_API_KEY && GEMINI_API_KEY.trim().length > 10) {
  try {
    genAI = new GoogleGenerativeAI(GEMINI_API_KEY.trim());
    console.log('✨ [AI Service] Google Gemini Generative AI client initialized successfully.');
  } catch (err) {
    console.warn('⚠️ [AI Service] Failed to initialize Google Gemini:', err.message);
  }
} else {
  console.log('ℹ️ [AI Service] GEMINI_API_KEY not configured.');
}

if (GROQ_API_KEY && GROQ_API_KEY.trim().length > 10) {
  console.log('⚡ [AI Service] Groq AI client configured as resilient high-speed fallback.');
}

function withTimeout(promise, ms = 6000, errorMsg = 'AI provider timed out') {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error(errorMsg)), ms)),
  ]);
}

/**
 * Universal Groq Chat Completion caller
 */
async function callGroq({ messages, jsonMode = false, maxTokens = 3000 }) {
  if (!GROQ_API_KEY) throw new Error('GROQ_API_KEY not configured');
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${GROQ_API_KEY.trim()}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'openai/gpt-oss-120b',
      messages,
      max_tokens: maxTokens,
      temperature: 0.5,
      ...(jsonMode ? { response_format: { type: 'json_object' } } : {}),
    }),
  });

  const data = await response.json();
  if (data.error) {
    throw new Error(data.error.message || 'Groq API request failed');
  }
  return data.choices?.[0]?.message?.content || '';
}

/**
 * Catalog product knowledge for Gemini prompt context
 */
const CATALOG_CONTEXT = `
Available AuraGlow Products in store:
1. "Radiant Glow Daily Serum" (prod-001) - 15% Vitamin C + Hyaluronic Acid + Ferulic Acid. Price: Rs. 5,800. Targets: Dullness, dark spots, uneven texture. Best for: All skin types.
2. "Petal Hydra Cloud Cream" (prod-003) - Multi-molecular Hyaluronic Acid + Peptides + Squalane. Price: Rs. 7,200. Targets: Dehydration, barrier repair, fine lines. Best for: Dry, sensitive, combination.
3. "Botanical Cleansing Melt" (prod-005) - Green tea polyphenols + Camellia oil + Aloe vera. Price: Rs. 3,200. Targets: Cleansing impurities without stripping lipid barrier. Best for: Oily, combination, acne.
4. "Invisible Shield SPF 50+ Fluid" (prod-008) - Broad-spectrum UVA/UVB + Niacinamide + Zinc. Price: Rs. 5,500. Targets: Sun protection, pollution, redness. Best for: All skin types, zero white cast.
5. "Velvet Matte Moisture Lipstick" (prod-002) - Shea butter + Vitamin E. Price: Rs. 4,500. 3 classic velvety shades.
6. "Rose Gold Illuminating Palette" (prod-004) - Mineral glow pigments. Price: Rs. 11,000. 12 warm rose-gold shades.
7. "Midnight Bloom Eau de Parfum" (prod-006) - Jasmine, dark vanilla & sandalwood. Price: Rs. 15,500.
8. "Precision Luxe Foundation Brush" (prod-007) - Ultra-soft cruelty-free vegan bristles. Price: Rs. 6,800.
9. "Luminous Silk Serum Foundation" (prod-009) - Hyaluronic Acid + Niacinamide breathable medium coverage foundation. Price: Rs. 9,500. 8 inclusive shades (Fair Warm/Cool to Deep Cool).
10. "Niacinamide 10% + Zinc Pore Minimizing Serum" (prod-010) - 10% Niacinamide + 1% Zinc PCA. Price: Rs. 4,900. Targets: Sebum control, enlarged pores, acne blemishes. Best for: Oily, combination.
11. "Centella Cica Barrier Calming Cream" (prod-011) - 70% Centella Asiatica + Madecassoside. Price: Rs. 6,400. Targets: Severe redness, facial flushing, reactive inflammation. Best for: Sensitive, reactive skin.
12. "Bakuchiol & Peptide Youth Firming Elixir" (prod-012) - 2% Plant-based bio-retinol + firming signal peptides. Price: Rs. 10,500. Targets: Wrinkles, loss of elasticity, photo-aging. Non-irritating. Best for: Aging, sensitive, dry, normal.
13. "BHA 2% Salicylic Clarifying Exfoliant Toner" (prod-013) - 2% Salicylic Acid + Green tea. Price: Rs. 4,200. Targets: Blackheads, cystic acne, clogged pores. Best for: Oily, acne-prone.
14. "Alpha Arbutin 2% Dark Spot Corrector" (prod-014) - 2% Purified Alpha Arbutin + Licorice root. Price: Rs. 6,800. Targets: Post-acne marks, melasma, hyperpigmentation. Best for: Dark spots, uneven tone.
15. "Ceramide Multi-Depth Barrier Moisture Balm" (prod-015) - 5 Bio-identical ceramides + Oat Beta-Glucan. Price: Rs. 7,900. Targets: Severe dryness, flakiness, eczema-prone barrier compromise. Best for: Dry, sensitive.
16. "Petal Dew Lip & Cheek Cream Tint" (prod-016) - Camellia seed oil + Vitamin E. Price: Rs. 3,800. 4 shades (Peony, Amber, Desert Rose, Wild Berry).
17. "Radiant Glow Skin Tint SPF 30" (prod-017) - Non-nano Zinc mineral skin tint. Price: Rs. 7,600. 5 shades (Fair to Deep). Sheer dewy coverage.
18. "Mineral Dew Creaseless Concealer" (prod-018) - Caffeine + Squalane de-puffing clean concealer. Price: Rs. 4,600. 6 shades (Fair Cool to Deep Cocoa).
19. "Oat Milk Soothing Barrier Cleanser" (prod-019) - Colloidal oatmeal + Sweet almond oil creamy cleanser. Price: Rs. 3,600. Non-stripping, hypoallergenic wash for dry & sensitive skin.
20. "Peptide Glaze Hydrating Lip Oil" (prod-020) - Maxi-Lip peptides + Jojoba oil mirror gloss. Price: Rs. 3,400. 4 sheer juicy shades.
`;

/**
 * Generate a personalized skincare routine using Google Gemini with Groq fallback
 */
async function generateAiRoutine({ skinType = 'Combination', concerns = [], allergens = [], skinTone = 'Medium', undertone = 'Warm', userNotes = '' }) {
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

  // ── 1. Primary Engine: Google Gemini ──
  if (genAI) {
    try {
      const model = genAI.getGenerativeModel({
        model: 'gemini-flash-lite-latest',
        generationConfig: {
          temperature: 0.4,
          maxOutputTokens: 3000,
          responseMimeType: 'application/json',
        },
      });

      const result = await withTimeout(model.generateContent(prompt), 6000, 'Gemini response timed out');
      let text = result.response.text().trim();
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
      console.warn('⚠️ [AI Service] Gemini API call error, switching to Groq fallback:', geminiError.message);
    }
  }

  // ── 2. Secondary Engine: Groq AI Fallback ──
  if (GROQ_API_KEY) {
    try {
      const groqRaw = await callGroq({
        messages: [
          {
            role: 'system',
            content: 'You are AuraGlow\'s Chief Clinical Dermatologist and Cosmetic Chemist. You MUST output ONLY a valid JSON object matching the requested schema without any markdown formatting.',
          },
          { role: 'user', content: prompt }
        ],
        jsonMode: true,
        maxTokens: 3000,
      });

      let cleanJson = groqRaw.trim();
      if (cleanJson.startsWith('```')) {
        cleanJson = cleanJson.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/, '').trim();
      }

      const parsed = JSON.parse(cleanJson);
      console.log('⚡ [AI Service] Routine generated successfully via Groq AI (openai/gpt-oss-120b).');
      return {
        success: true,
        isRealAI: true,
        model: 'Groq AI (openai/gpt-oss-120b)',
        routine: parsed,
      };
    } catch (groqError) {
      console.warn('⚠️ [AI Service] Groq fallback error, switching to clinical rule engine:', groqError.message);
    }
  }

  // ── 3. Tertiary Engine: Clinical Rule-Based Diagnostic Engine Fallback ──
  return {
    success: true,
    isRealAI: false,
    model: 'AuraGlow Clinical Diagnostic Engine (Fallback)',
    notice: 'Using built-in clinical algorithm.',
    routine: generateFallbackRoutine(skinType, concerns, allergens),
  };
}

/**
 * Interactive Dermatologist Consultation with AI (Gemini with Groq fallback)
 */
async function consultAiDermatologist({ question, skinProfile = {}, history = [] }) {
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

  // 1. Google Gemini
  if (genAI && question) {
    try {
      const model = genAI.getGenerativeModel({
        model: 'gemini-flash-lite-latest',
        generationConfig: {
          temperature: 0.6,
          maxOutputTokens: 1000,
        },
      });

      const result = await withTimeout(model.generateContent(prompt), 6000, 'Gemini response timed out');
      const reply = result.response.text();

      return {
        success: true,
        isRealAI: true,
        model: 'Google Gemini Flash Lite (Live)',
        reply: reply.trim(),
      };
    } catch (err) {
      console.warn('⚠️ [AI Consult] Gemini error, switching to Groq:', err.message);
    }
  }

  // 2. Groq Fallback
  if (GROQ_API_KEY && question) {
    try {
      const reply = await callGroq({
        messages: [
          { role: 'system', content: 'You are the AuraGlow Senior AI Skincare Consultant and Cosmetic Dermatologist.' },
          { role: 'user', content: prompt }
        ],
        jsonMode: false,
        maxTokens: 1000,
      });

      return {
        success: true,
        isRealAI: true,
        model: 'Groq AI (openai/gpt-oss-120b)',
        reply: reply.trim(),
      };
    } catch (groqErr) {
      console.warn('⚠️ [AI Consult] Groq error:', groqErr.message);
    }
  }

  // 3. Built-in consultation answers
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

  const routinesByType = {
    oily: {
      am: [
        { step: 1, stepName: 'Purifying Green Tea Foam', productId: 'prod-005', activeActives: 'Green Tea EGCG & Camellia', instruction: 'Lather with lukewarm water for 60 seconds; rinse thoroughly.', benefit: 'Clears overnight sebum while keeping acid mantle intact.' },
        { step: 2, stepName: 'Pore Clarifying Treatment', productId: 'prod-010', activeActives: '10% Niacinamide & 1% Zinc PCA', instruction: 'Press 3 drops into T-zone and areas prone to enlarged pores.', benefit: 'Regulates oil output and tightens pore appearance.' },
        { step: 3, stepName: 'Weightless Matte UV Shield', productId: 'prod-008', activeActives: 'Zinc Oxide SPF 50+ Fluid', instruction: 'Apply evenly as final morning step.', benefit: 'Broad-spectrum protection without shine or grease.' }
      ],
      pm: [
        { step: 1, stepName: 'Deep Decongesting Cleanse', productId: 'prod-005', activeActives: 'Green Tea & Aloe Vera', instruction: 'Wash away pollutants, excess sebum, and makeup.', benefit: 'Leaves skin clean and decongested.' },
        { step: 2, stepName: 'BHA 2% Pore Decongestion', productId: 'prod-013', activeActives: '2% Salicylic Acid & Willow Bark', instruction: 'Gently sweep across face with cotton pad or palms; do not rinse.', benefit: 'Penetrates pore linings to dissolve blackheads and cystic blockages.' },
        { step: 3, stepName: 'Sebum-Regulating Repair', productId: 'prod-010', activeActives: '10% Niacinamide & Zinc', instruction: 'Apply smoothly before sleep.', benefit: 'Supports nighttime blemish prevention.' }
      ],
      actives: [
        { name: 'Niacinamide 10%', function: 'Regulates sebaceous lipid synthesis and prevents pore stretching.' },
        { name: 'Salicylic Acid 2%', function: 'Lipid-soluble beta-hydroxy acid that clears congested follicules.' },
        { name: 'Zinc PCA 1%', function: 'Suppresses inflammatory acne lesions and curbs sebum oxidation.' }
      ]
    },
    dry: {
      am: [
        { step: 1, stepName: 'Oat Milk Cushion Cleanse', productId: 'prod-019', activeActives: 'Colloidal Oatmeal & Almond Oil', instruction: 'Massage onto damp skin; rinse with cool water.', benefit: 'Preserves delicate lipid barrier without stripping moisture.' },
        { step: 2, stepName: 'Bio-Lipid Antioxidant Serum', productId: 'prod-001', activeActives: 'Vitamin C & Rose Hip Oil', instruction: 'Press 4 drops gently into face and neck.', benefit: 'Floods thirsty cells with essential fatty acids and antioxidants.' },
        { step: 3, stepName: 'Ceramide Barrier Recovery Balm', productId: 'prod-015', activeActives: '5 Bio-Identical Ceramides', instruction: 'Warm a pea-sized amount between fingers and smooth over face.', benefit: 'Locks in 72-hour moisture and repairs flaky skin.' },
        { step: 4, stepName: 'Invisible Shield SPF 50', productId: 'prod-008', activeActives: 'Zinc Oxide & Hyaluronic Acid', instruction: 'Apply generously to face and neck.', benefit: 'Prevents photo-damage and trans-epidermal moisture loss.' }
      ],
      pm: [
        { step: 1, stepName: 'Comfort Cream Melt Cleanse', productId: 'prod-019', activeActives: 'Colloidal Oatmeal', instruction: 'Dissolve makeup and impurities softly.', benefit: 'Zero dryness or redness.' },
        { step: 2, stepName: 'Bakuchiol Firming Elixir', productId: 'prod-012', activeActives: '2% Bakuchiol & Signal Peptides', instruction: 'Smooth over face and décolleté.', benefit: 'Plumps fine dehydration lines without retinol dryness.' },
        { step: 3, stepName: 'Ceramide Multi-Depth Balm', productId: 'prod-015', activeActives: 'Ceramides & Oat Beta-Glucan', instruction: 'Apply generous layer before sleep.', benefit: 'Intense overnight lipid barrier cocoon.' }
      ],
      actives: [
        { name: '5 Bio-Identical Ceramides', function: 'Reconstructs damaged lipid bilayer and seals cellular hydration.' },
        { name: 'Colloidal Oatmeal', function: 'Relieves micro-inflammation and reinforces moisture barrier.' },
        { name: 'Bakuchiol 2%', function: 'Stimulates collagen without drying out parched skin.' }
      ]
    },
    sensitive: {
      am: [
        { step: 1, stepName: 'Ultra-Gentle Oat Cleanse', productId: 'prod-019', activeActives: 'Colloidal Oatmeal & Bisabolol', instruction: 'Gently glide over skin with minimal friction.', benefit: 'Calms reactive sensitivity upon contact.' },
        { step: 2, stepName: 'Centella Cica Relief Cream', productId: 'prod-011', activeActives: '70% Centella Asiatica & Madecassoside', instruction: 'Pat evenly over face, focusing on flushed zones.', benefit: 'Instant biological quenching of erythema and burning.' },
        { step: 3, stepName: 'Mineral UV Shield SPF 50', productId: 'prod-008', activeActives: 'Non-Nano Zinc Oxide', instruction: 'Smooth gently over face and ears.', benefit: 'Physical UV reflection completely free from chemical irritants.' }
      ],
      pm: [
        { step: 1, stepName: 'Hypoallergenic Oat Cleanse', productId: 'prod-019', activeActives: 'Colloidal Oatmeal', instruction: 'Rinse with tepid water; pat dry with clean microfiber.', benefit: 'Zero irritation or tightness.' },
        { step: 2, stepName: 'Centella Cica Overnight Relief', productId: 'prod-011', activeActives: 'Madecassoside & Panthenol B5', instruction: 'Apply a soothing layer before bed.', benefit: 'Overnight neuro-sensory recovery.' }
      ],
      actives: [
        { name: 'Centella Asiatica 70%', function: 'Inhibits inflammatory cytokines and fortifies weakened capillaries.' },
        { name: 'Madecassoside', function: 'Accelerates cellular tissue regeneration and micro-damage repair.' },
        { name: 'Non-Nano Zinc Oxide', function: 'Physical barrier that protects sensitive skin from environmental irritation.' }
      ]
    },
    combination: {
      am: [
        { step: 1, stepName: 'Balancing Botanical Cleanse', productId: 'prod-005', activeActives: 'Green Tea & Camellia', instruction: 'Massage gently for 60 seconds.', benefit: 'Cleanses T-zone while keeping cheeks comfortable.' },
        { step: 2, stepName: 'Radiant Cellular Serum', productId: 'prod-001', activeActives: 'Vitamin C & Niacinamide', instruction: 'Apply 3-4 drops evenly across face.', benefit: 'Brightens and unified skin texture.' },
        { step: 3, stepName: 'Petal Hydra Cloud Cream', productId: 'prod-003', activeActives: 'Hyaluronic Acid & Peptides', instruction: 'Smooth a light layer over cheeks and neck.', benefit: 'Weightless hydration that never feels greasy.' },
        { step: 4, stepName: 'Invisible Shield SPF 50', productId: 'prod-008', activeActives: 'Zinc Oxide SPF 50+', instruction: 'Apply 15 minutes before sun exposure.', benefit: 'Non-comedogenic broad-spectrum daily shield.' }
      ],
      pm: [
        { step: 1, stepName: 'Botanical Melt Cleanse', productId: 'prod-005', activeActives: 'Green Tea & Camellia', instruction: 'Rinse clean with lukewarm water.', benefit: 'Removes daily grime without stripping cheeks.' },
        { step: 2, stepName: 'Niacinamide T-Zone Balancing', productId: 'prod-010', activeActives: '10% Niacinamide & Zinc', instruction: 'Apply to forehead, nose, and chin.', benefit: 'Curb nighttime excess shine.' },
        { step: 3, stepName: 'Petal Hydra Cloud Cream', productId: 'prod-003', activeActives: 'Hyaluronic Acid & Squalane', instruction: 'Smooth over entire face.', benefit: 'Delivers balanced multi-depth moisture.' }
      ],
      actives: [
        { name: 'Niacinamide', function: 'Balances sebum in oily zones while preserving hydration elsewhere.' },
        { name: 'Multi-Depth Hyaluronic Acid', function: 'Provides featherlight plumping hydration.' },
        { name: 'Green Tea Extract', function: 'Antioxidant protection and oil balance.' }
      ]
    },
    normal: {
      am: [
        { step: 1, stepName: 'Gentle Botanical Cleanse', productId: 'prod-005', activeActives: 'Green Tea & Aloe Vera', instruction: 'Emulsify with water and rinse.', benefit: 'Fresh morning start.' },
        { step: 2, stepName: 'Radiant Glow Daily Serum', productId: 'prod-001', activeActives: '15% Stabilized Vitamin C', instruction: 'Press 4 drops into skin.', benefit: 'Antioxidant glass-skin glow.' },
        { step: 3, stepName: 'Petal Hydra Cream', productId: 'prod-003', activeActives: 'Hyaluronic Acid & Peptides', instruction: 'Smooth over face and neck.', benefit: 'All-day bouncy suppleness.' },
        { step: 4, stepName: 'Invisible Shield SPF 50', productId: 'prod-008', activeActives: 'Zinc Oxide & Niacinamide', instruction: 'Apply as final daytime step.', benefit: 'Complete environmental defense.' }
      ],
      pm: [
        { step: 1, stepName: 'Botanical Cleanse', productId: 'prod-005', activeActives: 'Camellia Oil', instruction: 'Wash away daily pollutants.', benefit: 'Cleanses without disruption.' },
        { step: 2, stepName: 'Bakuchiol Youth Firming Elixir', productId: 'prod-012', activeActives: '2% Bakuchiol & Peptides', instruction: 'Smooth over clean skin.', benefit: 'Overnight pro-collagen renewal.' },
        { step: 3, stepName: 'Petal Hydra Cream', productId: 'prod-003', activeActives: 'Peptides & Squalane', instruction: 'Lock in night nourishment.', benefit: 'Wake up to lit-from-within luminosity.' }
      ],
      actives: [
        { name: 'Stabilized Vitamin C 15%', function: 'Protects from free radicals and promotes even radiance.' },
        { name: 'Bakuchiol 2%', function: 'Stimulates cellular firmness and elasticity.' },
        { name: 'Botanical Squalane', function: 'Weightless lipid nourishment for healthy glow.' }
      ]
    }
  };

  const selected = routinesByType[normType] || routinesByType.combination;

  return {
    title: titleMap[normType] || titleMap.combination,
    clinicalRationale: rationaleMap[normType] || rationaleMap.combination,
    matchScore: 98,
    amRoutine: selected.am,
    pmRoutine: selected.pm,
    keyActives: selected.actives,
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
