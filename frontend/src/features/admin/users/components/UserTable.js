import React from 'react';
import { AdminTable } from '../../shared/components';

/**
 * Component hiển thị bảng danh sách người dùng
 * @param {Array} users - Danh sách người dùng
 * @param {Function} onUpdateStatus - Hàm cập nhật trạng thái người dùng
 * @param {Function} onUpdateRole - Hàm cập nhật role người dùng
 */
const UserTable = ({ users, onUpdateStatus, onUpdateRole }) => {
  const headers = [
    { title: 'ID', align: 'left' },
    { title: 'Người dùng', align: 'left' },
    { title: 'Email', align: 'left' },
    { title: 'Ngày tạo', align: 'left' },
    { title: 'Role', align: 'center' },
    { title: 'Trạng thái', align: 'center' },
    { title: 'Hành động', align: 'right' },
  ];

  /**
   * Hàm lấy class CSS cho trạng thái người dùng
   * @param {string} status - Trạng thái người dùng
   */
  const getStatusClass = (status) => {
    return status === 'active'
      ? 'bg-green-100 text-green-800'
      : 'bg-red-100 text-red-800';
  };

  /**
   * Hàm lấy class CSS cho role người dùng
   * @param {string} role - Role người dùng
   */
  const getRoleClass = (role) => {
    return role === 'admin'
      ? 'bg-purple-100 text-purple-800'
      : 'bg-blue-100 text-blue-800';
  };

  /**
   * Hàm render từng dòng người dùng
   */
  const renderRow = (user, index) => (
    <>
      <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
        #{user.id}
      </td>
      <td className='px-6 py-4 whitespace-nowrap'>
        <div className='flex items-center'>
          <div className='h-10 w-10 flex-shrink-0'>
            <div className='h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center'>
              <i className='fas fa-user text-gray-600'></i>
            </div>
          </div>
          <div className='ml-4'>
            <div className='text-sm font-medium text-gray-900'>
              {user.name || 'N/A'}
            </div>
            <div className='text-sm text-gray-500'>ID: {user.id}</div>
          </div>
        </div>
      </td>
      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
        {user.email}
      </td>
      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
        {new Date(user.created_at).toLocaleDateString('vi-VN')}
      </td>
      <td className='px-6 py-4 whitespace-nowrap text-center'>
        <select
          value={user.role}
          onChange={(e) => onUpdateRole(user.id, e.target.value)}
          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border-0 ${getRoleClass(
            user.role
          )}`}
        >
          <option value='user'>User</option>
          <option value='admin'>Admin</option>
        </select>
      </td>
      <td className='px-6 py-4 whitespace-nowrap text-center'>
        <span
          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusClass(
            user.status
          )}`}
        >
          {user.status === 'active' ? 'Hoạt động' : 'Bị khóa'}
        </span>
      </td>
      <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
        <button
          onClick={() =>
            onUpdateStatus(
              user.id,
              user.status === 'active' ? 'inactive' : 'active'
            )
          }
          className={`${
            user.status === 'active'
              ? 'text-red-600 hover:text-red-900'
              : 'text-green-600 hover:text-green-900'
          } mr-3`}
          title={
            user.status === 'active' ? 'Khóa tài khoản' : 'Mở khóa tài khoản'
          }
        >
          <i
            className={`fas ${
              user.status === 'active' ? 'fa-lock' : 'fa-unlock'
            }`}
          ></i>
        </button>
      </td>
    </>
  );

  return (
    <AdminTable
      headers={headers}
      data={users}
      renderRow={renderRow}
      emptyMessage='Không có người dùng nào'
    />
  );
};

export default UserTable;
