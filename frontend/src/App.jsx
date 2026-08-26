import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import './styles/globals.css'
import './styles/global.css'

// ─── Shared Layout Components ──────────────────────────────────────────────
import Navbar from './components/common/Navbar'
import Footer from './components/common/Footer'

// ─── Contexts ──────────────────────────────────────────────────────────────
import { CartProvider } from './context/CartContext'
import { CurrencyProvider } from './context/CurrencyContext'

// ─── Pages ─────────────────────────────────────────────────────────────────
import Home from './pages/Home'

// Module 1 (Dinu) — Auth & Profile (Connected from origin/feature/auth-profile)
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import SkinQuiz from './pages/SkinQuiz'
import ProtectedRoute from './components/auth/ProtectedRoute'

// Module 2 (Keshara) — Catalog
import CatalogPage from './pages/CatalogPage'
import ProductDetailPage from './pages/ProductDetailPage'

// Module 3 (Achani) — Cart & Wishlist
import CartPage from './pages/CartPage'
import WishlistPage from './pages/WishlistPage'

// Module 4 (Maduni) — Reviews & Recommendations
import RecommendationsPage from './pages/RecommendationsPage'

// Module 5 (Kaveesha) — Checkout, Payment & Order Tracking
import CheckoutPage from './pages/CheckoutPage'
import OrderConfirmationPage from './pages/OrderConfirmationPage'
import OrderTrackingPage from './pages/OrderTrackingPage'
import SupportPage from './pages/SupportPage'

// Module 6 (Tharushi) — Admin
import AdminLayout from './components/admin/AdminLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminProducts from './pages/admin/AdminProducts'
import AdminOrders from './pages/admin/AdminOrders'
import NotFound from './pages/NotFound'

// ──────────────────────────────────────────────────────────────────────────

// Scroll to top on every route change
function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

function App() {
  return (
    <CurrencyProvider>
      <CartProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            {/* ── Home (manages its own nav + layout internally) ── */}
            <Route path="/" element={<Home />} />

            {/* ── Module 1: Auth & Profile Pages (Dinu) ── */}
            <Route path="/login"     element={<WithLayout><Login /></WithLayout>} />
            <Route path="/register"  element={<WithLayout><Register /></WithLayout>} />
            <Route path="/profile"   element={<WithLayout><Profile /></WithLayout>} />
            <Route path="/skin-quiz" element={<WithLayout><SkinQuiz /></WithLayout>} />

            {/* ── Module 2: Product Routes (Keshara) ── */}
            <Route path="/products"     element={<CatalogPage />} />
            <Route path="/products/:id" element={<ProductDetailPage />} />

            {/* ── Module 3: Cart & Wishlist (Achani) ── */}
            <Route path="/cart"     element={<CartPage />} />
            <Route path="/wishlist" element={<WishlistPage />} />

            {/* ── Module 4: Recommendations & AI Advisor (Maduni) ── */}
            <Route path="/recommendations" element={<RecommendationsPage />} />
            <Route path="/advisor"         element={<RecommendationsPage />} />

            {/* ── Module 5: Checkout & Orders (Kaveesha) ── */}
            <Route path="/checkout"       element={<CheckoutPage />} />
            <Route path="/orders/confirm" element={<OrderConfirmationPage />} />
            <Route path="/orders/:id"     element={<OrderTrackingPage />} />
            <Route path="/support"        element={<SupportPage />} />

            {/* ── Module 6: Admin Routes (Tharushi) ── */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index           element={<AdminDashboard />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="orders"   element={<AdminOrders />} />
            </Route>

            {/* ── Fallback 404 ── */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </CurrencyProvider>
  )
}

// ── Layout wrapper: Navbar + page content + Footer ──────────────────────────
function WithLayout({ children }) {
  return (
    <>
      <Navbar />
      <main className="page-content fade-in">
        {children}
      </main>
      <Footer />
    </>
  )
}

export default App
