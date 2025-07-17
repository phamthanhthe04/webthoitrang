import React from 'react';
import { getImageUrl } from '../../../../utils/imageUtils';

const ProductTable = ({
  products,
  onViewImages,
  onEditProduct,
  onDeleteProduct,
}) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const getStatusColor = (status) => {
    return status === 'active'
      ? 'bg-green-100 text-green-800'
      : 'bg-red-100 text-red-800';
  };

  const getStockStatus = (stock) => {
    if (stock > 20) return { color: 'text-green-600', text: 'Còn hàng' };
    if (stock > 5) return { color: 'text-yellow-600', text: 'Sắp hết' };
    return { color: 'text-red-600', text: 'Hết hàng' };
  };

  return (
    <div className='bg-white rounded-lg shadow-sm border border-gray-200'>
      <div className='overflow-x-auto'>
        <table className='min-w-full divide-y divide-gray-200'>
          <thead className='bg-gray-50'>
            <tr>
              <th className='px-3 md:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-2/5'>
                Sản phẩm
              </th>
              <th className='px-3 md:px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell w-24'>
                Ảnh phụ
              </th>
              <th className='px-3 md:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell'>
                Danh mục
              </th>
              <th className='px-3 md:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Giá
              </th>
              <th className='px-3 md:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell'>
                Tồn kho
              </th>
              <th className='px-3 md:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell'>
                Trạng thái
              </th>
              <th className='px-3 md:px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className='bg-white divide-y divide-gray-200'>
            {products.map((product) => {
              const stockStatus = getStockStatus(product.stock);
              return (
                <tr key={product.id} className='hover:bg-gray-50'>
                  <td className='px-3 md:px-4 py-4'>
                    <div className='flex items-center space-x-3'>
                      <div className='flex-shrink-0 w-12 h-12'>
                        {product.image_url ? (
                          <img
                            src={getImageUrl(product.image_url)}
                            alt={product.name}
                            className='w-12 h-12 rounded-lg object-cover border border-gray-200'
                            onError={(e) => {
                              e.target.src = '/placeholder-image.png';
                              e.target.onerror = null;
                            }}
                          />
                        ) : (
                          <div className='w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200'>
                            <i className='fas fa-image text-gray-400'></i>
                          </div>
                        )}
                      </div>
                      <div className='min-w-0 flex-1'>
                        <p className='text-sm font-medium text-gray-900 truncate'>
                          {product.name}
                        </p>
                        <p className='text-sm text-gray-500 truncate'>
                          SKU: {product.sku || 'N/A'}
                        </p>
                        <div className='block md:hidden text-xs text-gray-500 mt-1'>
                          <span className='inline-block mr-2'>
                            {product.Category?.name || 'Chưa phân loại'}
                          </span>
                          <span
                            className={`inline-block px-2 py-1 text-xs rounded-full ${getStatusColor(
                              product.status
                            )}`}
                          >
                            {product.status === 'active'
                              ? 'Hoạt động'
                              : 'Không hoạt động'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className='px-3 md:px-4 py-4 text-center hidden md:table-cell'>
                    <button
                      onClick={() => onViewImages(product)}
                      className='inline-flex items-center px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors'
                    >
                      <i className='fas fa-images mr-1'></i>
                      {product.images ? product.images.length : 0}
                    </button>
                  </td>

                  <td className='px-3 md:px-4 py-4 hidden md:table-cell'>
                    <span className='text-sm text-gray-900'>
                      {product.Category?.name || 'Chưa phân loại'}
                    </span>
                  </td>

                  <td className='px-3 md:px-4 py-4'>
                    <div className='text-sm'>
                      <div className='font-medium text-gray-900'>
                        {formatCurrency(product.price)}
                      </div>
                      {product.sale_price && product.sale_price > 0 && (
                        <div className='text-red-600 font-semibold'>
                          {formatCurrency(product.sale_price)}
                        </div>
                      )}
                    </div>
                  </td>

                  <td className='px-3 md:px-4 py-4 hidden lg:table-cell'>
                    <div className='flex items-center space-x-2'>
                      <span className='text-sm font-medium text-gray-900'>
                        {product.stock}
                      </span>
                      <span className={`text-xs ${stockStatus.color}`}>
                        {stockStatus.text}
                      </span>
                    </div>
                  </td>

                  <td className='px-3 md:px-4 py-4 hidden sm:table-cell'>
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                        product.status
                      )}`}
                    >
                      {product.status === 'active'
                        ? 'Hoạt động'
                        : 'Không hoạt động'}
                    </span>
                  </td>

                  <td className='px-3 md:px-4 py-4 text-right'>
                    <div className='flex items-center justify-end space-x-2'>
                      <button
                        onClick={() => onViewImages(product)}
                        className='p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors md:hidden'
                        title='Xem ảnh'
                      >
                        <i className='fas fa-images'></i>
                      </button>
                      <button
                        onClick={() => onEditProduct(product)}
                        className='p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors'
                        title='Chỉnh sửa'
                      >
                        <i className='fas fa-edit'></i>
                      </button>
                      <button
                        onClick={() => onDeleteProduct(product)}
                        className='p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors'
                        title='Xóa'
                      >
                        <i className='fas fa-trash'></i>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductTable;
