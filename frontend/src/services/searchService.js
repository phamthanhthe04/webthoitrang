// src/services/searchService.js
import api from './api';

// Get search suggestions
export const getSearchSuggestions = (query) =>
  api.get(`/search/suggestions?q=${encodeURIComponent(query)}`);

// Get popular searches
export const getPopularSearches = () => api.get('/search/popular');

// Track search (analytics)
export const trackSearch = (query) => api.post('/search/track', { query });

// Get trending products
export const getTrendingProducts = (limit = 6) =>
  api.get(`/products/trending?limit=${limit}`);

const searchService = {
  getSearchSuggestions,
  getPopularSearches,
  trackSearch,
  getTrendingProducts,
};

export default searchService;
