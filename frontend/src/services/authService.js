import api from './api'; //conect to the API instance

const authService = {
  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      // Backend should return { success: true, data: { user_info, token } } or similar
      return response.data;
    } catch (error) {
      console.error(
        'Lỗi đăng nhập:',
        error.response?.data?.error || error.message
      );
      // Throw the error message for Redux Thunk to catch and put into state.error
      throw error.response?.data?.error || 'Đăng nhập thất bại';
    }
  },

  register: async (userData) => {
    // Expects an object { name, email, password }
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      console.error(
        'Lỗi đăng ký:',
        error.response?.data?.error || error.message
      );
      throw error.response?.data?.error || 'Đăng ký thất bại';
    }
  },

  changePassword: async (passwordData) => {
    try {
      const response = await api.put('/auth/change-password', passwordData);
      return response.data;
    } catch (error) {
      console.error(
        'Lỗi đổi mật khẩu:',
        error.response?.data?.error || error.message
      );
      throw error.response?.data?.error || 'Đổi mật khẩu thất bại';
    }
  },

  updateProfile: async (profileData) => {
    try {
      const response = await api.put('/auth/me', profileData);
      return response.data;
    } catch (error) {
      console.error(
        'Lỗi cập nhật thông tin:',
        error.response?.data?.error || error.message
      );
      throw error.response?.data?.error || 'Cập nhật thông tin thất bại';
    }
  },
};

export default authService;
