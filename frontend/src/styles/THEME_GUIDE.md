# 🎨 AuraGlow Theme Guide
## **MANDATORY READING for ALL Team Members**

> ⚠️ **This guide is the law of the UI.** Every frontend component you write MUST follow these rules. Violations will break the visual consistency of the app and require rework.

---

## 📁 Style Files Location

```
frontend/src/styles/
├── variables.css    ← 🔑 ALL design tokens (colors, fonts, spacing, shadows)
├── globals.css      ← Base resets, layout helpers, utility classes
├── components.css   ← Pre-built component classes (buttons, cards, inputs, etc.)
└── THEME_GUIDE.md   ← This file (documentation)
```

---

## 🚀 How to Use in Your Module

**Step 1**: In your module's main CSS file, import the design system:
```css
/* At the TOP of your module's CSS file */
@import '../styles/globals.css';   /* Includes variables.css automatically */
@import '../styles/components.css';
```

**Step 2**: Use the pre-built classes in your JSX.
```jsx
// ✅ CORRECT — use shared classes
<button className="btn btn-primary btn-lg">Add to Cart</button>
<div className="card product-card"> ... </div>
<input className="form-input" placeholder="Search products..." />
```

**Step 3**: For your module-specific styles, create a `.module.css` file and **only use CSS variables** — never hardcode values.
```css
/* ✅ CORRECT */
.myComponent {
  background: var(--color-bg-card);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  color: var(--color-text-primary);
  transition: transform var(--transition-base);
}

/* ❌ WRONG — never do this */
.myComponent {
  background: #1e1e1e;      /* hardcoded color */
  border-radius: 12px;       /* hardcoded radius */
  padding: 24px;             /* hardcoded spacing */
  color: white;              /* hardcoded color */
  font-family: 'Arial';      /* wrong font */
}
```

---

## 🎨 Color System

### Backgrounds (Dark Theme)
| Variable | Value | Use For |
|----------|-------|---------|
| `--color-bg-primary` | `#0d0d0f` | Page root background |
| `--color-bg-secondary` | `#121218` | Section backgrounds |
| `--color-bg-card` | `rgba(255,255,255,0.04)` | All glass cards |
| `--color-bg-input` | `rgba(255,255,255,0.06)` | Input fields |

### Brand Gradients
| Variable | Use For |
|----------|---------|
| `--gradient-brand` | Decorative elements |
| `--gradient-brand-vibrant` | Primary buttons |
| `--gradient-text` | Gradient text headings |
| `--gradient-hero` | Hero section background |

### Accent Colors
| Variable | Value | Use For |
|----------|-------|---------|
| `--color-accent-rose` | `#e8b4a0` | Primary accent, links |
| `--color-accent-peach` | `#f5c6aa` | Hover states |
| `--color-accent-lavender` | `#b8a9d9` | Secondary accents |
| `--color-accent-mauve` | `#d4a8c7` | Decorative accents |
| `--color-accent-gold` | `#d4af82` | Star ratings, gold highlights |

### Text Colors
| Variable | Use For |
|----------|---------|
| `--color-text-primary` | Main headings & body text |
| `--color-text-secondary` | Subtext, descriptions |
| `--color-text-muted` | Placeholders, disabled text, labels |
| `--color-text-accent` | Highlighted/important text |
| `--color-text-on-accent` | Text on colored buttons |

### Status Colors
| Variable | Use For |
|----------|---------|
| `--color-success` | Success messages, delivered status |
| `--color-warning` | Low stock warnings |
| `--color-error` | Form errors, failed payments |
| `--color-info` | Informational messages |

---

## 📝 Typography Rules

### Fonts
- **Headings** (h1–h6, section titles): Use `font-family: var(--font-heading)` → **Outfit**
- **Body text** (paragraphs, labels, buttons): Use `font-family: var(--font-body)` → **Inter**
- ❌ **Never use any other font** (no Arial, Helvetica, system-ui, etc.)

### Font Size Scale
```
--text-xs:    12px  → Badges, captions, table headers
--text-sm:    14px  → Labels, secondary text, button text
--text-base:  16px  → Body text, input text
--text-md:    18px  → Lead text
--text-lg:    20px  → Card titles
--text-xl:    24px  → Section subtitles
--text-2xl:   32px  → h3/h4 headings
--text-3xl:   40px  → h2 headings
--text-4xl:   56px  → h1 hero headings
--text-hero:  fluid → Hero/banner headlines
```

### Gradient Text (for section headings)
```jsx
<h2 className="text-gradient">Recommended For You</h2>
```

---

## 🔘 Button Usage

The design system provides 4 button variants:

```jsx
// Primary — use for main CTAs (Add to Cart, Checkout, Submit)
<button className="btn btn-primary">Add to Cart</button>

// Secondary — use for secondary actions (Save, Cancel)
<button className="btn btn-secondary">Add to Wishlist</button>

// Ghost — use for subtle actions (View Details, Load More)
<button className="btn btn-ghost">View All</button>

// Danger — use for destructive actions (Remove, Delete)
<button className="btn btn-danger">Remove</button>
```

### Size Modifiers
```jsx
<button className="btn btn-primary btn-sm">Small</button>   {/* compact */}
<button className="btn btn-primary">Default</button>         {/* standard */}
<button className="btn btn-primary btn-lg">Large</button>    {/* prominent */}
<button className="btn btn-primary btn-xl">Hero CTA</button> {/* hero section */}
<button className="btn btn-primary btn-full">Full Width</button>
```

---

## 🃏 Card Usage

```jsx
// General content card
<div className="card"> ... </div>

// Product card (with hover animation built-in)
<div className="product-card">
  <div className="product-card__image-wrap">
    <img className="product-card__image" src={...} alt={...} />
  </div>
  <div className="product-card__body">
    <p className="product-card__brand">AuraGlow</p>
    <h3 className="product-card__name">Radiant Serum</h3>
    <span className="product-card__price">RM 78</span>
  </div>
</div>
```

---

## 📝 Form Usage

```jsx
<div className="form-group">
  <label className="form-label" htmlFor="email">Email Address</label>
  <input
    id="email"
    type="email"
    className={`form-input ${error ? 'error' : ''}`}
    placeholder="you@example.com"
  />
  {error && <span className="form-error">{error}</span>}
</div>
```

---

## 🏷️ Badge Usage

```jsx
{/* Pre-built badge classes */}
<span className="badge badge-vegan">🌱 Vegan</span>
<span className="badge badge-cruelty-free">🐰 Cruelty-Free</span>
<span className="badge badge-low-stock">⚠️ Low Stock</span>
<span className="badge badge-out-of-stock">Out of Stock</span>
```

---

## 💀 Loading States

```jsx
// Spinner (for API loading)
<div className="spinner" />
<div className="spinner spinner-lg" />

// Skeleton (for content loading)
<div className="skeleton" style={{ height: '200px', width: '100%' }} />
```

---

## 🪟 Glassmorphism Classes

```jsx
// Basic glass card
<div className="glass"> ... </div>

// Stronger blur
<div className="glass-strong"> ... </div>

// Glass with accent border
<div className="glass-accent"> ... </div>
```

---

## ⚡ Animation Classes

```jsx
// Fade in from below on mount
<div className="fade-in-up"> ... </div>

// With delays (for staggered lists)
<div className="fade-in-up fade-in-up-delay-1"> ... </div>
<div className="fade-in-up fade-in-up-delay-2"> ... </div>
<div className="fade-in-up fade-in-up-delay-3"> ... </div>
```

---

## 📐 Layout Utilities

```jsx
// Container
<div className="container"> ... </div>        {/* max 1280px */}
<div className="container-lg"> ... </div>     {/* max 1024px */}

// Sections
<section className="section"> ... </section>      {/* large vertical padding */}
<section className="section-sm"> ... </section>   {/* smaller padding */}

// Grid layouts
<div className="grid-2"> ... </div>   {/* 2 columns */}
<div className="grid-3"> ... </div>   {/* 3 columns */}
<div className="grid-4"> ... </div>   {/* 4 columns (becomes 2 on tablet, 1 on mobile) */}

// Flex
<div className="flex-center"> ... </div>    {/* center both axes */}
<div className="flex-between"> ... </div>  {/* space-between */}

// Page content (accounts for fixed navbar height)
<main className="page-content"> ... </main>
```

---

## 📋 Section Heading Pattern

Use this consistent pattern for all section headings:
```jsx
<div className="section-heading">
  <p className="section-heading__eyebrow">Personalized For You</p>
  <h2 className="section-heading__title text-gradient">Recommended Products</h2>
  <p className="section-heading__subtitle">
    Based on your skin profile, we've curated the best matches.
  </p>
</div>
```

---

## 🚫 Common Mistakes to AVOID

| ❌ Wrong | ✅ Right |
|----------|----------|
| `color: white` | `color: var(--color-text-primary)` |
| `background: #1e1e1e` | `background: var(--color-bg-secondary)` |
| `font-family: 'Roboto'` | `font-family: var(--font-body)` |
| `border-radius: 8px` | `border-radius: var(--radius-md)` |
| `padding: 16px` | `padding: var(--space-4)` |
| `transition: 0.3s` | `transition: all var(--transition-base)` |
| Custom button styles | `className="btn btn-primary"` |
| Custom card styles | `className="card"` or `"product-card"` |
| `font-size: 24px` | `font-size: var(--text-xl)` |

---

## 🎯 Module-Specific Component Classes

| Module | Pre-built Classes to Use |
|--------|--------------------------|
| **Admin (Tharushi)** | `.admin-stat-card`, `.admin-table`, `.admin-table th/td` |
| **Checkout (Kaveesha)** | `.order-tracker`, `.tracker-step`, `.tracker-connector` |
| **Catalog (Keshara)** | `.product-card`, `.skin-match-badge`, `.badge-vegan`, `.badge-cruelty-free` |
| **Cart/Wishlist (Achani)** | `.card`, `.btn`, `.badge-low-stock` |
| **Auth (Dinu)** | `.modal`, `.form-group`, `.form-input`, `.btn-primary btn-full` |
| **Reviews (Maduni)** | `.star-rating`, `.star`, `.card`, `.badge` |

---

## 📞 If You're Unsure

1. Check `variables.css` — there's a variable for everything.
2. Check `components.css` — there's likely a pre-built class for your UI element.
3. Ask Tharushi before creating a new style from scratch.

---

*AuraGlow Design System v1.0 — Maintained by Tharushi* 🌸
