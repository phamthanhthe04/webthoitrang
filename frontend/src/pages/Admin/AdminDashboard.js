import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 150,
    totalOrders: 89,
    totalUsers: 245,
    totalRevenue: 15750000,
    recentOrders: [
      { id: 1, customer: 'Nguyễn Văn An', total: 750000, status: 'completed' },
      { id: 2, customer: 'Trần Thị Bình', total: 1200000, status: 'pending' },
      { id: 3, customer: 'Lê Minh Châu', total: 890000, status: 'shipping' },
    ],
    lowStockProducts: [
      { id: 1, name: 'Áo phông trắng', stock: 2 },
      { id: 2, name: 'Quần jean đen', stock: 1 },
      { id: 3, name: 'Váy dạ hội', stock: 3 },
    ],
  });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const getStatusColor = (status) => {
    const colorMap = {
      completed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      shipping: 'bg-blue-100 text-blue-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colorMap[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (status) => {
    const textMap = {
      completed: 'Hoàn thành',
      pending: 'Chờ xử lý',
      shipping: 'Đang giao',
      cancelled: 'Đã hủy',
    };
    return textMap[status] || status;
  };

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
        <h1 className='text-2xl font-semibold text-gray-900 mb-2'>
          Bảng điều khiển Admin
        </h1>
        <p className='text-gray-600'>
          Chào mừng bạn quay lại! Đây là tổng quan về hệ thống.
        </p>
      </div>

      {/* Stats Cards */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm font-medium text-gray-600'>Tổng sản phẩm</p>
              <p className='text-3xl font-semibold text-gray-900'>
                {stats.totalProducts}
              </p>
            </div>
            <div className='w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center'>
              <i className='fas fa-box text-blue-600'></i>
            </div>
          </div>
          <Link
            to='/admin/products'
            className='inline-flex items-center text-sm text-blue-600 hover:text-blue-700 mt-4'
          >
            Xem chi tiết <i className='fas fa-arrow-right ml-1'></i>
          </Link>
        </div>

        <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm font-medium text-gray-600'>Tổng đơn hàng</p>
              <p className='text-3xl font-semibold text-gray-900'>
                {stats.totalOrders}
              </p>
            </div>
            <div className='w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center'>
              <i className='fas fa-shopping-cart text-green-600'></i>
            </div>
          </div>
          <Link
            to='/admin/orders'
            className='inline-flex items-center text-sm text-blue-600 hover:text-blue-700 mt-4'
          >
            Xem chi tiết <i className='fas fa-arrow-right ml-1'></i>
          </Link>
        </div>

        <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm font-medium text-gray-600'>
                Tổng người dùng
              </p>
              <p className='text-3xl font-semibold text-gray-900'>
                {stats.totalUsers}
              </p>
            </div>
            <div className='w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center'>
              <i className='fas fa-users text-purple-600'></i>
            </div>
          </div>
          <Link
            to='/admin/users'
            className='inline-flex items-center text-sm text-blue-600 hover:text-blue-700 mt-4'
          >
            Xem chi tiết <i className='fas fa-arrow-right ml-1'></i>
          </Link>
        </div>

        <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm font-medium text-gray-600'>
                Tổng doanh thu
              </p>
              <p className='text-3xl font-semibold text-gray-900'>
                {formatCurrency(stats.totalRevenue)}
              </p>
            </div>
            <div className='w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center'>
              <i className='fas fa-dollar-sign text-yellow-600'></i>
            </div>
          </div>
          <p className='text-sm text-gray-500 mt-4'>Tháng này</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
        <h2 className='text-lg font-semibold text-gray-900 mb-4'>
          Thao tác nhanh
        </h2>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
          <Link
            to='/admin/products/add'
            className='flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors'
          >
            <div className='w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3'>
              <i className='fas fa-plus text-blue-600'></i>
            </div>
            <span className='font-medium text-gray-900'>Thêm sản phẩm mới</span>
          </Link>

          <Link
            to='/admin/orders'
            className='flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors'
          >
            <div className='w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3'>
              <i className='fas fa-list text-green-600'></i>
            </div>
            <span className='font-medium text-gray-900'>Xem đơn hàng</span>
          </Link>

          <Link
            to='/admin/users'
            className='flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors'
          >
            <div className='w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3'>
              <i className='fas fa-user-plus text-purple-600'></i>
            </div>
            <span className='font-medium text-gray-900'>
              Quản lý người dùng
            </span>
          </Link>

          <Link
            to='/admin/reports'
            className='flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors'
          >
            <div className='w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center mr-3'>
              <i className='fas fa-chart-bar text-yellow-600'></i>
            </div>
            <span className='font-medium text-gray-900'>Báo cáo thống kê</span>
          </Link>
        </div>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {/* Recent Orders */}
        <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
          <h2 className='text-lg font-semibold text-gray-900 mb-4'>
            Đơn hàng gần đây
          </h2>
          <div className='space-y-4'>
            {stats.recentOrders.map((order) => (
              <div
                key={order.id}
                className='flex items-center justify-between p-4 border border-gray-100 rounded-lg'
              >
                <div>
                  <h4 className='font-medium text-gray-900'>#{order.id}</h4>
                  <p className='text-sm text-gray-600'>{order.customer}</p>
                </div>
                <div className='text-right'>
                  <p className='font-semibold text-gray-900'>
                    {formatCurrency(order.total)}
                  </p>
                  <span
                    className={`inline-block px-2 py-1 text-xs rounded-full ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {getStatusText(order.status)}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <Link
            to='/admin/orders'
            className='inline-flex items-center text-sm text-blue-600 hover:text-blue-700 mt-4'
          >
            Xem tất cả đơn hàng <i className='fas fa-arrow-right ml-1'></i>
          </Link>
        </div>

        {/* Low Stock Alert */}
        <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
          <h2 className='text-lg font-semibold text-gray-900 mb-4'>
            Cảnh báo tồn kho thấp
          </h2>
          <div className='space-y-4'>
            {stats.lowStockProducts.map((product) => (
              <div
                key={product.id}
                className='flex items-center justify-between p-4 border border-gray-100 rounded-lg'
              >
                <div>
                  <h4 className='font-medium text-gray-900'>{product.name}</h4>
                  <p className='text-sm text-red-600'>
                    Còn lại: {product.stock} sản phẩm
                  </p>
                </div>
                <Link
                  to={`/admin/products/${product.id}`}
                  className='px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors'
                >
                  Cập nhật
                </Link>
              </div>
            ))}
          </div>
          <Link
            to='/admin/products'
            className='inline-flex items-center text-sm text-blue-600 hover:text-blue-700 mt-4'
          >
            Xem tất cả sản phẩm <i className='fas fa-arrow-right ml-1'></i>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
