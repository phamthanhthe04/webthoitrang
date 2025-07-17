import { useState, useEffect } from 'react';
import userService from '../../../../services/userService';
import { toast } from 'react-toastify';

/**
 * Hook quản lý logic nghiệp vụ cho người dùng admin
 * Bao gồm: tải dữ liệu, tìm kiếm, lọc theo role, khóa/mở khóa tài khoản
 */
export const useUserManagement = () => {
  // States quản lý dữ liệu và UI
  const [users, setUsers] = useState([]); // Danh sách tất cả người dùng
  const [loading, setLoading] = useState(true); // Trạng thái loading
  const [searchTerm, setSearchTerm] = useState(''); // Từ khóa tìm kiếm
  const [selectedRole, setSelectedRole] = useState('all'); // Role được chọn
  const [selectedStatus, setSelectedStatus] = useState('all'); // Trạng thái được chọn

  // Tải danh sách người dùng khi component mount
  useEffect(() => {
    loadUsers();
  }, []);

  /**
   * Hàm tải danh sách người dùng từ API
   */
  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await userService.getAllUsers();
      setUsers(response.users || []);
    } catch (error) {
      console.error('Error loading users:', error);
      toast.error('Không thể tải danh sách người dùng');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Hàm cập nhật trạng thái người dùng (khóa/mở khóa)
   * @param {number} userId - ID người dùng
   * @param {string} newStatus - Trạng thái mới ('active' hoặc 'inactive')
   */
  const updateUserStatus = async (userId, newStatus) => {
    try {
      await userService.updateUserStatus(userId, newStatus);

      // Cập nhật state local
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, status: newStatus } : user
        )
      );

      const statusText = newStatus === 'active' ? 'mở khóa' : 'khóa';
      toast.success(`${statusText} tài khoản thành công`);
    } catch (error) {
      console.error('Error updating user status:', error);
      toast.error('Có lỗi xảy ra khi cập nhật trạng thái tài khoản');
    }
  };

  /**
   * Hàm cập nhật role người dùng
   * @param {number} userId - ID người dùng
   * @param {string} newRole - Role mới ('user', 'admin')
   */
  const updateUserRole = async (userId, newRole) => {
    try {
      await userService.updateUserRole(userId, newRole);

      // Cập nhật state local
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, role: newRole } : user
        )
      );

      toast.success('Cập nhật quyền người dùng thành công');
    } catch (error) {
      console.error('Error updating user role:', error);
      toast.error('Có lỗi xảy ra khi cập nhật quyền người dùng');
    }
  };

  /**
   * Hàm lọc người dùng dựa trên từ khóa tìm kiếm, role và trạng thái
   * Kết hợp filter theo tên, email, role và status
   */
  const filteredUsers = users.filter((user) => {
    // Tìm kiếm theo tên hoặc email (case-insensitive)
    const matchesSearch =
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());

    // Lọc theo role
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;

    // Lọc theo trạng thái
    const matchesStatus =
      selectedStatus === 'all' || user.status === selectedStatus;

    return matchesSearch && matchesRole && matchesStatus;
  });

  /**
   * Hàm lấy thống kê người dùng
   */
  const getUserStats = () => {
    return {
      total: filteredUsers.length,
      active: filteredUsers.filter((user) => user.status === 'active').length,
      inactive: filteredUsers.filter((user) => user.status === 'inactive')
        .length,
      admin: filteredUsers.filter((user) => user.role === 'admin').length,
      user: filteredUsers.filter((user) => user.role === 'user').length,
    };
  };

  // Return các state và function cần thiết cho component
  return {
    users, // Danh sách người dùng gốc
    setUsers, // Hàm cập nhật danh sách người dùng
    loading, // Trạng thái loading
    searchTerm, // Từ khóa tìm kiếm
    setSearchTerm, // Hàm cập nhật từ khóa tìm kiếm
    selectedRole, // Role được chọn
    setSelectedRole, // Hàm cập nhật role
    selectedStatus, // Trạng thái được chọn
    setSelectedStatus, // Hàm cập nhật trạng thái
    filteredUsers, // Danh sách người dùng đã được lọc
    loadUsers, // Hàm tải lại danh sách người dùng
    updateUserStatus, // Hàm cập nhật trạng thái người dùng
    updateUserRole, // Hàm cập nhật role người dùng
    getUserStats, // Hàm lấy thống kê người dùng
  };
};
