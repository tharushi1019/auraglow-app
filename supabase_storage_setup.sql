-- =============================================================================
-- AuraGlow — Enable Product Images in Supabase Storage
-- Run this in your Supabase Dashboard -> SQL Editor (1-Click Setup)
-- =============================================================================

-- 1. Ensure the product-images bucket exists and is public
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 2. Allow anyone to view product images publicly
DROP POLICY IF EXISTS "Public can view product images" ON storage.objects;
CREATE POLICY "Public can view product images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'product-images');

-- 3. Allow uploads into the product-images bucket
DROP POLICY IF EXISTS "Public can upload product images" ON storage.objects;
CREATE POLICY "Public can upload product images"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'product-images');

-- 4. Allow updates/overwrites in the product-images bucket
DROP POLICY IF EXISTS "Public can update product images" ON storage.objects;
CREATE POLICY "Public can update product images"
ON storage.objects FOR UPDATE
TO public
USING (bucket_id = 'product-images');
