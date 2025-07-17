import React from 'react';

/**
 * Component bảng dữ liệu tái sử dụng cho admin
 * @param {Array} headers - Mảng các tiêu đề cột với thuộc tính title và align
 * @param {Array} data - Mảng dữ liệu để hiển thị
 * @param {Function} renderRow - Hàm render từng dòng dữ liệu
 * @param {boolean} loading - Trạng thái đang tải dữ liệu
 * @param {string} emptyMessage - Thông báo khi không có dữ liệu
 * @param {string} className - CSS class bổ sung
 */
const AdminTable = ({
  headers,
  data,
  renderRow,
  loading = false,
  emptyMessage = 'Không có dữ liệu',
  className = '',
}) => {
  // Hiển thị trạng thái loading khi đang tải dữ liệu
  if (loading) {
    return (
      <div className='bg-white rounded-lg shadow-md overflow-hidden'>
        <div className='flex items-center justify-center h-64'>
          <div className='text-gray-600'>Đang tải dữ liệu...</div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`bg-white rounded-lg shadow-md overflow-hidden ${className}`}
    >
      {/* Container với thanh cuộn ngang cho bảng responsive */}
      <div className='overflow-x-auto'>
        <table className='min-w-full divide-y divide-gray-200'>
          {/* Header của bảng với background xám nhạt */}
          <thead className='bg-gray-50'>
            <tr>
              {headers.map((header, index) => (
                <th
                  key={index}
                  className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${
                    // Điều chỉnh alignment text dựa trên thuộc tính align của header
                    header.align === 'right'
                      ? 'text-right'
                      : header.align === 'center'
                      ? 'text-center'
                      : 'text-left'
                  }`}
                >
                  {header.title}
                </th>
              ))}
            </tr>
          </thead>
          {/* Body của bảng với các dòng dữ liệu */}
          <tbody className='bg-white divide-y divide-gray-200'>
            {data.length === 0 ? (
              // Hiển thị thông báo khi không có dữ liệu
              <tr>
                <td
                  colSpan={headers.length} // Span qua tất cả các cột
                  className='px-6 py-12 text-center text-gray-500'
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              // Render từng dòng dữ liệu với hover effect
              data.map((item, index) => (
                <tr key={item.id || index} className='hover:bg-gray-50'>
                  {/* Gọi hàm renderRow để render nội dung cụ thể của từng dòng */}
                  {renderRow(item, index)}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminTable;
