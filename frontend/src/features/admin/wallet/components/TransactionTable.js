import React from 'react';
import { AdminTable } from '../../shared/components';

/**
 * Component hiển thị bảng lịch sử giao dịch
 * @param {Array} transactions - Danh sách giao dịch
 */
const TransactionTable = ({ transactions }) => {
  const headers = [
    { title: 'Mã GD', align: 'left' },
    { title: 'Người dùng', align: 'left' },
    { title: 'Loại', align: 'center' },
    { title: 'Số tiền', align: 'right' },
    { title: 'Mô tả', align: 'left' },
    { title: 'Ngày GD', align: 'left' },
  ];

  /**
   * Hàm lấy class CSS cho loại giao dịch
   * @param {string} type - Loại giao dịch
   */
  const getTypeClass = (type) => {
    const typeClasses = {
      deposit: 'bg-green-100 text-green-800',
      withdraw: 'bg-red-100 text-red-800',
      purchase: 'bg-blue-100 text-blue-800',
      refund: 'bg-yellow-100 text-yellow-800',
    };
    return typeClasses[type] || 'bg-gray-100 text-gray-800';
  };

  /**
   * Hàm lấy text hiển thị cho loại giao dịch
   * @param {string} type - Loại giao dịch
   */
  const getTypeText = (type) => {
    const typeTexts = {
      deposit: 'Nạp tiền',
      withdraw: 'Rút tiền',
      purchase: 'Mua hàng',
      refund: 'Hoàn tiền',
    };
    return typeTexts[type] || type;
  };

  /**
   * Hàm render từng dòng giao dịch
   */
  const renderRow = (transaction, index) => (
    <>
      <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
        #{transaction.id}
      </td>
      <td className='px-6 py-4 whitespace-nowrap'>
        <div className='text-sm font-medium text-gray-900'>
          {transaction.User?.name || 'N/A'}
        </div>
        <div className='text-sm text-gray-500'>
          {transaction.User?.email || ''}
        </div>
      </td>
      <td className='px-6 py-4 whitespace-nowrap text-center'>
        <span
          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeClass(
            transaction.type
          )}`}
        >
          {getTypeText(transaction.type)}
        </span>
      </td>
      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right font-medium'>
        <span
          className={`${
            transaction.type === 'deposit' || transaction.type === 'refund'
              ? 'text-green-600'
              : 'text-red-600'
          }`}
        >
          {transaction.type === 'deposit' || transaction.type === 'refund'
            ? '+'
            : '-'}
          {parseInt(transaction.amount || 0).toLocaleString('vi-VN')} ₫
        </span>
      </td>
      <td className='px-6 py-4 text-sm text-gray-500'>
        <div className='max-w-xs truncate'>
          {transaction.description || 'Không có mô tả'}
        </div>
      </td>
      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
        {new Date(transaction.created_at).toLocaleDateString('vi-VN')}
      </td>
    </>
  );

  return (
    <AdminTable
      headers={headers}
      data={transactions}
      renderRow={renderRow}
      emptyMessage='Không có giao dịch nào'
    />
  );
};

export default TransactionTable;
