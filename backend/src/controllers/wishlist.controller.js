const supabase = require('../config/supabaseClient');
const { resolveProductId } = require('./product.controller');

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const PRODUCT_FIELDS = 'id, name, brand, category, description, price, stock_quantity, images, skin_types_compatible, concerns_addressed, clean_beauty_tags, shades, is_vegan, is_cruelty_free';

async function getDatabaseUserId(req) {
  const userId = req.user?.id || req.user?.userId;
  if (typeof userId !== 'string' || !UUID_PATTERN.test(userId)) return { userId: null };

  try {
    const { data, error } = await supabase.from('users').select('id').eq('id', userId).maybeSingle();
    if (error) {
      console.error('[Wishlist] Account lookup failed:', error.message);
      return { userId: null, error: true };
    }
    return { userId: data?.id || null, error: false };
  } catch (error) {
    console.error('[Wishlist] Account lookup failed:', error.message);
    return { userId: null, error: true };
  }
}

function mapProduct(product) {
  const images = Array.isArray(product.images) ? product.images : [];
  return {
    id: product.id,
    name: product.name,
    brand: product.brand,
    category: product.category,
    description: product.description,
    price: Number(product.price),
    stock: product.stock_quantity,
    images,
    image: images[0] || '',
    imageGallery: images,
    skinTypes: product.skin_types_compatible || [],
    concerns: product.concerns_addressed || [],
    tags: product.clean_beauty_tags || [],
    shades: product.shades || [],
    isVegan: product.is_vegan,
    isCrueltyFree: product.is_cruelty_free,
  };
}

async function readWishlist(userId) {
  const { data, error } = await supabase
    .from('wishlist_items')
    .select(`product_id, created_at, product:products(${PRODUCT_FIELDS})`)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data || []).map(row => mapProduct(row.product));
}

function sendDatabaseError(res, message, error) {
  if (error) console.error('[Wishlist] Database operation failed:', error.message || error);
  return res.status(500).json({ success: false, message });
}

exports.getWishlist = async (req, res) => {
  const identity = await getDatabaseUserId(req);
  if (identity.error) return sendDatabaseError(res, 'Unable to verify account.');
  const { userId } = identity;
  if (!userId) {
    return res.status(403).json({ success: false, message: 'A database-backed account is required.' });
  }

  try {
    return res.json({ success: true, items: await readWishlist(userId) });
  } catch (error) {
    return sendDatabaseError(res, 'Unable to load wishlist.', error);
  }
};

exports.toggleWishlist = async (req, res) => {
  const identity = await getDatabaseUserId(req);
  if (identity.error) return sendDatabaseError(res, 'Unable to verify account.');
  const { userId } = identity;
  if (!userId) {
    return res.status(403).json({ success: false, message: 'A database-backed account is required.' });
  }

  const productId = resolveProductId(req.body.productId);
  if (typeof productId !== 'string' || !UUID_PATTERN.test(productId)) {
    return res.status(400).json({ success: false, message: 'A valid product ID is required.' });
  }

  try {
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('id')
      .eq('id', productId)
      .eq('is_active', true)
      .maybeSingle();
    if (productError) return sendDatabaseError(res, 'Unable to verify product.', productError);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found.' });

    const { data: existing, error: lookupError } = await supabase
      .from('wishlist_items')
      .select('id')
      .eq('user_id', userId)
      .eq('product_id', productId)
      .maybeSingle();
    if (lookupError) return sendDatabaseError(res, 'Unable to update wishlist.', lookupError);

    const write = existing
      ? await supabase.from('wishlist_items').delete().eq('id', existing.id).eq('user_id', userId)
      : await supabase.from('wishlist_items').insert({ user_id: userId, product_id: productId });
    if (write.error) return sendDatabaseError(res, 'Unable to update wishlist.', write.error);

    return res.json({ success: true, items: await readWishlist(userId) });
  } catch (error) {
    return sendDatabaseError(res, 'Unable to update wishlist.', error);
  }
};
