// src/services/categoryService.js
import api from './api';

export const categoryService = {
  // Lấy tất cả categories
  getCategories: () => api.get('/categories'),

  // Lấy category theo slug
  getCategoryBySlug: (slug) => api.get(`/categories/slug/${slug}`),

  // Lấy products theo category
  getProductsByCategory: (categoryId, params = {}) =>
    api.get(`/categories/${categoryId}/products`, { params }),

  // Lấy products theo category slug
  getProductsByCategorySlug: (slug, params = {}) =>
    api.get(`/categories/slug/${slug}/products`, { params }),
};
