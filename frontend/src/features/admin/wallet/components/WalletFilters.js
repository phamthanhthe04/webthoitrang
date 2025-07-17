import React from 'react';
import { AdminFilters } from '../../shared/components';

/**
 * Component bộ lọc cho ví và giao dịch
 * @param {string} searchTerm - Từ khóa tìm kiếm
 * @param {Function} setSearchTerm - Hàm cập nhật từ khóa tìm kiếm
 * @param {string} selectedType - Loại giao dịch được chọn
 * @param {Function} setSelectedType - Hàm cập nhật loại giao dịch
 * @param {Object} dateRange - Khoảng thời gian
 * @param {Function} setDateRange - Hàm cập nhật khoảng thời gian
 */
const WalletFilters = ({
  searchTerm,
  setSearchTerm,
  selectedType,
  setSelectedType,
  dateRange,
  setDateRange,
}) => {
  // Các bộ lọc bổ sung
  const additionalFilters = (
    <>
      {/* Lọc theo loại giao dịch */}
      <select
        value={selectedType}
        onChange={(e) => setSelectedType(e.target.value)}
        className='px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500'
      >
        <option value='all'>Tất cả loại GD</option>
        <option value='deposit'>Nạp tiền</option>
        <option value='withdraw'>Rút tiền</option>
        <option value='purchase'>Mua hàng</option>
        <option value='refund'>Hoàn tiền</option>
      </select>

      {/* Lọc theo khoảng thời gian */}
      <input
        type='date'
        value={dateRange.start}
        onChange={(e) =>
          setDateRange((prev) => ({ ...prev, start: e.target.value }))
        }
        className='px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500'
        placeholder='Từ ngày'
      />

      <input
        type='date'
        value={dateRange.end}
        onChange={(e) =>
          setDateRange((prev) => ({ ...prev, end: e.target.value }))
        }
        className='px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500'
        placeholder='Đến ngày'
      />
    </>
  );

  return (
    <AdminFilters
      searchTerm={searchTerm}
      onSearchChange={setSearchTerm}
      placeholder='Tìm kiếm theo tên hoặc email...'
      additionalFilters={additionalFilters}
    />
  );
};

export default WalletFilters;
