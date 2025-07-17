import React, { useState } from 'react';
import { useProductManagement } from './hooks/useProductManagement';
import { useProductForm } from './hooks/useProductForm';
import ProductFilters from './components/ProductFilters';
import ProductTable from './components/ProductTable';
import ProductModal from './components/ProductModal';
import ProductImageModal from './components/ProductImageModal';
import ProductPagination from './components/ProductPagination';
import { getImageUrl } from '../../../utils/imageUtils';

const AdminProductManagement = () => {
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Custom hooks
  const {
    products,
    setProducts,
    loading,
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    filteredProducts,
    deleteProduct,
  } = useProductManagement();

  const {
    formData,
    editingProduct,
    keepOldImages,
    mainImagePreview,
    additionalPreviews,
    uploading,
    handleInputChange,
    handleMainImageChange,
    handleAdditionalImagesChange,
    removeMainImage,
    removeAdditionalImage,
    resetForm,
    resetEditForm,
    handleToggleOldMainImage,
    handleToggleOldAdditionalImage,
    initializeEditForm,
    createProduct,
    updateProduct,
  } = useProductForm();

  // Event handlers
  const handleViewImages = (product) => {
    setSelectedProduct(product);
    setShowImageModal(true);
  };

  const handleEditProduct = (product) => {
    initializeEditForm(product);
    setShowEditModal(true);
  };

  const handleAddModalClose = () => {
    setShowAddModal(false);
    resetForm();
  };

  const handleEditModalClose = () => {
    setShowEditModal(false);
    resetEditForm();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createProduct((newProduct) => {
      setProducts((prev) => [...prev, newProduct]);
      setShowAddModal(false);
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    await updateProduct(editingProduct.id, (updatedProduct) => {
      setProducts((prev) =>
        prev.map((p) => (p.id === editingProduct.id ? updatedProduct : p))
      );
      setShowEditModal(false);
    });
  };

  // Loading state
  if (loading) {
    return (
      <div className='flex items-center justify-center h-64'>
        <div className='text-gray-600'>Đang tải danh sách sản phẩm...</div>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <h1 className='text-2xl font-semibold text-gray-900'>
            Quản lý sản phẩm
          </h1>
          <p className='text-gray-600 mt-1'>
            Tổng cộng {products.length} sản phẩm
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className='mt-4 sm:mt-0 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center'
        >
          <i className='fas fa-plus mr-2'></i>
          Thêm sản phẩm
        </button>
      </div>

      {/* Filters */}
      <ProductFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      {/* Products Table */}
      <ProductTable
        products={filteredProducts}
        onViewImages={handleViewImages}
        onEditProduct={handleEditProduct}
        onDeleteProduct={deleteProduct}
      />

      {/* Pagination */}
      <ProductPagination
        currentPage={1}
        totalPages={1}
        totalItems={filteredProducts.length}
        itemsPerPage={filteredProducts.length}
      />

      {/* Add Product Modal */}
      <ProductModal
        show={showAddModal}
        onClose={handleAddModalClose}
        title='Thêm sản phẩm mới'
        onSubmit={handleSubmit}
        uploading={uploading}
        isEdit={false}
        submitButtonText='Thêm sản phẩm'
        formProps={{
          formData,
          handleInputChange,
          mainImagePreview,
          additionalPreviews,
          handleMainImageChange,
          handleAdditionalImagesChange,
          removeMainImage,
          removeAdditionalImage,
        }}
      />

      {/* Edit Product Modal */}
      <ProductModal
        show={showEditModal}
        onClose={handleEditModalClose}
        title={`Chỉnh sửa sản phẩm: ${editingProduct?.name || ''}`}
        onSubmit={handleEditSubmit}
        uploading={uploading}
        isEdit={true}
        submitButtonText='Cập nhật sản phẩm'
        formProps={{
          formData,
          handleInputChange,
          mainImagePreview,
          additionalPreviews,
          handleMainImageChange,
          handleAdditionalImagesChange,
          removeMainImage,
          removeAdditionalImage,
          editingProduct,
          keepOldImages,
          handleToggleOldMainImage,
          handleToggleOldAdditionalImage,
          getImageUrl,
        }}
      />

      {/* Image Gallery Modal */}
      <ProductImageModal
        show={showImageModal}
        onClose={() => setShowImageModal(false)}
        product={selectedProduct}
      />
    </div>
  );
};

export default AdminProductManagement;
