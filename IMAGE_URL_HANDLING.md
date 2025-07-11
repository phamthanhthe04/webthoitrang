# Image URL Handling - Documentation

## Overview

This document explains the changes made to centralize and standardize image URL handling across the application.

## Problem Solved

Previously, the application had inconsistent image URL handling, with hardcoded URLs like `http://localhost:5000${imagePath}` scattered throughout different components. This made deployment to different environments difficult and was error-prone.

## Solution Implemented

A centralized utility function in `src/utils/imageUtils.js` now handles all image URLs. This function:

1. Checks if the image path already includes the full URL
2. Adds the API URL prefix if necessary
3. Provides a fallback for missing images

## Implementation Details

### 1. Created new utility file: `src/utils/imageUtils.js`

```js
export const API_URL = 'http://localhost:5000';

export const getImageUrl = (imagePath, fallbackImage = '/no-image.png') => {
  if (!imagePath) return fallbackImage;

  if (imagePath.startsWith('http')) {
    return imagePath;
  }

  return `${API_URL}${imagePath}`;
};

export const processImageArray = (images) => {
  if (!images || !Array.isArray(images)) return [];
  return images.map((image) => getImageUrl(image));
};
```

### 2. Updated the following components to use the utility:

- ProductCard.js
- ProductDetailPage.js
- WishlistPage.js
- AdminProductManagement.js
- SearchModal.js
- CartPage.js
- PromotionPage.js

### Benefits

- **Consistency**: All image URLs are now handled the same way
- **Maintainability**: To change the API URL for all images, only one file needs to be updated
- **Robustness**: Better handling of missing or null images with fallbacks
- **Deployment Ready**: Easily configure for different environments by changing the API_URL constant

### Future Improvements

- Consider moving API_URL to an environment configuration file
- Add image optimization options to the utility functions
- Add image preloading capabilities for critical images

## Usage

To use the utility in any component:

```js
import { getImageUrl } from '../utils/imageUtils';

// Then replace:
const imgSrc = product.images?.[0]
  ? `http://localhost:5000${product.images[0]}`
  : '/no-image.png';

// With:
const imgSrc = getImageUrl(product.images?.[0]);
```
