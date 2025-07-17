import { useState, useEffect } from 'react';
import {
  getAdminProducts,
  deleteProduct,
} from '../../../../services/productService';

/**
 * Hook quản lý logic nghiệp vụ cho danh sách sản phẩm admin
 * Bao gồm: tải dữ liệu, tìm kiếm, lọc theo danh mục, xóa sản phẩm
 */
export const useProductManagement = () => {
  // States quản lý dữ liệu và UI
  const [products, setProducts] = useState([]); // Danh sách tất cả sản phẩm
  const [loading, setLoading] = useState(true); // Trạng thái loading
  const [searchTerm, setSearchTerm] = useState(''); // Từ khóa tìm kiếm
  const [selectedCategory, setSelectedCategory] = useState('all'); // Danh mục được chọn

  // Tải danh sách sản phẩm khi component mount
  useEffect(() => {
    loadProducts();
  }, []);

  /**
   * Hàm tải danh sách sản phẩm từ API
   */
  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await getAdminProducts();

      // Đảm bảo rằng products luôn là một array
      if (
        response.data &&
        response.data.data &&
        Array.isArray(response.data.data.products)
      ) {
        setProducts(response.data.data.products);
      } else if (response.data && Array.isArray(response.data.products)) {
        setProducts(response.data.products);
      } else if (response.data && Array.isArray(response.data)) {
        setProducts(response.data);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error('Error loading products:', error);
      setProducts([]); // Đặt về array rỗng khi có lỗi
    } finally {
      setLoading(false);
    }
  };

  /**
   * Hàm xóa sản phẩm với xác nhận từ người dùng
   * @param {Object} product - Sản phẩm cần xóa
   */
  const handleDeleteProduct = async (product) => {
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

  /**
   * Hàm lọc sản phẩm dựa trên từ khóa tìm kiếm và danh mục
   * Kết hợp filter theo tên sản phẩm (case-insensitive) và category_id
   */
  const filteredProducts = (products || []).filter((product) => {
    // Tìm kiếm theo tên sản phẩm (không phân biệt hoa thường)
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    // Lọc theo danh mục (hỗ trợ cả category_id và Category.id)
    const matchesCategory =
      selectedCategory === 'all' ||
      product.category_id === selectedCategory ||
      product.Category?.id === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Return các state và function cần thiết cho component
  return {
    products, // Danh sách sản phẩm gốc
    setProducts, // Hàm cập nhật danh sách sản phẩm
    loading, // Trạng thái loading
    searchTerm, // Từ khóa tìm kiếm
    setSearchTerm, // Hàm cập nhật từ khóa tìm kiếm
    selectedCategory, // Danh mục được chọn
    setSelectedCategory, // Hàm cập nhật danh mục
    filteredProducts, // Danh sách sản phẩm đã được lọc
    loadProducts, // Hàm tải lại danh sách sản phẩm
    deleteProduct: handleDeleteProduct, // Hàm xóa sản phẩm
  };
};
