import { useState } from 'react';

export const useOrderModal = () => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');

  const openDetailModal = (order) => {
    setSelectedOrder(order);
    setShowDetailModal(true);
  };

  const closeDetailModal = () => {
    setShowDetailModal(false);
    setSelectedOrder(null);
  };

  const openStatusModal = (order) => {
    setSelectedOrder(order);
    setSelectedStatus(order.order_status);
    setShowStatusModal(true);
  };

  const closeStatusModal = () => {
    setShowStatusModal(false);
    setSelectedOrder(null);
    setSelectedStatus('');
  };

  return {
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
  };
};
