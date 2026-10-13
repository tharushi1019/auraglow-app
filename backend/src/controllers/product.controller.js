/**
 * =============================================================================
 *  AuraGlow — Product Controller (backend/src/controllers/product.controller.js)
 *  Module 2: Product Catalog & Search — FULLY DYNAMIC (database-only)
 * =============================================================================
 *  All product data comes from Supabase. No hardcoded fallback product arrays.
 *  - /products         → live catalog with filtering & sorting
 *  - /products/featured → top-selling products from order_items aggregation
 *  - /products/categories → live category counts from DB
 *  - /products/:id     → single product by UUID
 *  - /products/:id/related → same-category products from DB
 * =============================================================================
 */

const supabase = require('../config/supabaseClient');

// ─── Retry helper for transient network errors (fetch failed / ECONNRESET) ────
/**
 * Retries a Supabase query function up to `maxAttempts` times.
 * Only retries on transient network errors, not on logical errors.
 */
async function withRetry(fn, maxAttempts = 3, delayMs = 500) {
  let lastError;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const result = await fn();
      // Supabase returns { data, error }. Retry only on network-level fetch errors.
      if (result.error && isNetworkError(result.error.message)) {
        lastError = result.error;
        if (attempt < maxAttempts) {
          console.warn(`[Retry] Attempt ${attempt}/${maxAttempts} failed (network): ${result.error.message}. Retrying in ${delayMs}ms...`);
          await new Promise(r => setTimeout(r, delayMs * attempt));
          continue;
        }
      }
      return result;
    } catch (err) {
      lastError = err;
      if (isNetworkError(err.message) && attempt < maxAttempts) {
        console.warn(`[Retry] Attempt ${attempt}/${maxAttempts} threw: ${err.message}. Retrying in ${delayMs}ms...`);
        await new Promise(r => setTimeout(r, delayMs * attempt));
      } else {
        throw err;
      }
    }
  }
  throw lastError || new Error('Max retry attempts reached');
}

function isNetworkError(msg = '') {
  const m = msg.toLowerCase();
  return m.includes('fetch failed') || m.includes('econnreset') || m.includes('econnrefused') || m.includes('network') || m.includes('etimedout');
}

// ─── Shared helpers ───────────────────────────────────────────────────────────

function mapDbProduct(p, salesCount = 0) {
  const images = Array.isArray(p.images) ? p.images : [];
  return {
    id:           p.id,
    name:         p.name || '',
    brand:        p.brand || 'AuraGlow',
    category:     (p.category || 'skincare').toLowerCase(),
    price:        parseFloat(p.price) || 0,
    oldPrice:     p.compare_at_price ? parseFloat(p.compare_at_price) : null,
    stock:        p.stock_quantity ?? 0,
    rating:       parseFloat(p.avg_rating) || 4.5,
    reviewCount:  parseInt(p.review_count, 10) || 0,
    salesCount,
    isVegan:      p.is_vegan ?? false,
    isCrueltyFree: p.is_cruelty_free ?? true,
    tags:         Array.isArray(p.clean_beauty_tags) ? p.clean_beauty_tags : [],
    shades:       Array.isArray(p.shades) ? p.shades : [],
    skinTypes:    Array.isArray(p.skin_types_compatible) ? p.skin_types_compatible : [],
    concerns:     Array.isArray(p.concerns_addressed) ? p.concerns_addressed : [],
    badge:        p.is_vegan ? '🌱 Vegan' : '🐰 Cruelty-Free',
    badgeClass:   p.is_vegan ? 'badge-vegan' : 'badge-cruelty-free',
    description:  p.description || '',
    ingredients:  Array.isArray(p.ingredients) ? p.ingredients : [],
    howToUse:     p.how_to_use || '',
    image:        images[0] || 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=500&q=80',
    imageGallery: images,
  };
}

// ─── GET /api/v1/products ─────────────────────────────────────────────────────
exports.getProducts = async (req, res, next) => {
  try {
    const {
      search, category, minPrice, maxPrice,
      isVegan, isCrueltyFree, inStock,
      sort = 'bestseller', page = 1, limit = 20,
    } = req.query;

    // 1. Fetch all active products from Supabase
    const { data: dbProducts, error: dbErr } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (dbErr) {
      console.error('[Products] Catalog query failed:', dbErr.message);
      return res.status(503).json({ success: false, message: 'The product catalog is temporarily unavailable.' });
    }

    // 2. Fetch bestseller counts (units sold per product) from order_items
    let salesMap = {};
    try {
      const { data: salesData } = await supabase
        .from('order_items')
        .select('product_id, quantity');
      if (salesData) {
        salesData.forEach(row => {
          salesMap[row.product_id] = (salesMap[row.product_id] || 0) + (row.quantity || 1);
        });
      }
    } catch (salesErr) {
      console.warn('[Products] Sales aggregation note:', salesErr.message);
    }

    // 3. Fetch live ratings from reviews table
    let ratingsMap = {};
    try {
      const { data: reviewData } = await supabase
        .from('reviews')
        .select('product_id, rating');
      if (reviewData) {
        const grouped = {};
        reviewData.forEach(r => {
          if (!grouped[r.product_id]) grouped[r.product_id] = [];
          grouped[r.product_id].push(r.rating);
        });
        Object.entries(grouped).forEach(([pid, ratings]) => {
          ratingsMap[pid] = {
            avg: ratings.reduce((a, b) => a + b, 0) / ratings.length,
            count: ratings.length,
          };
        });
      }
    } catch (rErr) {
      console.warn('[Products] Ratings aggregation note:', rErr.message);
    }

    // 4. Map and enrich products
    let result = (dbProducts || []).map(p => {
      const ratingInfo = ratingsMap[p.id];
      return mapDbProduct({
        ...p,
        avg_rating:   ratingInfo ? ratingInfo.avg.toFixed(1) : (p.avg_rating || 4.5),
        review_count: ratingInfo ? ratingInfo.count : (p.review_count || 0),
      }, salesMap[p.id] || 0);
    });

    // 5. Apply filters
    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.tags.some(t => t.toLowerCase().includes(q))
      );
    }
    if (category && category !== 'all') {
      result = result.filter(p => p.category === category.toLowerCase());
    }
    if (minPrice) result = result.filter(p => p.price >= Number(minPrice));
    if (maxPrice) result = result.filter(p => p.price <= Number(maxPrice));
    if (isVegan === 'true') result = result.filter(p => p.isVegan);
    if (isCrueltyFree === 'true') result = result.filter(p => p.isCrueltyFree);
    if (inStock === 'true') result = result.filter(p => p.stock > 0);

    // 6. Sorting
    switch (sort) {
      case 'price-asc':    result.sort((a, b) => a.price - b.price); break;
      case 'price-desc':   result.sort((a, b) => b.price - a.price); break;
      case 'rating-desc':  result.sort((a, b) => b.rating - a.rating); break;
      case 'name-asc':     result.sort((a, b) => a.name.localeCompare(b.name)); break;
      case 'newest':       break; // already ordered by created_at desc
      case 'bestseller':
      default:             result.sort((a, b) => b.salesCount - a.salesCount || b.reviewCount - a.reviewCount); break;
    }

    // 7. Pagination
    const total    = result.length;
    const pageNum  = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const startIdx = (pageNum - 1) * limitNum;

    return res.json({
      success:    true,
      total,
      count:      result.slice(startIdx, startIdx + limitNum).length,
      page:       pageNum,
      totalPages: Math.ceil(total / limitNum) || 1,
      products:   result.slice(startIdx, startIdx + limitNum),
    });
  } catch (error) {
    next(error);
  }
};

// ─── GET /api/v1/products/featured ───────────────────────────────────────────
/**
 * Returns the top-selling products based on actual order_items data.
 * Falls back to highest-rated products if no sales data exists.
 */
exports.getFeaturedProducts = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 8;

    // Step 1: Aggregate sales counts from order_items
    let salesMap = {};
    try {
      const { data: salesData } = await supabase
        .from('order_items')
        .select('product_id, quantity');
      if (salesData) {
        salesData.forEach(row => {
          salesMap[row.product_id] = (salesMap[row.product_id] || 0) + (row.quantity || 1);
        });
      }
    } catch (e) {
      console.warn('[Featured] Sales aggregation note:', e.message);
    }

    // Step 2: Fetch active products
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true);

    if (error || !products) {
      return res.status(503).json({ success: false, message: 'Featured products unavailable.' });
    }

    // Step 3: Fetch ratings
    let ratingsMap = {};
    try {
      const { data: reviewData } = await supabase
        .from('reviews')
        .select('product_id, rating');
      if (reviewData) {
        const grouped = {};
        reviewData.forEach(r => {
          if (!grouped[r.product_id]) grouped[r.product_id] = [];
          grouped[r.product_id].push(r.rating);
        });
        Object.entries(grouped).forEach(([pid, ratings]) => {
          ratingsMap[pid] = {
            avg: ratings.reduce((a, b) => a + b, 0) / ratings.length,
            count: ratings.length,
          };
        });
      }
    } catch (e) {
      console.warn('[Featured] Ratings note:', e.message);
    }

    // Step 4: Enrich and sort by sales → rating → created_at
    const enriched = products.map(p => {
      const ratingInfo = ratingsMap[p.id];
      return mapDbProduct({
        ...p,
        avg_rating:   ratingInfo ? ratingInfo.avg.toFixed(1) : 4.5,
        review_count: ratingInfo ? ratingInfo.count : 0,
      }, salesMap[p.id] || 0);
    });

    enriched.sort((a, b) => b.salesCount - a.salesCount || b.rating - a.rating);
    const featured = enriched.slice(0, limit);

    return res.json({ success: true, products: featured });
  } catch (error) {
    next(error);
  }
};

// ─── GET /api/v1/products/categories ─────────────────────────────────────────
exports.getCategories = async (req, res, next) => {
  try {
    const { data: products, error } = await supabase
      .from('products')
      .select('category')
      .eq('is_active', true);

    const categoryMeta = {
      skincare:  { id: 'cat-1', slug: 'skincare',  name: 'Skincare',   description: 'Serums, moisturizers & treatments',  image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=600&q=80' },
      makeup:    { id: 'cat-2', slug: 'makeup',    name: 'Makeup',     description: 'Lips, eyes, face & more',            image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=600&q=80' },
      fragrance: { id: 'cat-3', slug: 'fragrance', name: 'Fragrance',  description: 'Perfumes & body mists',              image: 'https://images.unsplash.com/photo-1557170334-a9632e77c6e4?auto=format&fit=crop&w=600&q=80' },
      tools:     { id: 'cat-4', slug: 'tools',     name: 'Tools',      description: 'Brushes, devices & accessories',    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80' },
    };

    const countMap = {};
    if (!error && products) {
      products.forEach(p => {
        const cat = (p.category || 'skincare').toLowerCase();
        countMap[cat] = (countMap[cat] || 0) + 1;
      });
    }

    const categories = Object.values(categoryMeta).map(cat => ({
      ...cat,
      count: countMap[cat.slug] || 0,
    }));

    return res.json({ success: true, categories });
  } catch (error) {
    next(error);
  }
};

// ─── GET /api/v1/products/:id ─────────────────────────────────────────────────
exports.getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ success: false, message: 'Product ID is required.' });

    // Use withRetry to handle transient fetch failed / network blips
    const { data: product, error } = await withRetry(() =>
      supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .eq('is_active', true)
        .maybeSingle()
    );

    if (error) {
      console.error('[ProductById] Lookup failed:', error.message);
      return res.status(503).json({ success: false, message: 'Product details are temporarily unavailable. Please try again.' });
    }
    if (!product) {
      // Also try without is_active filter in case the flag is null/false in DB
      const { data: anyProduct } = await withRetry(() =>
        supabase.from('products').select('*').eq('id', id).maybeSingle()
      );
      if (!anyProduct) {
        return res.status(404).json({ success: false, message: `Product not found.` });
      }
      // Found but inactive — still return it so users don't hit a blank page
      console.warn(`[ProductById] Product '${id}' exists but is_active=false — serving anyway.`);
      return res.json({ success: true, product: mapDbProduct(anyProduct, 0) });
    }

    // Fetch live rating for this product
    let avg_rating = 4.5, review_count = 0;
    try {
      const { data: reviewData } = await withRetry(() =>
        supabase.from('reviews').select('rating').eq('product_id', id)
      );
      if (reviewData && reviewData.length > 0) {
        review_count = reviewData.length;
        avg_rating = (reviewData.reduce((a, r) => a + r.rating, 0) / review_count).toFixed(1);
      }
    } catch (e) {}

    // Fetch total units sold
    let salesCount = 0;
    try {
      const { data: salesData } = await withRetry(() =>
        supabase.from('order_items').select('quantity').eq('product_id', id)
      );
      if (salesData) salesCount = salesData.reduce((a, r) => a + (r.quantity || 1), 0);
    } catch (e) {}

    return res.json({
      success: true,
      product: mapDbProduct({ ...product, avg_rating, review_count }, salesCount),
    });
  } catch (error) {
    console.error('[ProductById] Unhandled error:', error.message);
    return res.status(503).json({ success: false, message: 'Product details are temporarily unavailable. Please try again.' });
  }
};

// ─── GET /api/v1/products/:id/related ────────────────────────────────────────
exports.getRelatedProducts = async (req, res, next) => {
  try {
    const { id } = req.params;
    const limit  = parseInt(req.query.limit, 10) || 4;

    // Find the product's category first
    const { data: currentProduct } = await supabase
      .from('products')
      .select('category')
      .eq('id', id)
      .eq('is_active', true)
      .maybeSingle();

    let query = supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .neq('id', id);

    if (currentProduct && currentProduct.category) {
      query = query.eq('category', currentProduct.category);
    }

    const { data: related, error } = await query.limit(limit);

    if (error || !related) {
      // Fallback: any random products
      const { data: fallback } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .neq('id', id)
        .limit(limit);
      return res.json({ success: true, products: (fallback || []).map(p => mapDbProduct(p)) });
    }

    return res.json({ success: true, products: related.map(p => mapDbProduct(p)) });
  } catch (error) {
    next(error);
  }
};

exports.resolveProductId = (id) => id;
