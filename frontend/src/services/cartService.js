/**
 * =============================================================================
 *  AuraGlow — Cart Service (frontend/src/services/cartService.js)
 *  Module 3: Shopping Cart & Wishlist (Achani)
 * =============================================================================
 */

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api/v1';

export async function fetchCart() {
  try {
    const res = await fetch(`${API_BASE}/cart`);
    if (!res.ok) throw new Error('API failed');
    const data = await res.json();
    return data.items || [];
  } catch {
    const local = localStorage.getItem('auraglow_cart');
    return local ? JSON.parse(local) : [];
  }
}

export async function syncCart(cartItems) {
  try {
    localStorage.setItem('auraglow_cart', JSON.stringify(cartItems));
    // Attempt backend sync
    await fetch(`${API_BASE}/cart/clear`, { method: 'POST' });
    for (const item of cartItems) {
      await fetch(`${API_BASE}/cart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: item.productId || item.id,
          quantity: item.quantity,
          price: item.price,
        }),
      });
    }
  } catch (err) {
    console.warn('API cart sync offline, saved locally.', err.message);
  }
}
