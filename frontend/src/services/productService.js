/**
 * =============================================================================
 *  AuraGlow — Product Service (frontend/src/services/productService.js)
 *  Module 2: Product Catalog & Search (Keshara)
 * =============================================================================
 */

import { products as mockProducts, categories as mockCategories } from '@/data/mockData';

const API_BASE = import.meta.env.VITE_API_BASE_URL || (import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api/v1` : 'http://localhost:5000/api/v1');

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
    const data = await res.json();
    if (!res.ok) throw new Error(data?.message || 'The product catalog is temporarily unavailable.');
    if (data && data.success && Array.isArray(data.products)) {
      return data;
    }
    throw new Error('Invalid API response format');
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error('Unable to reach the product catalog API. Check that the backend is running and the API URL is correct.');
    }
    throw new Error(error.message || 'Unable to load products.');
  }
}

/**
 * Fetch a single product by ID
 */
export async function getProductById(id) {
  try {
    const res = await fetch(`${API_BASE}/products/${id}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data?.message || 'Product details are temporarily unavailable.');
    if (data && data.success && data.product) {
      return data.product;
    }
    throw new Error('Product not found in API');
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error('Unable to reach the product API. Check that the backend is running and the API URL is correct.');
    }
    throw new Error(error.message || 'Unable to load product details.');
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
