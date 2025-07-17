import React from 'react';

/**
 * Component phân trang thông minh với khả năng hiển thị page numbers linh hoạt
 * @param {number} currentPage - Trang hiện tại (bắt đầu từ 1)
 * @param {number} totalPages - Tổng số trang
 * @param {number} totalItems - Tổng số item
 * @param {number} itemsPerPage - Số item trên mỗi trang
 * @param {Function} onPageChange - Hàm xử lý khi thay đổi trang
 * @param {boolean} showInfo - Hiển thị thông tin số item hay không
 */
const AdminPagination = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  showInfo = true,
}) => {
  // Tính toán item đầu và cuối của trang hiện tại
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  /**
   * Hàm tạo mảng số trang để hiển thị với logic thông minh:
   * - Nếu tổng trang <= 5: hiển thị tất cả
   * - Nếu trang hiện tại ở đầu: [1,2,3,4,...,last]
   * - Nếu trang hiện tại ở cuối: [1,...,n-3,n-2,n-1,n]
   * - Nếu trang hiện tại ở giữa: [1,...,current-1,current,current+1,...,last]
   */
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      // Hiển thị tất cả trang nếu số trang ít
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        // Trang hiện tại ở đầu
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Trang hiện tại ở cuối
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Trang hiện tại ở giữa
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  // Không hiển thị pagination nếu chỉ có 1 trang
  if (totalPages <= 1) return null;

  return (
    <div className='flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0'>
      {/* Thông tin số item hiển thị */}
      {showInfo && (
        <div className='text-sm text-gray-700'>
          Hiển thị {startItem} - {endItem} trong tổng số {totalItems} kết quả
        </div>
      )}

      {/* Container các button pagination */}
      <div className='flex items-center space-x-2'>
        {/* Button Previous */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-3 py-1 text-sm rounded-md ${
            currentPage === 1
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          <i className='fas fa-chevron-left'></i>
        </button>

        {/* Các button số trang */}
        {getPageNumbers().map((page, index) => (
          <button
            key={index}
            onClick={() => typeof page === 'number' && onPageChange(page)}
            disabled={page === '...'} // Disable button dấu ba chấm
            className={`px-3 py-1 text-sm rounded-md ${
              page === currentPage
                ? 'bg-blue-600 text-white' // Trang hiện tại
                : page === '...'
                ? 'bg-white text-gray-400 cursor-default' // Dấu ba chấm
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50' // Trang khác
            }`}
          >
            {page}
          </button>
        ))}

        {/* Button Next */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-3 py-1 text-sm rounded-md ${
            currentPage === totalPages
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          <i className='fas fa-chevron-right'></i>
        </button>
      </div>
    </div>
  );
};

export default AdminPagination;
