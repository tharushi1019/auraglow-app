/**
 * =============================================================================
 *  AuraGlow — Product Service (frontend/src/services/productService.js)
 *  Module 2: Product Catalog & Search (Keshara)
 * =============================================================================
 */

import { products as mockProducts, categories as mockCategories } from '@/data/mockData';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api/v1';

/**
 * Fetch products with filtering, search, and sorting
 */
export async function getProducts(params = {}) {
  try {
    const query = new URLSearchParams();
    if (params.search) query.append('search', params.search);
    if (params.category && params.category !== 'all') query.append('category', params.category);
    if (params.minPrice) query.append('minPrice', params.minPrice);
    if (params.maxPrice) query.append('maxPrice', params.maxPrice);
    if (params.isVegan) query.append('isVegan', 'true');
    if (params.isCrueltyFree) query.append('isCrueltyFree', 'true');
    if (params.inStock) query.append('inStock', 'true');
    if (params.sort) query.append('sort', params.sort);
    if (params.page) query.append('page', params.page);
    if (params.limit) query.append('limit', params.limit);

    const res = await fetch(`${API_BASE}/products?${query.toString()}`);
    if (!res.ok) throw new Error('API fetch failed');
    const data = await res.json();
    if (data && data.success && Array.isArray(data.products)) {
      return data;
    }
    throw new Error('Invalid API response format');
  } catch {
    // Client-side fallback filter
    return filterMockProducts(params);
  }
}

/**
 * Fetch a single product by ID
 */
export async function getProductById(id) {
  try {
    const res = await fetch(`${API_BASE}/products/${id}`);
    if (!res.ok) throw new Error('API fetch failed');
    const data = await res.json();
    if (data && data.success && data.product) {
      return data.product;
    }
    throw new Error('Product not found in API');
  } catch {
    const found = mockProducts.find(p => p.id === id || p.id.toLowerCase() === id.toLowerCase());
    return found || null;
  }
}

/**
 * Fetch all categories with product count
 */
export async function getCategories() {
  try {
    const res = await fetch(`${API_BASE}/products/categories`);
    if (!res.ok) throw new Error('API fetch failed');
    const data = await res.json();
    if (data && data.success && Array.isArray(data.categories)) {
      return data.categories;
    }
    throw new Error('Categories failed');
  } catch {
    return mockCategories.map(cat => ({
      ...cat,
      count: mockProducts.filter(p => p.category === cat.slug).length,
    }));
  }
}

/**
 * Fetch featured products
 */
export async function getFeaturedProducts() {
  try {
    const res = await fetch(`${API_BASE}/products/featured`);
    if (!res.ok) throw new Error('API fetch failed');
    const data = await res.json();
    if (data && data.success && Array.isArray(data.products)) {
      return data.products;
    }
    throw new Error('Featured products failed');
  } catch {
    return mockProducts.slice(0, 4);
  }
}

/**
 * Fetch related products
 */
export async function getRelatedProducts(id) {
  try {
    const res = await fetch(`${API_BASE}/products/${id}/related`);
    if (!res.ok) throw new Error('API fetch failed');
    const data = await res.json();
    if (data && data.success && Array.isArray(data.products)) {
      return data.products;
    }
    throw new Error('Related products failed');
  } catch {
    const current = mockProducts.find(p => p.id === id);
    if (!current) return mockProducts.slice(0, 4);
    const related = mockProducts.filter(
      p => p.id !== id && (p.category === current.category || p.tags.some(t => current.tags.includes(t)))
    );
    return related.length > 0 ? related.slice(0, 4) : mockProducts.filter(p => p.id !== id).slice(0, 4);
  }
}

/**
 * Helper: Client-side mock filtering fallback
 */
function filterMockProducts(params = {}) {
  let list = [...mockProducts];

  if (params.search && params.search.trim()) {
    const q = params.search.trim().toLowerCase();
    list = list.filter(
      p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        (p.tags && p.tags.some(t => t.toLowerCase().includes(q))) ||
        (p.ingredients && p.ingredients.some(i => i.toLowerCase().includes(q)))
    );
  }

  if (params.category && params.category !== 'all') {
    list = list.filter(p => p.category.toLowerCase() === params.category.toLowerCase());
  }

  if (params.minPrice) {
    list = list.filter(p => p.price >= Number(params.minPrice));
  }
  if (params.maxPrice) {
    list = list.filter(p => p.price <= Number(params.maxPrice));
  }

  if (params.isVegan) {
    list = list.filter(p => p.isVegan === true);
  }
  if (params.isCrueltyFree) {
    list = list.filter(p => p.isCrueltyFree === true);
  }
  if (params.inStock) {
    list = list.filter(p => p.stock > 0);
  }

  switch (params.sort) {
    case 'price-asc':
      list.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      list.sort((a, b) => b.price - a.price);
      break;
    case 'rating-desc':
      list.sort((a, b) => b.rating - a.rating);
      break;
    case 'name-asc':
      list.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case 'bestseller':
    default:
      list.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0));
      break;
  }

  const page = parseInt(params.page || 1, 10);
  const limit = parseInt(params.limit || 20, 10);
  const start = (page - 1) * limit;

  return {
    success: true,
    total: list.length,
    count: list.slice(start, start + limit).length,
    page,
    totalPages: Math.ceil(list.length / limit) || 1,
    products: list.slice(start, start + limit),
  };
}
