/**
 * =============================================================================
 *  AuraGlow — Product Service (frontend/src/services/productService.js)
 *  All product data comes from the backend API (which reads from Supabase).
 *  No mock data fallbacks — errors are surfaced properly.
 * =============================================================================
 */

const API_BASE = import.meta.env.VITE_API_BASE_URL
  || (import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api/v1` : 'http://localhost:5000/api/v1');

/**
 * Fetch products with filtering, search, and sorting
 */
export async function getProducts(params = {}) {
  const query = new URLSearchParams();
  if (params.search)                               query.append('search', params.search);
  if (params.category && params.category !== 'all') query.append('category', params.category);
  if (params.minPrice)                             query.append('minPrice', params.minPrice);
  if (params.maxPrice)                             query.append('maxPrice', params.maxPrice);
  if (params.isVegan)                              query.append('isVegan', 'true');
  if (params.isCrueltyFree)                        query.append('isCrueltyFree', 'true');
  if (params.inStock)                              query.append('inStock', 'true');
  if (params.sort)                                 query.append('sort', params.sort);
  if (params.page)                                 query.append('page', params.page);
  if (params.limit)                                query.append('limit', params.limit);

  const res  = await fetch(`${API_BASE}/products?${query.toString()}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || 'The product catalog is temporarily unavailable.');
  if (data && data.success && Array.isArray(data.products)) return data;
  throw new Error('Invalid API response format');
}

/**
 * Fetch a single product by ID — with automatic retry on transient network failures.
 * Retries up to 3 times with 800ms, 1600ms, 2400ms delays before giving up.
 * This prevents the black screen caused by momentary Supabase connectivity blips.
 */
export async function getProductById(id) {
  const maxAttempts = 3;
  let lastError;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const res  = await fetch(`${API_BASE}/products/${id}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || 'Product details are temporarily unavailable.');
      if (data && data.success && data.product) return data.product;
      throw new Error('Product not found');
    } catch (err) {
      lastError = err;
      const isNetworkError = (
        err.message.toLowerCase().includes('fetch') ||
        err.message.toLowerCase().includes('network') ||
        err.message.toLowerCase().includes('failed to fetch') ||
        err.name === 'TypeError'
      );
      if (isNetworkError && attempt < maxAttempts) {
        console.warn(`[productService] Attempt ${attempt}/${maxAttempts} failed (${err.message}). Retrying in ${attempt * 800}ms...`);
        await new Promise(r => setTimeout(r, attempt * 800));
      } else {
        break;
      }
    }
  }
  throw lastError;
}

/**
 * Fetch all categories with live product count
 */
export async function getCategories() {
  const res  = await fetch(`${API_BASE}/products/categories`);
  if (!res.ok) throw new Error('Could not load categories');
  const data = await res.json();
  if (data && data.success && Array.isArray(data.categories)) return data.categories;
  throw new Error('Invalid categories response');
}

/**
 * Fetch featured / trending products (sorted by real sales data)
 */
export async function getFeaturedProducts(limit = 8) {
  const res  = await fetch(`${API_BASE}/products/featured?limit=${limit}`);
  if (!res.ok) throw new Error('Could not load featured products');
  const data = await res.json();
  if (data && data.success && Array.isArray(data.products)) return data.products;
  throw new Error('Invalid featured products response');
}

/**
 * Fetch related products — non-critical, never fails the page.
 * Returns empty array on any error so the product detail page still loads.
 */
export async function getRelatedProducts(id, limit = 4) {
  try {
    const res  = await fetch(`${API_BASE}/products/${id}/related?limit=${limit}`);
    if (!res.ok) return [];
    const data = await res.json();
    if (data && data.success && Array.isArray(data.products)) return data.products;
    return [];
  } catch {
    return []; // related products are non-critical — silently return empty
  }
}
