import React from 'react';

/**
 * Component lựa chọn các tùy chọn sản phẩm
 * Bao gồm size, màu sắc, số lượng
 */
const ProductOptions = ({
  sizes,
  colors,
  hasSizes,
  hasColors,
  selectedSize,
  selectedColor,
  quantity,
  product,
  onSizeSelect,
  onColorSelect,
  onQuantityChange,
}) => {
  return (
    <div className='space-y-6'>
      {/* Lựa chọn size */}
      {hasSizes && (
        <div>
          <h3 className='text-lg font-semibold text-gray-900 mb-3'>
            Chọn size
          </h3>
          <div className='flex flex-wrap gap-2'>
            {sizes.map((size) => (
              <button
                key={size}
                onClick={() => onSizeSelect(size)}
                className={`
                  px-4 py-2 border rounded-lg font-medium transition-colors
                  ${
                    selectedSize === size
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-gray-300 hover:border-gray-400 text-gray-700'
                  }
                `}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Lựa chọn màu sắc */}
      {hasColors && (
        <div>
          <h3 className='text-lg font-semibold text-gray-900 mb-3'>
            Chọn màu sắc
          </h3>
          <div className='flex flex-wrap gap-2'>
            {colors.map((color) => (
              <button
                key={color}
                onClick={() => onColorSelect(color)}
                className={`
                  px-4 py-2 border rounded-lg font-medium transition-colors
                  ${
                    selectedColor === color
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-gray-300 hover:border-gray-400 text-gray-700'
                  }
                `}
              >
                {color}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Số lượng */}
      <div>
        <h3 className='text-lg font-semibold text-gray-900 mb-3'>Số lượng</h3>
        <div className='flex items-center space-x-3'>
          <div className='flex items-center border border-gray-300 rounded-lg'>
            <button
              onClick={() => onQuantityChange(quantity - 1)}
              disabled={quantity <= 1}
              className='px-3 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed'
            >
              <i className='fas fa-minus'></i>
            </button>
            <span className='px-4 py-2 font-medium min-w-[60px] text-center'>
              {quantity}
            </span>
            <button
              onClick={() => onQuantityChange(quantity + 1)}
              disabled={product.stock && quantity >= product.stock}
              className='px-3 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed'
            >
              <i className='fas fa-plus'></i>
            </button>
          </div>

          {product.stock && (
            <span className='text-sm text-gray-600'>
              (Còn {product.stock} sản phẩm)
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductOptions;
