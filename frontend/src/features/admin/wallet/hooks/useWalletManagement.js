import { useState, useEffect } from 'react';
import {
  getAllWallets,
  getAllTransactions,
} from '../../../../services/walletService';
import { toast } from 'react-toastify';

/**
 * Hook quản lý logic nghiệp vụ cho ví điện tử admin
 * Bao gồm: tải dữ liệu ví, lịch sử giao dịch, tìm kiếm, lọc theo loại giao dịch
 */
export const useWalletManagement = () => {
  // States quản lý dữ liệu và UI
  const [wallets, setWallets] = useState([]); // Danh sách ví người dùng
  const [transactions, setTransactions] = useState([]); // Lịch sử giao dịch
  const [loading, setLoading] = useState(true); // Trạng thái loading
  const [searchTerm, setSearchTerm] = useState(''); // Từ khóa tìm kiếm
  const [selectedType, setSelectedType] = useState('all'); // Loại giao dịch được chọn
  const [dateRange, setDateRange] = useState({ start: '', end: '' }); // Khoảng thời gian

  // Tải dữ liệu khi component mount
  useEffect(() => {
    loadWallets();
    loadTransactions();
  }, []);

  /**
   * Hàm tải danh sách ví từ API
   */
  const loadWallets = async () => {
    try {
      setLoading(true);
      const response = await getAllWallets();
      setWallets(response.data || []);
    } catch (error) {
      console.error('Error loading wallets:', error);
      toast.error('Không thể tải danh sách ví');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Hàm tải lịch sử giao dịch từ API
   */
  const loadTransactions = async () => {
    try {
      const response = await getAllTransactions();
      setTransactions(response.data || []);
    } catch (error) {
      console.error('Error loading transactions:', error);
      toast.error('Không thể tải lịch sử giao dịch');
    }
  };

  /**
   * Hàm lọc giao dịch dựa trên từ khóa tìm kiếm, loại giao dịch và khoảng thời gian
   */
  const filteredTransactions = transactions.filter((transaction) => {
    // Tìm kiếm theo mã giao dịch hoặc tên người dùng (case-insensitive)
    const matchesSearch =
      transaction.id.toString().includes(searchTerm) ||
      transaction.User?.name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      transaction.User?.email?.toLowerCase().includes(searchTerm.toLowerCase());

    // Lọc theo loại giao dịch
    const matchesType =
      selectedType === 'all' || transaction.type === selectedType;

    // Lọc theo khoảng thời gian
    let matchesDate = true;
    if (dateRange.start && dateRange.end) {
      const transactionDate = new Date(transaction.created_at);
      const startDate = new Date(dateRange.start);
      const endDate = new Date(dateRange.end);
      matchesDate = transactionDate >= startDate && transactionDate <= endDate;
    }

    return matchesSearch && matchesType && matchesDate;
  });

  /**
   * Hàm lọc ví dựa trên từ khóa tìm kiếm
   */
  const filteredWallets = wallets.filter((wallet) => {
    return (
      wallet.User?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wallet.User?.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  /**
   * Hàm tính tổng số dư ví
   */
  const getTotalBalance = () => {
    return filteredWallets.reduce(
      (total, wallet) => total + parseFloat(wallet.balance || 0),
      0
    );
  };

  /**
   * Hàm lấy thống kê giao dịch
   */
  const getTransactionStats = () => {
    const stats = {
      total: filteredTransactions.length,
      deposit: 0,
      withdraw: 0,
      purchase: 0,
      refund: 0,
    };

    filteredTransactions.forEach((transaction) => {
      if (stats.hasOwnProperty(transaction.type)) {
        stats[transaction.type]++;
      }
    });

    return stats;
  };

  /**
   * Hàm tính tổng tiền theo loại giao dịch
   */
  const getAmountByType = (type) => {
    return filteredTransactions
      .filter((transaction) => transaction.type === type)
      .reduce(
        (total, transaction) => total + parseFloat(transaction.amount || 0),
        0
      );
  };

  // Return các state và function cần thiết cho component
  return {
    wallets, // Danh sách ví
    setWallets, // Hàm cập nhật danh sách ví
    transactions, // Lịch sử giao dịch
    setTransactions, // Hàm cập nhật lịch sử giao dịch
    loading, // Trạng thái loading
    searchTerm, // Từ khóa tìm kiếm
    setSearchTerm, // Hàm cập nhật từ khóa tìm kiếm
    selectedType, // Loại giao dịch được chọn
    setSelectedType, // Hàm cập nhật loại giao dịch
    dateRange, // Khoảng thời gian
    setDateRange, // Hàm cập nhật khoảng thời gian
    filteredWallets, // Danh sách ví đã được lọc
    filteredTransactions, // Lịch sử giao dịch đã được lọc
    loadWallets, // Hàm tải lại danh sách ví
    loadTransactions, // Hàm tải lại lịch sử giao dịch
    getTotalBalance, // Hàm tính tổng số dư
    getTransactionStats, // Hàm lấy thống kê giao dịch
    getAmountByType, // Hàm tính tổng tiền theo loại
  };
};
