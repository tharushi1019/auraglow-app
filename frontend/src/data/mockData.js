/**
 * =============================================================================
 *  AuraGlow — Shared Mock Data  (frontend/src/data/mockData.js)
 * =============================================================================
 *  ⚠️  IMPORTANT FOR ALL TEAM MEMBERS  ⚠️
 *
 *  Import your data FROM THIS FILE instead of hardcoding it in your component.
 *  This keeps products, categories, images, and prices consistent across every
 *  module so the app never looks broken.
 *
 *  Usage:
 *    import { products, categories, orders, users } from '@/data/mockData';
 *
 *  All prices are stored as raw LKR numbers (e.g. 8900 = Rs. 8,900).
 *  Use the useCurrency() hook + formatPrice() to display them correctly.
 * =============================================================================
 */

// ─── CATEGORIES ──────────────────────────────────────────────────────────────

export const categories = [
  {
    id: 'cat-1',
    slug: 'skincare',
    name: 'Skincare',
    description: 'Serums, moisturizers & treatments',
    image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'cat-2',
    slug: 'makeup',
    name: 'Makeup',
    description: 'Lips, eyes, face & more',
    image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'cat-3',
    slug: 'fragrance',
    name: 'Fragrance',
    description: 'Perfumes & body mists',
    image: 'https://images.unsplash.com/photo-1557170334-a9632e77c6e4?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'cat-4',
    slug: 'tools',
    name: 'Tools',
    description: 'Brushes, devices & accessories',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80',
  },
];

// ─── PRODUCTS ─────────────────────────────────────────────────────────────────

export const products = [
  {
    id: 'prod-001',
    name: 'Radiant Glow Serum',
    brand: 'AuraGlow',
    category: 'skincare',
    price: 8900,          // LKR
    oldPrice: 12000,      // LKR (null = no discount)
    stock: 45,
    rating: 4.8,
    reviewCount: 2340,
    isVegan: true,
    isCrueltyFree: true,
    tags: ['serum', 'brightening', 'vitamin-c'],
    badge: '🌱 Vegan',
    badgeClass: 'badge-vegan',
    description: 'A lightweight, fast-absorbing serum powered by Vitamin C and Rose Hip Oil to brighten, even tone, and protect your skin.',
    ingredients: ['Vitamin C', 'Rose Hip Oil', 'Niacinamide', 'Hyaluronic Acid'],
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=500&q=80',
    imageGallery: [
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1556228578-dd539282b964?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    id: 'prod-002',
    name: 'Velvet Matte Lipstick',
    brand: 'AuraGlow',
    category: 'makeup',
    price: 4500,
    oldPrice: null,
    stock: 12,
    rating: 4.6,
    reviewCount: 1820,
    isVegan: false,
    isCrueltyFree: true,
    tags: ['lipstick', 'matte', 'long-lasting'],
    badge: '🐰 Cruelty-Free',
    badgeClass: 'badge-cruelty-free',
    description: 'Intensely pigmented matte lipstick with a comfortable, all-day wear formula. No drying, no fading.',
    ingredients: ['Shea Butter', 'Vitamin E', 'Jojoba Oil'],
    image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=500&q=80',
    imageGallery: [
      'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    id: 'prod-003',
    name: 'Petal Hydra Cream',
    brand: 'AuraGlow',
    category: 'skincare',
    price: 7200,
    oldPrice: 9000,
    stock: 0,
    rating: 4.9,
    reviewCount: 3105,
    isVegan: true,
    isCrueltyFree: true,
    tags: ['moisturizer', 'hydration', 'sensitive-skin'],
    badge: '🌱 Vegan',
    badgeClass: 'badge-vegan',
    description: 'A rich yet lightweight moisturizer infused with Hyaluronic Acid and Petal Extract for 72-hour deep hydration.',
    ingredients: ['Hyaluronic Acid', 'Rose Petal Extract', 'Ceramides', 'Squalane'],
    image: 'https://images.unsplash.com/photo-1599305090598-fe179d501227?auto=format&fit=crop&w=500&q=80',
    imageGallery: [
      'https://images.unsplash.com/photo-1599305090598-fe179d501227?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    id: 'prod-004',
    name: 'Rose Gold Eye Palette',
    brand: 'AuraGlow',
    category: 'makeup',
    price: 11000,
    oldPrice: null,
    stock: 85,
    rating: 4.7,
    reviewCount: 980,
    isVegan: false,
    isCrueltyFree: true,
    tags: ['eyeshadow', 'palette', 'rose-gold'],
    badge: '🐰 Cruelty-Free',
    badgeClass: 'badge-cruelty-free',
    description: '12 highly blendable, richly pigmented shades in warm rose-gold tones. Perfect for day-to-night looks.',
    ingredients: ['Mica', 'Titanium Dioxide', 'Vitamin E'],
    image: 'https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=500&q=80',
    imageGallery: [
      'https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    id: 'prod-005',
    name: 'Green Tea Cleansing Foam',
    brand: 'AuraGlow',
    category: 'skincare',
    price: 3200,
    oldPrice: null,
    stock: 120,
    rating: 4.5,
    reviewCount: 670,
    isVegan: true,
    isCrueltyFree: true,
    tags: ['cleanser', 'green-tea', 'oily-skin'],
    badge: '🌱 Vegan',
    badgeClass: 'badge-vegan',
    description: 'A gentle, foaming cleanser with Green Tea Extract to remove impurities without stripping natural moisture.',
    ingredients: ['Green Tea Extract', 'Aloe Vera', 'Glycerin'],
    image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=500&q=80',
    imageGallery: [
      'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    id: 'prod-006',
    name: 'Midnight Bloom Perfume',
    brand: 'AuraGlow',
    category: 'fragrance',
    price: 15500,
    oldPrice: 18000,
    stock: 30,
    rating: 4.8,
    reviewCount: 420,
    isVegan: true,
    isCrueltyFree: true,
    tags: ['perfume', 'floral', 'luxury'],
    badge: '🌱 Vegan',
    badgeClass: 'badge-vegan',
    description: 'A luxurious floral-musk fragrance with top notes of jasmine and base notes of sandalwood. Long-lasting 8-hour wear.',
    ingredients: ['Jasmine Absolute', 'Rose Otto', 'Sandalwood', 'Musk'],
    image: 'https://images.unsplash.com/photo-1557170334-a9632e77c6e4?auto=format&fit=crop&w=500&q=80',
    imageGallery: [
      'https://images.unsplash.com/photo-1557170334-a9632e77c6e4?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    id: 'prod-007',
    name: 'Pro Blending Brush Set',
    brand: 'AuraGlow',
    category: 'tools',
    price: 6800,
    oldPrice: null,
    stock: 55,
    rating: 4.6,
    reviewCount: 310,
    isVegan: true,
    isCrueltyFree: true,
    tags: ['brush', 'tools', 'makeup-artist'],
    badge: '🌱 Vegan',
    badgeClass: 'badge-vegan',
    description: 'A 5-piece professional blending brush set with synthetic bristles. Vegan, ultra-soft, and easy to clean.',
    ingredients: [],
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=500&q=80',
    imageGallery: [
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    id: 'prod-008',
    name: 'SPF 50 Sunscreen Fluid',
    brand: 'AuraGlow',
    category: 'skincare',
    price: 5500,
    oldPrice: null,
    stock: 90,
    rating: 4.7,
    reviewCount: 1450,
    isVegan: true,
    isCrueltyFree: true,
    tags: ['sunscreen', 'spf50', 'daily'],
    badge: '🌱 Vegan',
    badgeClass: 'badge-vegan',
    description: 'Lightweight, invisible SPF 50 fluid that protects against UVA/UVB rays. No white cast. Suitable for all skin types.',
    ingredients: ['Zinc Oxide', 'Niacinamide', 'Hyaluronic Acid'],
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=500&q=80',
    imageGallery: [
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80',
    ],
  },
];

// ─── ORDERS (mock) ────────────────────────────────────────────────────────────

export const orders = [
  {
    id: 'ORD-8901',
    customer: { name: 'Sasha R.', email: 'sasha@example.com', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
    items: [{ productId: 'prod-001', qty: 1 }, { productId: 'prod-003', qty: 1 }],
    total: 16100,         // LKR
    status: 'Processing',
    date: '2026-08-24',
    address: '14 Galle Road, Colombo 03',
  },
  {
    id: 'ORD-8900',
    customer: { name: 'Anika P.', email: 'anika@example.com', avatar: 'https://randomuser.me/api/portraits/women/68.jpg' },
    items: [{ productId: 'prod-001', qty: 1 }],
    total: 8900,
    status: 'Shipped',
    date: '2026-08-23',
    address: '72 Flower Road, Kandy',
  },
  {
    id: 'ORD-8899',
    customer: { name: 'Leila M.', email: 'leila@example.com', avatar: 'https://randomuser.me/api/portraits/women/55.jpg' },
    items: [{ productId: 'prod-004', qty: 1 }, { productId: 'prod-008', qty: 2 }],
    total: 22000,
    status: 'Delivered',
    date: '2026-08-21',
    address: '3 Station Road, Galle',
  },
  {
    id: 'ORD-8898',
    customer: { name: 'Keshara D.', email: 'keshara@example.com', avatar: 'https://randomuser.me/api/portraits/women/32.jpg' },
    items: [{ productId: 'prod-002', qty: 1 }],
    total: 4500,
    status: 'Pending',
    date: '2026-08-20',
    address: '55 Baseline Road, Colombo 09',
  },
];

// ─── USERS (mock) ─────────────────────────────────────────────────────────────

export const users = [
  { id: 'usr-1', name: 'Sasha R.',   email: 'sasha@example.com',   skinType: 'Dry',         avatar: 'https://randomuser.me/api/portraits/women/44.jpg', role: 'customer' },
  { id: 'usr-2', name: 'Anika P.',   email: 'anika@example.com',   skinType: 'Combination', avatar: 'https://randomuser.me/api/portraits/women/68.jpg', role: 'customer' },
  { id: 'usr-3', name: 'Leila M.',   email: 'leila@example.com',   skinType: 'Sensitive',   avatar: 'https://randomuser.me/api/portraits/women/55.jpg', role: 'customer' },
  { id: 'usr-4', name: 'Tharushi W.', email: 'tharushi@example.com', skinType: 'Normal',   avatar: 'https://randomuser.me/api/portraits/women/12.jpg', role: 'admin'    },
];

// ─── REVIEWS (mock) ───────────────────────────────────────────────────────────

export const reviews = [
  { id: 'rev-1', productId: 'prod-001', userId: 'usr-1', rating: 5, title: 'Game changer!', body: 'The Radiant Serum changed my skin completely. I get compliments every single day. AuraGlow is the only brand I trust!', date: '2026-08-10', verified: true },
  { id: 'rev-2', productId: 'prod-001', userId: 'usr-2', rating: 4, title: 'Love the texture', body: 'The skin quiz matched me with products that actually work for my combination skin. Serum absorbs beautifully.', date: '2026-08-05', verified: true },
  { id: 'rev-3', productId: 'prod-003', userId: 'usr-3', rating: 5, title: 'So hydrating!', body: 'Beautiful packaging, even better results. The Petal Hydra Cream is so lightweight yet so moisturizing. Will buy again!', date: '2026-07-29', verified: true },
  { id: 'rev-4', productId: 'prod-002', userId: 'usr-1', rating: 4, title: 'Great colour payoff', body: 'Stays on all day. I was skeptical but this really is long-lasting. Comfortable to wear too.', date: '2026-08-12', verified: false },
];

// ─── SKIN QUIZ QUESTIONS ──────────────────────────────────────────────────────

export const skinQuizQuestions = [
  {
    id: 'q1',
    question: 'What is your skin type?',
    options: ['Dry', 'Oily', 'Combination', 'Sensitive', 'Normal'],
  },
  {
    id: 'q2',
    question: 'What is your main skin concern?',
    options: ['Dullness & Uneven Tone', 'Acne & Breakouts', 'Fine Lines & Wrinkles', 'Dryness & Dehydration', 'Dark Spots & Pigmentation'],
  },
  {
    id: 'q3',
    question: 'How would you describe your skin tone?',
    options: ['Fair', 'Light', 'Medium', 'Tan', 'Deep'],
  },
  {
    id: 'q4',
    question: 'Which ingredients do you prefer?',
    options: ['Natural & Botanical', 'Science-Backed (Acids, Retinol)', 'Fragrance-Free', 'No Preference'],
  },
  {
    id: 'q5',
    question: 'What is your daily routine like?',
    options: ['Minimal — 2 steps max', 'Standard — Cleanse, Tone, Moisturize', 'Full routine — 5+ steps', 'I am just starting out'],
  },
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────

/** Get a single product by its ID */
export const getProductById = (id) => products.find(p => p.id === id);

/** Get all products in a specific category */
export const getProductsByCategory = (slug) => products.filter(p => p.category === slug);

/** Get featured / best-seller products (first 4) */
export const getFeaturedProducts = () => products.slice(0, 4);

/** Get order status badge class */
export const getOrderBadgeClass = (status) => {
  const map = {
    Pending:    'badge-pending',
    Processing: 'badge-warning',
    Shipped:    'badge-info',
    Delivered:  'badge-success',
    Cancelled:  'badge-error',
  };
  return map[status] ?? 'badge';
};
