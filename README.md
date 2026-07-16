# 🌸 AuraGlow — Personalized Clean Beauty & Skincare E-Commerce Platform

> A premium, personalized Direct-to-Consumer (D2C) Clean Beauty & Skincare e-commerce web application built with React.js, Node.js/Express.js, and Supabase (PostgreSQL).

---

## 👥 Team Members & Modules

| # | Member | Module | Branch |
|---|--------|--------|--------|
| 01 | **Tharushi** | Admin Dashboard & Inventory | `feature/admin-dashboard` |
| 02 | **Dinu** | Authentication & Profile | `feature/auth-profile` |
| 03 | **Keshara** | Product Catalog & Search | `feature/product-catalog` |
| 04 | **Achani** | Shopping Cart & Wishlist | `feature/cart-wishlist` |
| 05 | **Maduni** | Review & Recommendation | `feature/review-recommendation` |
| 06 | **Kaveesha** | Checkout, Stripe & Alerts | `feature/checkout-stripe` |

---

## 🏗️ Project Structure

```
auraglow-app/
├── frontend/          # React.js + Vite SPA
│   ├── public/
│   └── src/
│       ├── components/   # Reusable UI components (by module)
│       ├── pages/        # Page-level components
│       ├── context/      # React Context providers
│       ├── hooks/        # Custom React hooks
│       ├── services/     # API call functions
│       ├── styles/       # ⭐ SHARED design system (DO NOT MODIFY)
│       └── utils/        # Helper functions
│
├── backend/           # Node.js + Express.js REST API
│   └── src/
│       ├── routes/       # API route definitions
│       ├── controllers/  # Business logic handlers
│       ├── middleware/   # Auth/validation middleware
│       ├── services/     # Database interaction layer
│       ├── config/       # App configuration
│       └── utils/        # Utility functions
│
├── database/          # SQL schema and seed files
│   ├── schema.sql
│   └── seed.sql
│
└── .github/
    └── workflows/     # CI/CD (future)
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+ ([Download](https://nodejs.org))
- Git ([Download](https://git-scm.com))
- A code editor (VS Code recommended)

### 1. Clone the Repository
```bash
git clone https://github.com/YOUR_ORG/auraglow-app.git
cd auraglow-app

# Switch to your feature branch
git checkout feature/YOUR-MODULE-NAME
```

### 2. Setup Frontend
```bash
cd frontend
npm install
cp .env.example .env    # Fill in your values
npm run dev             # Starts at http://localhost:5173
```

### 3. Setup Backend
```bash
cd backend
npm install
cp .env.example .env    # Fill in your values
npm run dev             # Starts at http://localhost:3001
```

---

## 🎨 IMPORTANT: Theme & Design System

> ⚠️ **ALL members MUST use the shared design system. Do NOT use custom colors, fonts, or styles that are not defined in `frontend/src/styles/`.**

Read the **[Theme Guide](frontend/src/styles/THEME_GUIDE.md)** before writing ANY frontend code.

The design system is pre-built in:
- `frontend/src/styles/variables.css` — All colors, spacing, typography tokens
- `frontend/src/styles/globals.css` — Base resets and shared utility classes
- `frontend/src/styles/components.css` — Pre-built component styles (buttons, cards, inputs)

---

## 🌿 Git Branching Strategy

```
main          ← Production-ready code (Protected — Tharushi only can merge)
  └── develop ← Integration branch (all members merge here)
        ├── feature/auth-profile          (Dinu)
        ├── feature/product-catalog       (Keshara)
        ├── feature/cart-wishlist         (Achani)
        ├── feature/review-recommendation (Maduni)
        ├── feature/checkout-stripe       (Kaveesha)
        └── feature/admin-dashboard       (Tharushi)
```

### Rules
1. **NEVER push directly to `main`** — it is branch-protected.
2. Always work on your own `feature/` branch.
3. When your module is ready, open a **Pull Request → `develop`**.
4. Only Tharushi merges `develop → main`.

---

## 🔐 Environment Variables

Never commit `.env` files. Copy the provided `.env.example` and fill in values shared by your team lead.

### Backend `.env` variables:
```
PORT=3001
SUPABASE_URL=
SUPABASE_SERVICE_KEY=
JWT_SECRET=
STRIPE_SECRET_KEY=
IMGBB_API_KEY=
EMAIL_HOST=
EMAIL_PORT=
EMAIL_USER=
EMAIL_PASS=
FRONTEND_URL=http://localhost:5173
```

### Frontend `.env` variables:
```
VITE_API_BASE_URL=http://localhost:3001/api/v1
VITE_STRIPE_PUBLISHABLE_KEY=
```

---

## 📋 Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React.js 18 + Vite 5 |
| Styling | Vanilla CSS / CSS Modules |
| Backend | Node.js 18+ + Express.js 4 |
| Database | Supabase (PostgreSQL) |
| Auth | JWT + Bcrypt.js |
| Payment | Stripe (Test Mode) |
| Images | ImgBB CDN API |
| Email | Nodemailer |
| Charts | Recharts / Chart.js |

---

*AuraGlow — Clean Beauty, Powered by Code. 🌸*
