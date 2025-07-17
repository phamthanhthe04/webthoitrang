import React from 'react';
import CategoryTreeSelect from '../../../../components/Admin/CategoryTreeSelect';

const ProductFormFields = ({
  formData,
  handleInputChange,
  mainImagePreview,
  additionalPreviews,
  handleMainImageChange,
  handleAdditionalImagesChange,
  removeMainImage,
  removeAdditionalImage,
  isEdit = false,
  editingProduct = null,
  keepOldImages = null,
  handleToggleOldMainImage = null,
  handleToggleOldAdditionalImage = null,
  getImageUrl = null,
}) => {
  return (
    <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
      {/* Thông tin cơ bản */}
      <div className='space-y-4'>
        <h4 className='text-lg font-medium text-gray-900 border-b pb-2'>
          Thông tin cơ bản
        </h4>

        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            Tên sản phẩm <span className='text-red-500'>*</span>
          </label>
          <input
            type='text'
            name='name'
            value={formData.name}
            onChange={handleInputChange}
            className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
            placeholder='Nhập tên sản phẩm'
            required
          />
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            Mô tả
          </label>
          <textarea
            name='description'
            value={formData.description}
            onChange={handleInputChange}
            rows={isEdit ? '4' : '3'}
            className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
            placeholder='Mô tả sản phẩm...'
          />
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            Danh mục <span className='text-red-500'>*</span>
          </label>
          <CategoryTreeSelect
            value={formData.category_id}
            onChange={(category) => {
              handleInputChange({
                target: { name: 'category_id', value: category },
              });
            }}
            placeholder='Chọn danh mục sản phẩm'
          />
        </div>

        <div
          className={
            isEdit ? 'grid grid-cols-3 gap-4' : 'grid grid-cols-2 gap-4'
          }
        >
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Giá gốc <span className='text-red-500'>*</span>
            </label>
            <input
              type='number'
              name='price'
              value={formData.price}
              onChange={handleInputChange}
              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
              placeholder='0'
              min='0'
              step='0.01'
              required
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Giá khuyến mãi
            </label>
            <input
              type='number'
              name='sale_price'
              value={formData.sale_price}
              onChange={handleInputChange}
              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
              placeholder='0'
              min='0'
              step='0.01'
            />
          </div>
          {isEdit && (
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Số lượng <span className='text-red-500'>*</span>
              </label>
              <input
                type='number'
                name='stock'
                value={formData.stock}
                onChange={handleInputChange}
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                placeholder='0'
                min='0'
                required
              />
            </div>
          )}
        </div>

        {!isEdit && (
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Tồn kho <span className='text-red-500'>*</span>
              </label>
              <input
                type='number'
                name='stock'
                value={formData.stock}
                onChange={handleInputChange}
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                placeholder='0'
                min='0'
                required
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Trạng thái
              </label>
              <select
                name='status'
                value={formData.status}
                onChange={handleInputChange}
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
              >
                <option value='active'>Hoạt động</option>
                <option value='inactive'>Không hoạt động</option>
                <option value='out_of_stock'>Hết hàng</option>
              </select>
            </div>
          </div>
        )}

        {isEdit && (
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Tags
            </label>
            <input
              type='text'
              name='tags'
              value={formData.tags}
              onChange={handleInputChange}
              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
              placeholder='Ví dụ: mới, hot, sale (cách nhau bằng dấu phẩy)'
            />
          </div>
        )}

        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            SKU
          </label>
          <input
            type='text'
            name='sku'
            value={formData.sku}
            onChange={handleInputChange}
            className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
            placeholder='Mã sản phẩm (tự động tạo nếu để trống)'
          />
        </div>

        {isEdit && (
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Kích thước
              </label>
              <input
                type='text'
                name='sizes'
                value={formData.sizes}
                onChange={handleInputChange}
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                placeholder='Ví dụ: S, M, L, XL'
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Màu sắc
              </label>
              <input
                type='text'
                name='colors'
                value={formData.colors}
                onChange={handleInputChange}
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                placeholder='Ví dụ: Đỏ, Xanh, Vàng'
              />
            </div>
          </div>
        )}
      </div>

      {/* Thông tin bổ sung & Ảnh */}
      <div className='space-y-4'>
        <h4 className='text-lg font-medium text-gray-900 border-b pb-2'>
          {isEdit ? 'Ảnh sản phẩm' : 'Thông tin bổ sung & Ảnh'}
        </h4>

        {!isEdit && (
          <>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Tags (phân cách bằng dấu phẩy)
              </label>
              <input
                type='text'
                name='tags'
                value={formData.tags}
                onChange={handleInputChange}
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                placeholder='ví dụ: hot, sale, new'
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Kích thước (phân cách bằng dấu phẩy)
              </label>
              <input
                type='text'
                name='sizes'
                value={formData.sizes}
                onChange={handleInputChange}
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                placeholder='ví dụ: S, M, L, XL'
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Màu sắc (phân cách bằng dấu phẩy)
              </label>
              <input
                type='text'
                name='colors'
                value={formData.colors}
                onChange={handleInputChange}
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                placeholder='ví dụ: Đỏ, Xanh, Trắng'
              />
            </div>
          </>
        )}

        {/* Ảnh chính hiện tại (chỉ trong edit mode) */}
        {isEdit && editingProduct?.image_url && (
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Ảnh chính hiện tại
            </label>
            <div className='relative'>
              <img
                src={getImageUrl(editingProduct.image_url)}
                alt='Current main'
                className='w-32 h-32 object-cover rounded-lg border-2 border-gray-200'
              />
              <div className='absolute top-2 right-2'>
                <label className='flex items-center'>
                  <input
                    type='checkbox'
                    checked={keepOldImages?.mainImage || false}
                    onChange={handleToggleOldMainImage}
                    className='mr-1'
                  />
                  <span className='text-xs bg-white px-1 rounded'>Giữ</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Upload ảnh chính */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            {isEdit && editingProduct?.image_url
              ? 'Thay ảnh chính mới'
              : 'Ảnh chính'}
            {!isEdit && <span className='text-red-500'> *</span>}
          </label>
          {!isEdit ? (
            <div className='border-2 border-dashed border-gray-300 rounded-lg p-4 relative hover:border-blue-400 transition-colors'>
              {mainImagePreview ? (
                <div className='relative'>
                  <img
                    src={mainImagePreview}
                    alt='Preview'
                    className='w-full h-32 object-cover rounded-lg'
                  />
                  <button
                    type='button'
                    onClick={removeMainImage}
                    className='absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 transition-colors'
                  >
                    ×
                  </button>
                </div>
              ) : (
                <div className='text-center py-6'>
                  <i className='fas fa-cloud-upload-alt text-gray-400 text-3xl mb-3'></i>
                  <p className='text-sm text-gray-600 mb-2'>
                    Nhấn để chọn ảnh chính
                  </p>
                  <p className='text-xs text-gray-500'>
                    PNG, JPG, JPEG tối đa 5MB
                  </p>
                </div>
              )}
              <input
                type='file'
                accept='image/*'
                onChange={handleMainImageChange}
                className='absolute inset-0 w-full h-full opacity-0 cursor-pointer'
              />
            </div>
          ) : (
            <>
              <input
                type='file'
                accept='image/*'
                onChange={handleMainImageChange}
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
              />
              {mainImagePreview && (
                <div className='mt-2 relative'>
                  <img
                    src={mainImagePreview}
                    alt='New main preview'
                    className='w-32 h-32 object-cover rounded-lg border-2 border-blue-200'
                  />
                  <button
                    type='button'
                    onClick={removeMainImage}
                    className='absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600'
                  >
                    ×
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Ảnh phụ hiện tại (chỉ trong edit mode) */}
        {isEdit &&
          editingProduct?.images &&
          editingProduct.images.length > 0 && (
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Ảnh phụ hiện tại
              </label>
              <div className='grid grid-cols-3 gap-2'>
                {editingProduct.images.map((image, index) => (
                  <div key={index} className='relative'>
                    <img
                      src={getImageUrl(image)}
                      alt={`Current additional ${index + 1}`}
                      className='w-20 h-20 object-cover rounded border-2 border-gray-200'
                    />
                    <div className='absolute top-1 right-1'>
                      <label className='flex items-center'>
                        <input
                          type='checkbox'
                          checked={
                            keepOldImages?.additionalImages[index] || false
                          }
                          onChange={() => handleToggleOldAdditionalImage(index)}
                          className='mr-1 scale-75'
                        />
                        <span className='text-xs bg-white px-1 rounded'>
                          Giữ
                        </span>
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        {/* Upload ảnh phụ */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            {isEdit &&
            editingProduct?.images &&
            editingProduct.images.length > 0
              ? 'Thêm ảnh phụ mới'
              : 'Ảnh phụ (tối đa 10 ảnh)'}
          </label>
          {!isEdit ? (
            <div className='border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-400 transition-colors'>
              <div className='text-center mb-3'>
                <i className='fas fa-images text-gray-400 text-2xl mb-2'></i>
                <p className='text-sm text-gray-600 mb-2'>Chọn nhiều ảnh phụ</p>
                <label className='inline-flex items-center px-4 py-2 bg-blue-50 text-blue-700 text-sm font-medium rounded-lg cursor-pointer hover:bg-blue-100 transition-colors'>
                  <i className='fas fa-plus mr-2'></i>
                  Thêm ảnh phụ
                  <input
                    type='file'
                    accept='image/*'
                    multiple
                    onChange={handleAdditionalImagesChange}
                    className='hidden'
                  />
                </label>
              </div>
              {additionalPreviews.length > 0 && (
                <div className='grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-gray-200'>
                  {additionalPreviews.map((preview, index) => (
                    <div key={index} className='relative group'>
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className='w-full h-20 object-cover rounded-lg'
                      />
                      <button
                        type='button'
                        onClick={() => removeAdditionalImage(index)}
                        className='absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100'
                      >
                        ×
                      </button>
                      <div className='absolute bottom-1 left-1 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded'>
                        {index + 1}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <>
              <input
                type='file'
                accept='image/*'
                multiple
                onChange={handleAdditionalImagesChange}
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
              />
              {additionalPreviews.length > 0 && (
                <div className='mt-2 grid grid-cols-3 gap-2'>
                  {additionalPreviews.map((preview, index) => (
                    <div key={index} className='relative'>
                      <img
                        src={preview}
                        alt={`New additional preview ${index + 1}`}
                        className='w-20 h-20 object-cover rounded border-2 border-blue-200'
                      />
                      <button
                        type='button'
                        onClick={() => removeAdditionalImage(index)}
                        className='absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600'
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductFormFields;
