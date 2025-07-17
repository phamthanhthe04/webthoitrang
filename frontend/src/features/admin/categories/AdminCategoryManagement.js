import React, { useState } from 'react';
import { useCategoryManagement } from './hooks/useCategoryManagement';
import { useCategoryForm } from './hooks/useCategoryForm';
import CategoryTable from './components/CategoryTable';
import CategoryModal from './components/CategoryModal';

const AdminCategoryManagement = () => {
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // Custom hooks
  const {
    categories,
    loading,
    fetchCategories,
    deleteCategory,
    getCategoriesByLevel,
    getCategoryPath,
  } = useCategoryManagement();

  const {
    formData,
    editingCategory,
    uploading,
    handleInputChange,
    resetForm,
    initializeEditForm,
    resetEditForm,
    createCategory,
    updateCategory,
  } = useCategoryForm();

  // Event handlers
  const handleEditCategory = (category) => {
    initializeEditForm(category);
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
    await createCategory(categories, () => {
      setShowAddModal(false);
      fetchCategories();
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    await updateCategory(editingCategory.id, categories, () => {
      setShowEditModal(false);
      fetchCategories();
    });
  };

  // Loading state
  if (loading) {
    return (
      <div className='flex items-center justify-center h-64'>
        <div className='text-gray-600'>Đang tải danh sách danh mục...</div>
      </div>
    );
  }

  // Statistics
  const stats = {
    total: categories.length,
    level1: getCategoriesByLevel(1).length,
    level2: getCategoriesByLevel(2).length,
    level3: getCategoriesByLevel(3).length,
  };

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <h1 className='text-2xl font-semibold text-gray-900'>
            Quản lý danh mục
          </h1>
          <p className='text-gray-600 mt-1'>Tổng cộng {stats.total} danh mục</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className='mt-4 sm:mt-0 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center'
        >
          <i className='fas fa-plus mr-2'></i>
          Thêm danh mục
        </button>
      </div>

      {/* Statistics Cards */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
        <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-4'>
          <div className='flex items-center'>
            <div className='p-2 bg-blue-100 rounded-lg'>
              <i className='fas fa-layer-group text-blue-600'></i>
            </div>
            <div className='ml-3'>
              <p className='text-sm font-medium text-gray-600'>Tổng số</p>
              <p className='text-lg font-semibold text-gray-900'>
                {stats.total}
              </p>
            </div>
          </div>
        </div>

        <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-4'>
          <div className='flex items-center'>
            <div className='p-2 bg-green-100 rounded-lg'>
              <i className='fas fa-folder text-green-600'></i>
            </div>
            <div className='ml-3'>
              <p className='text-sm font-medium text-gray-600'>Cấp 1</p>
              <p className='text-lg font-semibold text-gray-900'>
                {stats.level1}
              </p>
            </div>
          </div>
        </div>

        <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-4'>
          <div className='flex items-center'>
            <div className='p-2 bg-yellow-100 rounded-lg'>
              <i className='fas fa-folder-open text-yellow-600'></i>
            </div>
            <div className='ml-3'>
              <p className='text-sm font-medium text-gray-600'>Cấp 2</p>
              <p className='text-lg font-semibold text-gray-900'>
                {stats.level2}
              </p>
            </div>
          </div>
        </div>

        <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-4'>
          <div className='flex items-center'>
            <div className='p-2 bg-purple-100 rounded-lg'>
              <i className='fas fa-file-alt text-purple-600'></i>
            </div>
            <div className='ml-3'>
              <p className='text-sm font-medium text-gray-600'>Cấp 3</p>
              <p className='text-lg font-semibold text-gray-900'>
                {stats.level3}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Table */}
      <CategoryTable
        categories={categories}
        onEditCategory={handleEditCategory}
        onDeleteCategory={deleteCategory}
        getCategoryPath={getCategoryPath}
      />

      {/* Add Category Modal */}
      <CategoryModal
        show={showAddModal}
        onClose={handleAddModalClose}
        title='Thêm danh mục mới'
        onSubmit={handleSubmit}
        uploading={uploading}
        isEdit={false}
        formData={formData}
        handleInputChange={handleInputChange}
        categories={categories}
      />

      {/* Edit Category Modal */}
      <CategoryModal
        show={showEditModal}
        onClose={handleEditModalClose}
        title={`Chỉnh sửa danh mục: ${editingCategory?.name || ''}`}
        onSubmit={handleEditSubmit}
        uploading={uploading}
        isEdit={true}
        formData={formData}
        handleInputChange={handleInputChange}
        categories={categories}
        editingCategory={editingCategory}
      />
    </div>
  );
};

export default AdminCategoryManagement;
