-- =============================================================================
-- AuraGlow — SEED DATA Script
-- Run this AFTER creating all tables with the main schema script.
-- This populates the database with all products and sample data
-- that match the frontend mockData.js file exactly.
-- =============================================================================
-- Created by: Tharushi (Admin Module)
-- Matches: frontend/src/data/mockData.js
-- =============================================================================

-- We use fixed UUIDs so that foreign key relationships work correctly.
-- DO NOT change these UUIDs once data is inserted, or FK references will break.

-- =============================================================================
-- STEP 1: SEED USERS (sample customers + admin)
-- Passwords are all:  Test@1234  (bcrypt hash below)
-- For demo/testing only. Real users will register through the app.
-- =============================================================================

INSERT INTO users (id, name, email, password_hash, role, avatar_url) VALUES
  (
    'a1000000-0000-0000-0000-000000000001',
    'Sasha R.',
    'sasha@example.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    'customer',
    'https://randomuser.me/api/portraits/women/44.jpg'
  ),
  (
    'a1000000-0000-0000-0000-000000000002',
    'Anika P.',
    'anika@example.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    'customer',
    'https://randomuser.me/api/portraits/women/68.jpg'
  ),
  (
    'a1000000-0000-0000-0000-000000000003',
    'Leila M.',
    'leila@example.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    'customer',
    'https://randomuser.me/api/portraits/women/55.jpg'
  ),
  (
    'a1000000-0000-0000-0000-000000000004',
    'Keshara D.',
    'keshara@example.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    'customer',
    'https://randomuser.me/api/portraits/women/32.jpg'
  )
ON CONFLICT (email) DO NOTHING;

-- =============================================================================
-- STEP 2: SEED SKIN PROFILES (quiz results for each sample user)
-- =============================================================================

INSERT INTO skin_profiles (user_id, skin_type, concerns, allergens, skin_tone, undertone) VALUES
  (
    'a1000000-0000-0000-0000-000000000001',
    'dry',
    '["Dullness & Uneven Tone", "Dark Spots & Pigmentation"]',
    '[]',
    'medium',
    'warm'
  ),
  (
    'a1000000-0000-0000-0000-000000000002',
    'combination',
    '["Acne & Breakouts", "Dryness & Dehydration"]',
    '["gluten-free"]',
    'tan',
    'neutral'
  ),
  (
    'a1000000-0000-0000-0000-000000000003',
    'sensitive',
    '["Fine Lines & Wrinkles", "Dryness & Dehydration"]',
    '["fragrance-free"]',
    'light',
    'cool'
  ),
  (
    'a1000000-0000-0000-0000-000000000004',
    'combination',
    '["Dullness & Uneven Tone"]',
    '[]',
    'medium',
    'warm'
  )
ON CONFLICT (user_id) DO NOTHING;

-- =============================================================================
-- STEP 3: SEED PRODUCTS (matches mockData.js exactly — 8 products)
-- =============================================================================

INSERT INTO products (
  id, name, brand, category, description, price, stock_quantity,
  images, skin_types_compatible, concerns_addressed, clean_beauty_tags,
  shades, is_vegan, is_cruelty_free, is_active
) VALUES

  -- prod-001: Radiant Glow Serum
  (
    'b2000000-0000-0000-0000-000000000001',
    'Radiant Glow Serum',
    'AuraGlow',
    'skincare',
    'A lightweight, fast-absorbing serum powered by Vitamin C and Rose Hip Oil to brighten, even tone, and protect your skin.',
    8900.00, 45,
    '["https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80","https://images.unsplash.com/photo-1556228578-dd539282b964?auto=format&fit=crop&w=800&q=80"]',
    '["dry","combination","sensitive"]',
    '["dullness","dark-spots"]',
    '["vegan","cruelty-free","paraben-free","sulfate-free"]',
    '[]',
    TRUE, TRUE, TRUE
  ),

  -- prod-002: Velvet Matte Lipstick
  (
    'b2000000-0000-0000-0000-000000000002',
    'Velvet Matte Lipstick',
    'AuraGlow',
    'makeup',
    'Intensely pigmented matte lipstick with a comfortable, all-day wear formula. No drying, no fading.',
    4500.00, 12,
    '["https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=800&q=80"]',
    '["dry","oily","combination","sensitive"]',
    '[]',
    '["cruelty-free","paraben-free"]',
    '[{"name":"Ruby Red","hex":"#9B1B30","stock":4},{"name":"Dusty Rose","hex":"#C4A0A0","stock":5},{"name":"Berry Bliss","hex":"#7B2D8B","stock":3}]',
    FALSE, TRUE, TRUE
  ),

  -- prod-003: Petal Hydra Cream
  (
    'b2000000-0000-0000-0000-000000000003',
    'Petal Hydra Cream',
    'AuraGlow',
    'skincare',
    'A rich yet lightweight moisturizer infused with Hyaluronic Acid and Petal Extract for 72-hour deep hydration.',
    7200.00, 0,
    '["https://images.unsplash.com/photo-1599305090598-fe179d501227?auto=format&fit=crop&w=800&q=80"]',
    '["dry","sensitive"]',
    '["dryness","fine-lines"]',
    '["vegan","cruelty-free","fragrance-free","paraben-free"]',
    '[]',
    TRUE, TRUE, TRUE
  ),

  -- prod-004: Rose Gold Eye Palette
  (
    'b2000000-0000-0000-0000-000000000004',
    'Rose Gold Eye Palette',
    'AuraGlow',
    'makeup',
    '12 highly blendable, richly pigmented shades in warm rose-gold tones. Perfect for day-to-night looks.',
    11000.00, 85,
    '["https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=800&q=80"]',
    '["dry","oily","combination","sensitive"]',
    '[]',
    '["cruelty-free","paraben-free"]',
    '[]',
    FALSE, TRUE, TRUE
  ),

  -- prod-005: Green Tea Cleansing Foam
  (
    'b2000000-0000-0000-0000-000000000005',
    'Green Tea Cleansing Foam',
    'AuraGlow',
    'skincare',
    'A gentle, foaming cleanser with Green Tea Extract to remove impurities without stripping natural moisture.',
    3200.00, 120,
    '["https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=800&q=80"]',
    '["oily","combination"]',
    '["acne"]',
    '["vegan","cruelty-free","sulfate-free","paraben-free"]',
    '[]',
    TRUE, TRUE, TRUE
  ),

  -- prod-006: Midnight Bloom Perfume
  (
    'b2000000-0000-0000-0000-000000000006',
    'Midnight Bloom Perfume',
    'AuraGlow',
    'fragrance',
    'A luxurious floral-musk fragrance with top notes of jasmine and base notes of sandalwood. Long-lasting 8-hour wear.',
    15500.00, 30,
    '["https://images.unsplash.com/photo-1557170334-a9632e77c6e4?auto=format&fit=crop&w=800&q=80"]',
    '["dry","oily","combination","sensitive"]',
    '[]',
    '["vegan","cruelty-free"]',
    '[{"name":"30ml","hex":null,"stock":12},{"name":"50ml","hex":null,"stock":10},{"name":"100ml","hex":null,"stock":8}]',
    TRUE, TRUE, TRUE
  ),

  -- prod-007: Pro Blending Brush Set
  (
    'b2000000-0000-0000-0000-000000000007',
    'Pro Blending Brush Set',
    'AuraGlow',
    'tools',
    'A 5-piece professional blending brush set with synthetic bristles. Vegan, ultra-soft, and easy to clean.',
    6800.00, 55,
    '["https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80"]',
    '["dry","oily","combination","sensitive"]',
    '[]',
    '["vegan","cruelty-free"]',
    '[]',
    TRUE, TRUE, TRUE
  ),

  -- prod-008: SPF 50 Sunscreen Fluid
  (
    'b2000000-0000-0000-0000-000000000008',
    'SPF 50 Sunscreen Fluid',
    'AuraGlow',
    'skincare',
    'Lightweight, invisible SPF 50 fluid that protects against UVA/UVB rays. No white cast. Suitable for all skin types.',
    5500.00, 90,
    '["https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80"]',
    '["dry","oily","combination","sensitive"]',
    '[]',
    '["vegan","cruelty-free","fragrance-free","paraben-free"]',
    '[]',
    TRUE, TRUE, TRUE
  ),

  -- prod-009: Luminous Silk Serum Foundation
  (
    'b2000000-0000-0000-0000-000000000009',
    'Luminous Silk Serum Foundation',
    'AuraGlow',
    'makeup',
    'A weightless, breathable skincare-infused foundation with Hyaluronic Acid and Niacinamide. Delivers medium, buildable luminous coverage that feels like bare skin.',
    9500.00, 65,
    '["https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?auto=format&fit=crop&w=800&q=80","https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80"]',
    '["dry","oily","combination","sensitive","normal"]',
    '["dullness","uneven-texture"]',
    '["vegan","cruelty-free","fragrance-free","paraben-free","silicone-free"]',
    '[{"name":"01 Fair Warm (Porcelain)","hex":"#F9E5D9","stock":8,"tone":"light","undertone":"warm"},{"name":"02 Fair Cool (Alabaster)","hex":"#F6DDD2","stock":8,"tone":"light","undertone":"cool"},{"name":"03 Light Neutral (Ivory)","hex":"#EED0BE","stock":9,"tone":"light","undertone":"neutral"},{"name":"04 Medium Warm (Sand)","hex":"#E5BF9E","stock":10,"tone":"medium","undertone":"warm"},{"name":"05 Medium Neutral (Honey)","hex":"#D6A87C","stock":10,"tone":"medium","undertone":"neutral"},{"name":"06 Tan Warm (Caramel)","hex":"#C28C58","stock":7,"tone":"tan","undertone":"warm"},{"name":"07 Dark Neutral (Toffee)","hex":"#9B613A","stock":7,"tone":"dark","undertone":"neutral"},{"name":"08 Deep Cool (Espresso)","hex":"#5E3823","stock":6,"tone":"deep","undertone":"cool"}]',
    TRUE, TRUE, TRUE
  ),

  -- prod-010: Niacinamide 10% + Zinc Pore Minimizing Serum
  (
    'b2000000-0000-0000-0000-000000000010',
    'Niacinamide 10% + Zinc Pore Minimizing Serum',
    'AuraGlow',
    'skincare',
    'Clinical-strength clarifying treatment powered by 10% high-purity Niacinamide and 1% Zinc PCA to balance excess sebum and refine pore texture.',
    4900.00, 80,
    '["https://images.unsplash.com/photo-1608248597359-5984365b2d2f?auto=format&fit=crop&w=800&q=80","https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80"]',
    '["oily","combination","normal"]',
    '["acne","dullness"]',
    '["vegan","cruelty-free","fragrance-free","oil-free","sulfate-free","paraben-free"]',
    '[]',
    TRUE, TRUE, TRUE
  ),

  -- prod-011: Centella Cica Barrier Calming Cream
  (
    'b2000000-0000-0000-0000-000000000011',
    'Centella Cica Barrier Calming Cream',
    'AuraGlow',
    'skincare',
    'An emergency rescue moisturizer formulated with 70% Centella Asiatica leaf water and Madecassoside to soothe burning sensations and severe redness.',
    6400.00, 45,
    '["https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80","https://images.unsplash.com/photo-1599305090598-fe179d501227?auto=format&fit=crop&w=800&q=80"]',
    '["sensitive","dry","combination"]',
    '["redness","dehydration"]',
    '["vegan","cruelty-free","fragrance-free","hypoallergenic","paraben-free"]',
    '[]',
    TRUE, TRUE, TRUE
  ),

  -- prod-012: Bakuchiol & Peptide Youth Firming Elixir
  (
    'b2000000-0000-0000-0000-000000000012',
    'Bakuchiol & Peptide Youth Firming Elixir',
    'AuraGlow',
    'skincare',
    'Plant-based bio-retinol alternative with 2% Bakuchiol seed extract and firming Signal Peptides to smooth wrinkles without sensitivity or peeling.',
    10500.00, 35,
    '["https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=800&q=80","https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80"]',
    '["dry","combination","normal","sensitive"]',
    '["aging","dullness"]',
    '["vegan","cruelty-free","clean-retinol","paraben-free","sulfate-free"]',
    '[]',
    TRUE, TRUE, TRUE
  ),

  -- prod-013: BHA 2% Salicylic Clarifying Exfoliant Toner
  (
    'b2000000-0000-0000-0000-000000000013',
    'BHA 2% Salicylic Clarifying Exfoliant Toner',
    'AuraGlow',
    'skincare',
    'Gentle leave-on liquid exfoliant with 2% Salicylic Acid and Willow Bark to unglue dead cells, dissolve blackheads, and prevent cystic blemishes.',
    4200.00, 70,
    '["https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80","https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=800&q=80"]',
    '["oily","combination"]',
    '["acne"]',
    '["vegan","cruelty-free","alcohol-free","fragrance-free","paraben-free"]',
    '[]',
    TRUE, TRUE, TRUE
  ),

  -- prod-014: Alpha Arbutin 2% Dark Spot Corrector
  (
    'b2000000-0000-0000-0000-000000000014',
    'Alpha Arbutin 2% Dark Spot Corrector',
    'AuraGlow',
    'skincare',
    'Targeted brightening treatment with 2% purified Alpha Arbutin and Licorice Root to fade stubborn post-acne pigmentation and sun spots.',
    6800.00, 50,
    '["https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=800&q=80","https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80"]',
    '["dry","oily","combination","normal"]',
    '["dark-spots","dullness"]',
    '["vegan","cruelty-free","hydroquinone-free","fragrance-free","paraben-free"]',
    '[]',
    TRUE, TRUE, TRUE
  ),

  -- prod-015: Ceramide Multi-Depth Barrier Moisture Balm
  (
    'b2000000-0000-0000-0000-000000000015',
    'Ceramide Multi-Depth Barrier Moisture Balm',
    'AuraGlow',
    'skincare',
    'Ultra-nourishing lipid cushion with 5 bio-identical ceramides, cholesterol, and oat beta-glucan to shield severely dry, damaged skin.',
    7900.00, 40,
    '["https://images.unsplash.com/photo-1599305090598-fe179d501227?auto=format&fit=crop&w=800&q=80","https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80"]',
    '["dry","sensitive","normal"]',
    '["dryness","dehydration","redness"]',
    '["vegan","cruelty-free","fragrance-free","steroid-free","paraben-free"]',
    '[]',
    TRUE, TRUE, TRUE
  ),

  -- prod-016: Petal Dew Lip & Cheek Cream Tint
  (
    'b2000000-0000-0000-0000-000000000016',
    'Petal Dew Lip & Cheek Cream Tint',
    'AuraGlow',
    'makeup',
    'Multi-use dewy cream blush and lip tint enriched with Camellia seed oil and Vitamin E for a radiant, lit-from-within flush.',
    3800.00, 55,
    '["https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=80","https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=800&q=80"]',
    '["dry","oily","combination","sensitive","normal"]',
    '["dullness"]',
    '["vegan","cruelty-free","carmine-free","paraben-free","silicone-free"]',
    '[{"name":"Peony Glow (Soft Pink)","hex":"#E89EB0","stock":15,"tone":"light","undertone":"cool"},{"name":"Amber Sunrise (Terracotta)","hex":"#CF6D4E","stock":15,"tone":"medium","undertone":"warm"},{"name":"Desert Rose (Neutral Mauve)","hex":"#B8727C","stock":13,"tone":"medium","undertone":"neutral"},{"name":"Wild Berry (Deep Berry)","hex":"#87344D","stock":12,"tone":"deep","undertone":"cool"}]',
    TRUE, TRUE, TRUE
  ),

  -- prod-017: Radiant Glow Skin Tint SPF 30
  (
    'b2000000-0000-0000-0000-000000000017',
    'Radiant Glow Skin Tint SPF 30',
    'AuraGlow',
    'makeup',
    '3-in-1 hydrating skin tint, daily mineral sunscreen, and antioxidant serum. Sheer, dewy coverage with non-nano Zinc Oxide protection.',
    7600.00, 60,
    '["https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=800&q=80","https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80"]',
    '["dry","combination","sensitive","normal"]',
    '["dehydration","dullness"]',
    '["vegan","cruelty-free","chemical-uv-free","reef-safe","fragrance-free"]',
    '[{"name":"Fair 01 (Warm)","hex":"#F7E7DC","stock":12,"tone":"light","undertone":"warm"},{"name":"Light 02 (Neutral)","hex":"#ECD4C2","stock":12,"tone":"light","undertone":"neutral"},{"name":"Medium 03 (Golden)","hex":"#DEB997","stock":14,"tone":"medium","undertone":"warm"},{"name":"Tan 04 (Warm Amber)","hex":"#BE8C5E","stock":11,"tone":"tan","undertone":"warm"},{"name":"Deep 05 (Rich Bronze)","hex":"#7C4927","stock":11,"tone":"deep","undertone":"neutral"}]',
    TRUE, TRUE, TRUE
  ),

  -- prod-018: Mineral Dew Creaseless Concealer
  (
    'b2000000-0000-0000-0000-000000000018',
    'Mineral Dew Creaseless Concealer',
    'AuraGlow',
    'makeup',
    'Ultra-blendable, creaseless fluid concealer with Caffeine and Squalane to de-puff dark circles and disguise blemishes seamlessly.',
    4600.00, 75,
    '["https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=800&q=80","https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80"]',
    '["dry","oily","combination","sensitive","normal"]',
    '["dark-spots","dullness"]',
    '["vegan","cruelty-free","talc-free","silicone-free","paraben-free"]',
    '[{"name":"C1 Fair Cool","hex":"#F9E6DB","stock":12,"tone":"light","undertone":"cool"},{"name":"W1 Light Warm","hex":"#F0D4BF","stock":13,"tone":"light","undertone":"warm"},{"name":"N2 Medium Neutral","hex":"#DEBA9A","stock":15,"tone":"medium","undertone":"neutral"},{"name":"W2 Medium Golden","hex":"#D2A478","stock":13,"tone":"medium","undertone":"warm"},{"name":"W3 Tan Honey","hex":"#B57C4F","stock":11,"tone":"tan","undertone":"warm"},{"name":"N3 Deep Cocoa","hex":"#633B22","stock":11,"tone":"deep","undertone":"neutral"}]',
    TRUE, TRUE, TRUE
  ),

  -- prod-019: Oat Milk Soothing Barrier Cleanser
  (
    'b2000000-0000-0000-0000-000000000019',
    'Oat Milk Soothing Barrier Cleanser',
    'AuraGlow',
    'skincare',
    'Comforting non-foaming cleansing milk with Colloidal Oatmeal and Sweet Almond Oil to dissolve impurities while preserving sensitive barriers.',
    3600.00, 65,
    '["https://images.unsplash.com/photo-1556228578-dd539282b964?auto=format&fit=crop&w=800&q=80","https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=800&q=80"]',
    '["sensitive","dry","normal"]',
    '["redness","dehydration","dryness"]',
    '["vegan","cruelty-free","soap-free","sulfate-free","fragrance-free","hypoallergenic"]',
    '[]',
    TRUE, TRUE, TRUE
  ),

  -- prod-020: Peptide Glaze Hydrating Lip Oil
  (
    'b2000000-0000-0000-0000-000000000020',
    'Peptide Glaze Hydrating Lip Oil',
    'AuraGlow',
    'makeup',
    'Cushiony, non-sticky lip oil with Maxi-Lip peptides, Jojoba oil, and Vitamin C. Plumps the look of lips with mirror-like shine and lasting moisture.',
    3400.00, 80,
    '["https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=800&q=80","https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=80"]',
    '["dry","oily","combination","sensitive","normal"]',
    '["dehydration"]',
    '["vegan","cruelty-free","mineral-oil-free","gluten-free","paraben-free"]',
    '[{"name":"Crystal Clear (High Gloss)","hex":"#FFFFFF","stock":20,"tone":"all","undertone":"neutral"},{"name":"Rose Quartz (Sheer Pink)","hex":"#F2A9B8","stock":20,"tone":"light","undertone":"cool"},{"name":"Honey Peach (Warm Nude)","hex":"#EAA27D","stock":20,"tone":"medium","undertone":"warm"},{"name":"Blackberry Glaze (Sheer Plum)","hex":"#773549","stock":20,"tone":"deep","undertone":"cool"}]',
    TRUE, TRUE, TRUE
  )

ON CONFLICT (id) DO NOTHING;

-- =============================================================================
-- STEP 4: SEED ORDERS
-- =============================================================================

INSERT INTO orders (
  id, user_id, total_amount, shipping_cost, status,
  shipping_address, billing_address, contact_email
) VALUES
  (
    'c3000000-0000-0000-0000-000000000001',
    'a1000000-0000-0000-0000-000000000001',
    16100.00, 350.00, 'processing',
    '{"street":"14 Galle Road","city":"Colombo 03","state":"Western","postal_code":"00300","country":"Sri Lanka"}',
    '{"street":"14 Galle Road","city":"Colombo 03","state":"Western","postal_code":"00300","country":"Sri Lanka"}',
    'sasha@example.com'
  ),
  (
    'c3000000-0000-0000-0000-000000000002',
    'a1000000-0000-0000-0000-000000000002',
    8900.00, 350.00, 'shipped',
    '{"street":"72 Flower Road","city":"Kandy","state":"Central","postal_code":"20000","country":"Sri Lanka"}',
    '{"street":"72 Flower Road","city":"Kandy","state":"Central","postal_code":"20000","country":"Sri Lanka"}',
    'anika@example.com'
  ),
  (
    'c3000000-0000-0000-0000-000000000003',
    'a1000000-0000-0000-0000-000000000003',
    22000.00, 350.00, 'delivered',
    '{"street":"3 Station Road","city":"Galle","state":"Southern","postal_code":"80000","country":"Sri Lanka"}',
    '{"street":"3 Station Road","city":"Galle","state":"Southern","postal_code":"80000","country":"Sri Lanka"}',
    'leila@example.com'
  ),
  (
    'c3000000-0000-0000-0000-000000000004',
    'a1000000-0000-0000-0000-000000000004',
    4500.00, 350.00, 'pending',
    '{"street":"55 Baseline Road","city":"Colombo 09","state":"Western","postal_code":"00900","country":"Sri Lanka"}',
    '{"street":"55 Baseline Road","city":"Colombo 09","state":"Western","postal_code":"00900","country":"Sri Lanka"}',
    'keshara@example.com'
  )
ON CONFLICT (id) DO NOTHING;

-- =============================================================================
-- STEP 5: SEED ORDER ITEMS
-- =============================================================================

INSERT INTO order_items (order_id, product_id, product_name, product_brand, quantity, unit_price) VALUES
  -- Order 1: Radiant Glow Serum + Petal Hydra Cream
  ('c3000000-0000-0000-0000-000000000001','b2000000-0000-0000-0000-000000000001','Radiant Glow Serum',   'AuraGlow', 1, 8900.00),
  ('c3000000-0000-0000-0000-000000000001','b2000000-0000-0000-0000-000000000003','Petal Hydra Cream',    'AuraGlow', 1, 7200.00),
  -- Order 2: Radiant Glow Serum
  ('c3000000-0000-0000-0000-000000000002','b2000000-0000-0000-0000-000000000001','Radiant Glow Serum',   'AuraGlow', 1, 8900.00),
  -- Order 3: Rose Gold Eye Palette + 2x SPF 50 Sunscreen
  ('c3000000-0000-0000-0000-000000000003','b2000000-0000-0000-0000-000000000004','Rose Gold Eye Palette','AuraGlow', 1, 11000.00),
  ('c3000000-0000-0000-0000-000000000003','b2000000-0000-0000-0000-000000000008','SPF 50 Sunscreen Fluid','AuraGlow',2, 5500.00),
  -- Order 4: Velvet Matte Lipstick
  ('c3000000-0000-0000-0000-000000000004','b2000000-0000-0000-0000-000000000002','Velvet Matte Lipstick','AuraGlow', 1, 4500.00);

-- =============================================================================
-- STEP 6: SEED REVIEWS
-- =============================================================================

INSERT INTO reviews (user_id, product_id, order_id, rating, title, comment) VALUES
  (
    'a1000000-0000-0000-0000-000000000001',
    'b2000000-0000-0000-0000-000000000001',
    'c3000000-0000-0000-0000-000000000001',
    5, 'Game changer!',
    'The Radiant Serum changed my skin completely. I get compliments every single day. AuraGlow is the only brand I trust!'
  ),
  (
    'a1000000-0000-0000-0000-000000000002',
    'b2000000-0000-0000-0000-000000000001',
    'c3000000-0000-0000-0000-000000000002',
    4, 'Love the texture',
    'The skin quiz matched me with products that actually work for my combination skin. Serum absorbs beautifully.'
  ),
  (
    'a1000000-0000-0000-0000-000000000003',
    'b2000000-0000-0000-0000-000000000004',
    'c3000000-0000-0000-0000-000000000003',
    5, 'So hydrating!',
    'Beautiful packaging, even better results. The Petal Hydra Cream is so lightweight yet so moisturizing. Will buy again!'
  ),
  (
    'a1000000-0000-0000-0000-000000000001',
    'b2000000-0000-0000-0000-000000000002',
    NULL,
    4, 'Great colour payoff',
    'Stays on all day. I was skeptical but this really is long-lasting. Comfortable to wear too.'
  )
ON CONFLICT (user_id, product_id) DO NOTHING;

-- =============================================================================
-- VERIFY with these queries after running:
-- SELECT COUNT(*) FROM users;        -- expect: 5 (4 sample + 1 admin)
-- SELECT COUNT(*) FROM products;     -- expect: 8
-- SELECT COUNT(*) FROM orders;       -- expect: 4
-- SELECT COUNT(*) FROM order_items;  -- expect: 6
-- SELECT COUNT(*) FROM reviews;      -- expect: 4
-- =============================================================================
