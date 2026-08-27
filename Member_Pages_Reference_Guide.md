# AuraGlow — Member Pages & Features Reference Guide

This reference document outlines every page and view in the AuraGlow E-Commerce Platform, categorized by the team member responsible, along with a concise 2–3 sentence explanation for each page.

---

## 1. Dinu — Module 1: Authentication, Profiles & Skin Quiz (`feature/auth-profile`)

### 🔑 Login Page (`/login` — `Login.jsx`)
> Implemented a secure login gateway featuring client-side form validation, password encryption verification, and animated cosmetic line-art background doodles (`CosmeticDoodles.jsx`). Upon successful authentication, it stores the JWT token globally in `AuthContext` and smoothly redirects users to their personalized profile dashboard.

### 📝 Register Page (`/register` — `Register.jsx`)
> Developed the user onboarding sign-up page that captures full name, email, and passwords with real-time error checking. It registers the new account directly into the Supabase `users` database table and initializes the user's active session immediately.

### 👤 Profile Dashboard (`/profile` — `Profile.jsx`)
> A dedicated customer account dashboard displaying the user's identity details, member since timestamp, and active skin profile parameters. It also includes account management controls and a clean logout action that clears active tokens safely.

### ✨ Skin Quiz Wizard (`/skin-quiz` — `SkinQuiz.jsx`)
> An interactive, 3-step personalized quiz where users select their skin type, primary skin concerns, and ingredient allergen sensitivities using glowing option chips. The completed quiz data is saved to the `skin_profiles` database table and feeds directly into the AI Routine Advisor.

---

## 2. Tharushi (Group Leader) — Module 2: Storefront & Admin Dashboard (`feature/admin-dashboard`)

### 🏠 Storefront Homepage (`/` — `Home.jsx`)
> Crafted the high-conversion luxury landing page featuring a radiant hero section, interactive "Shop by Category" showcase cards, and a trending products carousel. It integrates the global multi-currency converter and pure CSS hover elevations to provide an immersive luxury clean beauty shopping experience.

### 📊 Executive Admin Dashboard (`/admin` — `AdminDashboard.jsx`)
> Built a real-time administrative console displaying high-level KPI cards (Gross Revenue, Processed Orders, AOV, and Conversion Rate) with period-over-period growth indicators. It features interactive sales trajectory bar charts, clean beauty category revenue share breakdowns, and live store activity feeds.

### 🧴 Inventory & SKU Hub (`/admin/products` — `AdminProducts.jsx`)
> Developed a comprehensive inventory management table with live SKU searching, category filtering, and inline `+` / `-` stock adjustments. It includes an "Add Product SKU" modal equipped with automated drag-and-drop file uploads directly to the **ImgBB CDN**.

### 📦 Order Fulfillment Manager (`/admin/orders` — `AdminOrders.jsx`)
> An administrative order dispatch center featuring status pill filters (Pending, Processing, Shipped, Delivered) and customer search. It includes an inspect invoice modal to view full recipient addresses and 1-click actions to advance shipment statuses.

---

## 3. Keshara — Module 3: Product Catalog & Search Engine (`feature/product-catalog`)

### 🛍️ Product Catalog Page (`/products` — `CatalogPage.jsx`)
> Engineered the primary shopping catalog equipped with a faceted sidebar allowing simultaneous filtering by Category, Skin Compatibility, and Price brackets. Includes a real-time instant search bar that filters the product grid on the fly without full page reloads.

### 🔍 Product Detail Page (`/products/:id` — `ProductDetailPage.jsx`)
> Designed an immersive product view featuring high-resolution image galleries, interactive tabs for Ingredients and Usage routines, and live stock badges. It also displays a dynamic "Skin Match" compatibility score badge comparing the product with the user's quiz profile.

---

## 4. Achani — Module 4: Shopping Cart & Wishlist System (`feature/cart-wishlist`)

### 🛒 Shopping Bag (`/cart` — `CartPage.jsx`)
> Built an interactive shopping cart with live quantity steppers, automated item subtotals, and free delivery thresholds. It automatically calculates and applies a dynamic 15% Bundle Discount whenever a customer adds 3 or more products to their bag.

### 🤍 Wishlist Board (`/wishlist` — `WishlistPage.jsx`)
> Created a visual "Save for Later" board where customers can curate their favorite skincare and beauty products. Users can seamlessly push any wishlisted product directly into their active cart with a single click.

---

## 5. Maduni — Module 5: Customer Reviews & AI Recommendations (`feature/review-recommendation`)

### 🤖 AI Routine Advisor (`/recommendations` & `/advisor` — `RecommendationsPage.jsx`)
> Engineered an intelligent skincare algorithm that analyzes the user's `SkinQuiz` responses to generate a customized 4-step AM/PM regimen (Cleanser, Toner, Serum, Moisturizer). Includes a "One-Click Bundle" button allowing customers to add the entire recommended regimen to their cart at once.

### ⭐ Product Reviews Section (`ReviewsSection.jsx` on Product Detail Pages)
> Implemented an authentic customer review engine displaying graphical star breakdown bars, average satisfaction scores, and "Verified Purchase" badges. It highlights reviews from customers who share the same skin type as the browsing user using dynamic Skin Match badges.

---

## 6. Kaveesha — Module 6: Secure Checkout, Payment & Tracking (`feature/checkout-stripe`)

### 💳 3-Step Checkout Wizard (`/checkout` — `CheckoutPage.jsx`)
> Designed a streamlined accordion checkout flow covering Delivery Address, Payment Method, and Final Order Review. It includes a simulated Stripe card gateway with real-time brand detection, CVV masking, and 256-bit SSL trust badges.

### 🎉 Order Confirmation Screen (`/orders/confirm` — `OrderConfirmationPage.jsx`)
> Developed a celebratory post-purchase confirmation screen featuring animated confetti, generated order tracking numbers, and complete invoice receipts. It provides customers with a direct button to track their package in real time.

### 🚚 Live Shipment Stepper (`/orders/:id` — `OrderTrackingPage.jsx`)
> Built a visual 5-stage shipment timeline (Confirmed → Processing → Dispatched → Out for Delivery → Delivered) with estimated delivery dates and dispatch milestones.

### 💬 Customer Support Portal (`/support` — `SupportPage.jsx`)
> Created a dedicated customer support hub with a searchable FAQ accordion, contact inquiry form, and live chat placeholder to assist shoppers with order inquiries.
