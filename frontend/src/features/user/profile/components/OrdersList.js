import React from 'react';

/**
 * Component hiển thị danh sách đơn hàng của user
 * Bao gồm thông tin cơ bản và trạng thái đơn hàng
 */
const OrdersList = ({
  orders,
  loading,
  onViewOrderDetail,
  getOrderStatusBadge,
}) => {
  if (loading) {
    return (
      <div className='bg-white p-6 rounded-lg border border-gray-200'>
        <div className='text-center py-8'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4'></div>
          <p className='text-gray-600'>Đang tải danh sách đơn hàng...</p>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className='bg-white p-6 rounded-lg border border-gray-200'>
        <div className='text-center py-8'>
          <div className='text-gray-300 text-6xl mb-4'>
            <i className='fas fa-shopping-bag'></i>
          </div>
          <h3 className='text-lg font-semibold text-gray-900 mb-2'>
            Chưa có đơn hàng nào
          </h3>
          <p className='text-gray-600 mb-4'>
            Bạn chưa thực hiện đơn hàng nào. Hãy khám phá sản phẩm của chúng
            tôi!
          </p>
          <a
            href='/'
            className='inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors'
          >
            <i className='fas fa-shopping-cart mr-2'></i>
            Mua sắm ngay
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className='bg-white rounded-lg border border-gray-200 overflow-hidden'>
      <div className='p-6 border-b border-gray-200'>
        <h3 className='text-lg font-semibold text-gray-900'>
          Đơn hàng của tôi ({orders.length})
        </h3>
      </div>

      <div className='divide-y divide-gray-200'>
        {orders.map((order) => {
          const statusConfig = getOrderStatusBadge(order.status);

          return (
            <div
              key={order.id}
              className='p-6 hover:bg-gray-50 transition-colors'
            >
              <div className='flex items-center justify-between mb-4'>
                <div>
                  <h4 className='font-semibold text-gray-900'>
                    Đơn hàng #{order.id}
                  </h4>
                  <p className='text-sm text-gray-600'>
                    Đặt ngày:{' '}
                    {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                  </p>
                </div>

                <div className='text-right'>
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${statusConfig.color}`}
                  >
                    {statusConfig.text}
                  </span>
                  <p className='text-lg font-bold text-gray-900 mt-1'>
                    {Number(order.total).toLocaleString('vi-VN')} đ
                  </p>
                </div>
              </div>

              {/* Thông tin sản phẩm (hiển thị 2 sản phẩm đầu) */}
              <div className='space-y-2 mb-4'>
                {order.items?.slice(0, 2).map((item, index) => (
                  <div
                    key={index}
                    className='flex items-center text-sm text-gray-600'
                  >
                    <span className='font-medium'>
                      {item.productName || item.Product?.name}
                    </span>
                    <span className='mx-2'>×</span>
                    <span>{item.quantity}</span>
                    {item.size && (
                      <>
                        <span className='mx-2'>•</span>
                        <span>Size: {item.size}</span>
                      </>
                    )}
                    {item.color && (
                      <>
                        <span className='mx-2'>•</span>
                        <span>Màu: {item.color}</span>
                      </>
                    )}
                  </div>
                ))}

                {order.items && order.items.length > 2 && (
                  <p className='text-sm text-gray-500'>
                    và {order.items.length - 2} sản phẩm khác...
                  </p>
                )}
              </div>

              {/* Nút xem chi tiết */}
              <div className='flex justify-end'>
                <button
                  onClick={() => onViewOrderDetail(order)}
                  className='px-4 py-2 text-sm font-medium text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-colors'
                >
                  <i className='fas fa-eye mr-2'></i>
                  Xem chi tiết
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrdersList;
