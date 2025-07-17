import React from 'react';

/**
 * Component bộ lọc và tìm kiếm tái sử dụng cho admin
 * @param {string} searchTerm - Từ khóa tìm kiếm hiện tại
 * @param {Function} onSearchChange - Hàm xử lý khi thay đổi từ khóa tìm kiếm
 * @param {string} placeholder - Placeholder cho ô tìm kiếm
 * @param {ReactNode} additionalFilters - Các bộ lọc bổ sung (select, button, etc.)
 * @param {string} className - CSS class bổ sung
 */
const AdminFilters = ({
  searchTerm,
  onSearchChange,
  placeholder = 'Tìm kiếm...',
  additionalFilters = null,
  className = '',
}) => {
  return (
    <div className={`bg-white p-4 rounded-lg shadow-md ${className}`}>
      <div className='flex flex-col md:flex-row gap-4'>
        {/* Ô tìm kiếm với icon search */}
        <div className='flex-1'>
          <div className='relative'>
            {/* Icon search ở bên trái input */}
            <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
              <i className='fas fa-search text-gray-400'></i>
            </div>
            <input
              type='text'
              placeholder={placeholder}
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className='block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500'
            />
          </div>
        </div>

        {/* Các bộ lọc bổ sung (nếu có) */}
        {additionalFilters && (
          <div className='flex flex-wrap gap-4'>{additionalFilters}</div>
        )}
      </div>
    </div>
  );
};

export default AdminFilters;
