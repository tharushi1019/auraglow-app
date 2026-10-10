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
      return_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/orders/confirm`,
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

    // ── Pre-order stock validation ───────────────────────────────────────────
    if (supabase && items.length > 0) {
      try {
        const { data: dbProducts } = await supabase
          .from('products')
          .select('id, name, stock_quantity');
        if (dbProducts && dbProducts.length > 0) {
          const productMap = {};
          dbProducts.forEach(p => {
            productMap[p.name.toLowerCase().trim()] = p;
          });

          const outOfStock = [];
          for (const item of items) {
            const matched = productMap[(item.name || '').toLowerCase().trim()];
            if (matched && typeof matched.stock_quantity === 'number') {
              if (item.quantity > matched.stock_quantity) {
                outOfStock.push(`${item.name || 'Item'} (requested: ${item.quantity}, available: ${matched.stock_quantity})`);
              }
            }
          }

          if (outOfStock.length > 0) {
            return res.status(400).json({
              success: false,
              message: `Insufficient stock for: ${outOfStock.join('; ')}. Please update your cart.`,
            });
          }
        }
      } catch (stockCheckErr) {
        console.warn('[Checkout] Stock pre-check note:', stockCheckErr.message);
        // Non-critical — proceed if Supabase is unavailable
      }
    }

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

    const total = (subtotal || 0) - discountAmount + shippingFee;

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
      items,
      shippingAddress,
      paymentMethod: {
        type: paymentMethod?.type || 'card',
        lastFour: paymentMethod?.lastFour || '****',
        brand: paymentMethod?.brand || 'Visa',
      },
      promoCode: promoCode || null,
      subtotal: subtotal || 0,
      discountAmount,
      shippingFee,
      total,
      trackingSteps: [
        { stage: 'Order Confirmed', date: new Date().toISOString(), done: true },
        { stage: 'Processing', date: null, done: false },
        { stage: 'Dispatched', date: null, done: false },
        { stage: 'Out for Delivery', date: null, done: false },
        { stage: 'Delivered', date: null, done: false },
      ],
    };

    // 1. Insert into live Supabase orders table so Admin Dashboard reflects it immediately
    if (userId) {
      try {
        const dbOrderPayload = {
          user_id: userId,
          stripe_payment_id: paymentIntentId || null,
          total_amount: total,
          shipping_cost: shippingFee,
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
        } else if (insertedOrder && items.length > 0) {
          order._uuid = insertedOrder.id;

          // Fetch real product UUIDs and stock from products table to link order_items and update inventory
          const { data: dbProducts } = await supabase.from('products').select('id, name, stock_quantity');
          const productMap = {};
          (dbProducts || []).forEach(p => {
            productMap[p.name.toLowerCase().trim()] = p;
          });

          // Insert order items
          const orderItemsRows = items.map(it => {
            const matched = productMap[(it.name || '').toLowerCase().trim()] || dbProducts?.[0];
            return {
              order_id: insertedOrder.id,
              product_id: matched?.id,
              product_name: it.name || 'AuraGlow Product',
              product_brand: 'AuraGlow',
              quantity: it.quantity || 1,
              unit_price: parseFloat(it.price) || 0,
              selected_shade: it.selectedShade || null,
              _matchedProduct: matched,
            };
          }).filter(row => !!row.product_id);

          if (orderItemsRows.length > 0) {
            const rowsToInsert = orderItemsRows.map(({ _matchedProduct, ...rest }) => rest);
            const { error: itemsErr } = await supabase.from('order_items').insert(rowsToInsert);
            if (itemsErr) console.warn('⚠️ Order items insert notice:', itemsErr.message);

            // ── Inventory / Stock Deduction (Supabase) ──
            for (const row of orderItemsRows) {
              try {
                const prod = row._matchedProduct || (dbProducts || []).find(p => p.id === row.product_id);
                if (prod && typeof prod.stock_quantity === 'number') {
                  const newStock = Math.max(0, prod.stock_quantity - (row.quantity || 1));
                  await supabase
                    .from('products')
                    .update({ stock_quantity: newStock })
                    .eq('id', row.product_id);
                }
              } catch (stockErr) {
                console.warn('⚠️ Stock deduction notice for item:', row.product_id, stockErr.message);
              }
            }
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

    // Fallback: in-memory store
    const orders = Object.values(ordersStore);
    res.json({ success: true, orders });
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

    // 1. Check local session memory store first
    if (ordersStore[orderId]) {
      return res.json({ success: true, order: ordersStore[orderId] });
    }

    // 2. Query live Supabase database by UUID or notes reference
    try {
      let query = supabase
        .from('orders')
        .select(`
          id, status, total_amount, shipping_cost, contact_email, created_at, notes, shipping_address,
          order_items ( product_name, quantity, unit_price )
        `);

      // If looks like UUID
      if (orderId.includes('-') && orderId.length === 36) {
        query = query.eq('id', orderId);
      } else {
        query = query.ilike('notes', `%${orderId}%`);
      }

      const { data: dbOrder } = await query.maybeSingle();

      if (dbOrder) {
        const cleanId = dbOrder.id.replace(/-/g, '').slice(-6).toUpperCase();
        const displayId = orderId.startsWith('AG-') ? orderId : `ORD-${cleanId}`;

        const trackingStatus = dbOrder.status.toLowerCase();
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

    return res.status(404).json({ success: false, message: 'Order not found.' });
  } catch (error) {
    next(error);
  }
};
