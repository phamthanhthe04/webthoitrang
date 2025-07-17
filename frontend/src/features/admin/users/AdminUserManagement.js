import React from 'react';
import { useUserManagement } from './hooks/useUserManagement';
import { UserTable, UserFilters } from './components';
import { AdminPagination } from '../shared/components';

/**
 * Component chính quản lý người dùng admin
 * Sử dụng feature-based architecture với hooks và components tách biệt
 */
const AdminUserManagement = () => {
  // Custom hook quản lý logic nghiệp vụ
  const {
    loading,
    searchTerm,
    setSearchTerm,
    selectedRole,
    setSelectedRole,
    selectedStatus,
    setSelectedStatus,
    filteredUsers,
    updateUserStatus,
    updateUserRole,
    getUserStats,
  } = useUserManagement();

  // Event handlers
  const handleUpdateStatus = async (userId, newStatus) => {
    await updateUserStatus(userId, newStatus);
  };

  const handleUpdateRole = async (userId, newRole) => {
    await updateUserRole(userId, newRole);
  };

  // Tính toán thống kê
  const stats = getUserStats();

  // Loading state
  if (loading) {
    return (
      <div className='flex items-center justify-center h-64'>
        <div className='text-gray-600'>Đang tải danh sách người dùng...</div>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Header với thống kê */}
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <h1 className='text-2xl font-semibold text-gray-900'>
            Quản lý người dùng
          </h1>
          <p className='text-gray-600 mt-1'>
            Tổng cộng {stats.total} người dùng
          </p>
        </div>
      </div>

      {/* Thống kê nhanh */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
        <div className='bg-blue-50 p-4 rounded-lg border border-blue-200'>
          <div className='text-sm font-medium text-blue-800'>
            Tổng người dùng
          </div>
          <div className='text-2xl font-bold text-blue-600'>{stats.total}</div>
        </div>
        <div className='bg-green-50 p-4 rounded-lg border border-green-200'>
          <div className='text-sm font-medium text-green-800'>Hoạt động</div>
          <div className='text-2xl font-bold text-green-600'>
            {stats.active}
          </div>
        </div>
        <div className='bg-red-50 p-4 rounded-lg border border-red-200'>
          <div className='text-sm font-medium text-red-800'>Bị khóa</div>
          <div className='text-2xl font-bold text-red-600'>
            {stats.inactive}
          </div>
        </div>
        <div className='bg-purple-50 p-4 rounded-lg border border-purple-200'>
          <div className='text-sm font-medium text-purple-800'>Admin</div>
          <div className='text-2xl font-bold text-purple-600'>
            {stats.admin}
          </div>
        </div>
      </div>

      {/* Filters */}
      <UserFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedRole={selectedRole}
        setSelectedRole={setSelectedRole}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
      />

      {/* Users Table */}
      <UserTable
        users={filteredUsers}
        onUpdateStatus={handleUpdateStatus}
        onUpdateRole={handleUpdateRole}
      />

      {/* Pagination */}
      <AdminPagination
        currentPage={1}
        totalPages={1}
        totalItems={filteredUsers.length}
        itemsPerPage={filteredUsers.length}
      />
    </div>
  );
};

export default AdminUserManagement;
