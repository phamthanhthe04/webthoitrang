import React from 'react';

/**
 * Component lựa chọn phương thức thanh toán
 * Bao gồm ví điện tử và thanh toán khi nhận hàng (COD)
 */
const PaymentMethodSelector = ({
  paymentMethod,
  onPaymentMethodChange,
  wallet,
  total,
}) => {
  return (
    <div className='bg-white p-6 rounded-lg border border-gray-200'>
      <h3 className='text-lg font-semibold text-gray-900 mb-4'>
        Phương thức thanh toán
      </h3>

      <div className='space-y-4'>
        {/* Thanh toán qua ví */}
        <label className='flex items-start space-x-3 cursor-pointer'>
          <input
            type='radio'
            name='paymentMethod'
            value='wallet'
            checked={paymentMethod === 'wallet'}
            onChange={(e) => onPaymentMethodChange(e.target.value)}
            className='mt-1'
          />
          <div className='flex-1'>
            <div className='flex items-center justify-between'>
              <span className='font-medium text-gray-900'>Ví điện tử</span>
              <span className='text-sm text-gray-600'>
                Số dư: {Number(wallet?.balance || 0).toLocaleString('vi-VN')} đ
              </span>
            </div>
            <p className='text-sm text-gray-600 mt-1'>
              Thanh toán nhanh chóng và an toàn qua ví điện tử
            </p>

            {/* Cảnh báo số dư không đủ */}
            {wallet && wallet.balance < total && (
              <div className='mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-600'>
                <i className='fas fa-exclamation-triangle mr-1'></i>
                Số dư ví không đủ để thanh toán đơn hàng này
              </div>
            )}
          </div>
        </label>

        {/* Thanh toán khi nhận hàng */}
        <label className='flex items-start space-x-3 cursor-pointer'>
          <input
            type='radio'
            name='paymentMethod'
            value='cod'
            checked={paymentMethod === 'cod'}
            onChange={(e) => onPaymentMethodChange(e.target.value)}
            className='mt-1'
          />
          <div className='flex-1'>
            <span className='font-medium text-gray-900'>
              Thanh toán khi nhận hàng (COD)
            </span>
            <p className='text-sm text-gray-600 mt-1'>
              Thanh toán bằng tiền mặt khi nhận hàng tại địa chỉ giao hàng
            </p>
          </div>
        </label>
      </div>

      {/* Thông tin phí COD nếu có */}
      {paymentMethod === 'cod' && (
        <div className='mt-4 p-3 bg-blue-50 border border-blue-200 rounded text-sm text-blue-700'>
          <i className='fas fa-info-circle mr-1'></i>
          Phí thu hộ (COD): Miễn phí
        </div>
      )}
    </div>
  );
};

export default PaymentMethodSelector;
