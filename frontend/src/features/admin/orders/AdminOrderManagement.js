import React from 'react';
import { useOrderManagement, useOrderModal } from './hooks';
import {
  OrderFilters,
  OrderTable,
  OrderDetailModal,
  OrderStatusModal,
} from './components';

const AdminOrderManagement = () => {
  // Custom hooks
  const {
    loading,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    filteredOrders,
    statusCounts,
    updateOrderStatus,
  } = useOrderManagement();

  const {
    selectedOrder,
    setSelectedOrder,
    showDetailModal,
    showStatusModal,
    updatingStatus,
    setUpdatingStatus,
    selectedStatus,
    setSelectedStatus,
    openDetailModal,
    closeDetailModal,
    openStatusModal,
    closeStatusModal,
  } = useOrderModal();

  // Event handlers
  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      setUpdatingStatus(true);
      const updatedOrder = await updateOrderStatus(orderId, newStatus);
      setSelectedOrder(updatedOrder);
      closeStatusModal();
    } catch (error) {
      // Error already handled in hook
    } finally {
      setUpdatingStatus(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className='flex items-center justify-center h-64'>
        <div className='text-gray-600'>Đang tải danh sách đơn hàng...</div>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div>
        <h1 className='text-2xl font-semibold text-gray-900'>
          Quản lý đơn hàng
        </h1>
        <p className='text-gray-600 mt-1'>
          Tổng cộng {statusCounts.all} đơn hàng
        </p>
      </div>

      {/* Filters */}
      <OrderFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        statusCounts={statusCounts}
      />

      {/* Orders Table */}
      <OrderTable
        orders={filteredOrders}
        onViewDetail={openDetailModal}
        onUpdateStatus={openStatusModal}
      />

      {/* Order Detail Modal */}
      <OrderDetailModal
        show={showDetailModal}
        onClose={closeDetailModal}
        order={selectedOrder}
      />

      {/* Order Status Modal */}
      <OrderStatusModal
        show={showStatusModal}
        onClose={closeStatusModal}
        order={selectedOrder}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        onConfirm={handleUpdateStatus}
        loading={updatingStatus}
      />
    </div>
  );
};

export default AdminOrderManagement;
