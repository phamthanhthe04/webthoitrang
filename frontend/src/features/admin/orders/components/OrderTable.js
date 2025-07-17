import React from 'react';
import { AdminTable } from '../../shared/components';

const OrderTable = ({ orders, onViewDetail, onUpdateStatus }) => {
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

  const getStatusColor = (status) => {
    const colorMap = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colorMap[status] || 'bg-gray-100 text-gray-800';
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

  const headers = [
    { title: 'Mã đơn hàng', align: 'left' },
    { title: 'Khách hàng', align: 'left' },
    { title: 'Tổng tiền', align: 'right' },
    { title: 'Trạng thái', align: 'center' },
    { title: 'Ngày đặt', align: 'left' },
    { title: 'Hành động', align: 'right' },
  ];

  const renderRow = (order) => (
    <>
      <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
        #{order.id}
      </td>
      <td className='px-6 py-4 whitespace-nowrap'>
        <div>
          <div className='text-sm font-medium text-gray-900'>
            {order.user_name || 'N/A'}
          </div>
          <div className='text-sm text-gray-500'>
            {order.user_email || 'N/A'}
          </div>
        </div>
      </td>
      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right'>
        {formatCurrency(order.total_amount)}
      </td>
      <td className='px-6 py-4 whitespace-nowrap text-center'>
        <span
          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
            order.order_status
          )}`}
        >
          {getStatusText(order.order_status)}
        </span>
      </td>
      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
        {formatDateTime(order.created_at)}
      </td>
      <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
        <button
          onClick={() => onViewDetail(order)}
          className='text-blue-600 hover:text-blue-900 mr-3'
          title='Xem chi tiết'
        >
          <i className='fas fa-eye'></i>
        </button>
        <button
          onClick={() => onUpdateStatus(order)}
          className='text-green-600 hover:text-green-900'
          title='Cập nhật trạng thái'
        >
          <i className='fas fa-edit'></i>
        </button>
      </td>
    </>
  );

  return (
    <AdminTable
      headers={headers}
      data={orders}
      renderRow={renderRow}
      emptyMessage='Không có đơn hàng nào'
    />
  );
};

export default OrderTable;
