import React from 'react';
import CategoryFilterSelect from '../../../../components/Admin/CategoryFilterSelect';

const ProductFilters = ({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
}) => {
  return (
    <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6'>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Tìm kiếm
          </label>
          <div className='relative'>
            <i className='fas fa-search absolute left-3 top-3 text-gray-400'></i>
            <input
              type='text'
              placeholder='Tìm theo tên sản phẩm...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
            />
          </div>
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Danh mục
          </label>
          <CategoryFilterSelect
            value={selectedCategory}
            onChange={setSelectedCategory}
            placeholder='Tất cả danh mục'
          />
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Trạng thái
          </label>
          <select className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'>
            <option value='all'>Tất cả trạng thái</option>
            <option value='active'>Hoạt động</option>
            <option value='inactive'>Không hoạt động</option>
            <option value='out_of_stock'>Hết hàng</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default ProductFilters;
