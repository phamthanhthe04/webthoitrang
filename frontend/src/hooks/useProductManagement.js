import { useState, useEffect } from 'react';
import { getProducts, deleteProduct } from '../services/productService';

export const useProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await getProducts();
      setProducts(response.data.products);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (product) => {
    if (
      window.confirm(
        `Bạn có chắc muốn xóa sản phẩm "${product.name}"?\nTất cả ảnh liên quan cũng sẽ bị xóa.`
      )
    ) {
      try {
        await deleteProduct(product.id);
        setProducts((prev) => prev.filter((p) => p.id !== product.id));
        alert('Xóa sản phẩm thành công!');
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Có lỗi xảy ra khi xóa sản phẩm');
      }
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' ||
      product.category_id === selectedCategory ||
      product.Category?.id === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return {
    products,
    setProducts,
    loading,
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    filteredProducts,
    loadProducts,
    deleteProduct,
  };
};
