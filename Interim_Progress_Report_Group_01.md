# Interim Progress Report (CA 02)
**Project Name:** AuraGlow — Personalized Clean Beauty & Skincare E-Commerce Platform
**Date:** August 24, 2026
**Group:** [Insert Group Number / Name]

---

## 1. Project Overview
AuraGlow is a premium Direct-to-Consumer (D2C) Clean Beauty e-commerce web application. The platform is built using React.js (Vite) for the frontend, Node.js/Express.js for the backend API, and Supabase (PostgreSQL) for database and authentication management. 

This report outlines the development progress made to date to meet the 35% overall completion requirement for the CA 02 submission. The core UI/UX architecture has been established, and significant progress has been made on the primary customer-facing modules and the administrative backend.

---

## 2. Completed Modules & Features (Frontend & Backend)

### 2.1. Admin Dashboard & Inventory (Tharushi)
*Module 6 — Complete Frontend Implementation*
The administrative interface has been fully designed and built, establishing the tools required to manage the e-commerce platform.

- **Admin Layout & Navigation:** Built `AdminLayout.jsx` featuring a persistent side-navigation bar and a top header containing live user status and a global currency selector.
- **Dashboard Overview:** Implemented `AdminDashboard.jsx` which displays live KPI metrics (Today's Revenue, New Orders, Low Stock Items, Active Users) using dynamically updating glassmorphism cards.
- **Product & Inventory Management:** Created `AdminProducts.jsx`. Features a comprehensive data table listing all products with dynamic status badges (Active, Low Stock, Out of Stock). Includes a functional "+ Add Product" modal form.
- **Order Management:** Created `AdminOrders.jsx`. Displays a table of customer orders with colored status indicators and a dropdown menu to update order states (Pending, Processing, Shipped, Delivered).
- **Global Currency System:** Developed `CurrencyContext.jsx` using React Context. Allows users (both customers and admins) to switch between LKR, USD, EUR, GBP, and AED. The `formatPrice()` hook automatically recalculates and updates all prices across the entire application instantly.
- **Data Standardization:** Engineered `mockData.js`, establishing a normalized, single source of truth for products, categories, orders, and users. This ensures UI consistency across all team members' modules.
- **Storefront Landing Page:** Fully redesigned `Home.jsx` to feature a premium, responsive hero section, category navigation, and a dynamic 4-column product grid with hover-state action buttons.

### 2.2. Authentication, Profile & Skin Quiz (Dinu)
*Module 1 — Frontend & Backend Integration*
The core user identity and personalized onboarding flows have been established and wired to the Supabase database.

- **Database Architecture:** Designed and implemented the normalized 3NF PostgreSQL schema in Supabase (`users`, `skin_profiles`, `products`, `orders`, `cart_items`, `reviews`).
- **Backend Auth Controllers:** Developed Express.js routes and controllers (`auth.controller.js`, `auth.routes.js`) for secure user registration, login, and token generation.
- **Frontend Auth Context:** Built `AuthContext.jsx` and `authApi.js` to manage global user state and API communication.
- **Protected Routing:** Implemented `ProtectedRoute.jsx` to restrict access to authenticated areas (like the user profile and checkout).
- **Authentication Pages:** Designed and built `Login.jsx` and `Register.jsx`, featuring form validation and custom illustrative assets (`CosmeticDoodles.jsx`).
- **User Profile:** Built `Profile.jsx` allowing users to view their account details.
- **Skin Quiz Flow:** Developed `SkinQuiz.jsx`, an interactive multi-step form that captures user skin concerns, types, and preferences, which is mapped directly to the `skin_profiles` database table for personalized product recommendations.

---

## 3. GitHub & Branching Strategy
To ensure code stability and prevent merge conflicts, the team is utilizing a strict Git Feature Branch workflow:
- The `main` branch is protected for production releases.
- The `develop` branch serves as the central integration branch.
- Team members develop strictly on isolated branches (e.g., `feature/admin-dashboard`, `feature/auth-profile`).
- Code is combined via Pull Requests (PRs) into `develop` after peer review.

---

## 4. Next Steps (Towards 100% Completion)
With the foundation, database schema, Authentication, and Admin Dashboard completed, the remaining development phases will focus on:
1. **Product Catalog & Search (Keshara):** Connecting the storefront to the Supabase product tables and implementing dynamic filtering.
2. **Cart & Wishlist (Achani):** Building the persistent cart logic using the established database tables.
3. **Checkout & Stripe Integration (Kaveesha):** Implementing the payment gateway and finalizing order insertion into the database.
4. **Reviews (Maduni):** Enabling verified purchase reviews on the product detail pages.

---
*(Note: Please attach screenshots of the Home Page, Admin Dashboard, Admin Products, and Login/Register pages below this section in your final Word document).*
