import React from 'react';
import { AdminFilters } from '../../shared/components';

/**
 * Component bộ lọc cho danh sách người dùng
 * @param {string} searchTerm - Từ khóa tìm kiếm
 * @param {Function} setSearchTerm - Hàm cập nhật từ khóa tìm kiếm
 * @param {string} selectedRole - Role được chọn
 * @param {Function} setSelectedRole - Hàm cập nhật role
 * @param {string} selectedStatus - Trạng thái được chọn
 * @param {Function} setSelectedStatus - Hàm cập nhật trạng thái
 */
const UserFilters = ({
  searchTerm,
  setSearchTerm,
  selectedRole,
  setSelectedRole,
  selectedStatus,
  setSelectedStatus,
}) => {
  // Các bộ lọc bổ sung
  const additionalFilters = (
    <>
      {/* Lọc theo role */}
      <select
        value={selectedRole}
        onChange={(e) => setSelectedRole(e.target.value)}
        className='px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500'
      >
        <option value='all'>Tất cả role</option>
        <option value='user'>User</option>
        <option value='admin'>Admin</option>
      </select>

      {/* Lọc theo trạng thái */}
      <select
        value={selectedStatus}
        onChange={(e) => setSelectedStatus(e.target.value)}
        className='px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500'
      >
        <option value='all'>Tất cả trạng thái</option>
        <option value='active'>Hoạt động</option>
        <option value='inactive'>Bị khóa</option>
      </select>
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

export default UserFilters;
