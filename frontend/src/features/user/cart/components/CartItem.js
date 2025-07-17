import React from 'react';
import { getImageUrl } from '../../../../utils/imageUtils';

/**
 * Component hiển thị từng item trong giỏ hàng
 * Bao gồm hình ảnh, thông tin, điều chỉnh số lượng, xóa
 */
const CartItem = ({ item, onQuantityChange, onRemoveItem }) => {
  return (
    <div className='flex items-center space-x-4 p-4 border border-gray-200 rounded-xl hover:shadow-md transition-shadow'>
      {/* Hình ảnh sản phẩm */}
      <img
        className='w-20 h-20 object-cover rounded-lg'
        src={
          item.image
            ? item.image.startsWith('http')
              ? item.image
              : getImageUrl(item.image)
            : '/no-image.png'
        }
        alt={item.name}
      />

      {/* Thông tin sản phẩm */}
      <div className='flex-1'>
        <h3 className='text-lg font-semibold text-gray-900'>{item.name}</h3>
        <div className='text-sm text-gray-600 mt-1'>
          {item.size && <span>Size: {item.size}</span>}
          {item.size && item.color && <span className='mx-2'>|</span>}
          {item.color && <span>Màu: {item.color}</span>}
        </div>
        <div className='text-xl font-bold text-primary-600 mt-2'>
          {Number(item.price).toLocaleString('vi-VN')} đ
        </div>
      </div>

      {/* Điều chỉnh số lượng và xóa */}
      <div className='flex items-center space-x-4'>
        {/* Quantity controls */}
        <div className='flex items-center border border-gray-300 rounded-lg'>
          <button
            onClick={() => onQuantityChange(item, item.quantity - 1)}
            disabled={item.quantity <= 1}
            className='px-3 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed'
          >
            <i className='fas fa-minus'></i>
          </button>
          <span className='px-4 py-2 font-medium min-w-[50px] text-center'>
            {item.quantity}
          </span>
          <button
            onClick={() => onQuantityChange(item, item.quantity + 1)}
            className='px-3 py-2 text-gray-600 hover:text-gray-800'
          >
            <i className='fas fa-plus'></i>
          </button>
        </div>

        {/* Remove button */}
        <button
          className='px-4 py-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors'
          onClick={() => onRemoveItem(item)}
        >
          <i className='fas fa-trash'></i>
        </button>
      </div>
    </div>
  );
};

export default CartItem;
