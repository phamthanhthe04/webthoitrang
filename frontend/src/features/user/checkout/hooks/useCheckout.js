import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  getMyWallet,
  payOrderWithWallet,
} from '../../../../services/walletService';
import { orderService } from '../../../../services/orderService';
import { clearCart } from '../../../cart/cartSlice';
import { toast } from 'react-toastify';

/**
 * Custom hook cho quản lý logic thanh toán
 * Xử lý tất cả business logic liên quan đến checkout
 */
export const useCheckout = () => {
  const { items: cartItems } = useSelector((state) => state.cart);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Trạng thái local
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('wallet');
  const [shippingInfo, setShippingInfo] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || '',
    note: '',
  });

  /**
   * Tính toán tổng tiền đơn hàng
   * Bao gồm tiền hàng và phí vận chuyển
   */
  const calculateTotals = () => {
    const subtotal = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const shippingFee = 30000; // Phí vận chuyển cố định
    const total = subtotal + shippingFee;

    return { subtotal, shippingFee, total };
  };

  /**
   * Kiểm tra điều kiện truy cập trang checkout
   * Redirect nếu không đăng nhập hoặc giỏ hàng trống
   */
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/dang-nhap');
      return;
    }

    if (cartItems.length === 0) {
      navigate('/gio-hang');
      return;
    }

    fetchWalletInfo();
  }, [isAuthenticated, cartItems, navigate]);

  /**
   * Cập nhật thông tin shipping khi user thay đổi
   */
  useEffect(() => {
    if (user) {
      setShippingInfo((prev) => ({
        ...prev,
        name: user.name || '',
        phone: user.phone || '',
        address: user.address || '',
      }));
    }
  }, [user]);

  /**
   * Lấy thông tin ví điện tử của user
   */
  const fetchWalletInfo = async () => {
    try {
      const response = await getMyWallet();
      if (response.success) {
        setWallet(response.data);
      }
    } catch (error) {
      console.error('Error fetching wallet:', error);
      toast.error('Không thể tải thông tin ví');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Xử lý thay đổi thông tin giao hàng
   */
  const handleShippingInfoChange = (field, value) => {
    setShippingInfo((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  /**
   * Validate thông tin giao hàng
   */
  const validateShippingInfo = () => {
    if (!shippingInfo.name.trim()) {
      toast.error('Vui lòng nhập họ tên');
      return false;
    }
    if (!shippingInfo.phone.trim()) {
      toast.error('Vui lòng nhập số điện thoại');
      return false;
    }
    if (!shippingInfo.address.trim()) {
      toast.error('Vui lòng nhập địa chỉ giao hàng');
      return false;
    }
    return true;
  };

  /**
   * Xử lý thanh toán qua ví điện tử
   */
  // Thanh toán ví: chỉ truyền orderId
  const handleWalletPayment = async (orderId) => {
    const response = await payOrderWithWallet(orderId);
    if (response.success) {
      return response.data;
    }
    throw new Error(response.message);
  };

  /**
   * Xử lý thanh toán khi nhận hàng (COD)
   */
  const handleCodPayment = async (orderData) => {
    const response = await orderService.createOrder(orderData);

    if (response.success) {
      return response.data;
    }
    throw new Error(response.message);
  };

  /**
   * Xử lý đặt hàng chính
   */
  const handlePlaceOrder = async () => {
    if (!validateShippingInfo()) return;

    setSubmitting(true);
    try {
      const { total } = calculateTotals();

      // Kiểm tra số dư ví nếu thanh toán qua ví
      if (paymentMethod === 'wallet' && wallet.balance < total) {
        toast.error('Số dư ví không đủ để thanh toán');
        return;
      }

      // Chuẩn bị dữ liệu đơn hàng
      const orderData = {
        shipping_address: shippingInfo.address,
        payment_method: paymentMethod,
        items: cartItems.map((item) => ({
          product_id: item.id,
          quantity: item.quantity,
          price: item.price,
          size: item.size,
          color: item.color,
        })),
        notes: shippingInfo.note,
      };

      let result;

      // Quy trình chuẩn: tạo đơn hàng trước, sau đó thanh toán ví
      if (paymentMethod === 'wallet') {
        // 1. Tạo đơn hàng trước
        const orderRes = await orderService.createOrder(orderData);
        console.log('[CHECKOUT] orderRes:', orderRes);
        console.log('[CHECKOUT] orderRes.data.id:', orderRes.data?.id);
        console.log('[CHECKOUT] orderRes.success:', orderData);
        if (!orderRes.success || !orderRes.data?.id) {
          throw new Error(orderRes.message || 'Không thể tạo đơn hàng');
        }
        // 2. Gọi API thanh toán ví với orderId
        result = await handleWalletPayment(orderRes.data.id);
        console.log('[CHECKOUT] Payment result:', result);
      } else {
        result = await handleCodPayment(orderData);
      }

      // Xóa giỏ hàng và chuyển hướng
      dispatch(clearCart());
      toast.success('Đặt hàng thành công!');
      navigate(`/don-hang/${result.id}`);
    } catch (error) {
      console.error('Order error:', error);
      toast.error(error.message || 'Có lỗi xảy ra khi đặt hàng');
    } finally {
      setSubmitting(false);
    }
  };

  return {
    // State
    wallet,
    loading,
    submitting,
    paymentMethod,
    shippingInfo,
    cartItems,

    // Computed values
    totals: calculateTotals(),

    // Actions
    setPaymentMethod,
    handleShippingInfoChange,
    handlePlaceOrder,
  };
};
