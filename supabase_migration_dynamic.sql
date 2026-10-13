-- =============================================================================
--  AuraGlow — Full Dynamic Platform Migration
--  Run this in Supabase SQL Editor to enable all dynamic features
-- =============================================================================

-- 1. Add missing product columns if they don't exist
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS compare_at_price     DECIMAL(10,2) DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS how_to_use           TEXT          DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS ingredients          TEXT[]        DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS avg_rating           DECIMAL(3,2)  DEFAULT 4.5,
  ADD COLUMN IF NOT EXISTS review_count         INTEGER       DEFAULT 0;

-- 2. Add product_id to order_items if missing
ALTER TABLE order_items
  ADD COLUMN IF NOT EXISTS product_id UUID REFERENCES products(id) ON DELETE SET NULL;

-- 3. Create a view for top-selling products (used by trending section)
CREATE OR REPLACE VIEW top_selling_products AS
  SELECT
    p.id,
    p.name,
    p.brand,
    p.category,
    p.price,
    p.compare_at_price,
    p.images,
    p.is_vegan,
    p.is_cruelty_free,
    p.is_active,
    p.stock_quantity,
    p.avg_rating,
    p.review_count,
    COALESCE(SUM(oi.quantity), 0) AS total_units_sold
  FROM products p
  LEFT JOIN order_items oi ON oi.product_id = p.id
  WHERE p.is_active = TRUE
  GROUP BY p.id
  ORDER BY total_units_sold DESC, p.avg_rating DESC;

-- 4. Storage policies for product-images bucket
INSERT INTO storage.buckets (id, name, public)
  VALUES ('product-images', 'product-images', true)
  ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "Public can upload product images" ON storage.objects;
CREATE POLICY "Public can upload product images"
  ON storage.objects FOR INSERT TO public
  WITH CHECK (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Public can view product images" ON storage.objects;
CREATE POLICY "Public can view product images"
  ON storage.objects FOR SELECT TO public
  USING (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Public can update product images" ON storage.objects;
CREATE POLICY "Public can update product images"
  ON storage.objects FOR UPDATE TO public
  USING (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Public can delete product images" ON storage.objects;
CREATE POLICY "Public can delete product images"
  ON storage.objects FOR DELETE TO public
  USING (bucket_id = 'product-images');

-- 5. Function to refresh product ratings (call after review inserts)
CREATE OR REPLACE FUNCTION refresh_product_rating(pid UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE products
  SET
    avg_rating   = (SELECT COALESCE(AVG(rating), 4.5) FROM reviews WHERE product_id = pid),
    review_count = (SELECT COUNT(*) FROM reviews WHERE product_id = pid)
  WHERE id = pid;
END;
$$ LANGUAGE plpgsql;

-- 6. Trigger: auto-update rating when a review is inserted
CREATE OR REPLACE FUNCTION trg_refresh_rating()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM refresh_product_rating(NEW.product_id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS after_review_insert ON reviews;
CREATE TRIGGER after_review_insert
  AFTER INSERT OR UPDATE ON reviews
  FOR EACH ROW EXECUTE FUNCTION trg_refresh_rating();

-- 7. Grant anon/authenticated access to the view
GRANT SELECT ON top_selling_products TO anon, authenticated;

-- Done!
SELECT 'AuraGlow migration complete ✅' AS status;
