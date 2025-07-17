import React, { useState } from 'react';
import { useWalletManagement } from './hooks/useWalletManagement';
import { WalletTable, TransactionTable, WalletFilters } from './components';
import { AdminPagination } from '../shared/components';

/**
 * Component chính quản lý ví điện tử admin
 * Sử dụng feature-based architecture với hooks và components tách biệt
 */
const AdminWalletManagement = () => {
  // State quản lý tab hiện tại
  const [activeTab, setActiveTab] = useState('wallets'); // 'wallets' hoặc 'transactions'

  // Custom hook quản lý logic nghiệp vụ
  const {
    loading,
    searchTerm,
    setSearchTerm,
    selectedType,
    setSelectedType,
    dateRange,
    setDateRange,
    filteredWallets,
    filteredTransactions,
    getTotalBalance,
    getTransactionStats,
    getAmountByType,
  } = useWalletManagement();

  // Tính toán thống kê
  const totalBalance = getTotalBalance();
  const transactionStats = getTransactionStats();

  // Loading state
  if (loading) {
    return (
      <div className='flex items-center justify-center h-64'>
        <div className='text-gray-600'>Đang tải dữ liệu ví...</div>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Header với thống kê */}
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <h1 className='text-2xl font-semibold text-gray-900'>
            Quản lý ví điện tử
          </h1>
          <p className='text-gray-600 mt-1'>
            Tổng số dư: {totalBalance.toLocaleString('vi-VN')} ₫
          </p>
        </div>
      </div>

      {/* Thống kê tổng quan */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
        <div className='bg-blue-50 p-4 rounded-lg border border-blue-200'>
          <div className='text-sm font-medium text-blue-800'>Tổng số ví</div>
          <div className='text-2xl font-bold text-blue-600'>
            {filteredWallets.length}
          </div>
        </div>
        <div className='bg-green-50 p-4 rounded-lg border border-green-200'>
          <div className='text-sm font-medium text-green-800'>Nạp tiền</div>
          <div className='text-2xl font-bold text-green-600'>
            {getAmountByType('deposit').toLocaleString('vi-VN')} ₫
          </div>
        </div>
        <div className='bg-red-50 p-4 rounded-lg border border-red-200'>
          <div className='text-sm font-medium text-red-800'>Rút tiền</div>
          <div className='text-2xl font-bold text-red-600'>
            {getAmountByType('withdraw').toLocaleString('vi-VN')} ₫
          </div>
        </div>
        <div className='bg-purple-50 p-4 rounded-lg border border-purple-200'>
          <div className='text-sm font-medium text-purple-800'>Tổng GD</div>
          <div className='text-2xl font-bold text-purple-600'>
            {transactionStats.total}
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className='border-b border-gray-200'>
        <nav className='-mb-px flex space-x-8'>
          <button
            onClick={() => setActiveTab('wallets')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'wallets'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Danh sách ví ({filteredWallets.length})
          </button>
          <button
            onClick={() => setActiveTab('transactions')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'transactions'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Lịch sử giao dịch ({filteredTransactions.length})
          </button>
        </nav>
      </div>

      {/* Filters */}
      <WalletFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedType={selectedType}
        setSelectedType={setSelectedType}
        dateRange={dateRange}
        setDateRange={setDateRange}
      />

      {/* Tab Content */}
      {activeTab === 'wallets' ? (
        <>
          {/* Wallets Table */}
          <WalletTable wallets={filteredWallets} />

          {/* Pagination */}
          <AdminPagination
            currentPage={1}
            totalPages={1}
            totalItems={filteredWallets.length}
            itemsPerPage={filteredWallets.length}
          />
        </>
      ) : (
        <>
          {/* Transactions Table */}
          <TransactionTable transactions={filteredTransactions} />

          {/* Pagination */}
          <AdminPagination
            currentPage={1}
            totalPages={1}
            totalItems={filteredTransactions.length}
            itemsPerPage={filteredTransactions.length}
          />
        </>
      )}
    </div>
  );
};

export default AdminWalletManagement;
