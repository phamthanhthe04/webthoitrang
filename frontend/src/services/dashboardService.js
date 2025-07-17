import api from './api';

const dashboardService = {
  // Lấy thống kê tổng quan
  getDashboardStats: async () => {
    try {
      const response = await api.get('/dashboard/stats');
      return response.data;
    } catch (error) {
      console.error('Lỗi khi lấy thống kê dashboard:', error);
      throw error.response?.data?.message || 'Lỗi lấy thống kê dashboard';
    }
  },

  // Lấy thống kê doanh thu
  getRevenueStats: async (params = {}) => {
    try {
      const response = await api.get('/dashboard/revenue', { params });
      return response.data;
    } catch (error) {
      console.error('Lỗi khi lấy thống kê doanh thu:', error);
      throw error.response?.data?.message || 'Lỗi lấy thống kê doanh thu';
    }
  },

  // Lấy thống kê sản phẩm
  getProductStats: async () => {
    try {
      const response = await api.get('/dashboard/products');
      return response.data;
    } catch (error) {
      console.error('Lỗi khi lấy thống kê sản phẩm:', error);
      throw error.response?.data?.message || 'Lỗi lấy thống kê sản phẩm';
    }
  },
};

export default dashboardService;
