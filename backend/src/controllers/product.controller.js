/**
 * =============================================================================
 *  AuraGlow — Product Controller (backend/src/controllers/product.controller.js)
 *  Module 2: Product Catalog & Search (Keshara)
 * =============================================================================
 */

// Fallback seed / mock data in case Supabase client is not configured
const initialProducts = [
  {
    id: 'prod-001',
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
    howToUse: 'Apply directly from bullet starting in center of lips and moving outwards. Layer for intense bold color.',
    skinTypes: ['All Skin Tones'],
    image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=500&q=80',
    imageGallery: [
      'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=800&q=80'
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
    howToUse: 'Warm a pea-sized amount between fingertips and gently massage into face and neck in upward circular motions.',
    skinTypes: ['Dry Skin', 'Sensitive Skin', 'Dehydrated Skin'],
    image: 'https://images.unsplash.com/photo-1599305090598-fe179d501227?auto=format&fit=crop&w=500&q=80',
    imageGallery: [
      'https://images.unsplash.com/photo-1599305090598-fe179d501227?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1556228578-dd539282b964?auto=format&fit=crop&w=800&q=80'
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
    ingredients: ['Green Tea Extract', 'Aloe Vera', 'Glycerin', 'Salicylic Acid'],
    howToUse: 'Lather a small amount with lukewarm water and gently massage over damp face for 60 seconds. Rinse thoroughly.',
    skinTypes: ['Oily Skin', 'Combination Skin', 'Acne-Prone'],
    image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=500&q=80',
    imageGallery: [
      'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=800&q=80'
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
    ingredients: ['Jasmine Absolute', 'Rose Otto', 'Sandalwood', 'Musk', 'Bergamot'],
    howToUse: 'Spritz onto pulse points (wrists, neck, behind ears) from 6 inches away. Do not rub wrists together.',
    skinTypes: ['All Skin Types'],
    image: 'https://images.unsplash.com/photo-1557170334-a9632e77c6e4?auto=format&fit=crop&w=500&q=80',
    imageGallery: [
      'https://images.unsplash.com/photo-1557170334-a9632e77c6e4?auto=format&fit=crop&w=800&q=80'
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
    ingredients: ['Synthetic Taklon Fibers', 'Recycled Aluminum Ferrule', 'FSC Certified Wood Handle'],
    howToUse: 'Use round brush for blending shadows, angled brush for crease contour, and flat brush for high-pigment packing.',
    skinTypes: ['All Skin Types'],
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=500&q=80',
    imageGallery: [
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80'
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
    let result = [...initialProducts];
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
    const product = initialProducts.find(p => p.id === id || p.id.toLowerCase() === id.toLowerCase());

    if (!product) {
      return res.status(404).json({
        success: false,
        message: `Product with ID '${id}' not found`,
      });
    }

    res.json({
      success: true,
      product,
    });
  } catch (error) {
    next(error);
  }
};

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
    const product = initialProducts.find(p => p.id === id);

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
