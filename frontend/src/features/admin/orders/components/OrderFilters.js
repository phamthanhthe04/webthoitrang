import React from 'react';
import { AdminFilters } from '../../shared/components';

const OrderFilters = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusChange,
  statusCounts,
}) => {
  const statusTabs = [
    { key: 'all', label: 'Tất cả', count: statusCounts.all },
    { key: 'pending', label: 'Chờ xử lý', count: statusCounts.pending },
    { key: 'confirmed', label: 'Đã xác nhận', count: statusCounts.confirmed },
    { key: 'shipped', label: 'Đang giao', count: statusCounts.shipped },
    { key: 'delivered', label: 'Đã giao', count: statusCounts.delivered },
    { key: 'cancelled', label: 'Đã hủy', count: statusCounts.cancelled },
  ];

  const additionalFilters = (
    <div className='flex flex-wrap gap-2'>
      {statusTabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onStatusChange(tab.key)}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            statusFilter === tab.key
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {tab.label} ({tab.count})
        </button>
      ))}
    </div>
  );

  return (
    <AdminFilters
      searchTerm={searchTerm}
      onSearchChange={onSearchChange}
      placeholder='Tìm kiếm theo tên khách hàng, email hoặc mã đơn hàng...'
      additionalFilters={additionalFilters}
    />
  );
};

export default OrderFilters;
