import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { getProductBySlug } from '../../../../services/productService';
import { addToCart } from '../../../cart/cartSlice';
import { toast } from 'react-toastify';

/**
 * Custom hook cho trang chi tiết sản phẩm
 * Xử lý load sản phẩm, quản lý lựa chọn size/màu, thêm vào giỏ hàng
 */
export const useProductDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Dữ liệu sản phẩm
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Lựa chọn của user
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [addingToCart, setAddingToCart] = useState(false);

  /**
   * Lấy thông tin sản phẩm từ API
   */
  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getProductBySlug(slug);
      if (response.data && response.data.success) {
        setProduct(response.data.data);
      } else {
        setError('Không tìm thấy sản phẩm');
      }
    } catch (err) {
      console.error('Error fetching product:', err);
      setError('Có lỗi xảy ra khi tải sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Load sản phẩm khi component mount hoặc slug thay đổi
   */
  useEffect(() => {
    if (slug) {
      fetchProduct();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  /**
   * Reset lựa chọn khi sản phẩm thay đổi
   */
  useEffect(() => {
    if (product) {
      setSelectedSize('');
      setSelectedColor('');
      setQuantity(1);
      setSelectedImageIndex(0);
    }
  }, [product]);

  /**
   * Helper function để parse array từ các định dạng khác nhau
   * Xử lý cả JSON string và comma-separated string
   */
  const parseArrayField = (field) => {
    if (!field) return [];
    if (Array.isArray(field)) return field;
    if (typeof field === 'string') {
      try {
        const parsed = JSON.parse(field);
        return Array.isArray(parsed)
          ? parsed
          : field
              .split(',')
              .map((item) => item.trim())
              .filter((item) => item);
      } catch {
        return field
          .split(',')
          .map((item) => item.trim())
          .filter((item) => item);
      }
    }
    return [];
  };

  /**
   * Lấy danh sách size có sẵn
   */
  const getSizes = () => parseArrayField(product?.sizes);

  /**
   * Lấy danh sách màu có sẵn
   */
  const getColors = () => parseArrayField(product?.colors);

  /**
   * Lấy danh sách tags
   */
  const getTags = () => parseArrayField(product?.tags);

  /**
   * Lấy danh sách hình ảnh
   */
  const getImages = () => parseArrayField(product?.images);

  /**
   * Kiểm tra sản phẩm có size options
   */
  const hasSizes = () => getSizes().length > 0;

  /**
   * Kiểm tra sản phẩm có color options
   */
  const hasColors = () => getColors().length > 0;

  /**
   * Validate lựa chọn trước khi thêm vào giỏ hàng
   */
  const validateSelection = () => {
    if (hasSizes() && !selectedSize) {
      toast.error('Vui lòng chọn size');
      return false;
    }
    if (hasColors() && !selectedColor) {
      toast.error('Vui lòng chọn màu sắc');
      return false;
    }
    if (quantity < 1) {
      toast.error('Số lượng phải lớn hơn 0');
      return false;
    }
    return true;
  };

  /**
   * Thêm sản phẩm vào giỏ hàng
   */
  const handleAddToCart = async () => {
    if (!validateSelection()) return;

    setAddingToCart(true);
    try {
      dispatch(
        addToCart({
          id: product.id, // dùng cho frontend
          product_id: product.id, // dùng cho backend
          name: product.name,
          price:
            product.sale_price && Number(product.sale_price) > 0
              ? Number(product.sale_price)
              : Number(product.price),
          image: product.images?.[0] || '/no-image.png',
          quantity: Number(quantity),
          size: selectedSize || null,
          color: selectedColor || null,
        })
      );
      toast.success('Đã thêm sản phẩm vào giỏ hàng!');
    } catch (error) {
      console.error('Add to cart error:', error);
      toast.error(error || 'Có lỗi xảy ra khi thêm vào giỏ hàng');
    } finally {
      setAddingToCart(false);
    }
  };

  /**
   * Mua ngay - thêm vào giỏ hàng và chuyển đến trang thanh toán
   */
  const handleBuyNow = async () => {
    if (!validateSelection()) return;

    setAddingToCart(true);
    try {
      dispatch(
        addToCart({
          id: product.id, // dùng cho frontend
          product_id: product.id, // dùng cho backend
          name: product.name,
          price:
            product.sale_price && Number(product.sale_price) > 0
              ? Number(product.sale_price)
              : Number(product.price),
          image: product.images?.[0] || '/no-image.png',
          quantity: Number(quantity),
          size: selectedSize || null,
          color: selectedColor || null,
        })
      );
      navigate('/thanh-toan');
    } catch (error) {
      console.error('Buy now error:', error);
      toast.error(error || 'Có lỗi xảy ra');
    } finally {
      setAddingToCart(false);
    }
  };

  /**
   * Thay đổi số lượng
   */
  const handleQuantityChange = (newQuantity) => {
    if (newQuantity < 1) return;
    if (product.stock && newQuantity > product.stock) {
      toast.warning(`Chỉ còn ${product.stock} sản phẩm trong kho`);
      setQuantity(product.stock);
    } else {
      setQuantity(newQuantity);
    }
  };

  return {
    // Product data
    product,
    loading,
    error,

    // User selections
    selectedSize,
    selectedColor,
    quantity,
    selectedImageIndex,
    addingToCart,

    // Actions
    setSelectedSize,
    setSelectedColor,
    setSelectedImageIndex,
    handleQuantityChange,
    handleAddToCart,
    handleBuyNow,

    // Computed values
    sizes: getSizes(),
    colors: getColors(),
    tags: getTags(),
    images: getImages(),
    hasSizes: hasSizes(),
    hasColors: hasColors(),
  };
};
