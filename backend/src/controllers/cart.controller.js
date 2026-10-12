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
      console.error('[Cart] Account lookup failed:', error.message);
      return { userId: null, error: true };
    }
    return { userId: data?.id || null, error: false };
  } catch (error) {
    console.error('[Cart] Account lookup failed:', error.message);
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

async function readCart(userId) {
  const { data, error } = await supabase
    .from('cart_items')
    .select(`id, product_id, quantity, selected_shade, created_at, product:products(${PRODUCT_FIELDS})`)
    .eq('user_id', userId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return (data || []).map(row => {
    const product = mapProduct(row.product);
    return {
      id: row.product_id,
      productId: row.product_id,
      cartItemId: row.id,
      quantity: row.quantity,
      selectedShade: row.selected_shade,
      price: product.price,
      product,
    };
  });
}

function sendDatabaseError(res, message, error) {
  if (error) console.error('[Cart] Database operation failed:', error.message || error);
  return res.status(500).json({ success: false, message });
}

exports.getCart = async (req, res) => {
  const identity = await getDatabaseUserId(req);
  if (identity.error) return sendDatabaseError(res, 'Unable to verify account.');
  const { userId } = identity;
  if (!userId) {
    return res.status(403).json({ success: false, message: 'A database-backed account is required.' });
  }

  try {
    return res.json({ success: true, items: await readCart(userId) });
  } catch (error) {
    return sendDatabaseError(res, 'Unable to load cart.', error);
  }
};

exports.addToCart = async (req, res) => {
  const identity = await getDatabaseUserId(req);
  if (identity.error) return sendDatabaseError(res, 'Unable to verify account.');
  const { userId } = identity;
  if (!userId) {
    return res.status(403).json({ success: false, message: 'A database-backed account is required.' });
  }

  const productId = resolveProductId(req.body.productId);
  const quantity = req.body.quantity === undefined ? 1 : Number(req.body.quantity);
  const selectedShade = req.body.selectedShade == null || req.body.selectedShade === ''
    ? null
    : req.body.selectedShade;

  if (typeof productId !== 'string' || !UUID_PATTERN.test(productId)) {
    return res.status(400).json({ success: false, message: 'A valid product ID is required.' });
  }
  if (!Number.isSafeInteger(quantity) || quantity < 1) {
    return res.status(400).json({ success: false, message: 'Quantity must be a positive whole number.' });
  }
  if (selectedShade !== null && (typeof selectedShade !== 'string' || selectedShade.length > 100)) {
    return res.status(400).json({ success: false, message: 'Selected shade is invalid.' });
  }

  try {
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('id, shades')
      .eq('id', productId)
      .eq('is_active', true)
      .maybeSingle();
    if (productError) return sendDatabaseError(res, 'Unable to verify product.', productError);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found.' });

    if (selectedShade !== null && Array.isArray(product.shades) && product.shades.length > 0) {
      const shadeExists = product.shades.some(shade => shade?.name === selectedShade);
      if (!shadeExists) {
        return res.status(400).json({ success: false, message: 'Selected shade is not available for this product.' });
      }
    }

    let existingQuery = supabase
      .from('cart_items')
      .select('id')
      .eq('user_id', userId)
      .eq('product_id', productId);
    existingQuery = selectedShade === null
      ? existingQuery.is('selected_shade', null)
      : existingQuery.eq('selected_shade', selectedShade);
    const { data: existing, error: existingError } = await existingQuery.limit(1).maybeSingle();
    if (existingError) return sendDatabaseError(res, 'Unable to update cart.', existingError);

    const write = existing
      ? await supabase.from('cart_items').update({ quantity }).eq('id', existing.id).eq('user_id', userId)
      : await supabase.from('cart_items').insert({
        user_id: userId,
        product_id: productId,
        quantity,
        selected_shade: selectedShade,
      });
    if (write.error) return sendDatabaseError(res, 'Unable to update cart.', write.error);

    return res.json({ success: true, items: await readCart(userId) });
  } catch (error) {
    return sendDatabaseError(res, 'Unable to update cart.', error);
  }
};

exports.removeFromCart = async (req, res) => {
  const identity = await getDatabaseUserId(req);
  if (identity.error) return sendDatabaseError(res, 'Unable to verify account.');
  const { userId } = identity;
  if (!userId) {
    return res.status(403).json({ success: false, message: 'A database-backed account is required.' });
  }

  const productId = resolveProductId(req.params.productId);
  const selectedShade = req.query.selectedShade || null;
  if (typeof productId !== 'string' || !UUID_PATTERN.test(productId)) {
    return res.status(400).json({ success: false, message: 'A valid product ID is required.' });
  }

  try {
    let query = supabase.from('cart_items').delete().eq('user_id', userId).eq('product_id', productId);
    query = selectedShade === null
      ? query.is('selected_shade', null)
      : query.eq('selected_shade', selectedShade);
    const { error } = await query;
    if (error) return sendDatabaseError(res, 'Unable to remove cart item.', error);
    return res.json({ success: true, items: await readCart(userId) });
  } catch (error) {
    return sendDatabaseError(res, 'Unable to remove cart item.', error);
  }
};

exports.clearCart = async (req, res) => {
  const identity = await getDatabaseUserId(req);
  if (identity.error) return sendDatabaseError(res, 'Unable to verify account.');
  const { userId } = identity;
  if (!userId) {
    return res.status(403).json({ success: false, message: 'A database-backed account is required.' });
  }

  try {
    const { error } = await supabase.from('cart_items').delete().eq('user_id', userId);
    if (error) return sendDatabaseError(res, 'Unable to clear cart.', error);
    return res.json({ success: true, message: 'Cart cleared successfully.', items: [] });
  } catch (error) {
    return sendDatabaseError(res, 'Unable to clear cart.', error);
  }
};
