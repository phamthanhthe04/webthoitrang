import { useState, useEffect, useCallback } from 'react';
import {
  getCategories,
  deleteCategory,
} from '../../../../services/categoryService';
import { toast } from 'react-toastify';

/**
 * Hook quản lý logic nghiệp vụ cho danh mục admin
 * Bao gồm: tải dữ liệu, tính toán level phân cấp, xóa danh mục
 */
export const useCategoryManagement = () => {
  // States quản lý dữ liệu và UI
  const [categories, setCategories] = useState([]); // Danh sách tất cả danh mục
  const [loading, setLoading] = useState(true); // Trạng thái loading

  /**
   * Hàm tính toán level của danh mục dựa trên parent_id
   * Sử dụng thuật toán đệ quy để tìm cấp độ của danh mục trong cây phân cấp
   * @param {Object} category - Danh mục cần tính level
   * @param {Array} allCategories - Danh sách tất cả danh mục để tìm parent
   * @returns {number} Cấp độ của danh mục (1 = gốc, 2 = con, 3 = cháu, ...)
   */
  const calculateCategoryLevel = useCallback((category, allCategories) => {
    // Nếu không có parent_id, đây là danh mục cấp 1 (gốc)
    if (!category.parent_id) return 1;

    let level = 1;
    let currentId = category.parent_id;
    let maxIterations = 10; // Ngăn chặn vòng lặp vô hạn trong trường hợp dữ liệu lỗi

    // Duyệt ngược lên cây phân cấp để đếm level
    while (currentId && maxIterations > 0) {
      const currentParentId = currentId;
      const parentCategory = allCategories.find(
        (c) => c.id === currentParentId
      );
      if (!parentCategory) break; // Không tìm thấy parent, dừng lại

      level++; // Tăng level lên 1
      currentId = parentCategory.parent_id; // Tiếp tục tìm parent của parent
      maxIterations--; // Giảm counter để tránh vòng lặp vô hạn
    }

    return level;
  }, []);

  // Định nghĩa fetchCategories với useCallback để tránh tạo hàm mới mỗi lần render
  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getCategories();

      // API trả về mảng categories trực tiếp, không có wrapper
      const categoriesData = Array.isArray(response.data) ? response.data : [];

      // Backend đã tính level rồi, chỉ cần thêm alias
      const categoriesWithLevel = categoriesData.map((category) => {
        // Sử dụng level từ backend, fallback về tính toán nếu không có
        const level =
          category.level || calculateCategoryLevel(category, categoriesData);
        return {
          ...category,
          level,
          parentId: category.parent_id, // Tạo alias để tương thích với frontend code cũ
          productCount: 0, // Sẽ được tính sau khi có API đếm products
        };
      });

      setCategories(categoriesWithLevel);
    } catch (error) {
      toast.error(
        `Không thể tải danh mục: ${
          error.response?.data?.message || error.message
        }`
      );
    } finally {
      setLoading(false);
    }
  }, [calculateCategoryLevel]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const deleteCategory = async (category) => {
    if (
      window.confirm(
        `Bạn có chắc muốn xóa danh mục "${category.name}"?\nTất cả danh mục con cũng sẽ bị xóa.`
      )
    ) {
      try {
        await deleteCategory(category.id);
        await fetchCategories(); // Reload data after deletion
        toast.success('Xóa danh mục thành công!');
      } catch (error) {
        toast.error('Có lỗi xảy ra khi xóa danh mục');
      }
    }
  };

  // Lọc danh mục theo level
  const getCategoriesByLevel = (level) => {
    return categories.filter((cat) => cat.level === level);
  };

  // Lấy danh mục con của một danh mục
  const getChildCategories = (parentId) => {
    return categories.filter((cat) => cat.parent_id === parentId);
  };

  // Lấy đường dẫn danh mục (breadcrumb)
  const getCategoryPath = (category) => {
    const path = [category];
    let currentCategory = category;

    while (currentCategory.parent_id) {
      const parent = categories.find((c) => c.id === currentCategory.parent_id);
      if (parent) {
        path.unshift(parent);
        currentCategory = parent;
      } else {
        break;
      }
    }

    return path;
  };

  return {
    categories,
    setCategories,
    loading,
    fetchCategories,
    deleteCategory,
    getCategoriesByLevel,
    getChildCategories,
    getCategoryPath,
    calculateCategoryLevel,
  };
};
