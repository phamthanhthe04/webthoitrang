import { useState } from 'react';
import { createProduct, updateProduct } from '../services/productService';

export const useProductForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category_id: '',
    price: '',
    sale_price: '',
    stock: '',
    status: 'active',
    tags: '',
    sizes: '',
    colors: '',
    sku: '',
  });

  const [editingProduct, setEditingProduct] = useState(null);
  const [keepOldImages, setKeepOldImages] = useState({
    mainImage: false,
    additionalImages: [],
  });

  const [mainImage, setMainImage] = useState(null);
  const [additionalImages, setAdditionalImages] = useState([]);
  const [mainImagePreview, setMainImagePreview] = useState(null);
  const [additionalPreviews, setAdditionalPreviews] = useState([]);
  const [uploading, setUploading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleMainImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMainImage(file);
      const reader = new FileReader();
      reader.onload = (e) => setMainImagePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleAdditionalImagesChange = (e) => {
    const files = Array.from(e.target.files);
    setAdditionalImages(files);

    const promises = files.map((file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(promises).then((previews) => {
      setAdditionalPreviews(previews);
    });
  };

  const removeMainImage = () => {
    setMainImage(null);
    setMainImagePreview(null);
  };

  const removeAdditionalImage = (index) => {
    const newImages = additionalImages.filter((_, i) => i !== index);
    const newPreviews = additionalPreviews.filter((_, i) => i !== index);
    setAdditionalImages(newImages);
    setAdditionalPreviews(newPreviews);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      category_id: '',
      price: '',
      sale_price: '',
      stock: '',
      status: 'active',
      tags: '',
      sizes: '',
      colors: '',
      sku: '',
    });
    setMainImage(null);
    setMainImagePreview(null);
    setAdditionalImages([]);
    setAdditionalPreviews([]);
  };

  const resetEditForm = () => {
    setEditingProduct(null);
    resetForm();
    setKeepOldImages({
      mainImage: false,
      additionalImages: [],
    });
  };

  const handleToggleOldMainImage = () => {
    const newValue = !keepOldImages.mainImage;
    setKeepOldImages((prev) => ({
      ...prev,
      mainImage: newValue,
    }));

    if (newValue) {
      setMainImage(null);
      if (editingProduct && editingProduct.image_url) {
        setMainImagePreview(editingProduct.image_url);
      }
    } else {
      setMainImagePreview(null);
    }
  };

  const handleToggleOldAdditionalImage = (index) => {
    setKeepOldImages((prev) => ({
      ...prev,
      additionalImages: prev.additionalImages.map((keep, i) =>
        i === index ? !keep : keep
      ),
    }));
  };

  const initializeEditForm = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name || '',
      description: product.description || '',
      category_id: product.category_id || '',
      price: product.price || '',
      sale_price: product.sale_price || '',
      stock: product.stock || '',
      status: product.status || 'active',
      tags: Array.isArray(product.tags)
        ? product.tags.join(', ')
        : product.tags || '',
      sizes: Array.isArray(product.sizes)
        ? product.sizes.join(', ')
        : product.sizes || '',
      colors: Array.isArray(product.colors)
        ? product.colors.join(', ')
        : product.colors || '',
      sku: product.sku || '',
    });

    setMainImage(null);
    setAdditionalImages([]);
    setMainImagePreview(product.image_url || null);
    setAdditionalPreviews(Array.isArray(product.images) ? product.images : []);
    setKeepOldImages({
      mainImage: true,
      additionalImages: (product.images || []).map(() => true),
    });
  };

  const createProduct = async (onSuccess) => {
    setUploading(true);
    try {
      const productData = {
        ...formData,
        mainImage,
        additionalImages,
      };

      const response = await createProduct(productData);
      if (response.data) {
        onSuccess(response.data.product);
        resetForm();
        alert('Thêm sản phẩm thành công!');
      }
    } catch (error) {
      console.error('Error creating product:', error);
      let errorMessage = 'Có lỗi xảy ra khi thêm sản phẩm';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      alert(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  const updateProduct = async (productId, onSuccess) => {
    setUploading(true);
    try {
      const productData = {
        ...formData,
        ...(mainImage && { mainImage }),
        ...(additionalImages.length > 0 && { additionalImages }),
      };

      if (keepOldImages.mainImage) {
        productData.keepOldMainImage = true;
      }

      if (keepOldImages.additionalImages.some((keep) => keep)) {
        productData.keepOldAdditionalImages = keepOldImages.additionalImages;
      }

      const response = await updateProduct(productId, productData);
      if (response.data) {
        onSuccess(response.data.product);
        resetEditForm();
        alert('Cập nhật sản phẩm thành công!');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      let errorMessage = 'Có lỗi xảy ra khi cập nhật sản phẩm';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      alert(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  return {
    formData,
    setFormData,
    editingProduct,
    keepOldImages,
    mainImage,
    additionalImages,
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
  };
};
