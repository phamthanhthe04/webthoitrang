import React, { useState, useEffect, useCallback } from 'react';
import adminService from '../../services/adminService';
import { toast } from 'react-toastify';

const AdminCategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [newCategory, setNewCategory] = useState({
    name: '',
    description: '',
    parentId: '',
    image_url: '',
    level: 1,
  });

  // Hàm tính toán level của danh mục dựa trên parent_id hoặc parentId
  const calculateCategoryLevel = useCallback((category, allCategories) => {
    // Kiểm tra cả parentId và parent_id để đảm bảo tính tương thích
    if (!category.parent_id && !category.parentId) return 1; // Nếu không có parent_id/parentId, đây là danh mục cấp 1

    let level = 1;
    // Sử dụng parentId nếu có, nếu không thì dùng parent_id
    let currentId = category.parentId || category.parent_id;
    let maxIterations = 10; // Ngăn chặn vòng lặp vô hạn nếu có lỗi dữ liệu

    while (currentId && maxIterations > 0) {
      // Sử dụng biến tạm để tránh lỗi ESLint
      const currentParentId = currentId;
      const parentCategory = allCategories.find(
        (c) => c.id === currentParentId
      );
      if (!parentCategory) break;

      level++;
      currentId = parentCategory.parentId || parentCategory.parent_id;
      maxIterations--;
    }

    return level;
  }, []);

  // Định nghĩa fetchCategories với useCallback để tránh tạo hàm mới mỗi lần render
  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      const response = await adminService.getCategories();

      // Truy cập đúng cấu trúc dữ liệu từ API (success: true, data: categories)
      const categoriesData = response.data.data || [];
      console.log('Raw API response:', categoriesData);

      // Chuyển đổi từ parent_id sang parentId
      const transformedCategories = categoriesData.map((category) => {
        // Đếm số sản phẩm nếu có
        const productCount = category.Products ? category.Products.length : 0;

        return {
          ...category,
          parentId: category.parent_id, // Chuyển đổi parent_id thành parentId để giữ tương thích với frontend
          productCount, // Thêm số lượng sản phẩm
        };
      });

      // Tính level sau khi đã chuyển đổi tất cả các danh mục
      const categoriesWithLevel = transformedCategories.map((category) => {
        return {
          ...category,
          level: calculateCategoryLevel(category, transformedCategories),
        };
      });

      setCategories(categoriesWithLevel);
      console.log('Categories with level:', categoriesWithLevel);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error(
        `Không thể tải danh mục: ${
          error.response?.data?.error || error.message
        }`
      );
    } finally {
      setLoading(false);
    }
  }, [calculateCategoryLevel]);

  const handleAddCategory = async (e) => {
    e.preventDefault();
    try {
      // Kiểm tra xem danh mục cấp cao hơn cấp 1 có danh mục cha chưa
      if (newCategory.level > 1 && !newCategory.parentId) {
        toast.error('Danh mục cấp cao hơn cấp 1 phải có danh mục cha!');
        return;
      }

      // Chuyển đổi từ parentId sang parent_id trước khi gửi lên API
      const categoryData = {
        name: newCategory.name,
        description: newCategory.description,
        parent_id: newCategory.parentId || null, // Chuyển đổi từ parentId sang parent_id
        image_url: newCategory.image_url || null, // Thêm image_url nếu có
        // Không gửi level vì backend không có trường này, level sẽ được tính toán dựa trên parent_id
        // Tự động tạo slug từ tên nếu cần
        slug: newCategory.name
          .toLowerCase()
          .replace(/[^a-z0-9 -]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-'),
      };

      console.log('Sending category data:', categoryData);
      const response = await adminService.createCategory(categoryData);

      if (response.data) {
        toast.success('Thêm danh mục thành công!');
        fetchCategories(); // Refresh categories from server
        setNewCategory({
          name: '',
          description: '',
          parentId: '',
          image_url: '',
          level: 1,
        });
        setShowAddModal(false);
      }
    } catch (error) {
      console.error('Error creating category:', error);
      toast.error(
        `Không thể thêm danh mục: ${
          error.response?.data?.error || error.message
        }`
      );
    }
  };

  const handleEditCategory = (category) => {
    setEditingCategory({
      ...category,
      parentId: category.parentId || category.parent_id || '',
    });
    setShowEditModal(true);
  };

  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    try {
      // Kiểm tra xem danh mục cấp cao hơn cấp 1 có danh mục cha chưa
      if (editingCategory.level > 1 && !editingCategory.parentId) {
        toast.error('Danh mục cấp cao hơn cấp 1 phải có danh mục cha!');
        return;
      }

      // Kiểm tra để tránh tạo chu trình danh mục (category không thể là parent của chính nó hoặc con cháu của nó)
      if (editingCategory.parentId === editingCategory.id) {
        toast.error('Danh mục không thể là danh mục cha của chính nó!');
        return;
      }

      // Chuyển đổi từ parentId sang parent_id trước khi gửi lên API
      const categoryData = {
        name: editingCategory.name,
        description: editingCategory.description,
        parent_id: editingCategory.parentId || null, // Chuyển đổi từ parentId sang parent_id
        image_url:
          editingCategory.image_url || editingCategory.image_url || null, // Giữ lại image_url nếu có
        // Tự động cập nhật slug nếu cần
        slug:
          editingCategory.slug ||
          editingCategory.name
            .toLowerCase()
            .replace(/[^a-z0-9 -]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-'),
      };

      console.log('Updating category with data:', categoryData);
      await adminService.updateCategory(editingCategory.id, categoryData);
      toast.success('Cập nhật danh mục thành công!');
      fetchCategories(); // Refresh categories from server
      setShowEditModal(false);
      setEditingCategory(null);
    } catch (error) {
      console.error('Error updating category:', error);
      toast.error(
        `Không thể cập nhật danh mục: ${
          error.response?.data?.error || error.message
        }`
      );
    }
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditingCategory((prev) => ({
      ...prev,
      [name]: name === 'level' ? parseInt(value) : value,
    }));
  };

  const handleDeleteCategory = async (categoryId) => {
    if (window.confirm('Bạn có chắc muốn xóa danh mục này?')) {
      try {
        await adminService.deleteCategory(categoryId);
        toast.success('Xóa danh mục thành công!');
        fetchCategories(); // Refresh categories from server
      } catch (error) {
        console.error('Error deleting category:', error);
        toast.error('Không thể xóa danh mục. Vui lòng thử lại sau.');
      }
    }
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 1:
        return 'bg-blue-100 text-blue-800';
      case 2:
        return 'bg-green-100 text-green-800';
      case 3:
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getLevelText = (level) => {
    switch (level) {
      case 1:
        return 'Cấp 1 (Giới tính)';
      case 2:
        return 'Cấp 2 (Loại SP)';
      case 3:
        return 'Cấp 3 (Chi tiết)';
      default:
        return 'Khác';
    }
  };

  // Hàm tạo cấu trúc cây danh mục từ mảng phẳng
  const buildCategoryTree = (categories) => {
    // Clone categories để không ảnh hưởng đến mảng ban đầu
    const categoriesWithChildren = categories.map((cat) => ({
      ...cat,
      children: [],
    }));

    // Map để truy cập nhanh bằng ID
    const categoriesMap = {};
    categoriesWithChildren.forEach((cat) => {
      categoriesMap[cat.id] = cat;
    });

    // Xây dựng cây
    const rootCategories = [];
    categoriesWithChildren.forEach((cat) => {
      // Sử dụng cả parentId và parent_id để đảm bảo tính tương thích
      const parentId = cat.parentId || cat.parent_id;

      if (parentId) {
        // Nếu có parent, thêm vào children của parent
        const parent = categoriesMap[parentId];
        if (parent) {
          parent.children.push(cat);
        } else {
          // Nếu parent không tồn tại, thêm vào root
          rootCategories.push(cat);
        }
      } else {
        // Nếu không có parent, thêm vào root
        rootCategories.push(cat);
      }
    });

    return rootCategories;
  };

  // Chuyển danh mục cây về mảng phẳng để hiển thị trong bảng
  const flattenCategories = (cats, result = [], level = 0) => {
    cats.forEach((cat) => {
      const category = { ...cat, displayLevel: level };
      result.push(category);
      if (cat.children && cat.children.length > 0) {
        flattenCategories(cat.children, result, level + 1);
      }
    });
    return result;
  };

  const categoryTree = buildCategoryTree(categories);
  const allCategories = flattenCategories(categoryTree);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  if (loading) {
    return (
      <div className='flex items-center justify-center h-64'>
        <div className='text-gray-600'>Đang tải danh sách danh mục...</div>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <h1 className='text-2xl font-semibold text-gray-900'>
            Quản lý danh mục
          </h1>
          <p className='text-gray-600 mt-1'>
            Tổng cộng {allCategories.length} danh mục với cấu trúc 3 tầng
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className='mt-4 sm:mt-0 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center'
        >
          <i className='fas fa-plus mr-2'></i>
          Thêm danh mục
        </button>
      </div>

      {/* Stats Cards */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
        <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
          <div className='flex items-center'>
            <div className='p-2 bg-blue-100 rounded-lg'>
              <i className='fas fa-layer-group text-blue-600'></i>
            </div>
            <div className='ml-4'>
              <p className='text-sm font-medium text-gray-600'>Tổng danh mục</p>
              <p className='text-2xl font-semibold text-gray-900'>
                {allCategories.length}
              </p>
            </div>
          </div>
        </div>

        <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
          <div className='flex items-center'>
            <div className='p-2 bg-green-100 rounded-lg'>
              <i className='fas fa-users text-green-600'></i>
            </div>
            <div className='ml-4'>
              <p className='text-sm font-medium text-gray-600'>
                Cấp 1 (Giới tính)
              </p>
              <p className='text-2xl font-semibold text-gray-900'>
                {
                  categories.filter(
                    (c) => c.level === 1 || (!c.parentId && c.level !== 3)
                  ).length
                }
              </p>
            </div>
          </div>
        </div>

        <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
          <div className='flex items-center'>
            <div className='p-2 bg-purple-100 rounded-lg'>
              <i className='fas fa-tags text-purple-600'></i>
            </div>
            <div className='ml-4'>
              <p className='text-sm font-medium text-gray-600'>
                Cấp 2 (Loại SP)
              </p>
              <p className='text-2xl font-semibold text-gray-900'>
                {
                  categories.filter(
                    (c) => c.level === 2 || (c.parentId && c.level !== 3)
                  ).length
                }
              </p>
            </div>
          </div>
        </div>

        <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
          <div className='flex items-center'>
            <div className='p-2 bg-yellow-100 rounded-lg'>
              <i className='fas fa-tag text-yellow-600'></i>
            </div>
            <div className='ml-4'>
              <p className='text-sm font-medium text-gray-600'>
                Cấp 3 (Chi tiết)
              </p>
              <p className='text-2xl font-semibold text-gray-900'>
                {categories.filter((c) => c.level === 3).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Structure Guide */}
      <div className='bg-blue-50 border border-blue-200 rounded-lg p-6'>
        <h3 className='text-lg font-medium text-blue-900 mb-3'>
          <i className='fas fa-info-circle mr-2'></i>
          Cấu trúc danh mục 3 tầng cho cửa hàng thời trang
        </h3>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 text-sm'>
          <div className='flex items-center'>
            <span className='w-3 h-3 bg-blue-500 rounded-full mr-2'></span>
            <span className='text-blue-700'>
              <strong>Cấp 1:</strong> Giới tính (Nam, Nữ, Trẻ em)
            </span>
          </div>
          <div className='flex items-center'>
            <span className='w-3 h-3 bg-green-500 rounded-full mr-2'></span>
            <span className='text-green-700'>
              <strong>Cấp 2:</strong> Loại sản phẩm (Áo, Quần, Váy)
            </span>
          </div>
          <div className='flex items-center'>
            <span className='w-3 h-3 bg-purple-500 rounded-full mr-2'></span>
            <span className='text-purple-700'>
              <strong>Cấp 3:</strong> Chi tiết (Áo phông, Áo sơ mi...)
            </span>
          </div>
        </div>
        <p className='mt-3 text-sm text-blue-800'>
          <i className='fas fa-info-circle mr-1'></i>
          Lưu ý: Danh mục được liên kết với bảng sản phẩm qua trường{' '}
          <code>category_id</code>. Trường <code>level</code> được tính toán tự
          động dựa trên cấu trúc phân cấp.
        </p>
      </div>

      {/* Categories Table */}
      <div className='bg-white rounded-lg shadow-sm border border-gray-200'>
        <div className='px-6 py-4 border-b border-gray-200'>
          <h2 className='text-lg font-medium text-gray-900'>
            Danh sách danh mục
          </h2>
        </div>

        <div className='overflow-x-auto'>
          <table className='min-w-full divide-y divide-gray-200'>
            <thead className='bg-gray-50'>
              <tr>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Tên danh mục
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Cấp độ
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Mô tả
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Số sản phẩm
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-gray-200'>
              {allCategories.map((category) => (
                <tr key={category.id} className='hover:bg-gray-50'>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='flex items-center'>
                      <div
                        style={{
                          marginLeft: `${(category.displayLevel || 0) * 20}px`,
                        }}
                      >
                        {(category.displayLevel > 0 || category.parentId) && (
                          <span className='text-gray-400 mr-2'>└─</span>
                        )}
                        <span className='text-sm font-medium text-gray-900'>
                          {category.name}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getLevelColor(
                        category.level
                      )}`}
                    >
                      {getLevelText(category.level)}
                    </span>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                    {category.description || 'Chưa có mô tả'}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                    {category.Products
                      ? category.Products.length
                      : category.productCount || 0}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                    <div className='flex space-x-2'>
                      <button
                        onClick={() => handleEditCategory(category)}
                        className='text-blue-600 hover:text-blue-900'
                      >
                        <i className='fas fa-edit'></i>
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(category.id)}
                        className='text-red-600 hover:text-red-900'
                      >
                        <i className='fas fa-trash'></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Category Modal */}
      {showAddModal && (
        <div className='fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white rounded-lg shadow-xl max-w-md w-full mx-4'>
            <div className='px-6 py-4 border-b border-gray-200'>
              <h3 className='text-lg font-medium text-gray-900'>
                Thêm danh mục mới
              </h3>
            </div>

            <form onSubmit={handleAddCategory} className='p-6 space-y-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Tên danh mục
                </label>
                <input
                  type='text'
                  value={newCategory.name}
                  onChange={(e) =>
                    setNewCategory((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                  required
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Mô tả
                </label>
                <textarea
                  value={newCategory.description || ''}
                  onChange={(e) =>
                    setNewCategory((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  rows={3}
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  URL Hình ảnh (tùy chọn)
                </label>
                <input
                  type='text'
                  value={newCategory.image_url || ''}
                  onChange={(e) =>
                    setNewCategory((prev) => ({
                      ...prev,
                      image_url: e.target.value,
                    }))
                  }
                  placeholder='Ví dụ: /images/categories/nam.jpg'
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Cấp độ
                </label>
                <select
                  value={newCategory.level}
                  onChange={(e) =>
                    setNewCategory((prev) => ({
                      ...prev,
                      level: parseInt(e.target.value),
                    }))
                  }
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                >
                  <option value={1}>Cấp 1 - Giới tính</option>
                  <option value={2}>Cấp 2 - Loại sản phẩm</option>
                  <option value={3}>Cấp 3 - Chi tiết</option>
                </select>
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Danh mục cha
                </label>
                <select
                  value={newCategory.parentId}
                  onChange={(e) =>
                    setNewCategory((prev) => ({
                      ...prev,
                      parentId: e.target.value,
                    }))
                  }
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                >
                  <option value=''>Không có danh mục cha</option>
                  {allCategories
                    .filter((cat) => cat.level < newCategory.level)
                    .map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name} ({getLevelText(category.level)})
                      </option>
                    ))}
                </select>
              </div>

              <div className='flex justify-end space-x-3 pt-4'>
                <button
                  type='button'
                  onClick={() => {
                    setShowAddModal(false);
                    setNewCategory({
                      name: '',
                      description: '',
                      parentId: '',
                      image_url: '',
                      level: 1,
                    });
                  }}
                  className='px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors'
                >
                  Hủy
                </button>
                <button
                  type='submit'
                  className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors'
                >
                  Thêm danh mục
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Category Modal */}
      {showEditModal && editingCategory && (
        <div className='fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white rounded-lg shadow-xl max-w-md w-full mx-4'>
            <div className='px-6 py-4 border-b border-gray-200'>
              <h3 className='text-lg font-medium text-gray-900'>
                Chỉnh sửa danh mục
              </h3>
            </div>

            <form onSubmit={handleUpdateCategory} className='p-6 space-y-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Tên danh mục
                </label>
                <input
                  type='text'
                  name='name'
                  value={editingCategory.name}
                  onChange={handleEditInputChange}
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                  required
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Mô tả
                </label>
                <textarea
                  name='description'
                  value={editingCategory.description || ''}
                  onChange={handleEditInputChange}
                  rows={3}
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  URL Hình ảnh (tùy chọn)
                </label>
                <input
                  type='text'
                  name='image_url'
                  value={editingCategory.image_url || ''}
                  onChange={handleEditInputChange}
                  placeholder='Ví dụ: /images/categories/nam.jpg'
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                />
                {editingCategory.image_url && (
                  <div className='mt-2'>
                    <label className='text-xs text-gray-500'>
                      Hình ảnh hiện tại:
                    </label>
                    <div className='mt-1 h-20 w-20 border border-gray-200 rounded'>
                      <img
                        src={editingCategory.image_url}
                        alt={editingCategory.name}
                        className='h-full w-full object-cover rounded'
                        onError={(e) => {
                          e.target.src = '/placeholder.png';
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Cấp độ
                </label>
                <select
                  name='level'
                  value={editingCategory.level}
                  onChange={handleEditInputChange}
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                >
                  <option value={1}>Cấp 1 - Giới tính</option>
                  <option value={2}>Cấp 2 - Loại sản phẩm</option>
                  <option value={3}>Cấp 3 - Chi tiết</option>
                </select>
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Danh mục cha
                </label>
                <select
                  name='parentId'
                  value={editingCategory.parentId}
                  onChange={handleEditInputChange}
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                >
                  <option value=''>Không có danh mục cha</option>
                  {allCategories
                    .filter(
                      (cat) =>
                        cat.id !== editingCategory.id &&
                        cat.level < editingCategory.level
                    )
                    .map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name} ({getLevelText(category.level)})
                      </option>
                    ))}
                </select>
              </div>

              <div className='flex justify-end space-x-3 pt-4'>
                <button
                  type='button'
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingCategory(null);
                  }}
                  className='px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors'
                >
                  Hủy
                </button>
                <button
                  type='submit'
                  className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors'
                >
                  Lưu thay đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategoryManagement;
