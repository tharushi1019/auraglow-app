import client from '@/api/authApi';

function requireToken() {
  const token = localStorage.getItem('auraglow_token');
  if (!token) throw new Error('Sign in is required to access your cart.');
  return token;
}

function getItems(data) {
  if (!data?.success || !Array.isArray(data.items)) {
    throw new Error(data?.message || 'The cart response was invalid.');
  }
  return data.items;
}

function authConfig() {
  return { headers: { Authorization: `Bearer ${requireToken()}` } };
}

export async function fetchCart() {
  try {
    const { data } = await client.get('/cart', authConfig());
    return getItems(data);
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message || 'Unable to load cart.');
  }
}

export async function addCartItem({ productId, quantity, selectedShade = null }) {
  try {
    const { data } = await client.post('/cart', { productId, quantity, selectedShade }, authConfig());
    return getItems(data);
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message || 'Unable to update cart.');
  }
}

export async function removeCartItem(productId, selectedShade = null) {
  try {
    const params = selectedShade ? { selectedShade } : {};
    const { data } = await client.delete(`/cart/${encodeURIComponent(productId)}`, { ...authConfig(), params });
    return getItems(data);
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message || 'Unable to remove cart item.');
  }
}

export async function clearCart() {
  try {
    const { data } = await client.post('/cart/clear', {}, authConfig());
    return getItems(data);
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message || 'Unable to clear cart.');
  }
}
