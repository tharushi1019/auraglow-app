/**
 * =============================================================================
 *  AuraGlow — Product Controller (backend/src/controllers/product.controller.js)
 *  Module 2: Product Catalog & Search (Keshara)
 * =============================================================================
 */

const supabase = require('../config/supabaseClient');

const LEGACY_PRODUCT_ID_MAP = {
  'prod-001': 'b2000000-0000-0000-0000-000000000001',
  'prod-002': 'b2000000-0000-0000-0000-000000000002',
  'prod-003': 'b2000000-0000-0000-0000-000000000003',
  'prod-004': 'b2000000-0000-0000-0000-000000000004',
  'prod-005': 'b2000000-0000-0000-0000-000000000005',
  'prod-006': 'b2000000-0000-0000-0000-000000000006',
  'prod-007': 'b2000000-0000-0000-0000-000000000007',
  'prod-008': 'b2000000-0000-0000-0000-000000000008',
};

function resolveProductId(id) {
  if (!id || typeof id !== 'string') return id;
  const trimmed = id.trim();
  if (!trimmed) return trimmed;
  const legacyMatch = LEGACY_PRODUCT_ID_MAP[trimmed.toLowerCase()];
  if (legacyMatch) return legacyMatch;
  return trimmed;
}

function normalizeProductRecord(product) {
  if (!product || !product.id) return product;
  return {
    ...product,
    id: resolveProductId(product.id),
  };
}

// Fallback seed / mock data in case Supabase client is not configured
const initialProducts = [
  {
    id: 'b2000000-0000-0000-0000-000000000001',
    name: 'Radiant Glow Serum',
    brand: 'AuraGlow',
    category: 'skincare',
    price: 8900,
    oldPrice: 12000,
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
    howToUse: 'Apply 3-4 drops to cleansed face and neck every morning and evening before moisturizing. Gently pat until fully absorbed.',
    skinTypes: ['All Skin Types', 'Dull Skin', 'Dry Skin', 'Combination'],
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=500&q=80',
    imageGallery: [
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1556228578-dd539282b964?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80'
    ],
  },
  {
    id: 'b2000000-0000-0000-0000-000000000002',
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
    howToUse: 'Apply directly from bullet starting in center of lips and moving outwards. Layer for intense bold color.',
    skinTypes: ['All Skin Tones'],
    image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=500&q=80',
    imageGallery: [
      'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=800&q=80'
    ],
  },
  {
    id: 'b2000000-0000-0000-0000-000000000003',
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
    howToUse: 'Warm a pea-sized amount between fingertips and gently massage into face and neck in upward circular motions.',
    skinTypes: ['Dry Skin', 'Sensitive Skin', 'Dehydrated Skin'],
    image: 'https://images.unsplash.com/photo-1599305090598-fe179d501227?auto=format&fit=crop&w=500&q=80',
    imageGallery: [
      'https://images.unsplash.com/photo-1599305090598-fe179d501227?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1556228578-dd539282b964?auto=format&fit=crop&w=800&q=80'
    ],
  },
  {
    id: 'b2000000-0000-0000-0000-000000000004',
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
    ingredients: ['Mica', 'Titanium Dioxide', 'Vitamin E', 'Zinc Stearate'],
    howToUse: 'Use lighter shades as base or highlighter, medium shades for contouring the crease, and deep tones along lash line.',
    skinTypes: ['All Skin Tones'],
    image: 'https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=500&q=80',
    imageGallery: [
      'https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=800&q=80'
    ],
  },
  {
    id: 'b2000000-0000-0000-0000-000000000005',
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
    ingredients: ['Green Tea Extract', 'Aloe Vera', 'Glycerin', 'Salicylic Acid'],
    howToUse: 'Lather a small amount with lukewarm water and gently massage over damp face for 60 seconds. Rinse thoroughly.',
    skinTypes: ['Oily Skin', 'Combination Skin', 'Acne-Prone'],
    image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=500&q=80',
    imageGallery: [
      'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=800&q=80'
    ],
  },
  {
    id: 'b2000000-0000-0000-0000-000000000006',
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
    ingredients: ['Jasmine Absolute', 'Rose Otto', 'Sandalwood', 'Musk', 'Bergamot'],
    howToUse: 'Spritz onto pulse points (wrists, neck, behind ears) from 6 inches away. Do not rub wrists together.',
    skinTypes: ['All Skin Types'],
    image: 'https://images.unsplash.com/photo-1557170334-a9632e77c6e4?auto=format&fit=crop&w=500&q=80',
    imageGallery: [
      'https://images.unsplash.com/photo-1557170334-a9632e77c6e4?auto=format&fit=crop&w=800&q=80'
    ],
  },
  {
    id: 'b2000000-0000-0000-0000-000000000007',
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
    ingredients: ['Synthetic Taklon Fibers', 'Recycled Aluminum Ferrule', 'FSC Certified Wood Handle'],
    howToUse: 'Use round brush for blending shadows, angled brush for crease contour, and flat brush for high-pigment packing.',
    skinTypes: ['All Skin Types'],
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=500&q=80',
    imageGallery: [
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80'
    ],
  },
  {
    id: 'b2000000-0000-0000-0000-000000000008',
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
    ingredients: ['Zinc Oxide', 'Niacinamide', 'Hyaluronic Acid', 'Centella Asiatica'],
    howToUse: 'Apply generously 15 minutes before sun exposure as the final step in skincare. Reapply every 2 hours.',
    skinTypes: ['All Skin Types', 'Sensitive Skin', 'Sun-Sensitive'],
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=500&q=80',
    imageGallery: [
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80'
    ],
  },
];

const categoriesData = [
  { id: 'cat-1', slug: 'skincare', name: 'Skincare', count: 4, description: 'Serums, moisturizers & treatments' },
  { id: 'cat-2', slug: 'makeup', name: 'Makeup', count: 2, description: 'Lips, eyes, face & more' },
  { id: 'cat-3', slug: 'fragrance', name: 'Fragrance', count: 1, description: 'Perfumes & body mists' },
  { id: 'cat-4', slug: 'tools', name: 'Tools', count: 1, description: 'Brushes, devices & accessories' },
];

/**
 * GET /api/v1/products
 * Query Params: search, category, minPrice, maxPrice, isVegan, isCrueltyFree, inStock, sort, page, limit
 */
exports.getProducts = async (req, res, next) => {
  try {
    // ── Try to fetch live products from Supabase first ──────────────────────
    let result = [];
    const { data: dbProducts, error: dbErr } = await supabase
      .from('products')
      .select('id, name, brand, category, price, stock_quantity, is_vegan, is_cruelty_free, images, description, clean_beauty_tags, shades')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (dbErr) {
      console.error('[Products] Catalog query failed:', dbErr.message);
      return res.status(503).json({ success: false, message: 'The product catalog is temporarily unavailable.' });
    }
    result = (dbProducts || []).map(p => ({
      id: p.id,
      name: p.name || '',
      brand: p.brand || 'AuraGlow',
      category: (p.category || 'skincare').toLowerCase(),
      price: parseFloat(p.price) || 0,
      oldPrice: null,
      stock: p.stock_quantity ?? 0,
      rating: 4.7,
      reviewCount: 100,
      isVegan: p.is_vegan ?? false,
      isCrueltyFree: p.is_cruelty_free ?? true,
      tags: Array.isArray(p.clean_beauty_tags) ? p.clean_beauty_tags : [],
      shades: Array.isArray(p.shades) ? p.shades : [],
      badge: p.is_vegan ? '🌱 Vegan' : '🐰 Cruelty-Free',
      badgeClass: p.is_vegan ? 'badge-vegan' : 'badge-cruelty-free',
      description: p.description || '',
      ingredients: [],
      image: (Array.isArray(p.images) && p.images.length > 0)
        ? p.images[0]
        : 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=500&q=80',
      imageGallery: Array.isArray(p.images) ? p.images : [],
    }));
    const {
      search,
      category,
      minPrice,
      maxPrice,
      isVegan,
      isCrueltyFree,
      inStock,
      sort,
      page = 1,
      limit = 20,
    } = req.query;

    // Search filter
    if (search && search.trim() !== '') {
      const q = search.trim().toLowerCase();
      result = result.filter(
        p =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          (p.tags && p.tags.some(t => t.toLowerCase().includes(q))) ||
          (p.ingredients && p.ingredients.some(i => i.toLowerCase().includes(q)))
      );
    }

    // Category filter
    if (category && category !== 'all') {
      result = result.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }

    // Price filtering (raw LKR)
    if (minPrice) {
      result = result.filter(p => p.price >= Number(minPrice));
    }
    if (maxPrice) {
      result = result.filter(p => p.price <= Number(maxPrice));
    }

    // Boolean flags
    if (isVegan === 'true') {
      result = result.filter(p => p.isVegan === true);
    }
    if (isCrueltyFree === 'true') {
      result = result.filter(p => p.isCrueltyFree === true);
    }
    if (inStock === 'true') {
      result = result.filter(p => p.stock > 0);
    }

    // Sorting
    switch (sort) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating-desc':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'name-asc':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'bestseller':
      default:
        result.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0));
        break;
    }

    const total = result.length;
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const startIndex = (pageNum - 1) * limitNum;
    const paginatedProducts = result.slice(startIndex, startIndex + limitNum);

    res.json({
      success: true,
      total,
      count: paginatedProducts.length,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum) || 1,
      products: paginatedProducts,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/v1/products/:id
 */
exports.getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const canonicalId = resolveProductId(id);

    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(canonicalId);
    if (isUuid) {
      const { data: dbProduct, error: dbError } = await supabase
        .from('products')
        .select('id, name, brand, category, price, stock_quantity, is_vegan, is_cruelty_free, images, description, clean_beauty_tags, shades')
        .eq('id', canonicalId)
        .maybeSingle();
      if (dbError) {
        console.error('[ProductById] Product lookup failed:', dbError.message);
        return res.status(503).json({ success: false, message: 'Product details are temporarily unavailable.' });
      }
      if (dbProduct) {
        return res.json({
          success: true,
          product: {
            id: dbProduct.id,
            name: dbProduct.name || '',
            brand: dbProduct.brand || 'AuraGlow',
            category: (dbProduct.category || 'skincare').toLowerCase(),
            price: parseFloat(dbProduct.price) || 0,
            stock: dbProduct.stock_quantity ?? 0,
            isVegan: dbProduct.is_vegan ?? false,
            isCrueltyFree: dbProduct.is_cruelty_free ?? true,
            tags: Array.isArray(dbProduct.clean_beauty_tags) ? dbProduct.clean_beauty_tags : [],
            shades: Array.isArray(dbProduct.shades) ? dbProduct.shades : [],
            description: dbProduct.description || '',
            ingredients: [],
            image: (Array.isArray(dbProduct.images) && dbProduct.images.length > 0)
              ? dbProduct.images[0]
              : 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=500&q=80',
            imageGallery: Array.isArray(dbProduct.images) ? dbProduct.images : [],
          },
        });
      }
    }

    return res.status(404).json({
      success: false,
      message: `Product with ID '${id}' not found`,
    });
  } catch (error) {
    next(error);
  }
};

exports.resolveProductId = resolveProductId;

/**
 * GET /api/v1/products/categories
 */
exports.getCategories = async (req, res, next) => {
  try {
    const categoriesWithCount = categoriesData.map(cat => {
      const count = initialProducts.filter(p => p.category === cat.slug).length;
      return { ...cat, count };
    });

    res.json({
      success: true,
      categories: categoriesWithCount,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/v1/products/featured
 */
exports.getFeaturedProducts = async (req, res, next) => {
  try {
    const featured = initialProducts.slice(0, 4);
    res.json({
      success: true,
      products: featured,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/v1/products/:id/related
 */
exports.getRelatedProducts = async (req, res, next) => {
  try {
    const { id } = req.params;
    const canonicalId = resolveProductId(id);
    const product = initialProducts.find(p => resolveProductId(p.id) === canonicalId || p.id.toLowerCase() === canonicalId.toLowerCase());

    let related = [];
    if (product) {
      related = initialProducts
        .filter(p => p.id !== id && (p.category === product.category || p.tags.some(t => product.tags.includes(t))))
        .slice(0, 4);
    }

    if (related.length === 0) {
      related = initialProducts.filter(p => p.id !== id).slice(0, 4);
    }

    res.json({
      success: true,
      products: related,
    });
  } catch (error) {
    next(error);
  }
};

exports.initialProducts = initialProducts;
