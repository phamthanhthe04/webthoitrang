import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { removeFromCart, updateQuantity } from '../../features/cart/cartSlice';
import { toast } from 'react-toastify';

const CartModal = ({ isOpen, onClose }) => {
  const { items, totalAmount, totalItems } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleQuantityChange = (id, size, color, newQuantity) => {
    if (newQuantity < 1) return;
    dispatch(updateQuantity({ id, size, color, quantity: newQuantity }));
  };

  const handleRemoveItem = (id, size, color) => {
    dispatch(removeFromCart({ id, size, color }));
    toast.success('Đã xóa sản phẩm khỏi giỏ hàng!');
  };

  const handleCheckout = () => {
    onClose();
    navigate('/thanh-toan');
  };

  const handleViewCart = () => {
    onClose();
    navigate('/gio-hang');
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50'>
      {/* Backdrop */}
      <div className='fixed inset-0 bg-black bg-opacity-50' onClick={onClose} />

      {/* Modal */}
      <div className='fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-xl transform transition-transform duration-300'>
        <div className='flex flex-col h-full'>
          {/* Header */}
          <div className='flex justify-between items-center p-6 border-b border-gray-200'>
            <h3 className='text-xl font-semibold text-gray-900'>
              <i className='fas fa-shopping-cart mr-2'></i>
              Giỏ hàng ({totalItems} sản phẩm)
            </h3>
            <button
              className='text-gray-400 hover:text-gray-600 transition-colors'
              onClick={onClose}
            >
              <i className='fas fa-times text-xl'></i>
            </button>
          </div>

          {/* Body */}
          <div className='flex-1 overflow-y-auto p-6'>
            {items.length === 0 ? (
              <div className='text-center py-12'>
                <div className='text-gray-300 text-6xl mb-4'>
                  <i className='fas fa-shopping-cart'></i>
                </div>
                <p className='text-gray-600 mb-6'>
                  Giỏ hàng của bạn đang trống
                </p>
                <button
                  onClick={onClose}
                  className='px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors'
                >
                  Tiếp tục mua sắm
                </button>
              </div>
            ) : (
              <div className='space-y-4'>
                {items.map((item) => (
                  <div
                    key={`${item.id}-${item.size}-${item.color}`}
                    className='flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:shadow-md transition-shadow'
                  >
                    <img
                      src={item.image || '/no-image.png'}
                      alt={item.name}
                      className='w-16 h-16 object-cover rounded-lg'
                    />

                    <div className='flex-1 min-w-0'>
                      <h4 className='text-sm font-medium text-gray-900 truncate'>
                        {item.name}
                      </h4>
                      <div className='text-xs text-gray-500 mt-1'>
                        <span>Size: {item.size}</span>
                        <span className='mx-1'>|</span>
                        <span>Màu: {item.color}</span>
                      </div>
                      <div className='flex items-center justify-between mt-2'>
                        <span className='text-sm font-semibold text-primary-600'>
                          {Number(item.price).toLocaleString('vi-VN')} đ
                        </span>
                        <div className='flex items-center space-x-2'>
                          <button
                            className='w-6 h-6 flex items-center justify-center bg-gray-100 text-gray-600 rounded hover:bg-gray-200'
                            onClick={() =>
                              handleQuantityChange(
                                item.id,
                                item.size,
                                item.color,
                                item.quantity - 1
                              )
                            }
                            disabled={item.quantity <= 1}
                          >
                            <i className='fas fa-minus text-xs'></i>
                          </button>
                          <span className='text-sm font-medium w-6 text-center'>
                            {item.quantity}
                          </span>
                          <button
                            className='w-6 h-6 flex items-center justify-center bg-gray-100 text-gray-600 rounded hover:bg-gray-200'
                            onClick={() =>
                              handleQuantityChange(
                                item.id,
                                item.size,
                                item.color,
                                item.quantity + 1
                              )
                            }
                          >
                            <i className='fas fa-plus text-xs'></i>
                          </button>
                          <button
                            className='w-6 h-6 flex items-center justify-center text-red-500 hover:text-red-700'
                            onClick={() =>
                              handleRemoveItem(item.id, item.size, item.color)
                            }
                          >
                            <i className='fas fa-trash text-xs'></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className='border-t border-gray-200 p-6 bg-gray-50'>
              <div className='flex justify-between items-center mb-4'>
                <span className='text-lg font-semibold text-gray-900'>
                  Tổng cộng:
                </span>
                <span className='text-xl font-bold text-primary-600'>
                  {Number(totalAmount).toLocaleString('vi-VN')} đ
                </span>
              </div>
              <div className='space-y-3'>
                <button
                  onClick={handleViewCart}
                  className='w-full py-3 border border-primary-600 text-primary-600 rounded-lg hover:bg-primary-50 transition-colors font-medium'
                >
                  Xem giỏ hàng
                </button>
                <button
                  onClick={handleCheckout}
                  className='w-full py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium'
                >
                  Thanh toán ngay
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartModal;
