import { useState } from 'react';
import {
  createCategory,
  updateCategory,
} from '../../../../services/categoryService';
import { toast } from 'react-toastify';

export const useCategoryForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    parentId: '',
    image_url: '',
    level: 1,
  });

  const [editingCategory, setEditingCategory] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      parentId: '',
      image_url: '',
      level: 1,
    });
  };

  const initializeEditForm = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name || '',
      description: category.description || '',
      parentId: category.parent_id || category.parentId || '',
      image_url: category.image_url || '',
      level: category.level || 1,
    });
  };

  const resetEditForm = () => {
    setEditingCategory(null);
    resetForm();
  };

  const createCategory = async (categories, onSuccess) => {
    setUploading(true);
    try {
      // Kiểm tra xem danh mục cấp cao hơn cấp 1 có danh mục cha chưa
      if (formData.level > 1 && !formData.parentId) {
        toast.error('Danh mục cấp cao hơn cấp 1 phải có danh mục cha!');
        return;
      }

      // Kiểm tra trùng tên trong cùng parent trước khi gửi request
      const duplicateCheck = categories.find(
        (cat) =>
          cat.name.toLowerCase() === formData.name.toLowerCase() &&
          ((cat.parent_id || cat.parentId) === formData.parentId ||
            (!cat.parent_id && !cat.parentId && !formData.parentId))
      );

      if (duplicateCheck) {
        toast.error(
          `Danh mục "${formData.name}" đã tồn tại trong ${
            formData.parentId ? 'danh mục cha này' : 'danh mục gốc'
          }!`
        );
        return;
      }

      const categoryData = {
        name: formData.name,
        description: formData.description,
        parent_id: formData.parentId || null,
        image_url: formData.image_url || null,
        level: formData.level,
      };

      const response = await createCategory(categoryData);

      if (response.data) {
        onSuccess();
        resetForm();
        toast.success('Thêm danh mục thành công!');
      }
    } catch (error) {
      console.error('Error creating category:', error);

      let errorMessage = 'Có lỗi xảy ra khi thêm danh mục';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      toast.error(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  const updateCategory = async (categoryId, categories, onSuccess) => {
    setUploading(true);
    try {
      // Kiểm tra trùng tên (trừ chính nó)
      const duplicateCheck = categories.find(
        (cat) =>
          cat.id !== categoryId &&
          cat.name.toLowerCase() === formData.name.toLowerCase() &&
          ((cat.parent_id || cat.parentId) === formData.parentId ||
            (!cat.parent_id && !cat.parentId && !formData.parentId))
      );

      if (duplicateCheck) {
        toast.error(
          `Danh mục "${formData.name}" đã tồn tại trong ${
            formData.parentId ? 'danh mục cha này' : 'danh mục gốc'
          }!`
        );
        return;
      }

      // Kiểm tra không thể đặt chính nó làm parent
      if (formData.parentId && parseInt(formData.parentId) === categoryId) {
        toast.error('Không thể đặt chính danh mục này làm danh mục cha!');
        return;
      }

      const categoryData = {
        name: formData.name,
        description: formData.description,
        parent_id: formData.parentId || null,
        image_url: formData.image_url || null,
      };

      const response = await updateCategory(categoryId, categoryData);

      if (response.data) {
        onSuccess();
        resetEditForm();
        toast.success('Cập nhật danh mục thành công!');
      }
    } catch (error) {
      console.error('Error updating category:', error);

      let errorMessage = 'Có lỗi xảy ra khi cập nhật danh mục';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      toast.error(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  return {
    formData,
    setFormData,
    editingCategory,
    uploading,
    handleInputChange,
    resetForm,
    initializeEditForm,
    resetEditForm,
    createCategory,
    updateCategory,
  };
};
