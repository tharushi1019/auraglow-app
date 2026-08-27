import axios from 'axios';

// Default free public key for ImgBB API or configured via Vite environment
const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY || '2d0b8b6e680a6b5fb4e81561f36e8db0';

/**
 * Upload an image file directly to ImgBB CDN
 * @param {File} file - The image file to upload
 * @param {Function} onProgress - Optional callback for upload percentage (0-100)
 * @returns {Promise<{ url: string, displayUrl: string, deleteUrl: string }>}
 */
export async function uploadImageToImgBB(file, onProgress) {
  if (!file) throw new Error('No file provided for upload.');

  // Validate file size (under 32MB as per ImgBB specs)
  if (file.size > 32 * 1024 * 1024) {
    throw new Error('Image size must be less than 32MB.');
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
      };
    } else {
      throw new Error(response.data?.error?.message || 'Failed to upload image to ImgBB.');
    }
  } catch (error) {
    console.error('ImgBB Upload Error:', error);
    // If external upload fails (e.g. offline/network), provide local fallback object URL for seamless testing
    if (!navigator.onLine || error.code === 'ERR_NETWORK') {
      const fallbackUrl = URL.createObjectURL(file);
      return {
        url: fallbackUrl,
        displayUrl: fallbackUrl,
        thumbUrl: fallbackUrl,
        isLocalFallback: true,
      };
    }
    throw new Error(error.response?.data?.error?.message || error.message || 'Image upload failed.');
  }
}
