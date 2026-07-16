-- =============================================================================
-- AuraGlow — PostgreSQL Database Schema (Supabase)
-- Run this in your Supabase SQL Editor to create all tables.
-- All tables use UUID primary keys and enforce FK constraints.
-- Normalized to 3NF as per NFR-M4.
-- =============================================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================================================
-- TABLE: users
-- Stores all user accounts (customers and admins)
-- =============================================================================
CREATE TABLE IF NOT EXISTS users (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name           VARCHAR(255)  NOT NULL,
  email          VARCHAR(255)  NOT NULL UNIQUE,
  password_hash  VARCHAR(255)  NOT NULL,
  role           VARCHAR(20)   NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  avatar_url     TEXT,
  created_at     TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- TABLE: skin_profiles
-- Stores user's skin quiz results (1:1 with users)
-- =============================================================================
CREATE TABLE IF NOT EXISTS skin_profiles (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  skin_type   VARCHAR(50)  NOT NULL CHECK (skin_type IN ('dry', 'oily', 'combination', 'sensitive')),
  concerns    JSONB        NOT NULL DEFAULT '[]',   -- e.g. ["acne","anti-aging"]
  allergens   JSONB        NOT NULL DEFAULT '[]',   -- e.g. ["gluten-free","nut-free"]
  skin_tone   VARCHAR(50),                           -- e.g. "medium"
  undertone   VARCHAR(50),                           -- e.g. "warm"
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- TABLE: products
-- Full product catalogue with metadata
-- =============================================================================
CREATE TABLE IF NOT EXISTS products (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name                  VARCHAR(255)  NOT NULL,
  brand                 VARCHAR(255)  NOT NULL,
  category              VARCHAR(100)  NOT NULL CHECK (category IN ('skincare', 'makeup', 'tools', 'fragrance')),
  description           TEXT          NOT NULL,
  price                 NUMERIC(10,2) NOT NULL CHECK (price > 0),
  stock_quantity        INTEGER       NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
  images                JSONB         NOT NULL DEFAULT '[]',        -- array of ImgBB URLs
  skin_types_compatible JSONB         NOT NULL DEFAULT '[]',        -- e.g. ["dry","oily"]
  concerns_addressed    JSONB         NOT NULL DEFAULT '[]',        -- e.g. ["acne","dullness"]
  clean_beauty_tags     JSONB         NOT NULL DEFAULT '[]',        -- e.g. ["gluten-free","paraben-free"]
  shades                JSONB         NOT NULL DEFAULT '[]',        -- [{name, hex, stock}]
  is_vegan              BOOLEAN       NOT NULL DEFAULT FALSE,
  is_cruelty_free       BOOLEAN       NOT NULL DEFAULT FALSE,
  is_active             BOOLEAN       NOT NULL DEFAULT TRUE,        -- soft delete
  created_at            TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- Full-text search index
CREATE INDEX IF NOT EXISTS idx_products_fts ON products
  USING gin(to_tsvector('english', name || ' ' || brand || ' ' || description));

CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_stock ON products(stock_quantity);

-- =============================================================================
-- TABLE: wishlist_items
-- User wishlists (many users → many products)
-- =============================================================================
CREATE TABLE IF NOT EXISTS wishlist_items (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id  UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, product_id)   -- one entry per user-product pair
);

-- =============================================================================
-- TABLE: cart_items
-- Persistent shopping cart (stored in DB, not localStorage)
-- =============================================================================
CREATE TABLE IF NOT EXISTS cart_items (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        UUID    NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id     UUID    NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity       INTEGER NOT NULL DEFAULT 1 CHECK (quantity >= 1),
  selected_shade VARCHAR(100),   -- shade name, if applicable
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, product_id, selected_shade)
);

-- =============================================================================
-- TABLE: orders
-- Order header records
-- =============================================================================
CREATE TABLE IF NOT EXISTS orders (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID          NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  stripe_payment_id   VARCHAR(255),                -- Stripe PaymentIntent ID
  total_amount        NUMERIC(10,2) NOT NULL CHECK (total_amount > 0),
  shipping_cost       NUMERIC(10,2) NOT NULL DEFAULT 0,
  status              VARCHAR(50)   NOT NULL DEFAULT 'pending'
                        CHECK (status IN ('pending','paid','processing','packed','shipped','out_for_delivery','delivered','cancelled')),
  shipping_address    JSONB         NOT NULL,   -- {street, city, state, postal_code, country}
  billing_address     JSONB         NOT NULL,
  contact_email       VARCHAR(255)  NOT NULL,
  contact_phone       VARCHAR(50),
  estimated_delivery  DATE,
  notes               TEXT,
  created_at          TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);

-- =============================================================================
-- TABLE: order_items
-- Normalized order line items (many orders → many products)
-- =============================================================================
CREATE TABLE IF NOT EXISTS order_items (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id       UUID          NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id     UUID          NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  product_name   VARCHAR(255)  NOT NULL,    -- snapshot at time of purchase
  product_brand  VARCHAR(255)  NOT NULL,
  quantity       INTEGER       NOT NULL CHECK (quantity >= 1),
  unit_price     NUMERIC(10,2) NOT NULL CHECK (unit_price > 0),
  selected_shade VARCHAR(100),
  created_at     TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- TABLE: reviews
-- Customer product reviews (one review per user-product)
-- =============================================================================
CREATE TABLE IF NOT EXISTS reviews (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID    NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id  UUID    NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  order_id    UUID    REFERENCES orders(id) ON DELETE SET NULL, -- must have purchased
  rating      INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  title       VARCHAR(255),
  comment     TEXT    NOT NULL CHECK (char_length(comment) >= 10),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, product_id)   -- one review per user per product
);

CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON reviews(product_id);

-- =============================================================================
-- HELPER: updated_at auto-update trigger
-- =============================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at        BEFORE UPDATE ON users        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_skin_profiles_updated_at BEFORE UPDATE ON skin_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at     BEFORE UPDATE ON products     FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_cart_items_updated_at   BEFORE UPDATE ON cart_items   FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at       BEFORE UPDATE ON orders       FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reviews_updated_at      BEFORE UPDATE ON reviews      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================================================
-- SEED: Admin User (default admin account)
-- Password is: Admin@AuraGlow2026
-- Hash generated with bcrypt (10 rounds)
-- =============================================================================
-- ⚠️ Change this password immediately after setup!
INSERT INTO users (name, email, password_hash, role)
VALUES (
  'Tharushi Admin',
  'admin@auraglow.com',
  '$2a$10$placeholder_hash_change_this_immediately',
  'admin'
) ON CONFLICT (email) DO NOTHING;
