import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout, updateUserProfile } from '../../../auth/authSlice';
import authService from '../../../../services/authService';
import { orderService } from '../../../../services/orderService';
import { toast } from 'react-toastify';

/**
 * Custom hook cho quản lý trang profile người dùng
 * Xử lý thông tin cá nhân, đổi mật khẩu, lịch sử đơn hàng
 */
export const useProfile = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Quản lý tabs
  const [activeTab, setActiveTab] = useState('profile');

  // Thông tin profile
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  // Dữ liệu đổi mật khẩu
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Trạng thái UI
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  /**
   * Kiểm tra authentication và cập nhật thông tin user
   */
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/dang-nhap');
      return;
    }

    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
      });
    }
  }, [isAuthenticated, user, navigate]);

  /**
   * Tải danh sách đơn hàng khi chuyển sang tab orders
   */
  useEffect(() => {
    if (activeTab === 'orders' && isAuthenticated) {
      fetchOrders();
    }
  }, [activeTab, isAuthenticated]);

  /**
   * Lấy danh sách đơn hàng của user
   */
  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const response = await orderService.getUserOrders();
      if (response.success) {
        // Sắp xếp đơn hàng theo thời gian mới nhất
        const sortedOrders = response.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setOrders(sortedOrders);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Không thể tải danh sách đơn hàng');
    } finally {
      setLoadingOrders(false);
    }
  };

  /**
   * Xử lý thay đổi thông tin profile
   */
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /**
   * Xử lý thay đổi dữ liệu password
   */
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /**
   * Cập nhật thông tin profile
   */
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await dispatch(updateUserProfile(profileData)).unwrap();
      toast.success('Cập nhật thông tin thành công!');
      setIsEditing(false);
    } catch (error) {
      toast.error(error || 'Có lỗi xảy ra khi cập nhật thông tin');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Đổi mật khẩu
   */
  const handleChangePassword = async (e) => {
    e.preventDefault();

    // Validate password
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Mật khẩu xác nhận không khớp');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('Mật khẩu mới phải có ít nhất 6 ký tự');
      return;
    }

    setLoading(true);
    try {
      await authService.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      toast.success('Đổi mật khẩu thành công!');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      toast.error(error.message || 'Có lỗi xảy ra khi đổi mật khẩu');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Xem chi tiết đơn hàng
   */
  const handleViewOrderDetail = (order) => {
    setSelectedOrder(order);
  };

  /**
   * Quay lại danh sách đơn hàng
   */
  const handleBackToOrdersList = () => {
    setSelectedOrder(null);
  };

  /**
   * Lấy badge màu sắc theo trạng thái đơn hàng
   */
  const getOrderStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', text: 'Chờ xử lý' },
      confirmed: { color: 'bg-blue-100 text-blue-800', text: 'Đã xác nhận' },
      shipping: { color: 'bg-purple-100 text-purple-800', text: 'Đang giao' },
      delivered: { color: 'bg-green-100 text-green-800', text: 'Đã giao' },
      cancelled: { color: 'bg-red-100 text-red-800', text: 'Đã hủy' },
    };

    return statusConfig[status] || statusConfig.pending;
  };

  /**
   * Đăng xuất
   */
  const handleLogout = () => {
    if (window.confirm('Bạn có chắc chắn muốn đăng xuất?')) {
      dispatch(logout());
      navigate('/');
    }
  };

  return {
    // State
    activeTab,
    profileData,
    passwordData,
    isEditing,
    loading,
    orders,
    loadingOrders,
    selectedOrder,

    // Actions
    setActiveTab,
    setIsEditing,
    handleProfileChange,
    handlePasswordChange,
    handleUpdateProfile,
    handleChangePassword,
    handleViewOrderDetail,
    handleBackToOrdersList,
    handleLogout,

    // Utilities
    getOrderStatusBadge,
    fetchOrders,
  };
};
