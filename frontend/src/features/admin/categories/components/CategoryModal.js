import React from 'react';

const CategoryModal = ({
  show,
  onClose,
  title,
  onSubmit,
  uploading,
  isEdit = false,
  formData,
  handleInputChange,
  categories = [],
  editingCategory = null,
}) => {
  if (!show) return null;

  // Lọc danh mục có thể làm parent (không bao gồm chính nó và con của nó)
  const getAvailableParents = () => {
    if (!isEdit) {
      return categories.filter((cat) => cat.level < 3); // Chỉ cho phép cấp 1 và 2 làm parent
    }

    // Trong edit mode, loại bỏ chính nó và các danh mục con của nó
    return categories.filter((cat) => {
      if (cat.id === editingCategory?.id) return false; // Không thể chọn chính nó
      if (cat.parent_id === editingCategory?.id) return false; // Không thể chọn con của nó
      if (cat.level >= 3) return false; // Chỉ cho phép cấp 1 và 2 làm parent
      return true;
    });
  };

  const availableParents = getAvailableParents();

  return (
    <div className='fixed inset-0 z-50 overflow-y-auto'>
      <div className='flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center'>
        <div className='fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity'></div>

        <div className='inline-block bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full'>
          <div className='bg-white px-6 pt-6 pb-4'>
            <div className='flex items-center justify-between mb-6'>
              <h3 className='text-xl font-semibold text-gray-900'>{title}</h3>
              <button
                onClick={onClose}
                className='text-gray-400 hover:text-gray-600 text-xl'
              >
                <i className='fas fa-times'></i>
              </button>
            </div>

            <form onSubmit={onSubmit} className='space-y-4'>
              {/* Tên danh mục */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Tên danh mục <span className='text-red-500'>*</span>
                </label>
                <input
                  type='text'
                  name='name'
                  value={formData.name}
                  onChange={handleInputChange}
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                  placeholder='Nhập tên danh mục'
                  required
                />
              </div>

              {/* Mô tả */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Mô tả
                </label>
                <textarea
                  name='description'
                  value={formData.description}
                  onChange={handleInputChange}
                  rows='3'
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                  placeholder='Mô tả danh mục...'
                />
              </div>

              {/* Danh mục cha */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Danh mục cha
                </label>
                <select
                  name='parentId'
                  value={formData.parentId}
                  onChange={handleInputChange}
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                >
                  <option value=''>-- Danh mục gốc (Cấp 1) --</option>
                  {availableParents.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {'  '.repeat(cat.level - 1)} {cat.name} (Cấp {cat.level})
                    </option>
                  ))}
                </select>
                <p className='text-xs text-gray-500 mt-1'>
                  Để trống để tạo danh mục cấp 1. Chỉ có thể tạo tối đa 3 cấp.
                </p>
              </div>

              {/* URL ảnh */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  URL ảnh đại diện
                </label>
                <input
                  type='url'
                  name='image_url'
                  value={formData.image_url}
                  onChange={handleInputChange}
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                  placeholder='https://example.com/image.jpg'
                />
                {formData.image_url && (
                  <div className='mt-2'>
                    <img
                      src={formData.image_url}
                      alt='Preview'
                      className='w-16 h-16 rounded object-cover border border-gray-200'
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Thông tin cấp độ (readonly) */}
              {formData.parentId && (
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Cấp độ dự kiến
                  </label>
                  <div className='px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-600'>
                    {(() => {
                      const parent = categories.find(
                        (c) => c.id === parseInt(formData.parentId)
                      );
                      const level = parent ? parent.level + 1 : 1;
                      return `Cấp ${level}`;
                    })()}
                  </div>
                </div>
              )}
            </form>
          </div>

          <div className='bg-gray-50 px-6 py-4 flex flex-col sm:flex-row sm:justify-end space-y-2 sm:space-y-0 sm:space-x-3'>
            <button
              type='button'
              onClick={onClose}
              className='w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
            >
              Hủy
            </button>
            <button
              type='submit'
              disabled={uploading}
              onClick={onSubmit}
              className='w-full sm:w-auto px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {uploading ? (
                <>
                  <i className='fas fa-spinner fa-spin mr-2'></i>
                  {isEdit ? 'Đang cập nhật...' : 'Đang thêm...'}
                </>
              ) : isEdit ? (
                'Cập nhật danh mục'
              ) : (
                'Thêm danh mục'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryModal;
