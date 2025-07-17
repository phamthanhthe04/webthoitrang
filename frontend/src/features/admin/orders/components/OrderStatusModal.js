import React from 'react';
import { AdminModal } from '../../shared/components';

const OrderStatusModal = ({
  show,
  onClose,
  order,
  selectedStatus,
  onStatusChange,
  onConfirm,
  loading,
}) => {
  if (!order) return null;

  const statusOptions = [
    { value: 'pending', label: 'Chờ xử lý', color: 'text-yellow-600' },
    { value: 'confirmed', label: 'Đã xác nhận', color: 'text-blue-600' },
    { value: 'shipped', label: 'Đang giao', color: 'text-purple-600' },
    { value: 'delivered', label: 'Đã giao', color: 'text-green-600' },
    { value: 'cancelled', label: 'Đã hủy', color: 'text-red-600' },
  ];

  const handleConfirm = () => {
    onConfirm(order.id, selectedStatus);
  };

  return (
    <AdminModal
      show={show}
      onClose={onClose}
      title={`Cập nhật trạng thái đơn hàng #${order.id}`}
      showFooter={true}
      onConfirm={handleConfirm}
      confirmText='Cập nhật'
      loading={loading}
    >
      <div className='space-y-4'>
        <p className='text-sm text-gray-600'>
          Chọn trạng thái mới cho đơn hàng này:
        </p>

        <div className='space-y-2'>
          {statusOptions.map((option) => (
            <label
              key={option.value}
              className='flex items-center p-3 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer'
            >
              <input
                type='radio'
                name='status'
                value={option.value}
                checked={selectedStatus === option.value}
                onChange={(e) => onStatusChange(e.target.value)}
                className='mr-3'
              />
              <span className={`font-medium ${option.color}`}>
                {option.label}
              </span>
            </label>
          ))}
        </div>

        {selectedStatus !== order.order_status && (
          <div className='mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md'>
            <p className='text-sm text-yellow-800'>
              <i className='fas fa-exclamation-triangle mr-2'></i>
              Thay đổi trạng thái đơn hàng có thể ảnh hưởng đến quy trình xử lý.
              Hãy chắc chắn rằng bạn muốn thực hiện thay đổi này.
            </p>
          </div>
        )}
      </div>
    </AdminModal>
  );
};

export default OrderStatusModal;
