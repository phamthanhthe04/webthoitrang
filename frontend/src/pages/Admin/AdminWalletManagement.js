import React, { useState, useEffect } from 'react';
import {
  getAllWallets,
  getAllTransactions,
} from '../../services/walletService';

const AdminWalletManagement = () => {
  const [wallets, setWallets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState({
    totalWallets: 0,
    totalBalance: 0,
    todayTransactions: 0,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      // Load wallets and transactions in parallel
      const [walletsResponse, transactionsResponse] = await Promise.all([
        getAllWallets(),
        getAllTransactions({ limit: 10 }),
      ]);

      if (walletsResponse.data && walletsResponse.data.success) {
        const walletData = walletsResponse.data.data.wallets || [];
        setWallets(walletData);

        // Calculate stats
        const totalBalance = walletData.reduce(
          (sum, wallet) => sum + parseFloat(wallet.balance || 0),
          0
        );
        setStats((prev) => ({
          ...prev,
          totalWallets: walletData.length,
          totalBalance: totalBalance,
        }));
      }

      if (transactionsResponse.data && transactionsResponse.data.success) {
        const transactionData =
          transactionsResponse.data.data.transactions || [];
        setTransactions(transactionData);

        // Count today's transactions
        const today = new Date().toDateString();
        const todayCount = transactionData.filter(
          (t) => new Date(t.created_at).toDateString() === today
        ).length;

        setStats((prev) => ({
          ...prev,
          todayTransactions: todayCount,
        }));
      }
    } catch (error) {
      console.error('Error loading wallet data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('vi-VN');
  };

  if (loading) {
    return (
      <div className='flex justify-center items-center h-64'>
        <div className='text-lg'>Đang tải dữ liệu ví...</div>
      </div>
    );
  }

  return (
    <div className='bg-white rounded-lg shadow-md p-6'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl font-bold text-gray-800'>Quản lý Ví Tiền</h1>
      </div>

      {/* Statistics Cards */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-6'>
        <div className='bg-blue-50 p-4 rounded-lg'>
          <div className='flex items-center'>
            <div className='p-2 bg-blue-100 rounded-lg'>
              <i className='fas fa-wallet text-blue-600'></i>
            </div>
            <div className='ml-3'>
              <p className='text-sm font-medium text-gray-600'>Tổng số ví</p>
              <p className='text-lg font-semibold text-gray-900'>
                {stats.totalWallets}
              </p>
            </div>
          </div>
        </div>

        <div className='bg-green-50 p-4 rounded-lg'>
          <div className='flex items-center'>
            <div className='p-2 bg-green-100 rounded-lg'>
              <i className='fas fa-coins text-green-600'></i>
            </div>
            <div className='ml-3'>
              <p className='text-sm font-medium text-gray-600'>Tổng số dư</p>
              <p className='text-lg font-semibold text-gray-900'>
                {formatCurrency(stats.totalBalance)}
              </p>
            </div>
          </div>
        </div>

        <div className='bg-yellow-50 p-4 rounded-lg'>
          <div className='flex items-center'>
            <div className='p-2 bg-yellow-100 rounded-lg'>
              <i className='fas fa-exchange-alt text-yellow-600'></i>
            </div>
            <div className='ml-3'>
              <p className='text-sm font-medium text-gray-600'>
                Giao dịch hôm nay
              </p>
              <p className='text-lg font-semibold text-gray-900'>
                {stats.todayTransactions}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Wallet List */}
      <div className='mb-6'>
        <h2 className='text-xl font-semibold text-gray-800 mb-4'>
          Danh sách ví
        </h2>
        <div className='overflow-x-auto'>
          <table className='min-w-full divide-y divide-gray-200'>
            <thead className='bg-gray-50'>
              <tr>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Người dùng
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Số dư
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Trạng thái
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Cập nhật cuối
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-gray-200'>
              {wallets.length > 0 ? (
                wallets.map((wallet) => (
                  <tr key={wallet.id}>
                    <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                      {wallet.User?.name || wallet.User?.email || 'N/A'}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                      {formatCurrency(wallet.balance)}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          wallet.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {wallet.status === 'active' ? 'Hoạt động' : 'Tạm khóa'}
                      </span>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                      {formatDate(wallet.updated_at)}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                      <button className='text-blue-600 hover:text-blue-900 mr-4'>
                        Xem chi tiết
                      </button>
                      <button className='text-red-600 hover:text-red-900'>
                        {wallet.status === 'active' ? 'Khóa' : 'Mở khóa'}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan='5'
                    className='px-6 py-4 text-center text-gray-500'
                  >
                    Chưa có dữ liệu ví
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Transactions */}
      <div>
        <h2 className='text-xl font-semibold text-gray-800 mb-4'>
          Giao dịch gần đây
        </h2>
        <div className='overflow-x-auto'>
          <table className='min-w-full divide-y divide-gray-200'>
            <thead className='bg-gray-50'>
              <tr>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Mã giao dịch
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Người dùng
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Loại giao dịch
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Số tiền
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Thời gian
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Trạng thái
                </th>
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-gray-200'>
              {transactions.length > 0 ? (
                transactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                      #{transaction.id.slice(0, 8)}...
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                      {transaction.Wallet?.User?.name ||
                        transaction.Wallet?.User?.email ||
                        'N/A'}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                      {transaction.type === 'deposit'
                        ? 'Nạp tiền'
                        : transaction.type === 'withdraw'
                        ? 'Rút tiền'
                        : transaction.type === 'payment'
                        ? 'Thanh toán'
                        : 'Khác'}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                      <span
                        className={
                          transaction.type === 'deposit'
                            ? 'text-green-600'
                            : 'text-red-600'
                        }
                      >
                        {transaction.type === 'deposit' ? '+' : '-'}
                        {formatCurrency(transaction.amount)}
                      </span>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                      {formatDate(transaction.created_at)}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          transaction.status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : transaction.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {transaction.status === 'completed'
                          ? 'Thành công'
                          : transaction.status === 'pending'
                          ? 'Đang xử lý'
                          : 'Thất bại'}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan='6'
                    className='px-6 py-4 text-center text-gray-500'
                  >
                    Chưa có giao dịch nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminWalletManagement;
