import { useSelector, useDispatch } from 'react-redux';
import {
  selectCartItems,
  selectCartTotalAmount,
  updateQuantity,
  removeFromCart,
  clearCart,
} from '../../../cart/cartSlice';

/**
 * Custom hook cho quản lý giỏ hàng
 * Xử lý logic cập nhật số lượng, xóa sản phẩm, xóa toàn bộ giỏ hàng
 */
export const useCart = () => {
  const cartItems = useSelector(selectCartItems);
  const total = useSelector(selectCartTotalAmount);
  const dispatch = useDispatch();

  /**
   * Xử lý thay đổi số lượng sản phẩm
   * Kiểm tra số lượng tối thiểu và tối đa
   */
  const handleQuantityChange = (item, newQuantity) => {
    // Không cho phép số lượng âm
    if (newQuantity < 1) return;

    // Kiểm tra giới hạn tồn kho nếu có
    if (item.stock && newQuantity > item.stock) {
      alert(`Chỉ còn ${item.stock} sản phẩm trong kho.`);
      newQuantity = item.stock;
    }

    dispatch(
      updateQuantity({
        id: item.id,
        color: item.color,
        size: item.size,
        quantity: newQuantity,
      })
    );
  };

  /**
   * Xóa một sản phẩm khỏi giỏ hàng
   */
  const handleRemoveItem = (item) => {
    dispatch(
      removeFromCart({
        id: item.id,
        color: item.color,
        size: item.size,
      })
    );
  };

  /**
   * Xóa toàn bộ giỏ hàng với xác nhận
   */
  const handleClearCart = () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa toàn bộ giỏ hàng?')) {
      dispatch(clearCart());
    }
  };

  return {
    // State
    cartItems,
    total,

    // Computed
    isEmpty: cartItems.length === 0,
    itemCount: cartItems.length,

    // Actions
    handleQuantityChange,
    handleRemoveItem,
    handleClearCart,
  };
};
