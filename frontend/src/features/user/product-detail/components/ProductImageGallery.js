import React from 'react';
import { getImageUrl } from '../../../../utils/imageUtils';

/**
 * Component gallery hình ảnh sản phẩm
 * Hiển thị hình ảnh chính và thumbnail
 */
const ProductImageGallery = ({
  images,
  selectedImageIndex,
  onImageSelect,
  productName,
}) => {
  // Sử dụng hình ảnh đầu tiên nếu không có images hoặc selectedIndex không hợp lệ
  const displayImages = images.length > 0 ? images : ['/no-image.png'];
  const currentImage = displayImages[selectedImageIndex] || displayImages[0];

  return (
    <div className='space-y-4'>
      {/* Hình ảnh chính */}
      <div className='aspect-square bg-gray-100 rounded-2xl overflow-hidden'>
        <img
          src={
            currentImage && currentImage !== '/no-image.png'
              ? currentImage.startsWith('http')
                ? currentImage
                : getImageUrl(currentImage)
              : '/no-image.png'
          }
          alt={productName}
          className='w-full h-full object-cover hover:scale-105 transition-transform duration-300'
        />
      </div>

      {/* Thumbnail images */}
      {displayImages.length > 1 && (
        <div className='flex space-x-2 overflow-x-auto pb-2'>
          {displayImages.map((image, index) => (
            <button
              key={index}
              onClick={() => onImageSelect(index)}
              className={`
                flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors
                ${
                  index === selectedImageIndex
                    ? 'border-primary-500'
                    : 'border-gray-200 hover:border-gray-300'
                }
              `}
            >
              <img
                src={
                  image && image !== '/no-image.png'
                    ? image.startsWith('http')
                      ? image
                      : getImageUrl(image)
                    : '/no-image.png'
                }
                alt={`${productName} ${index + 1}`}
                className='w-full h-full object-cover'
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductImageGallery;
