/**
 * =============================================================================
 *  AuraGlow — Checkout Controller (backend/src/controllers/checkout.controller.js)
 *  Module 5: Checkout, Payment & Order Tracking (Kaveesha)
 *  Updated: Real Stripe PaymentIntent integration (Sandbox/Test Mode)
 * =============================================================================
 */

const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const supabase = require('../config/supabaseClient');
const { sendOrderInvoice } = require('../services/emailService');
const { initialProducts } = require('./product.controller');

// Initialize Stripe with secret key (sandbox test mode)
let stripe = null;
if (process.env.STRIPE_SECRET_KEY) {
  stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
}

// In-memory order store fallback
const ordersStore = {};

/**
 * POST /api/v1/checkout/create-payment-intent
 * Creates a real Stripe PaymentIntent (sandbox) for the frontend to confirm
 */
exports.createPaymentIntent = async (req, res, next) => {
  try {
    if (!stripe) {
      return res.status(503).json({
        success: false,
        message: 'Stripe is not configured. Please add STRIPE_SECRET_KEY to backend/.env',
      });
    }

    const { amount, currency = 'usd', items = [], customerEmail } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid payment amount.' });
    }

    // Stripe amounts are in smallest currency unit (cents for USD)
    // amount should be sent in cents from frontend (e.g. $129.99 = 12999)
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount), // already in cents
      currency,
      automatic_payment_methods: { enabled: true },
      metadata: {
        app: 'AuraGlow',
        items: JSON.stringify(items.map(i => `${i.name} x${i.quantity}`).join(', ')).slice(0, 500),
        customerEmail: customerEmail || '',
      },
    });

    res.status(200).json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error('[Stripe] createPaymentIntent error:', error.message);
    next(error);
  }
};

/**
 * POST /api/v1/checkout/confirm-payment-intent
 * Confirms a Stripe PaymentIntent (sandbox/test mode)
 */
exports.confirmPaymentIntent = async (req, res, next) => {
  try {
    if (!stripe) {
      return res.status(503).json({ success: false, message: 'Stripe is not configured' });
    }
    const { paymentIntentId, paymentMethod = 'pm_card_visa' } = req.body;
    if (!paymentIntentId) {
      return res.status(400).json({ success: false, message: 'paymentIntentId is required' });
    }

    const intent = await stripe.paymentIntents.confirm(paymentIntentId, {
      payment_method: paymentMethod,
      return_url: `${process.env.FRONTEND_URL || 'https://auraglow-app.netlify.app'}/orders/confirm`,
    });

    res.status(200).json({
      success: true,
      status: intent.status,
      paymentIntent: intent,
    });
  } catch (error) {
    console.error('[Stripe] confirmPaymentIntent error:', error.message);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * POST /api/v1/checkout
 * Validate cart, apply discounts, generate Order ID & save order
 */
exports.createOrder = async (req, res, next) => {
  try {
    const {
      items = [],
      shippingAddress,
      paymentMethod,
      promoCode,
      subtotal,
      discountAmount = 0,
      shippingFee = 0,
      paymentIntentId,   // Stripe PaymentIntent ID (if paid via Stripe)
      stripeStatus,      // 'succeeded' if confirmed
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart is empty.' });
    }
    if (!shippingAddress || !shippingAddress.firstName || !shippingAddress.email) {
      return res.status(400).json({ success: false, message: 'Shipping address is required.' });
    }

    // ── Idempotency guard: reject re-use of the same PaymentIntent ─────────
    if (paymentIntentId && supabase) {
      try {
        const { data: existingOrder } = await supabase
          .from('orders')
          .select('id')
          .eq('stripe_payment_id', paymentIntentId)
          .maybeSingle();
        if (existingOrder) {
          return res.status(409).json({
            success: false,
            message: 'This payment has already been used for a previous order. Please contact support.',
          });
        }
      } catch (idempErr) {
        console.warn('[Checkout] Idempotency check note:', idempErr.message);
        // Non-critical — proceed if Supabase is unavailable
      }
    }

    // ── Pre-order product verification, stock check & server-side totals ─────────
    let serverSubtotal = 0;
    const resolvedOrderItems = [];

    if (supabase && items.length > 0) {
      try {
        const { data: dbProducts, error: dbErr } = await supabase
          .from('products')
          .select('id, name, brand, price, stock_quantity');

        if (dbErr) {
          console.error('[Checkout] Product lookup error:', dbErr.message);
          return res.status(503).json({ success: false, message: 'Database temporarily unavailable for inventory verification.' });
        }

        const outOfStock = [];
        for (const item of items) {
          const matched = (dbProducts || []).find(p => p.id === item.productId || p.id === item.id)
            || (dbProducts || []).find(p => p.name && item.name && p.name.toLowerCase().trim() === item.name.toLowerCase().trim());

          if (!matched) {
            return res.status(400).json({ success: false, message: `Product "${item.name || item.productId}" is not available in catalog.` });
          }

          const requestedQty = Number(item.quantity) || 1;
          const availableStock = typeof matched.stock_quantity === 'number' ? matched.stock_quantity : 0;
          if (requestedQty > availableStock) {
            outOfStock.push(`${matched.name} (requested: ${requestedQty}, available: ${availableStock})`);
          }

          const unitPrice = parseFloat(matched.price) || 0;
          serverSubtotal += unitPrice * requestedQty;

          resolvedOrderItems.push({
            productId: matched.id,
            name: matched.name,
            brand: matched.brand || 'AuraGlow',
            quantity: requestedQty,
            unitPrice,
            selectedShade: item.selectedShade || null,
            matchedProduct: matched,
          });
        }

        if (outOfStock.length > 0) {
          return res.status(400).json({
            success: false,
            message: `Insufficient stock for: ${outOfStock.join('; ')}. Please adjust quantities in your shopping bag.`,
          });
        }
      } catch (stockCheckErr) {
        console.warn('[Checkout] Stock pre-check note:', stockCheckErr.message);
      }
    }

    if (resolvedOrderItems.length === 0) {
      serverSubtotal = Number(subtotal) || 0;
    }

    // ── Authoritative Server-side Calculation of Pricing & Discounts ──────────
    // 15% Bundle Discount applied when 3 or more items are in the order
    const serverDiscount = items.length >= 3 ? Math.round(serverSubtotal * 0.15) : 0;
    // Free shipping threshold: 15,000 LKR, else 500 LKR
    const serverShipping = (serverSubtotal - serverDiscount >= 15000 || items.length === 0) ? 0 : 500;
    const serverTotal = Math.max(0, Math.round(serverSubtotal - serverDiscount + serverShipping));

    // Verify Stripe payment was successful (if PaymentIntent provided)
    let stripeVerified = false;
    if (stripe && paymentIntentId) {
      try {
        const intent = await stripe.paymentIntents.retrieve(paymentIntentId);
        stripeVerified = intent.status === 'succeeded';
        if (!stripeVerified) {
          return res.status(402).json({
            success: false,
            message: `Payment not completed. Stripe status: ${intent.status}`,
          });
        }
      } catch (stripeErr) {
        console.error('[Stripe] PaymentIntent verify error:', stripeErr.message);
        // If key has restricted permissions, skip verification (demo mode)
      }
    }

    // Generate order ID: AG-XXXX-YYYY
    const rand = () => Math.floor(1000 + Math.random() * 9000);
    const orderId = `AG-${rand()}-${rand()}`;

    // Estimated delivery: 3-5 business days
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 5);

    // Detect authenticated user ID from JWT if available
    let userId = null;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const decoded = jwt.verify(authHeader.split(' ')[1], process.env.JWT_SECRET || 'auraglow-secret-key-2026');
        userId = decoded.id || decoded.userId;
      } catch (_) {}
    }

    // If no JWT, find user by contact email in users table
    if (!userId && shippingAddress?.email) {
      try {
        const { data: existingUser } = await supabase
          .from('users')
          .select('id')
          .eq('email', shippingAddress.email.toLowerCase())
          .maybeSingle();
        if (existingUser) userId = existingUser.id;
      } catch (_) {}
    }

    // Default to existing seed user if guest
    if (!userId) {
      try {
        const { data: firstUser } = await supabase.from('users').select('id').limit(1).maybeSingle();
        if (firstUser) userId = firstUser.id;
      } catch (_) {}
    }

    const order = {
      orderId,
      status: stripeVerified ? 'processing' : 'pending',
      paymentProvider: paymentIntentId ? 'stripe' : 'mock',
      paymentIntentId: paymentIntentId || null,
      stripeVerified,
      placedAt: new Date().toISOString(),
      estimatedDelivery: deliveryDate.toISOString(),
      items: resolvedOrderItems.length > 0 ? resolvedOrderItems.map(it => ({
        productId: it.productId,
        name: it.name,
        quantity: it.quantity,
        price: it.unitPrice,
        selectedShade: it.selectedShade,
      })) : items,
      shippingAddress,
      paymentMethod: {
        type: paymentMethod?.type || 'card',
        lastFour: paymentMethod?.lastFour || '****',
        brand: paymentMethod?.brand || 'Visa',
      },
      promoCode: promoCode || null,
      subtotal: serverSubtotal,
      discountAmount: serverDiscount,
      shippingFee: serverShipping,
      total: serverTotal,
      trackingSteps: [
        { stage: 'Order Confirmed', date: new Date().toISOString(), done: true },
        { stage: 'Processing', date: null, done: false },
        { stage: 'Dispatched', date: null, done: false },
        { stage: 'Out for Delivery', date: null, done: false },
        { stage: 'Delivered', date: null, done: false },
      ],
    };

    // 1. Insert into live Supabase orders table so Admin Dashboard reflects it immediately
    if (userId && supabase) {
      try {
        const dbOrderPayload = {
          user_id: userId,
          stripe_payment_id: paymentIntentId || null,
          total_amount: serverTotal,
          shipping_cost: serverShipping,
          status: stripeVerified ? 'processing' : 'pending',
          shipping_address: {
            street: shippingAddress.address1 || shippingAddress.street || 'Standard Address',
            city: shippingAddress.city || 'Colombo',
            state: shippingAddress.province || 'Western',
            postal_code: shippingAddress.postalCode || '00100',
            country: shippingAddress.country || 'Sri Lanka',
            firstName: shippingAddress.firstName || '',
            lastName: shippingAddress.lastName || '',
            phone: shippingAddress.phone || '',
          },
          billing_address: {
            street: shippingAddress.address1 || shippingAddress.street || 'Standard Address',
            city: shippingAddress.city || 'Colombo',
            country: shippingAddress.country || 'Sri Lanka',
          },
          contact_email: shippingAddress.email.toLowerCase(),
          contact_phone: shippingAddress.phone || null,
          notes: `Order Ref: ${orderId}`,
        };

        const { data: insertedOrder, error: insertErr } = await supabase
          .from('orders')
          .insert([dbOrderPayload])
          .select('id')
          .single();

        if (insertErr) {
          console.warn('⚠️ Supabase order insert notice:', insertErr.message);
        } else if (insertedOrder) {
          order._uuid = insertedOrder.id;

          // Insert order items
          const itemsToSave = resolvedOrderItems.length > 0 ? resolvedOrderItems : items.map(it => ({
            productId: it.productId || it.id,
            name: it.name || 'AuraGlow Product',
            brand: 'AuraGlow',
            quantity: it.quantity || 1,
            unitPrice: parseFloat(it.price) || 0,
            selectedShade: it.selectedShade || null,
          }));

          const orderItemsRows = itemsToSave.map(it => ({
            order_id: insertedOrder.id,
            product_id: it.productId,
            product_name: it.name,
            product_brand: it.brand || 'AuraGlow',
            quantity: it.quantity,
            unit_price: it.unitPrice,
            selected_shade: it.selectedShade,
          })).filter(row => Boolean(row.product_id));

          if (orderItemsRows.length > 0) {
            const { error: itemsErr } = await supabase.from('order_items').insert(orderItemsRows);
            if (itemsErr) console.warn('⚠️ Order items insert notice:', itemsErr.message);

            // ── Inventory / Stock Deduction (Supabase) ──
            for (const item of itemsToSave) {
              if (item.productId && item.quantity > 0) {
                try {
                  const currentStock = typeof item.matchedProduct?.stock_quantity === 'number'
                    ? item.matchedProduct.stock_quantity
                    : null;

                  if (currentStock !== null) {
                    const newStock = Math.max(0, currentStock - item.quantity);
                    await supabase
                      .from('products')
                      .update({ stock_quantity: newStock })
                      .eq('id', item.productId);
                  }
                } catch (stockErr) {
                  console.warn('⚠️ Stock deduction notice for item:', item.productId, stockErr.message);
                }
              }
            }
          }

          // ── Clear customer database cart after successful order creation ──
          try {
            await supabase.from('cart_items').delete().eq('user_id', userId);
          } catch (clearCartErr) {
            console.warn('⚠️ Cart clear after checkout notice:', clearCartErr.message);
          }
        }
      } catch (dbErr) {
        console.warn('⚠️ Supabase order creation fallback:', dbErr.message);
      }
    }

    // ── Inventory / Stock Deduction (In-Memory Fallback) ──
    if (Array.isArray(items)) {
      items.forEach(it => {
        const localProd = initialProducts.find(p =>
          p.id === it.id || (p.name && it.name && p.name.toLowerCase().trim() === it.name.toLowerCase().trim())
        );
        if (localProd && typeof localProd.stock === 'number') {
          localProd.stock = Math.max(0, localProd.stock - (it.quantity || 1));
        }
      });
    }

    ordersStore[orderId] = order;
    if (order._uuid) ordersStore[order._uuid] = order;

    // Trigger automated receipt / email invoice
    sendOrderInvoice(order).catch(err => console.error('Invoice email dispatch warning:', err.message));

    res.status(201).json({ success: true, order });

  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/v1/orders
 * List orders for the authenticated user from Supabase with order_items
 */
exports.getOrders = async (req, res, next) => {
  try {
    let userId = null;
    let userEmail = null;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const decoded = jwt.verify(authHeader.split(' ')[1], process.env.JWT_SECRET || 'auraglow-secret-key-2026');
        userId = decoded.id || decoded.userId;
        userEmail = decoded.email;
      } catch (_) {}
    }

    // If query contains email
    if (!userEmail && req.query.email) {
      userEmail = req.query.email.toLowerCase();
    }

    if (userId || userEmail) {
      try {
        let query = supabase
          .from('orders')
          .select(`
            id, status, total_amount, shipping_cost, contact_email, created_at, notes, shipping_address,
            order_items ( product_name, quantity, unit_price )
          `)
          .order('created_at', { ascending: false });

        if (userId && userEmail) {
          query = query.or(`user_id.eq.${userId},contact_email.ilike.${userEmail}`);
        } else if (userId) {
          query = query.eq('user_id', userId);
        } else if (userEmail) {
          query = query.ilike('contact_email', userEmail);
        }

        const { data: dbOrders, error: dbErr } = await query;

        if (!dbErr && dbOrders) {
          const mappedOrders = dbOrders.map(dbOrder => {
            const cleanId = dbOrder.id.replace(/-/g, '').slice(-6).toUpperCase();
            let displayId = `ORD-${cleanId}`;
            if (dbOrder.notes && dbOrder.notes.includes('AG-')) {
              const match = dbOrder.notes.match(/AG-\d{4}-\d{4}/);
              if (match) displayId = match[0];
            }

            const trackingStatus = (dbOrder.status || 'pending').toLowerCase();
            const trackingSteps = [
              { stage: 'Order Confirmed', date: dbOrder.created_at, done: true },
              { stage: 'Processing', date: ['processing', 'packed', 'shipped', 'delivered'].includes(trackingStatus) ? dbOrder.created_at : null, done: ['processing', 'packed', 'shipped', 'delivered'].includes(trackingStatus) },
              { stage: 'Dispatched', date: ['shipped', 'delivered'].includes(trackingStatus) ? dbOrder.created_at : null, done: ['shipped', 'delivered'].includes(trackingStatus) },
              { stage: 'Out for Delivery', date: trackingStatus === 'delivered' ? dbOrder.created_at : null, done: trackingStatus === 'delivered' },
              { stage: 'Delivered', date: trackingStatus === 'delivered' ? dbOrder.created_at : null, done: trackingStatus === 'delivered' },
            ];

            return {
              orderId: displayId,
              _uuid: dbOrder.id,
              status: dbOrder.status,
              total: parseFloat(dbOrder.total_amount),
              placedAt: dbOrder.created_at,
              estimatedDelivery: new Date(new Date(dbOrder.created_at).getTime() + 4 * 86400000).toISOString(),
              shippingAddress: dbOrder.shipping_address,
              paymentMethod: { brand: 'Stripe / Card', lastFour: '••••' },
              items: (dbOrder.order_items || []).map(it => ({
                name: it.product_name,
                quantity: it.quantity,
                price: parseFloat(it.unit_price),
              })),
              trackingSteps,
            };
          });

          return res.json({ success: true, orders: mappedOrders });
        }
      } catch (err) {
        console.warn('⚠️ Supabase getOrders lookup warning:', err.message);
      }
    }

    // If not authenticated and no contact email provided, do not expose system orders
    return res.json({ success: true, orders: [] });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/v1/orders/:orderId
 * Get single order details + tracking timeline
 */
exports.getOrderById = async (req, res, next) => {
  try {
    const { orderId } = req.params;

    // Detect authenticated user from JWT if present
    let requestingUserId = null;
    let requestingUserEmail = null;
    let requestingRole = null;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const decoded = jwt.verify(authHeader.split(' ')[1], process.env.JWT_SECRET || 'auraglow-secret-key-2026');
        requestingUserId = decoded.id || decoded.userId;
        requestingUserEmail = decoded.email ? decoded.email.toLowerCase() : null;
        requestingRole = decoded.role;
      } catch (_) {}
    }

    // 1. Query live Supabase database by UUID or notes reference
    if (supabase) {
      try {
        let query = supabase
          .from('orders')
          .select(`
            id, user_id, status, total_amount, shipping_cost, contact_email, created_at, notes, shipping_address,
            order_items ( product_name, quantity, unit_price )
          `);

        // If looks like UUID
        if (orderId.includes('-') && orderId.length === 36) {
          query = query.eq('id', orderId);
        } else {
          query = query.ilike('notes', `%${orderId}%`);
        }

        const { data: dbOrder, error: queryErr } = await query.maybeSingle();

        if (dbOrder && !queryErr) {
          // Ownership verification: if authenticated customer (non-admin), ensure they own this order
          if (requestingUserId && requestingRole !== 'admin') {
            const isOwner = (dbOrder.user_id && dbOrder.user_id === requestingUserId)
              || (dbOrder.contact_email && dbOrder.contact_email.toLowerCase() === requestingUserEmail);
            if (!isOwner) {
              return res.status(403).json({ success: false, message: 'You do not have permission to view this order.' });
            }
          }

          const cleanId = dbOrder.id.replace(/-/g, '').slice(-6).toUpperCase();
          const displayId = orderId.startsWith('AG-') ? orderId : `ORD-${cleanId}`;

          const trackingStatus = (dbOrder.status || 'pending').toLowerCase();
          const trackingSteps = [
            { stage: 'Order Confirmed', date: dbOrder.created_at, done: true },
            { stage: 'Processing', date: ['processing', 'packed', 'shipped', 'delivered'].includes(trackingStatus) ? dbOrder.created_at : null, done: ['processing', 'packed', 'shipped', 'delivered'].includes(trackingStatus) },
            { stage: 'Dispatched', date: ['shipped', 'delivered'].includes(trackingStatus) ? dbOrder.created_at : null, done: ['shipped', 'delivered'].includes(trackingStatus) },
            { stage: 'Out for Delivery', date: trackingStatus === 'delivered' ? dbOrder.created_at : null, done: trackingStatus === 'delivered' },
            { stage: 'Delivered', date: trackingStatus === 'delivered' ? dbOrder.created_at : null, done: trackingStatus === 'delivered' },
          ];

          const mapped = {
            orderId: displayId,
            _uuid: dbOrder.id,
            status: dbOrder.status,
            total: parseFloat(dbOrder.total_amount),
            placedAt: dbOrder.created_at,
            estimatedDelivery: new Date(new Date(dbOrder.created_at).getTime() + 4 * 86400000).toISOString(),
            shippingAddress: dbOrder.shipping_address,
            paymentMethod: { brand: 'Stripe / Card', lastFour: '••••' },
            items: (dbOrder.order_items || []).map(it => ({
              name: it.product_name,
              quantity: it.quantity,
              price: parseFloat(it.unit_price),
            })),
            trackingSteps,
          };

          ordersStore[orderId] = mapped;
          return res.json({ success: true, order: mapped });
        }
      } catch (sbErr) {
        console.warn('⚠️ Supabase order lookup note:', sbErr.message);
      }
    }

    // 2. Check local session memory store if present
    if (ordersStore[orderId]) {
      const memOrder = ordersStore[orderId];
      if (requestingUserId && requestingRole !== 'admin') {
        const emailMatches = memOrder.shippingAddress?.email && memOrder.shippingAddress.email.toLowerCase() === requestingUserEmail;
        if (!emailMatches) {
          return res.status(403).json({ success: false, message: 'You do not have permission to view this order.' });
        }
      }
      return res.json({ success: true, order: memOrder });
    }

    return res.status(404).json({ success: false, message: 'Order not found.' });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/v1/orders/:orderId/cancel
 * Customers can cancel their own pending orders before fulfillment begins.
 */
exports.cancelOrder = async (req, res, next) => {
  try {
    const userId = req.user?.id || req.user?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Please log in to cancel this order.' });
    }

    const { orderId } = req.params;
    const { data: order, error } = await supabase
      .from('orders')
      .select('id, status')
      .eq('id', orderId)
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      console.error('[Orders] Cancellation lookup failed:', error.message);
      return res.status(503).json({ success: false, message: 'Unable to verify this order right now.' });
    }
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }
    if (order.status !== 'pending') {
      return res.status(409).json({ success: false, message: 'Only pending orders can be cancelled.' });
    }

    const { data: cancelledOrder, error: updateError } = await supabase
      .from('orders')
      .update({ status: 'cancelled' })
      .eq('id', orderId)
      .eq('user_id', userId)
      .eq('status', 'pending')
      .select('id, status')
      .maybeSingle();

    if (updateError) {
      console.error('[Orders] Cancellation update failed:', updateError.message);
      return res.status(503).json({ success: false, message: 'Unable to cancel this order right now.' });
    }
    if (!cancelledOrder) {
      return res.status(409).json({ success: false, message: 'This order can no longer be cancelled.' });
    }

    // ── Restore inventory stock for cancelled order line items ──
    try {
      const { data: orderItems } = await supabase
        .from('order_items')
        .select('product_id, quantity')
        .eq('order_id', orderId);

      if (orderItems && orderItems.length > 0) {
        for (const item of orderItems) {
          if (item.product_id && item.quantity > 0) {
            const { data: prod } = await supabase
              .from('products')
              .select('stock_quantity')
              .eq('id', item.product_id)
              .maybeSingle();

            if (prod && typeof prod.stock_quantity === 'number') {
              await supabase
                .from('products')
                .update({ stock_quantity: prod.stock_quantity + item.quantity })
                .eq('id', item.product_id);
            }
          }
        }
      }
    } catch (restoreErr) {
      console.warn('⚠️ Order cancellation inventory restore notice:', restoreErr.message);
    }

    // Update in-memory orders if present
    if (ordersStore[orderId]) {
      ordersStore[orderId].status = 'cancelled';
    }

    return res.json({ success: true, order: cancelledOrder });
  } catch (error) {
    next(error);
  }
};
