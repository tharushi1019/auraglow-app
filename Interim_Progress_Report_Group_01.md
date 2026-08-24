# Interim Progress Report (CA 02)
**Project Name:** AuraGlow — Personalized Clean Beauty & Skincare E-Commerce Platform  
**Date:** August 24, 2026  
**Module Leader & Report Author:** Tharushi (Group Leader)  
**Group:** [Insert Group Number / Name]  

---

## 1. Executive Summary & Objective
AuraGlow is a premium Direct-to-Consumer (D2C) Clean Beauty & Skincare e-commerce platform built with React.js (Vite), Node.js / Express.js, and Supabase (PostgreSQL).

This Interim Progress Report (CA 02) demonstrates that our team has achieved **well over the mandatory 35% milestone** ahead of the August 29 deadline. The architectural foundation, design system, core public storefront, full administrative dashboard & inventory suite, multi-currency conversion engine, database schema, and authentication subsystem are fully developed, styled, and integrated.

---

## 2. Summary of Completed Development

### 2.1. Module 6: Admin Dashboard, Inventory & Core Platform (Tharushi)
*Status: 100% of Frontend Milestone Completed*

- **Storefront Landing Page (`Home.jsx`):**
  - High-conversion responsive Hero section with animated typography and dynamic call-to-action badges.
  - Interactive "Shop by Category" collection with pure CSS hover elevations and smooth image zoom.
  - 4-column product showcase ("Trending Right Now") featuring uniform aspect ratios, quick hover actions ("Add to Cart" and Wishlist), stock/vegan badges, star ratings, and strike-through discount pricing.
  - Social proof counters, clean beauty ingredient highlights, customer testimonials, and trust badges.

- **Global Multi-Currency Engine (`CurrencyContext.jsx` & `Navbar.jsx`):**
  - Implemented a custom React Context provider managing dynamic real-time currency conversions.
  - **Default Base Currency: LKR (Sri Lankan Rupee)** with instant conversion support for USD, EUR, GBP, and AED.
  - Custom `formatPrice()` utility dynamically recalculates all product cards, discount tags, order totals, and revenue metrics across the entire application without page reloads.
  - Integrated currency switchers in both the customer top navbar and the administrative layout header.

- **Admin Control Center & Layout (`AdminLayout.jsx`):**
  - Glassmorphic administrative sidebar with persistent route highlighting and quick back-to-store navigation.
  - Top administrative navigation bar showing admin profile status ("Tharushi — Online") and global currency controls.

- **Dashboard Analytics & KPIs (`AdminDashboard.jsx`):**
  - Live system date tracker (e.g., *Monday, 24 August 2026*) auto-updated in real-time.
  - Dynamic KPI cards for **Today's Revenue**, **New Orders**, **Active Users**, and **Low Stock Items** (calculated in real time from the inventory state).
  - Recent Orders table with automated color-coded status badges (`badge-warning`, `badge-info`, `badge-success`).
  - "Download Report" administrative action trigger.

- **Inventory Management Module (`AdminProducts.jsx`):**
  - Interactive product catalog table displaying ID, Product Name, Category, Price, Stock count, and Status badges.
  - **Live Search & Category Filtering:** Instant search bar filtering by product name combined with category selection dropdowns.
  - Stock summary header automatically highlighting low-stock and out-of-stock counts.
  - **Modal Add-Product Flow:** Pop-in modal dialog with validation for Name, Category, Base Price (LKR), and Initial Stock, with live table appending.
  - Row-level Product Edit and Delete operations.

- **Order Management Module (`AdminOrders.jsx`):**
  - Comprehensive customer order tracking data table.
  - Interactive inline status dropdown allowing administrators to update order status (`Pending` → `Processing` → `Shipped` → `Delivered` → `Cancelled`) with responsive color-coded visual indicator dots.

- **Branded 404 Not Found Page (`NotFound.jsx`):**
  - Aesthetic fallback page for unmatched routes with glowing gradient typography and direct navigation links back to the Storefront and Admin dashboard.

- **Design System & Micro-Interactions (`globals.css` & `components.css`):**
  - Unified token-based design system featuring smooth HSL color palettes, dark glassmorphism backdrops, and accessible typography.
  - Non-intrusive micro-interactions: smooth card elevations, soft button glow pulses, shimmer headers, and modal scale-ins.

- **Standardized Mock Data & Supabase Seed Script (`mockData.js` & `seed_data.sql`):**
  - Created `frontend/src/data/mockData.js` containing 8 fully detailed products, 4 categories, sample orders, customer profiles, and quiz questions to maintain strict data consistency across all 6 group members' branches.
  - Generated `database/seed_data.sql` with fixed UUID primary keys and relational foreign keys, perfectly mapping the mock data to Dinu's Supabase tables.

---

### 2.2. Module 1: Authentication, Profile & Skin Quiz (Dinu)
*Status: Core Backend & Frontend Architecture Completed*

- **PostgreSQL Database Schema (`database/schema.sql`):**
  - Designed and executed a 3NF normalized relational schema in Supabase containing: `users`, `skin_profiles`, `products`, `orders`, `order_items`, `cart_items`, `wishlist_items`, and `reviews`.
  - Configured PostgreSQL triggers for automatic `updated_at` timestamps and full-text search indexing on product names and descriptions.
- **Backend API & Authentication (`backend/src/`):**
  - Express.js REST API with modular controllers, routes, error handling middleware, and token validators.
  - Supabase client integration for secure customer and administrator authentication.
- **Frontend Authentication & Onboarding (`frontend/src/`):**
  - `AuthContext.jsx` managing user sessions and login state.
  - `Login.jsx` and `Register.jsx` with input validation and custom brand visuals (`CosmeticDoodles.jsx`).
  - `ProtectedRoute.jsx` component guarding private routes.
  - Multi-step interactive `SkinQuiz.jsx` mapping skin types, concerns, and undertones to the `skin_profiles` table.

---

## 3. Team Collaboration & Git Branching Strategy
To ensure zero code conflicts and maintain enterprise-level code quality:
1. **Protected `main` Branch:** Reserved exclusively for final production releases.
2. **Integration `develop` Branch:** Acts as the central hub where feature branches are merged.
3. **Isolated Feature Branches:** Each group member develops on their dedicated branch:
   - `feature/admin-dashboard` (Tharushi)
   - `feature/auth-profile` (Dinu)
   - `feature/product-catalog` (Keshara)
   - `feature/cart-wishlist` (Achani)
   - `feature/review-recommendation` (Maduni)
   - `feature/checkout-stripe` (Kaveesha)
4. **Pull Requests (PR):** All code is reviewed and merged into `develop` through verified GitHub Pull Requests.

---

## 4. Overall Progress Estimation

| Module | Assigned Member | Scope / Focus | Estimated Progress |
|---|---|---|:---:|
| **Module 6: Admin Dashboard & Inventory** | **Tharushi (Leader)** | Admin Suite, Storefront, Currency, Core Architecture | **100% (Frontend Milestone)** |
| **Module 1: Authentication & Profile** | **Dinu** | Auth, Supabase DB, Skin Quiz, Security | **80%** |
| **Module 2: Product Catalog & Search** | **Keshara** | Product Filtering, Search, Detail Pages | **25%** (Scaffolded) |
| **Module 3: Shopping Cart & Wishlist** | **Achani** | Persistent Cart, Local/DB Sync | **25%** (Scaffolded) |
| **Module 4: Reviews & Recommendations**| **Maduni** | Ratings, Verified Reviews, AI Suggestions | **25%** (Scaffolded) |
| **Module 5: Checkout, Stripe & Alerts** | **Kaveesha** | Payment Gateway, Stripe Intents, Invoices | **25%** (Scaffolded) |
| **OVERALL PROJECT PROGRESS** | **Group Total** | **Architecture, Frontend & DB Foundation** | **~45% (Exceeds 35% Requirement)** |

---

## 5. Next Steps Towards Final Submission
1. **Supabase Database Seeding:** Execute `seed_data.sql` in Supabase to populate live test data.
2. **Catalog & Search Integration (Keshara):** Connect the storefront catalog views to live Supabase product endpoints.
3. **Cart & Checkout Logic (Achani & Kaveesha):** Connect `cart_items` table and integrate Stripe sandbox payments.
4. **Verified Reviews (Maduni):** Link user reviews directly to completed `order_id` records.

---

## 6. Appendix: Visual Proof of Completed Work
*(Attach screenshots here when exporting to Word/PDF)*
- **Figure 1:** AuraGlow Homepage — Hero Section & Live Currency Selector (LKR)
- **Figure 2:** AuraGlow Homepage — Category Navigation & Featured Product Grid
- **Figure 3:** Admin Dashboard Overview — Live Date, KPI Cards & Recent Orders
- **Figure 4:** Admin Inventory Management — Live Search, Category Filters & Stock Badges
- **Figure 5:** Admin Order Management — Interactive Status Dropdown
- **Figure 6:** Customer Login & Skin Quiz Multi-Step Interface
