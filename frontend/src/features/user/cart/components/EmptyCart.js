import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Component hiển thị khi giỏ hàng trống
 * Bao gồm icon, thông báo và nút tiếp tục mua sắm
 */
const EmptyCart = () => {
  return (
    <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
      <div className='text-center max-w-md mx-auto px-4'>
        <div className='text-gray-300 text-8xl mb-6'>
          <i className='fas fa-shopping-cart'></i>
        </div>
        <h2 className='text-3xl font-bold text-gray-900 mb-4'>
          Giỏ hàng trống
        </h2>
        <p className='text-gray-600 mb-8'>
          Chưa có sản phẩm nào trong giỏ hàng của bạn
        </p>
        <Link
          to='/'
          className='inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors'
        >
          <i className='fas fa-shopping-bag mr-2'></i>
          Tiếp tục mua sắm
        </Link>
      </div>
    </div>
  );
};

export default EmptyCart;
