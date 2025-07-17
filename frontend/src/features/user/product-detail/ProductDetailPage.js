import React from 'react';
import { useProductDetail } from './hooks/useProductDetail';
import ProductImageGallery from './components/ProductImageGallery';
import ProductInfo from './components/ProductInfo';
import ProductOptions from './components/ProductOptions';
import ProductActions from './components/ProductActions';

/**
 * Component trang chi tiết sản phẩm
 * Tích hợp tất cả các component con và hook logic
 */
const ProductDetailPage = () => {
  const {
    product,
    loading,
    error,
    selectedSize,
    selectedColor,
    quantity,
    selectedImageIndex,
    addingToCart,
    setSelectedSize,
    setSelectedColor,
    setSelectedImageIndex,
    handleQuantityChange,
    handleAddToCart,
    handleBuyNow,
    sizes,
    colors,
    tags,
    images,
    hasSizes,
    hasColors,
  } = useProductDetail();

  // Loading state
  if (loading) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4'></div>
          <p className='text-gray-600'>Đang tải thông tin sản phẩm...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !product) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center max-w-md mx-auto px-4'>
          <div className='text-gray-300 text-8xl mb-6'>
            <i className='fas fa-exclamation-triangle'></i>
          </div>
          <h2 className='text-3xl font-bold text-gray-900 mb-4'>
            Không tìm thấy sản phẩm
          </h2>
          <p className='text-gray-600 mb-8'>
            {error ||
              'Sản phẩm bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.'}
          </p>
          <a
            href='/'
            className='inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors'
          >
            <i className='fas fa-home mr-2'></i>
            Về trang chủ
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50 py-8'>
      <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Breadcrumb */}
        <nav className='flex items-center space-x-2 text-sm text-gray-600 mb-8'>
          <a href='/' className='hover:text-primary-600'>
            Trang chủ
          </a>
          <i className='fas fa-chevron-right'></i>
          {product.category && (
            <>
              <span className='hover:text-primary-600'>
                {product.category.name}
              </span>
              <i className='fas fa-chevron-right'></i>
            </>
          )}
          <span className='text-gray-900'>{product.name}</span>
        </nav>

        {/* Main Content */}
        <div className='bg-white rounded-2xl shadow-lg overflow-hidden'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 p-8'>
            {/* Cột trái: Hình ảnh */}
            <div>
              <ProductImageGallery
                images={images}
                selectedImageIndex={selectedImageIndex}
                onImageSelect={setSelectedImageIndex}
                productName={product.name}
              />
            </div>

            {/* Cột phải: Thông tin sản phẩm */}
            <div className='space-y-8'>
              {/* Thông tin cơ bản */}
              <ProductInfo product={product} tags={tags} />

              {/* Tùy chọn sản phẩm */}
              <ProductOptions
                sizes={sizes}
                colors={colors}
                hasSizes={hasSizes}
                hasColors={hasColors}
                selectedSize={selectedSize}
                selectedColor={selectedColor}
                quantity={quantity}
                product={product}
                onSizeSelect={setSelectedSize}
                onColorSelect={setSelectedColor}
                onQuantityChange={handleQuantityChange}
              />

              {/* Các nút hành động */}
              <ProductActions
                product={product}
                addingToCart={addingToCart}
                onAddToCart={handleAddToCart}
                onBuyNow={handleBuyNow}
              />
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className='mt-8 bg-white rounded-2xl shadow-lg p-8'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            {/* Chính sách giao hàng */}
            <div className='text-center'>
              <div className='w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                <i className='fas fa-truck text-2xl text-blue-600'></i>
              </div>
              <h3 className='font-semibold text-gray-900 mb-2'>
                Giao hàng nhanh
              </h3>
              <p className='text-sm text-gray-600'>
                Giao hàng trong 1-3 ngày làm việc
              </p>
            </div>

            {/* Chính sách đổi trả */}
            <div className='text-center'>
              <div className='w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                <i className='fas fa-undo text-2xl text-green-600'></i>
              </div>
              <h3 className='font-semibold text-gray-900 mb-2'>
                Đổi trả dễ dàng
              </h3>
              <p className='text-sm text-gray-600'>
                Đổi trả miễn phí trong 7 ngày
              </p>
            </div>

            {/* Hỗ trợ khách hàng */}
            <div className='text-center'>
              <div className='w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                <i className='fas fa-headset text-2xl text-purple-600'></i>
              </div>
              <h3 className='font-semibold text-gray-900 mb-2'>Hỗ trợ 24/7</h3>
              <p className='text-sm text-gray-600'>
                Luôn sẵn sàng hỗ trợ khách hàng
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
