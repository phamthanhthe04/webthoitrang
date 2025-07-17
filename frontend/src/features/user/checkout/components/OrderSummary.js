import React from 'react';

/**
 * Component hiển thị thông tin đơn hàng trong checkout
 * Bao gồm danh sách sản phẩm, tính tổng tiền
 */
const OrderSummary = ({ items, totals }) => {
  const { subtotal, shippingFee, total } = totals;

  return (
    <div className='bg-gray-50 p-6 rounded-lg'>
      <h3 className='text-lg font-semibold text-gray-900 mb-4'>
        Thông tin đơn hàng
      </h3>

      {/* Danh sách sản phẩm */}
      <div className='space-y-3 mb-6'>
        {items.map((item) => (
          <div
            key={item.id + item.size + item.color}
            className='flex justify-between items-center'
          >
            <div className='flex-1'>
              <p className='font-medium text-gray-900'>{item.name}</p>
              <p className='text-sm text-gray-600'>
                {item.size && `Size: ${item.size}`}
                {item.size && item.color && ' | '}
                {item.color && `Màu: ${item.color}`}
              </p>
              <p className='text-sm text-gray-600'>Số lượng: {item.quantity}</p>
            </div>
            <div className='text-right'>
              <p className='font-medium text-gray-900'>
                {Number(item.price * item.quantity).toLocaleString('vi-VN')} đ
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Tổng kết */}
      <div className='border-t border-gray-200 pt-4 space-y-2'>
        <div className='flex justify-between text-gray-600'>
          <span>Tiền hàng:</span>
          <span>{Number(subtotal).toLocaleString('vi-VN')} đ</span>
        </div>
        <div className='flex justify-between text-gray-600'>
          <span>Phí vận chuyển:</span>
          <span>{Number(shippingFee).toLocaleString('vi-VN')} đ</span>
        </div>
        <div className='flex justify-between text-lg font-bold text-gray-900 border-t border-gray-200 pt-2'>
          <span>Tổng cộng:</span>
          <span className='text-primary-600'>
            {Number(total).toLocaleString('vi-VN')} đ
          </span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
