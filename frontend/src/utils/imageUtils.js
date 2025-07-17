//Xử lí url cho hình ảnh

// Định nghĩa URL cơ sở của API
export const API_URL = 'http://localhost:5000';

/**
 * Gets a full image URL by adding the API base URL if necessary
 *
 * @param {string} imagePath - The image path from the backend (can be relative or absolute)
 * @param {string} fallbackImage - Optional fallback image to use if imagePath is empty
 * @returns {string} - The full image URL
 */
export const getImageUrl = (imagePath, fallbackImage = '/no-image.png') => {
  if (!imagePath) return fallbackImage;

  // If the image path already includes the full URL, return it as is
  if (imagePath.startsWith('http')) {
    return imagePath;
  }

  // Ensure there is exactly one slash between API_URL and imagePath
  if (imagePath.startsWith('/')) {
    return `${API_URL}${imagePath}`;
  } else {
    return `${API_URL}/${imagePath}`;
  }
};

/**
 * Processes an array of image paths, ensuring each has the full URL
 *
 * @param {Array<string>} images - Array of image paths
 * @returns {Array<string>} - Array of full image URLs
 */
export const processImageArray = (images) => {
  if (!images || !Array.isArray(images)) return [];
  return images.map((image) => getImageUrl(image));
};
