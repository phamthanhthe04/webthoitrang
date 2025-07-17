import { useState, useEffect, useCallback } from 'react';
import { orderService } from '../../../../services/orderService';
import { toast } from 'react-toastify';

export const useOrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Fetch orders
  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const response = await orderService.getAllOrders();
      const ordersData = response.data || response || [];
      setOrders(ordersData);
      console.log(`👥 [ORDERS] Found ${ordersData.length} orders`);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Không thể tải danh sách đơn hàng');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      (order.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.user_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.id?.toString().includes(searchTerm)) ??
      false;

    const matchesStatus =
      statusFilter === 'all' || order.order_status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Status counts
  const statusCounts = {
    all: orders.length,
    pending: orders.filter((o) => o.order_status === 'pending').length,
    confirmed: orders.filter((o) => o.order_status === 'confirmed').length,
    shipped: orders.filter((o) => o.order_status === 'shipped').length,
    delivered: orders.filter((o) => o.order_status === 'delivered').length,
    cancelled: orders.filter((o) => o.order_status === 'cancelled').length,
  };

  // Update order status
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await orderService.updateOrderStatus(orderId, newStatus);

      // Update local state
      const updatedOrders = orders.map((order) => {
        if (order.id === orderId) {
          return { ...order, order_status: newStatus };
        }
        return order;
      });

      setOrders(updatedOrders);
      toast.success('Cập nhật trạng thái đơn hàng thành công');

      return updatedOrders.find((order) => order.id === orderId);
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Có lỗi xảy ra khi cập nhật trạng thái đơn hàng');
      throw error;
    }
  };

  return {
    orders,
    setOrders,
    loading,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    filteredOrders,
    statusCounts,
    updateOrderStatus,
    fetchOrders,
  };
};
