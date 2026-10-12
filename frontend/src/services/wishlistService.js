import client from '@/api/authApi';

function requireToken() {
  const token = localStorage.getItem('auraglow_token');
  if (!token) throw new Error('Sign in is required to access your wishlist.');
  return token;
}

function getItems(data) {
  if (!data?.success || !Array.isArray(data.items)) {
    throw new Error(data?.message || 'The wishlist response was invalid.');
  }
  return data.items;
}

function authConfig() {
  return { headers: { Authorization: `Bearer ${requireToken()}` } };
}

export async function fetchWishlist() {
  try {
    const { data } = await client.get('/wishlist', authConfig());
    return getItems(data);
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message || 'Unable to load wishlist.');
  }
}

export async function toggleWishlistBackend(productId) {
  try {
    const { data } = await client.post('/wishlist/toggle', { productId }, authConfig());
    return getItems(data);
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message || 'Unable to update wishlist.');
  }
}
