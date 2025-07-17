import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Component tổng kết giỏ hàng
 * Hiển thị tổng tiền và các nút hành động
 */
const CartSummary = ({ total, onClearCart }) => {
  return (
    <div className='mt-8 pt-6 border-t border-gray-200'>
      <div className='flex justify-between items-center mb-6'>
        <span className='text-2xl font-bold text-gray-900'>Tổng cộng:</span>
        <span className='text-3xl font-bold text-primary-600'>
          {Number(total).toLocaleString('vi-VN')} đ
        </span>
      </div>

      <div className='flex flex-col sm:flex-row gap-4'>
        {/* Nút xóa toàn bộ giỏ hàng */}
        <button
          className='flex-1 px-6 py-3 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors'
          onClick={onClearCart}
        >
          <i className='fas fa-trash mr-2'></i>
          Xóa toàn bộ giỏ hàng
        </button>

        {/* Nút thanh toán */}
        <Link
          to='/thanh-toan'
          className='flex-1 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-center font-medium'
        >
          <i className='fas fa-credit-card mr-2'></i>
          Thanh toán
        </Link>
      </div>
    </div>
  );
};

export default CartSummary;
