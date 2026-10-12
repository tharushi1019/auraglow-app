import axios from 'axios';
import { supabase } from '@/lib/supabase';

// ImgBB API key configured via Vite environment
const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY;

/**
 * Upload an image file directly to Supabase Storage (product-images bucket)
 * with graceful fallback to ImgBB CDN.
 * 
 * @param {File} file - The image file to upload
 * @param {Function} onProgress - Optional callback for upload percentage (0-100)
 * @returns {Promise<{ url: string, displayUrl: string, thumbUrl: string, provider: string }>}
 */
export async function uploadImageToImgBB(file, onProgress) {
  if (!file) throw new Error('No file provided for upload.');

  // Validate file size (under 15MB)
  if (file.size > 15 * 1024 * 1024) {
    throw new Error('Image size must be less than 15MB.');
  }

  // ── Strategy 1: Supabase Storage (Native & Permanent) ──────────────────────
  try {
    const fileExt = file.name ? file.name.split('.').pop().toLowerCase() : 'jpg';
    const cleanFileName = `prod-${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${fileExt}`;

    const { data: uploadData, error: uploadErr } = await supabase.storage
      .from('product-images')
      .upload(cleanFileName, file, {
        cacheControl: '3600',
        upsert: true,
        contentType: file.type || 'image/jpeg',
      });

    if (!uploadErr && uploadData) {
      const { data: urlData } = supabase.storage
        .from('product-images')
        .getPublicUrl(cleanFileName);

      if (urlData && urlData.publicUrl) {
        if (onProgress) onProgress(100);
        return {
          url: urlData.publicUrl,
          displayUrl: urlData.publicUrl,
          thumbUrl: urlData.publicUrl,
          provider: 'supabase',
        };
      }
    } else if (uploadErr) {
      console.warn('[Storage] Supabase direct upload notice:', uploadErr.message);
    }
  } catch (supabaseErr) {
    console.warn('[Storage] Supabase upload failed, checking ImgBB fallback:', supabaseErr.message);
  }

  // ── Strategy 2: ImgBB CDN Fallback ─────────────────────────────────────────
  if (!IMGBB_API_KEY || IMGBB_API_KEY === '2d0b8b6e680a6b5fb4e81561f36e8db0') {
    throw new Error(
      'To enable direct file upload: Run the 4 lines in supabase_storage_setup.sql in your Supabase SQL Editor (Recommended), or set a free key from api.imgbb.com in frontend/.env.'
    );
  }

  const formData = new FormData();
  formData.append('image', file);

  try {
    const response = await axios.post(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percent);
        }
      },
    });

    if (response.data && response.data.success) {
      return {
        url: response.data.data.url,
        displayUrl: response.data.data.display_url,
        thumbUrl: response.data.data.thumb?.url || response.data.data.url,
        deleteUrl: response.data.data.delete_url,
        provider: 'imgbb',
      };
    } else {
      throw new Error(response.data?.error?.message || 'Failed to upload image to ImgBB.');
    }
  } catch (error) {
    console.error('ImgBB Upload Error:', error);
    const apiError = error.response?.data?.error?.message;
    if (apiError && apiError.includes('Invalid API v1 key')) {
      throw new Error(
        'Invalid ImgBB API key. Run supabase_storage_setup.sql in Supabase SQL Editor, or get a free key from api.imgbb.com.'
      );
    }
    throw new Error(apiError || error.message || 'Image upload failed.');
  }
}
