import React from 'react';

/**
 * Component hiển thị chi tiết đơn hàng
 * Bao gồm thông tin sản phẩm, giao hàng, thanh toán
 */
const OrderDetailModal = ({ order, onBack, getOrderStatusBadge }) => {
  if (!order) return null;

  const statusConfig = getOrderStatusBadge(order.status);

  return (
    <div className='bg-white rounded-lg border border-gray-200'>
      {/* Header */}
      <div className='p-6 border-b border-gray-200'>
        <div className='flex items-center justify-between'>
          <div>
            <button
              onClick={onBack}
              className='flex items-center text-gray-600 hover:text-gray-800 mb-2'
            >
              <i className='fas fa-arrow-left mr-2'></i>
              Quay lại danh sách
            </button>
            <h3 className='text-lg font-semibold text-gray-900'>
              Chi tiết đơn hàng #{order.id}
            </h3>
          </div>
          <span
            className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${statusConfig.color}`}
          >
            {statusConfig.text}
          </span>
        </div>
      </div>

      <div className='p-6 space-y-6'>
        {/* Thông tin đơn hàng */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div>
            <h4 className='font-semibold text-gray-900 mb-3'>
              Thông tin đơn hàng
            </h4>
            <div className='space-y-2 text-sm'>
              <div className='flex justify-between'>
                <span className='text-gray-600'>Mã đơn hàng:</span>
                <span className='font-medium'>#{order.id}</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-600'>Ngày đặt:</span>
                <span>
                  {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-600'>Phương thức thanh toán:</span>
                <span className='capitalize'>
                  {order.paymentMethod === 'wallet' ? 'Ví điện tử' : 'COD'}
                </span>
              </div>
            </div>
          </div>

          <div>
            <h4 className='font-semibold text-gray-900 mb-3'>
              Thông tin giao hàng
            </h4>
            <div className='space-y-2 text-sm'>
              <div>
                <span className='text-gray-600'>Người nhận:</span>
                <p className='font-medium'>{order.shippingInfo?.name}</p>
              </div>
              <div>
                <span className='text-gray-600'>Số điện thoại:</span>
                <p>{order.shippingInfo?.phone}</p>
              </div>
              <div>
                <span className='text-gray-600'>Địa chỉ:</span>
                <p>{order.shippingInfo?.address}</p>
              </div>
              {order.shippingInfo?.note && (
                <div>
                  <span className='text-gray-600'>Ghi chú:</span>
                  <p className='italic'>{order.shippingInfo.note}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Danh sách sản phẩm */}
        <div>
          <h4 className='font-semibold text-gray-900 mb-3'>Sản phẩm đã đặt</h4>
          <div className='border border-gray-200 rounded-lg overflow-hidden'>
            <div className='bg-gray-50 px-4 py-3 grid grid-cols-12 gap-4 text-sm font-medium text-gray-700'>
              <div className='col-span-6'>Sản phẩm</div>
              <div className='col-span-2 text-center'>Số lượng</div>
              <div className='col-span-2 text-center'>Đơn giá</div>
              <div className='col-span-2 text-right'>Thành tiền</div>
            </div>

            {order.items?.map((item, index) => (
              <div
                key={index}
                className='px-4 py-3 border-t border-gray-200 grid grid-cols-12 gap-4 text-sm'
              >
                <div className='col-span-6'>
                  <p className='font-medium text-gray-900'>
                    {item.productName || item.Product?.name}
                  </p>
                  <div className='text-gray-600 text-xs mt-1'>
                    {item.size && <span>Size: {item.size}</span>}
                    {item.size && item.color && <span className='mx-2'>|</span>}
                    {item.color && <span>Màu: {item.color}</span>}
                  </div>
                </div>
                <div className='col-span-2 text-center'>{item.quantity}</div>
                <div className='col-span-2 text-center'>
                  {Number(item.price).toLocaleString('vi-VN')} đ
                </div>
                <div className='col-span-2 text-right font-medium'>
                  {Number(item.price * item.quantity).toLocaleString('vi-VN')} đ
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tổng kết thanh toán */}
        <div className='bg-gray-50 p-4 rounded-lg'>
          <div className='space-y-2 text-sm'>
            <div className='flex justify-between'>
              <span className='text-gray-600'>Tiền hàng:</span>
              <span>
                {Number(order.subtotal || 0).toLocaleString('vi-VN')} đ
              </span>
            </div>
            <div className='flex justify-between'>
              <span className='text-gray-600'>Phí vận chuyển:</span>
              <span>
                {Number(order.shippingFee || 30000).toLocaleString('vi-VN')} đ
              </span>
            </div>
            <div className='flex justify-between text-lg font-bold text-gray-900 border-t border-gray-200 pt-2'>
              <span>Tổng cộng:</span>
              <span className='text-primary-600'>
                {Number(order.total).toLocaleString('vi-VN')} đ
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailModal;
