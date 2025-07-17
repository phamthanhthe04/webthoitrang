import React from 'react';

/**
 * Component form nhập thông tin giao hàng
 * Bao gồm họ tên, số điện thoại, địa chỉ, ghi chú
 */
const ShippingForm = ({ shippingInfo, onShippingInfoChange }) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onShippingInfoChange(name, value);
  };

  return (
    <div className='bg-white p-6 rounded-lg border border-gray-200'>
      <h3 className='text-lg font-semibold text-gray-900 mb-4'>
        Thông tin giao hàng
      </h3>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        {/* Họ tên */}
        <div className='md:col-span-2'>
          <label
            htmlFor='name'
            className='block text-sm font-medium text-gray-700 mb-2'
          >
            Họ và tên <span className='text-red-500'>*</span>
          </label>
          <input
            type='text'
            id='name'
            name='name'
            value={shippingInfo.name}
            onChange={handleInputChange}
            className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent'
            placeholder='Nhập họ và tên'
            required
          />
        </div>

        {/* Số điện thoại */}
        <div>
          <label
            htmlFor='phone'
            className='block text-sm font-medium text-gray-700 mb-2'
          >
            Số điện thoại <span className='text-red-500'>*</span>
          </label>
          <input
            type='tel'
            id='phone'
            name='phone'
            value={shippingInfo.phone}
            onChange={handleInputChange}
            className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent'
            placeholder='Nhập số điện thoại'
            required
          />
        </div>

        {/* Địa chỉ */}
        <div className='md:col-span-2'>
          <label
            htmlFor='address'
            className='block text-sm font-medium text-gray-700 mb-2'
          >
            Địa chỉ giao hàng <span className='text-red-500'>*</span>
          </label>
          <textarea
            id='address'
            name='address'
            value={shippingInfo.address}
            onChange={handleInputChange}
            rows='3'
            className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent'
            placeholder='Nhập địa chỉ giao hàng chi tiết'
            required
          />
        </div>

        {/* Ghi chú */}
        <div className='md:col-span-2'>
          <label
            htmlFor='note'
            className='block text-sm font-medium text-gray-700 mb-2'
          >
            Ghi chú (tùy chọn)
          </label>
          <textarea
            id='note'
            name='note'
            value={shippingInfo.note}
            onChange={handleInputChange}
            rows='2'
            className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent'
            placeholder='Ghi chú thêm cho đơn hàng...'
          />
        </div>
      </div>
    </div>
  );
};

export default ShippingForm;
