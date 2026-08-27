/**
 * =============================================================================
 *  AuraGlow — Wishlist Service (frontend/src/services/wishlistService.js)
 *  Module 3: Shopping Cart & Wishlist (Achani)
 * =============================================================================
 */

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api/v1';

export async function fetchWishlist() {
  try {
    const res = await fetch(`${API_BASE}/wishlist`);
    if (!res.ok) throw new Error('API failed');
    const data = await res.json();
    return data.items || []; // list of product IDs
  } catch {
    const local = localStorage.getItem('auraglow_wishlist');
    return local ? JSON.parse(local) : [];
  }
}

export async function toggleWishlistBackend(productId) {
  try {
    const res = await fetch(`${API_BASE}/wishlist/toggle`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId }),
    });
    if (!res.ok) throw new Error('API failed');
    const data = await res.json();
    return data.items;
  } catch {
    const local = localStorage.getItem('auraglow_wishlist');
    let items = local ? JSON.parse(local) : [];
    const index = items.indexOf(productId);
    if (index > -1) {
      items.splice(index, 1);
    } else {
      items.push(productId);
    }
    localStorage.setItem('auraglow_wishlist', JSON.stringify(items));
    return items;
  }
}
