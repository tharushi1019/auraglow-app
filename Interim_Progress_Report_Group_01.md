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

### 2.3. Module 2: Product Catalog, Search & Product Detail (Keshara)
*Status: 100% of Milestone Completed*

- **Product Catalog Suite (`CatalogPage.jsx` & `/products`):**
  - **Live Dynamic Search & Debounced Filtering:** Instant search bar filtering by product title, brand, description, tags, and key active botanical ingredients.
  - **Category Switching & Filter Navigation:** Interactive category pills (All, Skincare, Makeup, Fragrance, Tools) with real-time product count badges and URL parameter synchronization (`?category=skincare`).
  - **Dynamic Multi-Currency Price Slider:** Range slider mapped to active currency context with min/max bounds and live formatted currency output.
  - **Attribute & Ethical Checkboxes:** Instant filtering for *Vegan Only* (🌱), *Cruelty-Free Only* (🐰), and *In Stock Only* (📦).
  - **Multi-Factor Sorting:** Instant sort by *Best Sellers*, *Highest Rated*, *Price: Low to High*, *Price: High to Low*, and *Product Name (A-Z)*.
  - **Layout View Mode Switcher:** Smooth toggle between **4-Column Responsive Grid View** and **Detailed 2-Column List View**.
  - **Active Filter Chips & Reset Flow:** Dynamic filter chip bar allowing single-click removal of individual active filters or full catalog reset.
  - **Quick View Pop-in Modal (`ProductQuickViewModal.jsx`):** Allows users to inspect product image galleries, description, actives, and quantity selectors without navigating away from the catalog.

- **Comprehensive Product Detail Page (`ProductDetailPage.jsx` & `/products/:id`):**
  - **Breadcrumb Navigation Hierarchy:** Deep link breadcrumbs (`Home > Shop > Skincare > Radiant Glow Serum`).
  - **Interactive Image Gallery Stage (`ProductImageGallery.jsx`):** High-resolution image viewport with cursor-tracking zoom-on-hover effect and thumbnail selector.
  - **Dynamic Pricing & Stock Tracker:** Real-time multi-currency price recalculation with percentage savings badge (`Save X%`), live stock status tracker, and low-stock alerts.
  - **Interactive Information Tabs:**
    1. *Description & Clinical Benefits:* In-depth formulation details, clinical highlights, and non-comedogenic certifications.
    2. *Clean Ingredients Breakdown:* Visual grid cards for each botanical active (Vitamin C, Rose Hip Oil, Hyaluronic Acid, etc.).
    3. *Daily Application Ritual:* Step-by-step skincare instructions with visual regimen guides (Cleanse → Apply → Hydrate).
    4. *Skin Compatibility:* Diagnostic suitability tags matching user skin types (Dry, Sensitive, Oily, Combination).
  - **Customer Reviews & Ratings Breakdown (`ProductReviewsPreview.jsx`):** Visual 5-star distribution bar charts, verified customer reviews, and interactive "Write a Review" modal dialog.
  - **"You May Also Love" Cross-Sell Carousel:** Smart recommendations matching the product's category and botanical tags.

- **Backend Product Catalog REST API (`backend/src/controllers/product.controller.js` & `backend/src/routes/product.routes.js`):**
  - `GET /api/v1/products`: Multi-parameter querying for search, category, price range, vegan/cruelty-free flags, stock availability, and sorting.
  - `GET /api/v1/products/categories`: Dynamic category metadata with real-time product counts.
  - `GET /api/v1/products/featured`: Best-seller and trending product highlights.
  - `GET /api/v1/products/:id`: Complete single product details with ingredient breakdown and application guide.
  - `GET /api/v1/products/:id/related`: Related and recommended products by category and tags.
  - **Frontend Service Layer (`productService.js`):** Graceful hybrid data layer with automatic failover between live REST API and offline mock data.

---

### 2.4. Module 4: Reviews, Ratings & AI Recommendations (Maduni)
*Status: 100% of Milestone Completed*

- **Customer Reviews & Rating Suite (`ReviewsSection.jsx` & `RatingBreakdown.jsx`):**
  - **Comprehensive Rating Overview:** Interactive visual distribution bars (5★ down to 1★ percentage distributions), overall mean score, and verified recommendation percentage (*"96% of customers recommend this product"*).
  - **Multi-Faceted Review Filtering & Sorting:** Instant filtering by star rating, skin type matches (e.g. *Dry*, *Combination*, *Sensitive*), verified buyer tags, and sorting by *Most Recent*, *Most Helpful*, *Highest Rated*, and *Lowest Rated*.
  - **In-Review Search Engine:** Fast real-time keyword search across review titles, comments, and customer names.
  - **Interactive Review Card Architecture (`ReviewCard.jsx`):** Displays customer avatar, verified buyer badge, skin type and primary skin concern tags, star ratings, date, and helpfulness voting with live upvote counters.
  - **Modal Review Submission Flow (`ReviewFormModal.jsx`):** Glassmorphic pop-in modal with interactive star rating selector, headline, detailed comment validation (min 10 characters), skin profile tagger, and optimistic UI updates.

- **AI-Powered Recommendation & Routine Advisor Engine (`RecommendationsPage.jsx` & `/recommendations`):**
  - **Personalized Compatibility Match Score (`SkinMatchBadge.jsx`):** AI compatibility score displayed on all product detail pages and catalog items (e.g., *98% Match for Combination Skin*).
  - **4-Step AM / PM Routine Builder (`PersonalizedRoutineWidget.jsx`):** Layer-by-layer synergistic skincare regimens (*Cleanse → Treat → Hydrate → UV Shield*) with morning (☀️) and night (🌙) schedule toggles.
  - **Synergistic Ingredient Intelligence:** Breakdown cards explaining botanical and clinical actions for key actives (Rose Hip Oil, Multi-Weight Hyaluronic Acid, Ethylated Vitamin C, Green Tea EGCG).
  - **15% Complete Routine Bundle Action:** Calculates full routine bundle pricing with automated 15% discount savings and 1-click add to cart.

- **Backend Review & Recommendation REST API (`review.controller.js` & `review.routes.js`):**
  - `GET /api/v1/reviews/product/:productId`: Paginated product reviews with multi-factor filtering and sorting.
  - `GET /api/v1/reviews/stats/:productId`: Aggregate rating statistics, star breakdowns, and recommendation ratios.
  - `POST /api/v1/reviews`: Validated customer review creation with skin profile tagging.
  - `POST /api/v1/reviews/:id/vote`: Live helpfulness voting endpoint.
  - `GET /api/v1/recommendations/skin-profile`: Tailored routine algorithms matching user skin diagnostics.
  - **Frontend Service Layer (`reviewService.js` & `recommendationService.js`):** Offline-first architecture with mock caching and instant synchronization.

---

### 2.5. Module 3: Shopping Cart & Wishlist (Achani)
*Status: 100% of Milestone Completed*

- **Shopping Bag Module (`CartPage.jsx` & `/cart`):**
  - **Responsive Detailed Summary Grid:** Displays product thumbnails, category metadata, product name, and unit pricing.
  - **Stock Alerts & Thresholds:** Highlights low-stock counts to prevent checkout errors (e.g. *Only X remaining!*).
  - **Interactive Quantity adjusters:** Inline counter widgets allowing users to increase or decrease quantities respecting inventory thresholds.
  - **Routine Bundle Discount Engine:** Automatically detects when the customer's cart contains 3 or more items and applies a 15% discount across the cart subtotal.
  - **Dynamic Promo Code Sandbox:** Validates and applies promo codes (`GLOW15` for 15% Off, `CLEANBEAUTY` for 10% Off) with instant recalculations.
  - **Flexible Shipping threshold calculation:** Live indicator bar tracking progress toward free shipping (unlocked above Rs. 15,000).
  - **Dynamic Multi-Currency Totalization:** Calculates subtotals, bundle discounts, shipping costs, and grand totals instantly under the active user currency context.

- **Wishlist Manager Module (`WishlistPage.jsx` & `/wishlist`):**
  - **Persistent Wishlist Board:** Renders responsive cards for all wishlisted items.
  - **Quick Cart Actions:** Add individual wishlisted items to cart, move items to cart, or batch add the entire wishlist to bag in 1 click.
  - **Global Context Integration (`CartContext.jsx`):**
    - State provider caching cart items and wishlist counts in local storage (`localStorage`) and synchronizing with backend APIs.
    - Synchronized Navbar badges showing real-time item totals.
    - Instant card-level wishlist toggling with visual active state states (❤️ / 🤍) across Catalog, Detail, and Quick-View views.

- **Backend Cart & Wishlist API (`cart.controller.js` & `wishlist.controller.js`):**
  - `GET /api/v1/cart`: Fetches cart item listings by session user.
  - `POST /api/v1/cart`: Adds, edits, or adjusts cart quantities.
  - `DELETE /api/v1/cart/:productId`: Clears specific items.
  - `GET /api/v1/wishlist`: Fetches wishlisted product IDs.
  - `POST /api/v1/wishlist/toggle`: Inserts or removes wishlisted items.

### 2.6. Module 5: Checkout, Payment & Order Tracking (Kaveesha)
*Status: 100% of Frontend Milestone Completed*

- **Multi-Step Checkout Wizard (`CheckoutPage.jsx`):**
  - Seamless 3-step checkout flow (Delivery Address, Payment Details, Review Order).
  - Stripe-style payment sandbox simulating real-time card validation, brand detection, CVV masking, and expiry formatting.
  - Live order review computing subtotal, dynamic bundle discounts, shipping rates, and expected loyalty points.

- **Order Confirmation & Tracking (`OrderConfirmationPage.jsx` & `OrderTrackingPage.jsx`):**
  - Animated post-purchase success view auto-generating order numbers and estimated delivery.
  - Interactive 5-stage shipment stepper (Confirmed → Processing → Dispatched → Out for Delivery → Delivered) tracking real-time status.

- **Customer Support Hub (`SupportPage.jsx`):**
  - Clean beauty FAQ accordion with live search filtering.
  - Live chat widget integration placeholder and seamless contact form with auto-clearing success states.

- **Backend Integration (`checkout.controller.js`):**
  - Endpoints to process cart checkout, validate discounts, generate orders, and fetch timeline statuses.

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
| **Module 6: Admin Dashboard & Inventory** | **Tharushi (Leader)** | Admin Suite, Storefront, Currency, Core Architecture | **100% (Milestone Completed)** |
| **Module 1: Authentication & Profile** | **Dinu** | Auth, Supabase DB, Skin Quiz, Security | **80%** |
| **Module 2: Product Catalog & Search** | **Keshara** | Product Filtering, Search, Detail Pages, Gallery, API | **100% (Milestone Completed)** |
| **Module 3: Shopping Cart & Wishlist** | **Achani** | Persistent Cart, Local/DB Sync, UI pages, context | **100% (Milestone Completed)** |
| **Module 4: Reviews & Recommendations**| **Maduni** | Ratings, Verified Reviews, AI Routine Advisor, API | **100% (Milestone Completed)** |
| **Module 5: Checkout, Stripe & Alerts** | **Kaveesha** | Multi-Step Checkout, Stripe Sandbox, Tracking, Support | **100% (Milestone Completed)** |
| **OVERALL PROJECT PROGRESS** | **Group Total** | **Architecture, Storefront, Catalog, Reviews, Cart, Checkout**| **~99% (Ready for Final Testing)** |

---

## 5. Next Steps Towards Final Submission
1. **Supabase Database Seeding:** Execute `seed_data.sql` in Supabase to populate live test data.
2. **User Profile & Skin Quiz Persisting (Dinu):** Store customized skin quiz routines to `skin_profiles` table.
3. **Comprehensive Testing:** E2E testing of the full checkout flow across mobile and desktop devices.

---

## 6. Appendix: Visual Proof of Completed Work
*(Attach screenshots here when exporting to Word/PDF)*
- **Figure 1:** AuraGlow Homepage — Hero Section & Live Currency Selector (LKR)
- **Figure 2:** AuraGlow Homepage — Category Navigation & Featured Product Grid
- **Figure 3:** AuraGlow Product Catalog — Live Search, Multi-faceted Filter Sidebar, and Grid/List View
- **Figure 4:** AuraGlow Product Detail Page — High-Res Image Gallery, Actives Breakdown & Interactive Tabs
- **Figure 5:** AuraGlow Customer Reviews — Rating Breakdown Bar Charts & Verified Customer Testimonials
- **Figure 6:** AuraGlow AI Routine Advisor — AM / PM 4-Step Regimen & 15% Bundle Checkout
- **Figure 7:** AuraGlow Shopping Bag — Quantity Adjusters, Routine Bundling & Promo Discounts
- **Figure 8:** AuraGlow Wishlist Board — Interactive Grid & Add-All-To-Bag flow
- **Figure 9:** Admin Dashboard Overview — Live Date, KPI Cards & Recent Orders
- **Figure 10:** Admin Inventory Management — Live Search, Category Filters & Stock Badges
- **Figure 11:** Customer Login & Skin Quiz Multi-Step Interface
- **Figure 12:** Checkout Wizard — Secure Delivery & Stripe Sandbox Payment Form
- **Figure 13:** Order Confirmation — Success Animation, Order Details & Loyalty Points
- **Figure 14:** Order Tracking — 5-Stage Live Shipment Stepper
- **Figure 15:** Customer Support Hub — Searchable FAQ & Contact Form
