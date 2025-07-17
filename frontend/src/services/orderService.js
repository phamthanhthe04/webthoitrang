// src/services/orderService.js
import api from './api';

export const orderService = {
  // Tạo đơn hàng mới
  createOrder: async (orderData) => {
    try {
      console.log('[ORDER SERVICE] Creating order with data:', orderData);
      const response = await api.post('/orders', orderData);
      console.log('[ORDER SERVICE] Create order response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Create order error:', error);
      throw error;
    }
  },

  // Lấy danh sách đơn hàng của user
  getUserOrders: async () => {
    try {
      const response = await api.get('/orders/my-orders');
      console.log('📦 [ORDERS] User orders response:', response);
      return response.data;
    } catch (error) {
      console.error('❌ [ORDERS] Get user orders error:', error);
      throw error;
    }
  },

  // Lấy chi tiết đơn hàng
  getOrderById: async (orderId) => {
    try {
      const response = await api.get(`/orders/${orderId}`);
      return response.data;
    } catch (error) {
      console.error('Get order by id error:', error);
      throw error;
    }
  },

  // Cập nhật trạng thái đơn hàng
  updateOrderStatus: async (orderId, status) => {
    try {
      const response = await api.put(`/orders/${orderId}/status`, { status });
      return response.data;
    } catch (error) {
      console.error('Update order status error:', error);
      throw error;
    }
  },

  // Hủy đơn hàng
  cancelOrder: async (orderId) => {
    try {
      const response = await api.put(`/orders/${orderId}/cancel`);
      return response.data;
    } catch (error) {
      console.error('Cancel order error:', error);
      throw error;
    }
  },

  // Admin order management
  getAllOrders: async (params = {}) => {
    try {
      const response = await api.get('/orders', { params });
      return response.data;
    } catch (error) {
      console.error('Get all orders error:', error);
      throw error;
    }
  },

  deleteOrder: async (id) => {
    try {
      const response = await api.delete(`/orders/${id}`);
      return response.data;
    } catch (error) {
      console.error('Delete order error:', error);
      throw error;
    }
  },
};
