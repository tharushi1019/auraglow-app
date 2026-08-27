require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Health Check ──────────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'AuraGlow API is running 🌸',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});

// ── API Routes (uncomment as each module is completed) ───────────────────────

// Module 1 — Dinu (Auth & Profile)
const authRoutes = require('./routes/auth.routes');
app.use('/api/v1/auth', authRoutes);

// Module 2 — Keshara (Product Catalog)
const productRoutes = require('./routes/product.routes');
app.use('/api/v1/products', productRoutes);

// Module 3 — Achani (Cart & Wishlist)
const cartRoutes = require('./routes/cart.routes');
const wishlistRoutes = require('./routes/wishlist.routes');
app.use('/api/v1/cart', cartRoutes);
app.use('/api/v1/wishlist', wishlistRoutes);

// Module 4 — Maduni (Reviews & Recommendations)
const reviewRoutes = require('./routes/review.routes');
app.use('/api/v1/reviews', reviewRoutes);
app.use('/api/v1/recommendations', reviewRoutes);

// Module 5 — Kaveesha (Checkout & Orders)
const checkoutRoutes = require('./routes/checkout.routes');
app.use('/api/v1/checkout', checkoutRoutes);
app.use('/api/v1/orders', (req, res, next) => {
  req.url = '/orders' + req.url;
  checkoutRoutes(req, res, next);
});

// Module 6 — Tharushi (Admin Dashboard)
// const adminRoutes = require('./routes/admin.routes');
// app.use('/api/v1/admin', adminRoutes);

// ── 404 Handler ───────────────────────────────────────────────────────────────
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// ── Global Error Handler ──────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('❌ Unhandled error:', err.message);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// ── Start Server ──────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🌸 AuraGlow Backend running at http://localhost:${PORT}`);
  console.log(`🏥 Health check: http://localhost:${PORT}/health`);
});

module.exports = app;
