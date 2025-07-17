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

  // Admin category management
  createCategory: (categoryData) => api.post('/admin/categories', categoryData),
  updateCategory: (id, categoryData) =>
    api.put(`/admin/categories/${id}`, categoryData),
  deleteCategory: (id) => api.delete(`/admin/categories/${id}`),
};

// Export individual functions for easier importing
export const getCategories = categoryService.getCategories;
export const getCategoryBySlug = categoryService.getCategoryBySlug;
export const getProductsByCategory = categoryService.getProductsByCategory;
export const getProductsByCategorySlug =
  categoryService.getProductsByCategorySlug;
export const createCategory = categoryService.createCategory;
export const updateCategory = categoryService.updateCategory;
export const deleteCategory = categoryService.deleteCategory;
