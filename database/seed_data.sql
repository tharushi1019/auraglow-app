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
