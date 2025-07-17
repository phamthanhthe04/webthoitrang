import React from 'react';
import { AdminTable } from '../../shared/components';

/**
 * Component hiển thị bảng danh sách ví người dùng
 * @param {Array} wallets - Danh sách ví
 */
const WalletTable = ({ wallets }) => {
  const headers = [
    { title: 'User ID', align: 'left' },
    { title: 'Người dùng', align: 'left' },
    { title: 'Số dư', align: 'right' },
    { title: 'Ngày tạo', align: 'left' },
    { title: 'Cập nhật', align: 'left' },
  ];

  /**
   * Hàm render từng dòng ví
   */
  const renderRow = (wallet, index) => (
    <>
      <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
        #{wallet.user_id}
      </td>
      <td className='px-6 py-4 whitespace-nowrap'>
        <div className='flex items-center'>
          <div className='h-10 w-10 flex-shrink-0'>
            <div className='h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center'>
              <i className='fas fa-wallet text-gray-600'></i>
            </div>
          </div>
          <div className='ml-4'>
            <div className='text-sm font-medium text-gray-900'>
              {wallet.User?.name || 'N/A'}
            </div>
            <div className='text-sm text-gray-500'>
              {wallet.User?.email || ''}
            </div>
          </div>
        </div>
      </td>
      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right font-medium'>
        <span
          className={`${
            parseFloat(wallet.balance) > 0 ? 'text-green-600' : 'text-gray-500'
          }`}
        >
          {parseInt(wallet.balance || 0).toLocaleString('vi-VN')} ₫
        </span>
      </td>
      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
        {new Date(wallet.created_at).toLocaleDateString('vi-VN')}
      </td>
      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
        {new Date(wallet.updated_at).toLocaleDateString('vi-VN')}
      </td>
    </>
  );

  return (
    <AdminTable
      headers={headers}
      data={wallets}
      renderRow={renderRow}
      emptyMessage='Không có ví nào'
    />
  );
};

export default WalletTable;
