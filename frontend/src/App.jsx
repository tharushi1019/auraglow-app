import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './styles/globals.css'

// ─── Shared Layout Components ──────────────────────────────────────────────
// import Navbar from './components/common/Navbar'
// import Footer from './components/common/Footer'

// ─── Pages (import when each member creates their module) ──────────────────
// Module 1 (Dinu) — Auth
// import LoginPage from './pages/LoginPage'
// import RegisterPage from './pages/RegisterPage'
// import ProfilePage from './pages/ProfilePage'
// import SkinQuizPage from './pages/SkinQuizPage'

// Module 2 (Keshara) — Catalog
// import CatalogPage from './pages/CatalogPage'
// import ProductDetailPage from './pages/ProductDetailPage'

// Module 3 (Achani) — Cart & Wishlist
// import CartPage from './pages/CartPage'
// import WishlistPage from './pages/WishlistPage'

// Module 4 (Maduni) — Reviews
// import ReviewsSection from './components/reviews/ReviewsSection'

// Module 5 (Kaveesha) — Checkout
// import CheckoutPage from './pages/CheckoutPage'
// import OrderTrackingPage from './pages/OrderTrackingPage'

// Module 6 (Tharushi) — Admin
// import AdminDashboard from './pages/admin/AdminDashboard'
// import AdminProducts from './pages/admin/AdminProducts'
// import AdminOrders from './pages/admin/AdminOrders'

// ──────────────────────────────────────────────────────────────────────────

function App() {
  return (
    <BrowserRouter>
      {/* <Navbar /> */}
      <main className="page-content">
        <Routes>
          {/* ── Public Routes ── */}
          <Route path="/" element={<ComingSoon label="Home / Landing Page" module="All Modules" />} />
          <Route path="/login" element={<ComingSoon label="Login Page" module="Module 1 — Dinu (Auth)" />} />
          <Route path="/register" element={<ComingSoon label="Register Page" module="Module 1 — Dinu (Auth)" />} />
          <Route path="/profile" element={<ComingSoon label="User Profile" module="Module 1 — Dinu (Auth)" />} />
          <Route path="/skin-quiz" element={<ComingSoon label="Skin Quiz" module="Module 1 — Dinu (Auth)" />} />

          {/* ── Product Routes ── */}
          <Route path="/products" element={<ComingSoon label="Product Catalog" module="Module 2 — Keshara (Catalog)" />} />
          <Route path="/products/:id" element={<ComingSoon label="Product Detail" module="Module 2 — Keshara (Catalog)" />} />

          {/* ── Cart & Wishlist ── */}
          <Route path="/cart" element={<ComingSoon label="Shopping Cart" module="Module 3 — Achani (Cart)" />} />
          <Route path="/wishlist" element={<ComingSoon label="Wishlist" module="Module 3 — Achani (Cart)" />} />

          {/* ── Checkout ── */}
          <Route path="/checkout" element={<ComingSoon label="Checkout" module="Module 5 — Kaveesha (Checkout)" />} />
          <Route path="/orders/:id" element={<ComingSoon label="Order Tracking" module="Module 5 — Kaveesha (Checkout)" />} />
          <Route path="/support" element={<ComingSoon label="Customer Support / FAQ" module="Module 5 — Kaveesha (Checkout)" />} />

          {/* ── Admin Routes ── */}
          <Route path="/admin" element={<ComingSoon label="Admin Dashboard" module="Module 6 — Tharushi (Admin)" />} />
          <Route path="/admin/products" element={<ComingSoon label="Admin Products" module="Module 6 — Tharushi (Admin)" />} />
          <Route path="/admin/orders" element={<ComingSoon label="Admin Orders" module="Module 6 — Tharushi (Admin)" />} />

          {/* ── Fallback ── */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      {/* <Footer /> */}
    </BrowserRouter>
  )
}

// ── Temporary placeholder shown until each module is built ──────────────────
function ComingSoon({ label, module }) {
  return (
    <div className="flex-center" style={{ minHeight: '100vh', flexDirection: 'column', gap: 'var(--space-6)', textAlign: 'center' }}>
      <div style={{ fontSize: '3rem' }}>🌸</div>
      <h1 className="text-gradient" style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-3xl)' }}>
        AuraGlow
      </h1>
      <div className="card" style={{ maxWidth: '480px' }}>
        <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-xs)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 'var(--space-2)' }}>
          Page
        </p>
        <h2 style={{ color: 'var(--color-text-primary)', fontSize: 'var(--text-xl)', marginBottom: 'var(--space-3)' }}>
          {label}
        </h2>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>
          Assigned to: <span style={{ color: 'var(--color-accent-rose)' }}>{module}</span>
        </p>
      </div>
      <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>
        Project initialized ✅ — Start building your module!
      </p>
    </div>
  )
}

export default App
