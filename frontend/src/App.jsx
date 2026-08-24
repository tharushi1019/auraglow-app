import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './styles/globals.css'

// ─── Shared Layout Components ──────────────────────────────────────────────
// import Navbar from './components/common/Navbar'
// import Footer from './components/common/Footer'

// ─── Pages (import when each member creates their module) ──────────────────
import Home from './pages/Home'

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
import AdminLayout from './components/admin/AdminLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminProducts from './pages/admin/AdminProducts'
import AdminOrders from './pages/admin/AdminOrders'

// ──────────────────────────────────────────────────────────────────────────

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ── Home (manages its own nav + layout) ── */}
        <Route path="/" element={<Home />} />

        {/* ── Auth pages with page-content padding ── */}
        <Route path="/login"     element={<PageWrapper><ComingSoon label="Login Page"    module="Module 1 — Dinu (Auth)" /></PageWrapper>} />
        <Route path="/register"  element={<PageWrapper><ComingSoon label="Register Page" module="Module 1 — Dinu (Auth)" /></PageWrapper>} />
        <Route path="/profile"   element={<PageWrapper><ComingSoon label="User Profile"  module="Module 1 — Dinu (Auth)" /></PageWrapper>} />
        <Route path="/skin-quiz" element={<PageWrapper><ComingSoon label="Skin Quiz"     module="Module 1 — Dinu (Auth)" /></PageWrapper>} />

        {/* ── Product Routes ── */}
        <Route path="/products"    element={<PageWrapper><ComingSoon label="Product Catalog" module="Module 2 — Keshara (Catalog)" /></PageWrapper>} />
        <Route path="/products/:id" element={<PageWrapper><ComingSoon label="Product Detail" module="Module 2 — Keshara (Catalog)" /></PageWrapper>} />

        {/* ── Cart & Wishlist ── */}
        <Route path="/cart"     element={<PageWrapper><ComingSoon label="Shopping Cart" module="Module 3 — Achani (Cart)" /></PageWrapper>} />
        <Route path="/wishlist" element={<PageWrapper><ComingSoon label="Wishlist"      module="Module 3 — Achani (Cart)" /></PageWrapper>} />

        {/* ── Checkout ── */}
        <Route path="/checkout"    element={<PageWrapper><ComingSoon label="Checkout"         module="Module 5 — Kaveesha (Checkout)" /></PageWrapper>} />
        <Route path="/orders/:id"  element={<PageWrapper><ComingSoon label="Order Tracking"   module="Module 5 — Kaveesha (Checkout)" /></PageWrapper>} />
        <Route path="/support"     element={<PageWrapper><ComingSoon label="Customer Support" module="Module 5 — Kaveesha (Checkout)" /></PageWrapper>} />

        {/* ── Admin Routes (AdminLayout manages its own space) ── */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index         element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders"   element={<AdminOrders />} />
        </Route>

        {/* ── Fallback ── */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

// Wrapper that adds top-nav padding for non-home pages
function PageWrapper({ children }) {
  return <main className="page-content">{children}</main>
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
