import api from './api';

const userService = {
  // Lấy danh sách users
  getAllUsers: async (params = {}) => {
    try {
      const response = await api.get('/users', { params });
      return response.data;
    } catch (error) {
      console.error('Lỗi khi lấy danh sách users:', error);
      throw error.response?.data?.message || 'Lỗi lấy danh sách users';
    }
  },

  // Lấy thông tin user theo ID
  getUser: async (id) => {
    try {
      const response = await api.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi lấy thông tin user:', error);
      throw error.response?.data?.message || 'Lỗi lấy thông tin user';
    }
  },

  // Cập nhật trạng thái user
  updateUserStatus: async (id, status) => {
    try {
      const response = await api.put(`/users/${id}/status`, { status });
      return response.data;
    } catch (error) {
      console.error('Lỗi khi cập nhật trạng thái user:', error);
      throw error.response?.data?.message || 'Lỗi cập nhật trạng thái user';
    }
  },

  // Cập nhật quyền user
  updateUserRole: async (id, role) => {
    try {
      const response = await api.put(`/users/${id}/role`, { role });
      return response.data;
    } catch (error) {
      console.error('Lỗi khi cập nhật quyền user:', error);
      throw error.response?.data?.message || 'Lỗi cập nhật quyền user';
    }
  },

  // Xóa user
  deleteUser: async (id) => {
    try {
      const response = await api.delete(`/users/${id}`);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi xóa user:', error);
      throw error.response?.data?.message || 'Lỗi xóa user';
    }
  },

  // Cập nhật hàng loạt users
  bulkUpdateUsers: async (userIds, action, value) => {
    try {
      const response = await api.put('/users/bulk-update', {
        userIds,
        action,
        value,
      });
      return response.data;
    } catch (error) {
      console.error('Lỗi khi cập nhật hàng loạt users:', error);
      throw error.response?.data?.message || 'Lỗi cập nhật hàng loạt users';
    }
  },
};

export default userService;
