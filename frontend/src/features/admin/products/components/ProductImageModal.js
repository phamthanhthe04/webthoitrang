import React from 'react';
import { getImageUrl } from '../../../../utils/imageUtils';

const ProductImageModal = ({ show, onClose, product }) => {
  if (!show || !product) return null;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  return (
    <div className='fixed inset-0 z-50 overflow-y-auto'>
      <div className='flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center'>
        <div className='fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity'></div>

        <div className='inline-block bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-5xl sm:w-full'>
          <div className='bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4'>
            <div className='flex items-center justify-between mb-4'>
              <h3 className='text-lg font-medium text-gray-900'>
                Gallery ảnh - {product.name}
              </h3>
              <button
                onClick={onClose}
                className='text-gray-400 hover:text-gray-600'
              >
                <i className='fas fa-times'></i>
              </button>
            </div>

            {/* Ảnh chính */}
            <div className='mb-6'>
              <h4 className='text-sm font-medium text-gray-700 flex items-center mb-2'>
                <i className='fas fa-star text-blue-500 mr-2'></i>
                Ảnh chính
              </h4>
              <div className='flex justify-center bg-gray-100 rounded-lg overflow-hidden'>
                {product.image_url ? (
                  <img
                    src={getImageUrl(product.image_url)}
                    alt={product.name}
                    className='h-72 object-contain rounded-lg'
                    onError={(e) => {
                      e.target.src = '/placeholder-image.png';
                      e.target.onerror = null;
                    }}
                  />
                ) : (
                  <div className='w-full h-72 bg-gray-200 flex items-center justify-center rounded-lg'>
                    <i className='fas fa-image text-gray-400 text-4xl'></i>
                  </div>
                )}
              </div>
            </div>

            {/* Ảnh phụ */}
            <div>
              <h4 className='text-sm font-medium text-gray-700 flex items-center mb-2'>
                <i className='fas fa-images text-green-500 mr-2'></i>
                Ảnh phụ ({product.images ? product.images.length : 0})
              </h4>

              {product.images && product.images.length > 0 ? (
                <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3'>
                  {product.images.map((imageUrl, index) => (
                    <div
                      key={index}
                      className='relative group bg-gray-100 rounded-lg p-1 border border-gray-200'
                    >
                      <div className='aspect-w-1 aspect-h-1'>
                        <img
                          src={getImageUrl(imageUrl)}
                          alt={`${product.name} - ảnh ${index + 1}`}
                          className='w-full h-32 object-contain rounded'
                          onError={(e) => {
                            e.target.src = '/placeholder-image.png';
                            e.target.onerror = null;
                          }}
                        />
                      </div>
                      <div className='absolute bottom-1 left-1 bg-black bg-opacity-50 text-white text-xs px-1.5 py-0.5 rounded'>
                        {index + 1}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className='h-24 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center'>
                  <div className='text-center'>
                    <i className='fas fa-images text-gray-400 text-2xl mb-2'></i>
                    <p className='text-sm text-gray-500'>Chưa có ảnh phụ</p>
                  </div>
                </div>
              )}
            </div>

            {/* Thông tin sản phẩm */}
            <div className='mt-6 pt-4 border-t border-gray-200'>
              <div className='grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm'>
                <div>
                  <span className='text-gray-500'>Danh mục:</span>
                  <span className='ml-2 text-gray-900'>
                    {product.Category?.name || 'Chưa phân loại'}
                  </span>
                </div>
                <div>
                  <span className='text-gray-500'>Giá:</span>
                  <span className='ml-2 text-gray-900'>
                    {formatCurrency(product.price)}
                  </span>
                </div>
                <div>
                  <span className='text-gray-500'>Tồn kho:</span>
                  <span className='ml-2 text-gray-900'>
                    {product.stock} sản phẩm
                  </span>
                </div>
                <div>
                  <span className='text-gray-500'>Tổng ảnh:</span>
                  <span className='ml-2 text-gray-900'>
                    {1 + (product.images ? product.images.length : 0)} ảnh
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className='bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse'>
            <button
              onClick={onClose}
              className='w-full inline-flex justify-center rounded-lg border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:w-auto sm:text-sm'
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductImageModal;
