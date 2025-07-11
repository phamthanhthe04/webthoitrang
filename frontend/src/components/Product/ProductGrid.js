import React from 'react';
import ProductCard from './ProductCard';

const ProductGrid = ({
  products = [],
  loading = false,
  error = null,
  emptyMessage = 'Không có sản phẩm nào được tìm thấy',
  className = '',
}) => {
  if (loading) {
    return (
      <div className='loading-state'>
        <div className='loading-spinner-large'></div>
        <div className='loading-text'>Đang tải sản phẩm...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='error-state'>
        <div className='error-icon'>
          <i className='fas fa-exclamation-triangle'></i>
        </div>
        <h3 className='error-title'>Có lỗi xảy ra</h3>
        <p className='error-description'>{error}</p>
        <button className='btn-retry' onClick={() => window.location.reload()}>
          <i className='fas fa-redo'></i> Thử lại
        </button>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className='empty-state'>
        <div className='empty-icon'>
          <i className='fas fa-shopping-bag'></i>
        </div>
        <h3 className='empty-title'>Chưa có sản phẩm</h3>
        <p className='empty-description'>{emptyMessage}</p>
        <a href='/' className='btn-browse'>
          <i className='fas fa-arrow-left'></i> Về trang chủ
        </a>
      </div>
    );
  }

  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${className}`}
    >
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;
