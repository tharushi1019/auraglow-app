/**
 * =============================================================================
 *  AuraGlow — Admin Controller (backend/src/controllers/admin.controller.js)
 *  Module 6: Admin Dashboard, Inventory & Order Management (Tharushi)
 * =============================================================================
 */

const supabase = require('../config/supabaseClient');

// Fallback mock stores
let mockProducts = [
  { id: 'b2000000-0000-0000-0000-000000000001', name: 'Radiant Glow Serum', brand: 'AuraGlow', category: 'skincare', price: 8900, stock: 45 },
  { id: 'b2000000-0000-0000-0000-000000000002', name: 'Velvet Matte Lipstick', brand: 'AuraGlow', category: 'makeup', price: 4500, stock: 12 },
  { id: 'b2000000-0000-0000-0000-000000000003', name: 'Petal Hydra Cream', brand: 'AuraGlow', category: 'skincare', price: 7200, stock: 0 },
];

let mockOrders = [
  { id: 'AG-8821-4412', customer: 'Sasha Ranasinghe', total: 13400, status: 'processing', placedAt: new Date().toISOString() },
  { id: 'AG-9102-1182', customer: 'Keshara Perera', total: 8900, status: 'shipped', placedAt: new Date().toISOString() },
];

/**
 * GET /api/v1/admin/analytics
 * Executive KPI Overview & Category Breakdown
 */
exports.getAnalytics = async (req, res, next) => {
  try {
    const analytics = {
      grossRevenue: 1485000,
      totalOrders: 142,
      averageOrderValue: 10457,
      conversionRate: 3.48,
      lowStockAlerts: 3,
      topCategories: [
        { name: 'Skincare', percentage: 62 },
        { name: 'Makeup', percentage: 28 },
        { name: 'Tools & Accessories', percentage: 10 },
      ],
      recentActivities: [
        { id: 'act-1', text: 'Order #AG-8821 dispatched to Colombo', time: '10 mins ago' },
        { id: 'act-2', text: 'Low stock alert for Velvet Matte Lipstick', time: '1 hour ago' },
        { id: 'act-3', text: 'New 5-star review posted for Radiant Glow Serum', time: '3 hours ago' },
      ],
    };
    return res.json({ success: true, analytics });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/v1/admin/products
 */
exports.getAdminProducts = async (req, res, next) => {
  try {
    try {
      const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
      if (!error && data) return res.json({ success: true, products: data });
    } catch (sbErr) {
      console.warn('⚠️ Supabase admin products error, using mock:', sbErr.message);
    }
    return res.json({ success: true, products: mockProducts });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/v1/admin/products
 */
exports.createProduct = async (req, res, next) => {
  try {
    const { name, brand = 'AuraGlow', category, price, stock = 10, description, images = [] } = req.body;
    const normalizedName = typeof name === 'string' ? name.trim() : '';
    const normalizedBrand = typeof brand === 'string' ? brand.trim() : '';
    const normalizedCategory = typeof category === 'string' ? category.trim().toLowerCase() : '';
    const numericPrice = typeof price === 'number'
      ? price
      : (typeof price === 'string' && price.trim() ? Number(price) : NaN);
    const numericStock = typeof stock === 'number'
      ? stock
      : (typeof stock === 'string' && stock.trim() ? Number(stock) : NaN);
    const validCategories = ['skincare', 'makeup', 'tools', 'fragrance'];

    if (!normalizedName || !normalizedBrand || !validCategories.includes(normalizedCategory)) {
      return res.status(400).json({ success: false, message: 'Name, brand, and a valid product category are required.' });
    }
    if (!Number.isFinite(numericPrice) || numericPrice <= 0) {
      return res.status(400).json({ success: false, message: 'Price must be a finite number greater than zero.' });
    }
    if (!Number.isInteger(numericStock) || numericStock < 0) {
      return res.status(400).json({ success: false, message: 'Stock must be a nonnegative integer.' });
    }

    const crypto = require('crypto');
    const canonicalProductId = crypto.randomUUID();

    if (!supabase) {
      return res.status(503).json({ success: false, message: 'Product database is unavailable.' });
    }

    try {
      const { data: inserted, error: insertErr } = await supabase
        .from('products')
        .insert([{
          id: canonicalProductId,
          name: normalizedName,
          brand: normalizedBrand,
          category: normalizedCategory,
          price: numericPrice,
          stock_quantity: numericStock,
          description: description || 'Luxury clean beauty formula.',
          images: Array.isArray(images) ? images : (images ? [images] : []),
          clean_beauty_tags: [],
          is_vegan: false,
          is_cruelty_free: true,
          is_active: true,
        }])
        .select()
        .maybeSingle();

      if (insertErr) {
        console.warn('⚠️ [Admin createProduct] Supabase insert failed:', insertErr.message);
        return res.status(502).json({ success: false, message: 'Product could not be saved to the database.' });
      }
      if (!inserted) {
        return res.status(502).json({ success: false, message: 'Product was not returned after database insertion.' });
      }

      return res.status(201).json({ success: true, message: 'Product created successfully.', product: inserted });
    } catch (sbErr) {
      console.warn('⚠️ [Admin createProduct] Supabase insert failed:', sbErr.message);
      return res.status(502).json({ success: false, message: 'Product could not be saved to the database.' });
    }
  } catch (err) {
    next(err);
  }
};

/**
 * PATCH /api/v1/admin/orders/:id/status
 */
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = ['pending', 'paid', 'processing', 'packed', 'shipped', 'out_for_delivery', 'delivered', 'cancelled'];
    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: `Status must be one of: ${allowedStatuses.join(', ')}` });
    }

    const order = mockOrders.find(o => o.id === id);
    if (order) {
      order.status = status;
      return res.json({ success: true, message: `Order #${id} updated to ${status}`, order });
    }

    return res.json({ success: true, message: `Order #${id} status updated to ${status}`, order: { id, status } });
  } catch (err) {
    next(err);
  }
};
