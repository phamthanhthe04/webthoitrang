import React from 'react';

/**
 * Component các nút hành động cho sản phẩm
 * Bao gồm thêm vào giỏ hàng và mua ngay
 */
const ProductActions = ({ product, addingToCart, onAddToCart, onBuyNow }) => {
  const isOutOfStock = !product.stock || product.stock === 0;

  if (isOutOfStock) {
    return (
      <div className='space-y-4'>
        <button
          disabled
          className='w-full py-3 px-6 bg-gray-300 text-gray-500 rounded-lg font-medium cursor-not-allowed'
        >
          <i className='fas fa-times-circle mr-2'></i>
          Hết hàng
        </button>

        <div className='text-center text-sm text-gray-600'>
          <p>Sản phẩm hiện tại đã hết hàng</p>
          <p>Vui lòng quay lại sau hoặc chọn sản phẩm khác</p>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-4'>
      {/* Nút thêm vào giỏ hàng */}
      <button
        onClick={onAddToCart}
        disabled={addingToCart}
        className='w-full py-3 px-6 border-2 border-primary-600 text-primary-600 rounded-lg font-medium hover:bg-primary-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
      >
        {addingToCart ? (
          <div className='flex items-center justify-center'>
            <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-primary-600 mr-2'></div>
            Đang thêm...
          </div>
        ) : (
          <>
            <i className='fas fa-cart-plus mr-2'></i>
            Thêm vào giỏ hàng
          </>
        )}
      </button>

      {/* Nút mua ngay */}
      <button
        onClick={onBuyNow}
        disabled={addingToCart}
        className='w-full py-3 px-6 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
      >
        {addingToCart ? (
          <div className='flex items-center justify-center'>
            <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2'></div>
            Đang xử lý...
          </div>
        ) : (
          <>
            <i className='fas fa-shopping-bag mr-2'></i>
            Mua ngay
          </>
        )}
      </button>

      {/* Thông tin bảo hành và chính sách */}
      <div className='pt-4 border-t border-gray-200'>
        <div className='space-y-2 text-sm text-gray-600'>
          <div className='flex items-center'>
            <i className='fas fa-shield-alt text-green-500 mr-2'></i>
            <span>Bảo hành chính hãng</span>
          </div>
          <div className='flex items-center'>
            <i className='fas fa-truck text-blue-500 mr-2'></i>
            <span>Miễn phí vận chuyển cho đơn hàng trên 500.000đ</span>
          </div>
          <div className='flex items-center'>
            <i className='fas fa-undo text-purple-500 mr-2'></i>
            <span>Đổi trả trong 7 ngày</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductActions;
