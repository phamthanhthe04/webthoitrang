import React from 'react';

const CategoryTable = ({
  categories,
  onEditCategory,
  onDeleteCategory,
  getCategoryPath,
}) => {
  // Hàm hiển thị cấp độ danh mục
  const renderCategoryLevel = (category) => {
    const path = getCategoryPath(category);
    return path.map((cat, index) => (
      <span key={cat.id}>
        {index > 0 && ' > '}
        <span
          className={
            index === path.length - 1 ? 'font-medium' : 'text-gray-500'
          }
        >
          {cat.name}
        </span>
      </span>
    ));
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 1:
        return 'bg-blue-100 text-blue-800';
      case 2:
        return 'bg-green-100 text-green-800';
      case 3:
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className='bg-white rounded-lg shadow-sm border border-gray-200'>
      <div className='overflow-x-auto'>
        <table className='min-w-full divide-y divide-gray-200'>
          <thead className='bg-gray-50'>
            <tr>
              <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                ID
              </th>
              <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Tên danh mục
              </th>
              <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Đường dẫn
              </th>
              <th className='px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Cấp độ
              </th>
              <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Mô tả
              </th>
              <th className='px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Số sản phẩm
              </th>
              <th className='px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className='bg-white divide-y divide-gray-200'>
            {categories.map((category) => (
              <tr key={category.id} className='hover:bg-gray-50'>
                <td className='px-4 py-4 whitespace-nowrap text-sm text-gray-900'>
                  #{category.id}
                </td>
                <td className='px-4 py-4 whitespace-nowrap'>
                  <div className='flex items-center'>
                    {category.image_url && (
                      <img
                        src={category.image_url}
                        alt={category.name}
                        className='w-8 h-8 rounded object-cover mr-3'
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    )}
                    <div>
                      <div className='text-sm font-medium text-gray-900'>
                        {category.name}
                      </div>
                      {category.parent_id && (
                        <div className='text-xs text-gray-500'>
                          Danh mục con
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td className='px-4 py-4 text-sm text-gray-900'>
                  <div className='max-w-xs truncate'>
                    {renderCategoryLevel(category)}
                  </div>
                </td>
                <td className='px-4 py-4 whitespace-nowrap text-center'>
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getLevelColor(
                      category.level
                    )}`}
                  >
                    Cấp {category.level}
                  </span>
                </td>
                <td className='px-4 py-4 text-sm text-gray-900'>
                  <div className='max-w-xs truncate'>
                    {category.description || 'Không có mô tả'}
                  </div>
                </td>
                <td className='px-4 py-4 whitespace-nowrap text-center text-sm text-gray-900'>
                  <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800'>
                    {category.productCount || 0}
                  </span>
                </td>
                <td className='px-4 py-4 whitespace-nowrap text-right text-sm font-medium'>
                  <div className='flex items-center justify-end space-x-2'>
                    <button
                      onClick={() => onEditCategory(category)}
                      className='p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors'
                      title='Chỉnh sửa'
                    >
                      <i className='fas fa-edit'></i>
                    </button>
                    <button
                      onClick={() => onDeleteCategory(category)}
                      className='p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors'
                      title='Xóa'
                    >
                      <i className='fas fa-trash'></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CategoryTable;
