import React, { useState, useEffect } from 'react';
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../../services/categoryService';

const AdminCategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [expandedCategories, setExpandedCategories] = useState(new Set());
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    parent_id: null,
  });

  // Tải danh sách danh mục
  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const response = await getCategories();

      // Kiểm tra cấu trúc response
      if (
        response.data &&
        response.data.data &&
        Array.isArray(response.data.data)
      ) {
        setCategories(response.data.data);
      } else if (response.data && Array.isArray(response.data)) {
        setCategories(response.data);
      } else {
        setCategories([]);
      }
    } catch (error) {
      console.error('Error loading categories:', error);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  // Hàm tạo cấu trúc cây từ danh sách phẳng
  const buildCategoryTree = (categories, parentId = null) => {
    return categories
      .filter((category) => category.parent_id === parentId)
      .map((category) => ({
        ...category,
        children: buildCategoryTree(categories, category.id),
      }));
  };

  // Hàm đếm danh mục theo cấp
  const getCategoryStats = () => {
    const stats = { level1: 0, level2: 0, level3: 0, total: categories.length };

    categories.forEach((category) => {
      if (!category.parent_id) {
        stats.level1++;
      } else {
        const parent = categories.find((c) => c.id === category.parent_id);
        if (parent && !parent.parent_id) {
          stats.level2++;
        } else if (parent && parent.parent_id) {
          stats.level3++;
        }
      }
    });

    return stats;
  };

  // Hàm toggle mở/đóng cây
  const toggleCategory = (categoryId) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, formData);
        alert('Cập nhật danh mục thành công!');
      } else {
        await createCategory(formData);
        alert('Tạo danh mục mới thành công!');
      }

      // Reset form
      setFormData({ name: '', description: '', parent_id: null });
      setShowAddForm(false);
      setEditingCategory(null);
      loadCategories();
    } catch (error) {
      console.error('Error saving category:', error);
      alert('Có lỗi xảy ra khi lưu danh mục');
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || '',
      parent_id: category.parent_id,
    });
    setShowAddForm(true);
  };

  const handleDelete = async (category) => {
    if (window.confirm(`Bạn có chắc muốn xóa danh mục "${category.name}"?`)) {
      try {
        await deleteCategory(category.id);
        alert('Xóa danh mục thành công!');
        loadCategories();
      } catch (error) {
        console.error('Error deleting category:', error);
        alert('Có lỗi xảy ra khi xóa danh mục');
      }
    }
  };

  const handleCancel = () => {
    setFormData({ name: '', description: '', parent_id: null });
    setShowAddForm(false);
    setEditingCategory(null);
  };

  // Component hiển thị một nút trong cây
  const CategoryTreeNode = ({ category, level = 0 }) => {
    const hasChildren = category.children && category.children.length > 0;
    const isExpanded = expandedCategories.has(category.id);

    return (
      <div className={`${level > 0 ? 'ml-6' : ''}`}>
        <div className='flex items-center py-2 px-3 hover:bg-gray-50 rounded-lg'>
          {/* Toggle button */}
          <button
            onClick={() => toggleCategory(category.id)}
            className={`mr-2 w-6 h-6 flex items-center justify-center text-gray-500 hover:text-gray-700 ${
              !hasChildren ? 'invisible' : ''
            }`}
          >
            {hasChildren && (
              <i
                className={`fas fa-chevron-${
                  isExpanded ? 'down' : 'right'
                } text-xs`}
              ></i>
            )}
          </button>

          {/* Category icon */}
          <div
            className={`mr-3 w-8 h-8 rounded-lg flex items-center justify-center ${
              level === 0
                ? 'bg-blue-100 text-blue-600'
                : level === 1
                ? 'bg-green-100 text-green-600'
                : 'bg-yellow-100 text-yellow-600'
            }`}
          >
            <i
              className={`fas ${
                level === 0
                  ? 'fa-folder'
                  : level === 1
                  ? 'fa-folder-open'
                  : 'fa-file-alt'
              } text-sm`}
            ></i>
          </div>

          {/* Category info */}
          <div className='flex-1'>
            <div className='flex items-center'>
              <span className='font-medium text-gray-900'>{category.name}</span>
              <span
                className={`ml-2 px-2 py-1 text-xs rounded-full ${
                  level === 0
                    ? 'bg-blue-100 text-blue-800'
                    : level === 1
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}
              >
                Cấp {level + 1}
              </span>
            </div>
            {category.description && (
              <p className='text-sm text-gray-500 mt-1'>
                {category.description}
              </p>
            )}
          </div>

          {/* Action buttons */}
          <div className='flex items-center space-x-2'>
            <button
              onClick={() => handleEdit(category)}
              className='text-blue-600 hover:text-blue-900 text-sm'
            >
              <i className='fas fa-edit'></i>
            </button>
            <button
              onClick={() => handleDelete(category)}
              className='text-red-600 hover:text-red-900 text-sm'
            >
              <i className='fas fa-trash'></i>
            </button>
          </div>
        </div>

        {/* Children */}
        {hasChildren && isExpanded && (
          <div className='ml-4 border-l-2 border-gray-200 pl-2'>
            {category.children.map((child) => (
              <CategoryTreeNode
                key={child.id}
                category={child}
                level={level + 1}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className='flex justify-center items-center h-64'>
        <div className='text-lg'>Đang tải danh sách danh mục...</div>
      </div>
    );
  }

  const categoryTree = buildCategoryTree(categories);
  const stats = getCategoryStats();

  return (
    <div className='bg-white rounded-lg shadow-md p-6'>
      <div className='flex justify-between items-center mb-6'>
        <div>
          <h1 className='text-2xl font-bold text-gray-800'>Quản lý Danh mục</h1>
          <p className='text-gray-600 mt-1'>
            Tổng cộng {stats.total} danh mục ({stats.level1} cấp 1,{' '}
            {stats.level2} cấp 2, {stats.level3} cấp 3)
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600'
        >
          <i className='fas fa-plus mr-2'></i>
          Thêm Danh mục
        </button>
      </div>

      {/* Statistics Cards */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-4 mb-6'>
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

      {/* Form thêm/sửa danh mục */}
      {showAddForm && (
        <div className='bg-gray-50 p-4 rounded-lg mb-6'>
          <h2 className='text-lg font-semibold mb-4'>
            {editingCategory ? 'Sửa Danh mục' : 'Thêm Danh mục Mới'}
          </h2>
          <form onSubmit={handleSubmit} className='space-y-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Tên danh mục
              </label>
              <input
                type='text'
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                placeholder='Nhập tên danh mục'
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Mô tả
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                placeholder='Nhập mô tả danh mục'
                rows='3'
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Danh mục cha
              </label>
              <select
                value={formData.parent_id || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    parent_id: e.target.value || null,
                  })
                }
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
              >
                <option value=''>Không có danh mục cha</option>
                {(categories || []).map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div className='flex space-x-2'>
              <button
                type='submit'
                className='bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600'
              >
                {editingCategory ? 'Cập nhật' : 'Thêm'}
              </button>
              <button
                type='button'
                onClick={handleCancel}
                className='bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600'
              >
                Hủy
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Cây danh mục */}
      <div className='bg-white rounded-lg border border-gray-200 p-4'>
        <div className='flex items-center justify-between mb-4'>
          <h2 className='text-lg font-semibold text-gray-800'>Cây danh mục</h2>
          <div className='flex space-x-2'>
            <button
              onClick={() =>
                setExpandedCategories(new Set(categories.map((c) => c.id)))
              }
              className='text-blue-600 hover:text-blue-900 text-sm'
            >
              <i className='fas fa-expand-arrows-alt mr-1'></i>
              Mở rộng tất cả
            </button>
            <button
              onClick={() => setExpandedCategories(new Set())}
              className='text-gray-600 hover:text-gray-900 text-sm'
            >
              <i className='fas fa-compress-arrows-alt mr-1'></i>
              Thu gọn tất cả
            </button>
          </div>
        </div>

        {categoryTree.length > 0 ? (
          <div className='space-y-1'>
            {categoryTree.map((category) => (
              <CategoryTreeNode key={category.id} category={category} />
            ))}
          </div>
        ) : (
          <div className='text-center py-8'>
            <div className='text-gray-400 mb-2'>
              <i className='fas fa-folder-open text-4xl'></i>
            </div>
            <p className='text-gray-500'>Chưa có danh mục nào</p>
            <button
              onClick={() => setShowAddForm(true)}
              className='mt-2 text-blue-600 hover:text-blue-900'
            >
              Thêm danh mục đầu tiên
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCategoryManagement;
