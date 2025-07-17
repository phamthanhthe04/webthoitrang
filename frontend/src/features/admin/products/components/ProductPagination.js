import React from 'react';

const ProductPagination = ({
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  itemsPerPage = 10,
}) => {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className='bg-white rounded-lg shadow-sm border border-gray-200 px-4 md:px-6 py-3'>
      <div className='flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0'>
        <div className='text-sm text-gray-700 text-center sm:text-left'>
          Hiển thị{' '}
          <span className='font-medium'>
            {startItem}-{endItem}
          </span>{' '}
          của <span className='font-medium'>{totalItems}</span> sản phẩm
        </div>
        <div className='flex items-center justify-center space-x-2'>
          <button
            className='px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
            disabled={currentPage <= 1}
          >
            Trước
          </button>
          <button className='px-3 py-2 text-sm bg-blue-600 text-white rounded-lg'>
            {currentPage}
          </button>
          <button
            className='px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
            disabled={currentPage >= totalPages}
          >
            Sau
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductPagination;
