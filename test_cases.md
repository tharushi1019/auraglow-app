# AuraGlow E-Commerce Platform — Complete Test Case Suite

> **Platform:** AuraGlow Personalized Clean Beauty & Skincare  
> **Type:** Web-based E-Commerce Platform  
> **Stack:** React + Node.js/Express + Supabase (PostgreSQL) + Google Gemini AI  
> **Demo URL:** http://localhost:5173 | **API:** http://localhost:5000

---

## 🔑 Demo Credentials

| Role | Email | Password |
|:---|:---|:---|
| Admin | `admin@auraglow.com` | `Admin@AuraGlow2026` |
| Customer | `demo@auraglow.com` | `Customer@123` |
| Guest | *(no login)* | — |

---

## ✅ MODULE 1 — User Authentication & Profile *(Dinu)*

### TC-AUTH-01: Guest Home Page Access
| Field | Details |
|:---|:---|
| **Test ID** | TC-AUTH-01 |
| **Description** | Guest can browse homepage without login |
| **Pre-condition** | Not logged in |
| **Steps** | 1. Open `http://localhost:5173` |
| **Expected Result** | Homepage loads with hero, products, categories. No forced login. |
| **Pass Criteria** | ✅ Homepage renders for guests |

### TC-AUTH-02: Guest Blocked from Profile
| Field | Details |
|:---|:---|
| **Test ID** | TC-AUTH-02 |
| **Description** | Guest navigating to `/profile` is redirected to login |
| **Pre-condition** | Not logged in |
| **Steps** | 1. Navigate to `http://localhost:5173/profile` |
| **Expected Result** | Redirected to `/login?redirect=%2Fprofile` |
| **Pass Criteria** | ✅ URL changes with redirect param |

### TC-AUTH-03: Guest Blocked from Skin Quiz
| Field | Details |
|:---|:---|
| **Test ID** | TC-AUTH-03 |
| **Description** | Guest clicking Skin Quiz is redirected to login |
| **Pre-condition** | Not logged in |
| **Steps** | 1. Click **✨ Skin Quiz** button in navbar |
| **Expected Result** | Redirected to `/login?redirect=%2Fskin-quiz` |
| **Pass Criteria** | ✅ Guest redirected |

### TC-AUTH-04: Guest Blocked from Wishlist
| Field | Details |
|:---|:---|
| **Test ID** | TC-AUTH-04 |
| **Description** | Guest navigating to `/wishlist` is redirected to login |
| **Pre-condition** | Not logged in |
| **Steps** | 1. Navigate to `http://localhost:5173/wishlist` |
| **Expected Result** | Redirected to `/login?redirect=%2Fwishlist` |
| **Pass Criteria** | ✅ Redirect with destination preserved |

### TC-AUTH-05: User Registration
| Field | Details |
|:---|:---|
| **Test ID** | TC-AUTH-05 |
| **Description** | New user can create an account |
| **Pre-condition** | Not logged in |
| **Steps** | 1. Go to `/register` → 2. Name: `Test User`, Email: `test@example.com`, Password: `Test@1234` → 3. Click **Register** |
| **Expected Result** | Account created, redirected to `/skin-quiz` for onboarding |
| **Pass Criteria** | ✅ Registration and redirect succeed |

### TC-AUTH-06: Customer Login → Profile
| Field | Details |
|:---|:---|
| **Test ID** | TC-AUTH-06 |
| **Description** | Customer logs in and lands on profile |
| **Pre-condition** | Not logged in |
| **Steps** | 1. Go to `/login` → 2. `demo@auraglow.com` / `Customer@123` → 3. Click **LOG IN** |
| **Expected Result** | Lands on `/profile` showing "Demo Customer" |
| **Pass Criteria** | ✅ Customer lands on `/profile` |

### TC-AUTH-07: Admin Login → Admin Dashboard
| Field | Details |
|:---|:---|
| **Test ID** | TC-AUTH-07 |
| **Description** | Admin login redirects directly to admin dashboard |
| **Pre-condition** | Not logged in |
| **Steps** | 1. Go to `/login` → 2. `admin@auraglow.com` / `Admin@AuraGlow2026` → 3. Click **LOG IN** |
| **Expected Result** | Redirects to `/admin` (Executive Dashboard) |
| **Pass Criteria** | ✅ Admin lands on `/admin` |

### TC-AUTH-08: Invalid Login Credentials
| Field | Details |
|:---|:---|
| **Test ID** | TC-AUTH-08 |
| **Description** | Wrong password shows error |
| **Pre-condition** | Not logged in |
| **Steps** | 1. `/login` → 2. `demo@auraglow.com` / `wrongpass` → 3. Click **LOG IN** |
| **Expected Result** | Error: *"Invalid email or password."* — no navigation |
| **Pass Criteria** | ✅ Error shown, no redirect |

### TC-AUTH-09: Profile Page Shows Account Details
| Field | Details |
|:---|:---|
| **Test ID** | TC-AUTH-09 |
| **Description** | Profile shows user name, email, skin profile |
| **Pre-condition** | Logged in as customer |
| **Steps** | 1. Navigate to `/profile` |
| **Expected Result** | Shows name, email, member since date, skin profile card |
| **Pass Criteria** | ✅ All user data displayed |

### TC-AUTH-10: Logout Clears Session
| Field | Details |
|:---|:---|
| **Test ID** | TC-AUTH-10 |
| **Description** | Logout redirects to login and blocks protected routes |
| **Pre-condition** | Logged in |
| **Steps** | 1. `/profile` → 2. Click **Log Out** |
| **Expected Result** | Session cleared, redirected to `/login` |
| **Pass Criteria** | ✅ Protected routes blocked after logout |

### TC-AUTH-11: Post-Login Redirect Preserved
| Field | Details |
|:---|:---|
| **Test ID** | TC-AUTH-11 |
| **Description** | Login takes user to their originally intended destination |
| **Pre-condition** | Not logged in |
| **Steps** | 1. Navigate to `/skin-quiz` (redirected to login) → 2. Login as customer |
| **Expected Result** | Lands on `/skin-quiz` after login |
| **Pass Criteria** | ✅ Destination preserved |

---

## ✅ MODULE 2 — Product Catalog *(Keshara)*

### TC-PROD-01: View All Products (Guest Allowed)
| Field | Details |
|:---|:---|
| **Test ID** | TC-PROD-01 |
| **Steps** | 1. Navigate to `http://localhost:5173/products` |
| **Expected Result** | Product grid with names, images, prices (LKR), ratings, skin type tags |
| **Pass Criteria** | ✅ Products visible to guest |

### TC-PROD-02: Filter by Category
| Field | Details |
|:---|:---|
| **Test ID** | TC-PROD-02 |
| **Steps** | 1. Click **Skincare** in navbar |
| **Expected Result** | Only skincare products shown; URL: `/products?category=skincare` |
| **Pass Criteria** | ✅ Category filter correct |

### TC-PROD-03: Search Products
| Field | Details |
|:---|:---|
| **Test ID** | TC-PROD-03 |
| **Steps** | 1. Type `serum` in search box |
| **Expected Result** | Only products matching "serum" shown |
| **Pass Criteria** | ✅ Search filter works |

### TC-PROD-04: Product Detail Page
| Field | Details |
|:---|:---|
| **Test ID** | TC-PROD-04 |
| **Steps** | 1. Click any product card |
| **Expected Result** | Name, Price, Rating, Description, Ingredients, "Add to Bag" button visible |
| **Pass Criteria** | ✅ Full detail page renders |

### TC-PROD-05: Add to Cart — Guest Sees Auth Modal
| Field | Details |
|:---|:---|
| **Test ID** | TC-PROD-05 |
| **Pre-condition** | Not logged in |
| **Steps** | 1. `/products` → 2. Click **Add to Bag** |
| **Expected Result** | **AuthRequiredModal**: *"Sign in to add products to your shopping bag"* |
| **Pass Criteria** | ✅ Modal shown, product not added |

### TC-PROD-06: Sort Products
| Field | Details |
|:---|:---|
| **Test ID** | TC-PROD-06 |
| **Steps** | 1. Select **Price: Low to High** sort |
| **Expected Result** | Products ordered cheapest first |
| **Pass Criteria** | ✅ Sort works |

### TC-PROD-07: Price Range Filter
| Field | Details |
|:---|:---|
| **Test ID** | TC-PROD-07 |
| **Steps** | 1. Adjust price slider to max 5000 LKR |
| **Expected Result** | Only products ≤ 5000 LKR shown |
| **Pass Criteria** | ✅ Price filter applied |

### TC-PROD-08: Currency Conversion
| Field | Details |
|:---|:---|
| **Test ID** | TC-PROD-08 |
| **Steps** | 1. Navbar currency selector → Select **USD** |
| **Expected Result** | All prices convert to USD |
| **Pass Criteria** | ✅ Prices update globally |

---

## ✅ MODULE 3 — Shopping Cart & Wishlist *(Achani)*

### TC-CART-01: Add Product to Cart
| Field | Details |
|:---|:---|
| **Test ID** | TC-CART-01 |
| **Pre-condition** | Logged in |
| **Steps** | 1. `/products` → 2. Click **Add to Bag** |
| **Expected Result** | Cart badge increments. Toast: *"Added to your shopping bag!"* |
| **Pass Criteria** | ✅ Badge and toast work |

### TC-CART-02: View Cart Page
| Field | Details |
|:---|:---|
| **Test ID** | TC-CART-02 |
| **Steps** | 1. Click cart icon → `/cart` |
| **Expected Result** | Items listed with name, image, qty controls, price, total |
| **Pass Criteria** | ✅ Cart page renders correctly |

### TC-CART-03: Update Quantity
| Field | Details |
|:---|:---|
| **Test ID** | TC-CART-03 |
| **Steps** | 1. `/cart` → 2. Click **+** button |
| **Expected Result** | Qty increases by 1, total updates |
| **Pass Criteria** | ✅ Qty and total update |

### TC-CART-04: Remove Item
| Field | Details |
|:---|:---|
| **Test ID** | TC-CART-04 |
| **Steps** | 1. `/cart` → 2. Click **🗑️ Remove** |
| **Expected Result** | Product removed, total recalculated |
| **Pass Criteria** | ✅ Item removed correctly |

### TC-CART-05: Empty Cart State
| Field | Details |
|:---|:---|
| **Test ID** | TC-CART-05 |
| **Steps** | 1. Open `/cart` with 0 items |
| **Expected Result** | *"Your bag is empty"* message with shop CTA |
| **Pass Criteria** | ✅ Empty state shown |

### TC-CART-06: Add to Wishlist
| Field | Details |
|:---|:---|
| **Test ID** | TC-CART-06 |
| **Pre-condition** | Logged in |
| **Steps** | 1. Product detail → 2. Click **🤍 Wishlist** |
| **Expected Result** | Heart icon fills, toast shown |
| **Pass Criteria** | ✅ Wishlist item added |

### TC-CART-07: View Wishlist
| Field | Details |
|:---|:---|
| **Test ID** | TC-CART-07 |
| **Pre-condition** | Logged in, 1+ wishlist items |
| **Steps** | 1. Navigate to `/wishlist` |
| **Expected Result** | Products shown with Add to Cart option |
| **Pass Criteria** | ✅ Wishlist renders |

### TC-CART-08: Wishlist Blocked for Guests
| Field | Details |
|:---|:---|
| **Test ID** | TC-CART-08 |
| **Pre-condition** | Not logged in |
| **Steps** | 1. Navigate to `/wishlist` |
| **Expected Result** | Redirected to `/login?redirect=%2Fwishlist` |
| **Pass Criteria** | ✅ Redirect occurs |

---

## ✅ MODULE 4 — Reviews, Ratings & AI Recommendations *(Maduni)*

### TC-REC-01: Recommendations Page Loads
| Field | Details |
|:---|:---|
| **Test ID** | TC-REC-01 |
| **Steps** | 1. Navigate to `/recommendations` |
| **Expected Result** | Skin type buttons, AI routine widget, and product cards visible |
| **Pass Criteria** | ✅ Page renders |

### TC-REC-02: Filter by Skin Type
| Field | Details |
|:---|:---|
| **Test ID** | TC-REC-02 |
| **Steps** | 1. Click **Oily Skin** button |
| **Expected Result** | Recommendations update for oily skin |
| **Pass Criteria** | ✅ Products filtered |

### TC-REC-03: AI Routine Widget (AM/PM)
| Field | Details |
|:---|:---|
| **Test ID** | TC-REC-03 |
| **Pre-condition** | Logged in |
| **Steps** | 1. Visit `/recommendations` |
| **Expected Result** | AM and PM routine steps shown with products |
| **Pass Criteria** | ✅ Routine widget renders |

### TC-REC-04: AI Chat — Guest Blocked
| Field | Details |
|:---|:---|
| **Test ID** | TC-REC-04 |
| **Pre-condition** | Not logged in |
| **Steps** | 1. `/recommendations` → 2. Type question → 3. Click Ask |
| **Expected Result** | AuthRequiredModal: *"Sign in to consult with our Senior AI Dermatologist"* |
| **Pass Criteria** | ✅ Guest blocked from AI chat |

### TC-REC-05: AI Chat — Live Gemini Response
| Field | Details |
|:---|:---|
| **Test ID** | TC-REC-05 |
| **Pre-condition** | Logged in, Gemini API key configured |
| **Steps** | 1. `/recommendations` → 2. Ask: *"Best ingredients for dry skin?"* |
| **Expected Result** | Live AI response with model badge **Google Gemini Flash Lite (Live)** |
| **Pass Criteria** | ✅ Real AI response received |

### TC-REC-06: Product Reviews
| Field | Details |
|:---|:---|
| **Test ID** | TC-REC-06 |
| **Steps** | 1. Open any product → 2. Scroll to reviews |
| **Expected Result** | Star ratings, reviewer names, review text visible |
| **Pass Criteria** | ✅ Reviews render |

---

## ✅ MODULE 5 — Checkout, Payment & Order Tracking *(Kaveesha)*

### TC-CHK-01: Guest Blocked from Checkout
| Field | Details |
|:---|:---|
| **Test ID** | TC-CHK-01 |
| **Pre-condition** | Not logged in |
| **Steps** | 1. Navigate to `/checkout` |
| **Expected Result** | Redirected to `/login?redirect=%2Fcheckout` |
| **Pass Criteria** | ✅ Guest blocked |

### TC-CHK-02: Cart "Proceed to Checkout" Auth Guard
| Field | Details |
|:---|:---|
| **Test ID** | TC-CHK-02 |
| **Pre-condition** | Not logged in |
| **Steps** | 1. `/cart` → 2. Click **Proceed to Checkout** |
| **Expected Result** | Redirected to login |
| **Pass Criteria** | ✅ Auth guard fires |

### TC-CHK-03: Checkout Form
| Field | Details |
|:---|:---|
| **Test ID** | TC-CHK-03 |
| **Pre-condition** | Logged in, 1+ items in cart |
| **Steps** | 1. `/cart` → 2. **Proceed to Checkout** |
| **Expected Result** | Delivery address form, order summary, payment section |
| **Pass Criteria** | ✅ Full checkout page renders |

### TC-CHK-04: Stripe Test Payment
| Field | Details |
|:---|:---|
| **Test ID** | TC-CHK-04 |
| **Steps** | 1. Fill delivery address → 2. Card: `4242 4242 4242 4242`, Exp: `12/29`, CVC: `123` → 3. **Place Order** |
| **Expected Result** | Payment succeeds → redirected to `/orders/confirm` |
| **Pass Criteria** | ✅ Stripe sandbox payment works |

### TC-CHK-05: Order Confirmation Page
| Field | Details |
|:---|:---|
| **Test ID** | TC-CHK-05 |
| **Steps** | 1. Complete checkout |
| **Expected Result** | Order ID, items, total paid, estimated delivery, Track Order CTA |
| **Pass Criteria** | ✅ Confirmation page renders |

### TC-CHK-06: Order Tracking
| Field | Details |
|:---|:---|
| **Test ID** | TC-CHK-06 |
| **Steps** | 1. Click **Track Order** or navigate to `/orders/:id` |
| **Expected Result** | Status timeline: Placed → Processing → Shipped → Out for Delivery → Delivered |
| **Pass Criteria** | ✅ Tracking timeline renders |

---

## ✅ MODULE 6 — Admin Dashboard *(Tharushi)*

### TC-ADM-01: Guest Blocked from Admin
| Field | Details |
|:---|:---|
| **Test ID** | TC-ADM-01 |
| **Pre-condition** | Not logged in |
| **Steps** | 1. Navigate to `/admin` |
| **Expected Result** | Redirected to `/login?redirect=%2Fadmin` |
| **Pass Criteria** | ✅ Admin blocked for guests |

### TC-ADM-02: Customer Blocked from Admin
| Field | Details |
|:---|:---|
| **Test ID** | TC-ADM-02 |
| **Pre-condition** | Logged in as customer |
| **Steps** | 1. Navigate to `/admin` |
| **Expected Result** | Redirected to `/` (homepage) |
| **Pass Criteria** | ✅ Non-admin blocked |

### TC-ADM-03: Dashboard KPIs
| Field | Details |
|:---|:---|
| **Test ID** | TC-ADM-03 |
| **Pre-condition** | Logged in as admin |
| **Steps** | 1. Login as admin → auto-redirected to `/admin` |
| **Expected Result** | KPI tiles: Revenue, Orders, Customers, Conversion Rate. Sales chart visible. |
| **Pass Criteria** | ✅ Dashboard renders completely |

### TC-ADM-04: View Products (READ)
| Field | Details |
|:---|:---|
| **Test ID** | TC-ADM-04 |
| **Steps** | 1. Admin sidebar → **Products** |
| **Expected Result** | Table: name, category, price, stock, status badges (Active/Low Stock/Out of Stock) |
| **Pass Criteria** | ✅ Product table renders |

### TC-ADM-05: Create Product (CREATE)
| Field | Details |
|:---|:---|
| **Test ID** | TC-ADM-05 |
| **Steps** | 1. **+ Add Product** → 2. Name: `Test Serum`, Category: `Skincare`, Price: `3500`, Stock: `50` → 3. **Create** |
| **Expected Result** | New product appears immediately (optimistic UI) |
| **Pass Criteria** | ✅ Product created |

### TC-ADM-06: Edit Product (UPDATE)
| Field | Details |
|:---|:---|
| **Test ID** | TC-ADM-06 |
| **Steps** | 1. Click **✏️ Edit** → 2. Change price to `4000` → 3. **Update** |
| **Expected Result** | Price updates in list in real-time |
| **Pass Criteria** | ✅ Update reflects immediately |

### TC-ADM-07: Delete Product (DELETE)
| Field | Details |
|:---|:---|
| **Test ID** | TC-ADM-07 |
| **Steps** | 1. Click **🗑️ Delete** → 2. Confirm |
| **Expected Result** | Product removed from list |
| **Pass Criteria** | ✅ Product deleted |

### TC-ADM-08: Search Products
| Field | Details |
|:---|:---|
| **Test ID** | TC-ADM-08 |
| **Steps** | 1. Type `serum` in admin search box |
| **Expected Result** | Only matching products shown |
| **Pass Criteria** | ✅ Live search works |

### TC-ADM-09: View Orders
| Field | Details |
|:---|:---|
| **Test ID** | TC-ADM-09 |
| **Steps** | 1. Admin sidebar → **Orders** |
| **Expected Result** | Order table: ID, Customer, Items, Total, Status badge |
| **Pass Criteria** | ✅ Orders table renders |

### TC-ADM-10: Update Order Status
| Field | Details |
|:---|:---|
| **Test ID** | TC-ADM-10 |
| **Steps** | 1. Select order → 2. Change **Pending** → **Processing** → 3. **Update Status** |
| **Expected Result** | Badge updates to **Processing** instantly |
| **Pass Criteria** | ✅ Status update works |

### TC-ADM-11: Admin Portal Hidden from Guests/Customers
| Field | Details |
|:---|:---|
| **Test ID** | TC-ADM-11 |
| **Pre-condition** | Guest or regular customer |
| **Steps** | 1. Check navbar and scroll to footer |
| **Expected Result** | No "Admin Portal" or "👑 Admin" link visible |
| **Pass Criteria** | ✅ Admin links hidden |

### TC-ADM-12: Admin Badge in Navbar
| Field | Details |
|:---|:---|
| **Test ID** | TC-ADM-12 |
| **Pre-condition** | Logged in as admin |
| **Steps** | 1. Check navbar after admin login |
| **Expected Result** | Purple **"👑 Admin"** pill visible in navbar |
| **Pass Criteria** | ✅ Admin badge shown |

---

## ✅ MODULE 7 — Skin Quiz & Personalization

### TC-QUIZ-01: Guest Blocked from Quiz
| Field | Details |
|:---|:---|
| **Test ID** | TC-QUIZ-01 |
| **Pre-condition** | Not logged in |
| **Steps** | 1. Click **✨ Skin Quiz** in navbar |
| **Expected Result** | Redirected to `/login?redirect=/skin-quiz` |
| **Pass Criteria** | ✅ Guest blocked |

### TC-QUIZ-02: Complete 4-Step Skin Quiz
| Field | Details |
|:---|:---|
| **Test ID** | TC-QUIZ-02 |
| **Pre-condition** | Logged in |
| **Steps** | 1. `/skin-quiz` → 2. Select **Dry** → 3. Next → 4. Select **Dehydration, Dullness** → 5. Next → 6. Select **Fragrance** allergen → 7. Next → 8. Tone: **Medium**, Undertone: **Warm** → 9. **Reveal My Routine** |
| **Expected Result** | Redirected to `/recommendations?quiz=success` with banner *"🎉 Skin Quiz Completed!"* |
| **Pass Criteria** | ✅ Quiz submits and personalizes |

### TC-QUIZ-03: Skin Profile Saved
| Field | Details |
|:---|:---|
| **Test ID** | TC-QUIZ-03 |
| **Steps** | 1. Complete quiz → 2. Check DevTools → localStorage → `auraglow_skin_profile` |
| **Expected Result** | JSON: `{skin_type, concerns, allergens, skin_tone, undertone}` |
| **Pass Criteria** | ✅ Profile persisted |

### TC-QUIZ-04: Recommendations Auto-Set from Quiz
| Field | Details |
|:---|:---|
| **Test ID** | TC-QUIZ-04 |
| **Steps** | 1. Complete quiz with **Dry** skin type → 2. View `/recommendations` |
| **Expected Result** | Skin type pre-selected as **Dry**, products match |
| **Pass Criteria** | ✅ Auto-personalization works |

---

## ✅ MODULE 8 — Notification System & Email

### TC-EMAIL-01: Welcome Email on Registration
| Field | Details |
|:---|:---|
| **Test ID** | TC-EMAIL-01 |
| **Pre-condition** | Gmail SMTP configured in `backend/.env` |
| **Steps** | 1. Register a new user with a real email |
| **Expected Result** | Welcome email received with AuraGlow branding |
| **Pass Criteria** | ✅ Email delivered |

### TC-EMAIL-02: Skin Quiz Confirmation Email
| Field | Details |
|:---|:---|
| **Test ID** | TC-EMAIL-02 |
| **Steps** | 1. Complete skin quiz with a real email account |
| **Expected Result** | Email with skin profile summary and routine steps |
| **Pass Criteria** | ✅ Quiz email delivered |

---

## ✅ MODULE 9 — Customer Support

### TC-SUP-01: Support Page
| Field | Details |
|:---|:---|
| **Test ID** | TC-SUP-01 |
| **Steps** | 1. Navigate to `/support` |
| **Expected Result** | FAQ accordion and contact form displayed |
| **Pass Criteria** | ✅ Page renders |

### TC-SUP-02: Submit Support Ticket
| Field | Details |
|:---|:---|
| **Test ID** | TC-SUP-02 |
| **Steps** | 1. Fill name, email, subject, message → 2. Click **Send Message** |
| **Expected Result** | Success toast: *"Your message has been sent!"* |
| **Pass Criteria** | ✅ Form submits |

---

## ✅ MODULE 10 — Security & Access Control

### TC-SEC-01: JWT Token Required for Protected APIs
| Field | Details |
|:---|:---|
| **Test ID** | TC-SEC-01 |
| **Steps** | 1. Call `GET http://localhost:5000/api/v1/auth/me` with no Authorization header |
| **Expected Result** | `401 Unauthorized: "Authorization token missing or malformed."` |
| **Pass Criteria** | ✅ API protected |

### TC-SEC-02: Admin Role Enforced on API
| Field | Details |
|:---|:---|
| **Test ID** | TC-SEC-02 |
| **Steps** | 1. Login as customer → 2. Use token to call `POST /api/v1/admin/products` |
| **Expected Result** | `403 Forbidden: "Administrator access required."` |
| **Pass Criteria** | ✅ Role-based access enforced |

### TC-SEC-03: Passwords Hashed (bcrypt)
| Field | Details |
|:---|:---|
| **Test ID** | TC-SEC-03 |
| **Steps** | 1. Inspect Supabase `users` table `password_hash` column |
| **Expected Result** | All hashes start with `$2a$10$` (bcrypt format) |
| **Pass Criteria** | ✅ No plaintext passwords |

### TC-SEC-04: Admin UI Hidden from Non-Admins
| Field | Details |
|:---|:---|
| **Test ID** | TC-SEC-04 |
| **Pre-condition** | Guest or customer |
| **Steps** | 1. Check navbar and footer |
| **Expected Result** | No "Admin Portal" or "👑 Admin" anywhere in UI |
| **Pass Criteria** | ✅ Admin hidden from non-admins |

---

## ✅ MODULE 11 — Database & Backend API

### TC-DB-01: API Health Check
| Field | Details |
|:---|:---|
| **Test ID** | TC-DB-01 |
| **Steps** | 1. Navigate to `http://localhost:5000` |
| **Expected Result** | `{"message":"AuraGlow API is running 🌸","version":"1.0.0"}` |
| **Pass Criteria** | ✅ API running |

### TC-DB-02: Supabase Connection
| Field | Details |
|:---|:---|
| **Test ID** | TC-DB-02 |
| **Steps** | 1. Login with valid credentials |
| **Expected Result** | User returned from Supabase DB, no errors in logs |
| **Pass Criteria** | ✅ DB connected |

### TC-DB-03: AI Routine Endpoint
| Field | Details |
|:---|:---|
| **Test ID** | TC-DB-03 |
| **Steps** | 1. `POST http://localhost:5000/api/v1/ai/routine` body: `{"skinType":"Dry","concerns":["Dehydration"]}` |
| **Expected Result** | `{success:true, isRealAI:true, routine:{title, amRoutine, pmRoutine}}` |
| **Pass Criteria** | ✅ AI endpoint returns structured JSON |

### TC-DB-04: AI Consultation Endpoint
| Field | Details |
|:---|:---|
| **Test ID** | TC-DB-04 |
| **Steps** | 1. `POST http://localhost:5000/api/v1/ai/consult` body: `{"question":"Best moisturizer for dry skin?"}` |
| **Expected Result** | `{success:true, isRealAI:true, model:"Google Gemini Flash Lite (Live)", reply:"..."}` |
| **Pass Criteria** | ✅ Live AI response |

---

## ✅ MODULE 12 — UX & Non-Functional

### TC-UX-01: Mobile Responsiveness
| Field | Details |
|:---|:---|
| **Test ID** | TC-UX-01 |
| **Steps** | 1. DevTools → Mobile 375px → Browse homepage |
| **Expected Result** | Single-column layout, no overflow |
| **Pass Criteria** | ✅ Mobile usable |

### TC-UX-02: Loading States
| Field | Details |
|:---|:---|
| **Test ID** | TC-UX-02 |
| **Steps** | 1. DevTools → Slow 3G → Load `/products` |
| **Expected Result** | Loading spinner visible while fetching |
| **Pass Criteria** | ✅ Loading state shown |

### TC-UX-03: Toast Notifications
| Field | Details |
|:---|:---|
| **Test ID** | TC-UX-03 |
| **Steps** | 1. Logged in → Click **Add to Bag** |
| **Expected Result** | Toast: *"🌸 Added to your shopping bag!"* auto-dismisses in 3s |
| **Pass Criteria** | ✅ Toast works |

### TC-UX-04: 404 Page
| Field | Details |
|:---|:---|
| **Test ID** | TC-UX-04 |
| **Steps** | 1. Navigate to `http://localhost:5173/xyz` |
| **Expected Result** | AuraGlow-branded 404 page with Go Home CTA |
| **Pass Criteria** | ✅ 404 renders |

---

## 📊 Test Summary

| Module | Tests | Priority |
|:---|:---:|:---|
| Auth & Profile (Dinu) | 11 (TC-AUTH-01 to 11) | 🔴 Critical |
| Product Catalog (Keshara) | 8 (TC-PROD-01 to 08) | 🔴 Critical |
| Cart & Wishlist (Achani) | 8 (TC-CART-01 to 08) | 🔴 Critical |
| Reviews & AI Recs (Maduni) | 6 (TC-REC-01 to 06) | 🔴 Critical |
| Checkout & Orders (Kaveesha) | 6 (TC-CHK-01 to 06) | 🔴 Critical |
| Admin Dashboard (Tharushi) | 12 (TC-ADM-01 to 12) | 🔴 Critical |
| Skin Quiz & Personalization | 4 (TC-QUIZ-01 to 04) | 🟡 High |
| Notification / Email | 2 (TC-EMAIL-01 to 02) | 🟡 High |
| Customer Support | 2 (TC-SUP-01 to 02) | 🟡 High |
| Security | 4 (TC-SEC-01 to 04) | 🔴 Critical |
| Database & API | 4 (TC-DB-01 to 04) | 🔴 Critical |
| UX & Non-Functional | 4 (TC-UX-01 to 04) | 🟢 Medium |
| **TOTAL** | **71 Test Cases** | |

---

## 📋 Lecturer Requirements Compliance Checklist

| Academic Requirement | AuraGlow Implementation | ✅ |
|:---|:---|:---:|
| Web-based E-Commerce Platform | React.js + Node.js/Express | ✅ |
| Database Integration (SQL) | Supabase — PostgreSQL | ✅ |
| **User Authentication** module | JWT + bcrypt + ProtectedRoute | ✅ |
| **Shopping Cart** module | CartContext + Supabase sync | ✅ |
| **Payment Module** | Stripe Sandbox API | ✅ |
| **Product Management** module | Admin CRUD (Create/Read/Update/Delete) | ✅ |
| **Order Management** module | Admin order status updates | ✅ |
| **Recommendation System** module | Google Gemini AI + Clinical Rule Engine | ✅ |
| **Delivery Tracking** module | Order tracking with animated timeline | ✅ |
| **Admin Dashboard** module | Executive KPIs + Charts + Live Feed | ✅ |
| **Review & Rating System** | Product star ratings + customer reviews | ✅ |
| **Notification System** | Gmail SMTP (Nodemailer) — Welcome + Quiz emails | ✅ |
| Innovative Feature | Google Gemini Dermatologist AI Advisor | ✅ |
| Frontend Technology | React 18, Vite, Vanilla CSS | ✅ |
| Backend Technology | Node.js, Express.js, REST API | ✅ |
| Database Technology | Supabase (PostgreSQL) | ✅ |
| External APIs | Stripe, Google Gemini, Gmail SMTP | ✅ |
| Role-Based Access Control | Admin / Customer / Guest | ✅ |
| Group members (6 modules) | Dinu, Keshara, Achani, Maduni, Kaveesha, Tharushi | ✅ |

---

> **To Run:** Backend → `cd backend && npm start` | Frontend → `cd frontend && npm run dev`  
> Backend: `http://localhost:5000` | Frontend: `http://localhost:5173`
