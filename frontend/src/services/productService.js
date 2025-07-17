// src/services/productService.js
import api from './api';

// Public product endpoints
export const getProducts = (params = {}) => api.get('/products', { params });
export const getProduct = (id) => api.get(`/products/${id}`);
export const getProductBySlug = (slug) => api.get(`/products/slug/${slug}`);

// Admin product endpoints
export const createProduct = (formData) => {
  return api.post('/products', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const updateProduct = (id, formData) => {
  return api.put(`/products/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const deleteProduct = (id) => api.delete(`/products/${id}`);

export const bulkDeleteProducts = (productIds) => {
  return api.delete('/products/bulk-delete', { data: { productIds } });
};

export const updateProductStatus = (id, status) => {
  return api.put(`/products/${id}/status`, { status });
};

// Admin specific product listing (with admin filters)
export const getAdminProducts = (params = {}) => {
  return api.get('/admin/products', { params });
};
