import React from 'react';
import { AdminModal } from '../../shared/components';

const OrderDetailModal = ({ show, onClose, order }) => {
  if (!order) return null;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid Date';
    return date.toLocaleString('vi-VN');
  };

  const getStatusText = (status) => {
    const statusMap = {
      pending: 'Chờ xử lý',
      confirmed: 'Đã xác nhận',
      shipped: 'Đang giao',
      delivered: 'Đã giao',
      cancelled: 'Đã hủy',
    };
    return statusMap[status] || status;
  };

  return (
    <AdminModal
      show={show}
      onClose={onClose}
      title={`Chi tiết đơn hàng #${order.id}`}
      size='large'
    >
      <div className='space-y-6'>
        {/* Order Info */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div>
            <h4 className='text-sm font-medium text-gray-900 mb-2'>
              Thông tin đơn hàng
            </h4>
            <div className='bg-gray-50 p-3 rounded-md space-y-2'>
              <div className='flex justify-between'>
                <span className='text-sm text-gray-600'>Mã đơn hàng:</span>
                <span className='text-sm font-medium'>#{order.id}</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-sm text-gray-600'>Trạng thái:</span>
                <span className='text-sm font-medium'>
                  {getStatusText(order.order_status)}
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-sm text-gray-600'>Ngày đặt:</span>
                <span className='text-sm font-medium'>
                  {formatDateTime(order.created_at)}
                </span>
              </div>
            </div>
          </div>

          <div>
            <h4 className='text-sm font-medium text-gray-900 mb-2'>
              Thông tin khách hàng
            </h4>
            <div className='bg-gray-50 p-3 rounded-md space-y-2'>
              <div className='flex justify-between'>
                <span className='text-sm text-gray-600'>Tên:</span>
                <span className='text-sm font-medium'>
                  {order.user_name || 'N/A'}
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-sm text-gray-600'>Email:</span>
                <span className='text-sm font-medium'>
                  {order.user_email || 'N/A'}
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-sm text-gray-600'>Điện thoại:</span>
                <span className='text-sm font-medium'>
                  {order.shipping_phone || 'N/A'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Shipping Address */}
        <div>
          <h4 className='text-sm font-medium text-gray-900 mb-2'>
            Địa chỉ giao hàng
          </h4>
          <div className='bg-gray-50 p-3 rounded-md'>
            <p className='text-sm text-gray-700'>
              {order.shipping_address || 'N/A'}
            </p>
          </div>
        </div>

        {/* Order Items */}
        {order.items && order.items.length > 0 && (
          <div>
            <h4 className='text-sm font-medium text-gray-900 mb-2'>
              Sản phẩm đã đặt
            </h4>
            <div className='border border-gray-200 rounded-md overflow-hidden'>
              <table className='min-w-full divide-y divide-gray-200'>
                <thead className='bg-gray-50'>
                  <tr>
                    <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase'>
                      Sản phẩm
                    </th>
                    <th className='px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase'>
                      Số lượng
                    </th>
                    <th className='px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase'>
                      Đơn giá
                    </th>
                    <th className='px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase'>
                      Thành tiền
                    </th>
                  </tr>
                </thead>
                <tbody className='bg-white divide-y divide-gray-200'>
                  {order.items.map((item, index) => (
                    <tr key={index}>
                      <td className='px-4 py-2 text-sm text-gray-900'>
                        {item.product_name || 'N/A'}
                      </td>
                      <td className='px-4 py-2 text-sm text-gray-900 text-center'>
                        {item.quantity}
                      </td>
                      <td className='px-4 py-2 text-sm text-gray-900 text-right'>
                        {formatCurrency(item.price)}
                      </td>
                      <td className='px-4 py-2 text-sm text-gray-900 text-right'>
                        {formatCurrency(item.quantity * item.price)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Total */}
        <div className='border-t pt-4'>
          <div className='flex justify-between items-center'>
            <span className='text-lg font-medium text-gray-900'>
              Tổng cộng:
            </span>
            <span className='text-lg font-bold text-blue-600'>
              {formatCurrency(order.total_amount)}
            </span>
          </div>
        </div>
      </div>
    </AdminModal>
  );
};

export default OrderDetailModal;
