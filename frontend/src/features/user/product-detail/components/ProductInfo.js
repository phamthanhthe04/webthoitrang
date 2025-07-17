import React from 'react';
import WishlistIcon from '../../../../components/Wishlist/WishlistIcon';

/**
 * Component thông tin chi tiết sản phẩm
 * Bao gồm tên, giá, mô tả, tags
 */
const ProductInfo = ({ product, tags }) => {
  return (
    <div className='space-y-6'>
      {/* Tên sản phẩm và wishlist */}
      <div className='flex justify-between items-start'>
        <h1 className='text-3xl font-bold text-gray-900 leading-tight'>
          {product.name}
        </h1>
        <WishlistIcon productId={product.id} />
      </div>

      {/* Giá sản phẩm */}
      <div className='space-y-2'>
        {product.originalPrice && product.originalPrice > product.price && (
          <div className='flex items-center space-x-2'>
            <span className='text-lg text-gray-500 line-through'>
              {Number(product.originalPrice).toLocaleString('vi-VN')} đ
            </span>
            <span className='px-2 py-1 bg-red-100 text-red-600 text-sm font-medium rounded'>
              -
              {Math.round(
                ((product.originalPrice - product.price) /
                  product.originalPrice) *
                  100
              )}
              %
            </span>
          </div>
        )}

        <div className='text-3xl font-bold text-primary-600'>
          {Number(product.price).toLocaleString('vi-VN')} đ
        </div>
      </div>

      {/* Thông tin tồn kho */}
      <div className='flex items-center space-x-4 text-sm'>
        <div className='flex items-center'>
          <i className='fas fa-box mr-2 text-gray-400'></i>
          <span className='text-gray-600'>
            Tồn kho: <span className='font-medium'>{product.stock || 0}</span>
          </span>
        </div>

        {product.stock > 0 ? (
          <span className='flex items-center text-green-600'>
            <i className='fas fa-check-circle mr-1'></i>
            Còn hàng
          </span>
        ) : (
          <span className='flex items-center text-red-600'>
            <i className='fas fa-times-circle mr-1'></i>
            Hết hàng
          </span>
        )}
      </div>

      {/* Mô tả sản phẩm */}
      {product.description && (
        <div>
          <h3 className='text-lg font-semibold text-gray-900 mb-3'>
            Mô tả sản phẩm
          </h3>
          <div className='prose prose-sm text-gray-600 max-w-none'>
            <p className='whitespace-pre-line'>{product.description}</p>
          </div>
        </div>
      )}

      {/* Tags */}
      {tags.length > 0 && (
        <div>
          <h3 className='text-lg font-semibold text-gray-900 mb-3'>Từ khóa</h3>
          <div className='flex flex-wrap gap-2'>
            {tags.map((tag, index) => (
              <span
                key={index}
                className='px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full'
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Danh mục */}
      {product.category && (
        <div>
          <h3 className='text-lg font-semibold text-gray-900 mb-2'>Danh mục</h3>
          <span className='inline-flex items-center px-3 py-1 bg-primary-100 text-primary-700 text-sm font-medium rounded-full'>
            <i className='fas fa-tag mr-2'></i>
            {product.category.name}
          </span>
        </div>
      )}
    </div>
  );
};

export default ProductInfo;
