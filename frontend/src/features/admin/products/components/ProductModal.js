import React from 'react';
import ProductFormFields from './ProductFormFields';

const ProductModal = ({
  show,
  onClose,
  title,
  onSubmit,
  uploading,
  isEdit = false,
  formProps,
  submitButtonText = 'Thêm sản phẩm',
}) => {
  if (!show) return null;

  return (
    <div className='fixed inset-0 z-50 overflow-y-auto'>
      <div className='flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center'>
        <div className='fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity'></div>

        <div className='inline-block bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full'>
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

            <form onSubmit={onSubmit} className='space-y-6'>
              <ProductFormFields isEdit={isEdit} {...formProps} />
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
                  {isEdit ? 'Đang cập nhật...' : 'Đang tải...'}
                </>
              ) : (
                submitButtonText
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
