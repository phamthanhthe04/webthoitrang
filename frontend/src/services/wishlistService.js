import api from './api';

export const wishlistService = {
  // Lấy danh sách yêu thích
  getWishlist: () => api.get('/wishlist'),

  // Thêm sản phẩm vào yêu thích
  addToWishlist: (productId) =>
    api.post('/wishlist', { product_id: productId }),

  // Xóa sản phẩm khỏi yêu thích
  removeFromWishlist: (productId) => api.delete(`/wishlist/${productId}`),

  // Kiểm tra sản phẩm có trong yêu thích không
  checkWishlist: (productId) => api.get(`/wishlist/check/${productId}`),
};

export default wishlistService;
