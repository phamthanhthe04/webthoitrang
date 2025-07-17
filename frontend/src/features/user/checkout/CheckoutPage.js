import React from 'react';
import { useCheckout } from './hooks/useCheckout';
import OrderSummary from './components/OrderSummary';
import ShippingForm from './components/ShippingForm';
import PaymentMethodSelector from './components/PaymentMethodSelector';

/**
 * Component chính của trang thanh toán
 * Tích hợp tất cả các component con và hook logic
 */
const CheckoutPage = () => {
  const {
    wallet,
    loading,
    submitting,
    paymentMethod,
    shippingInfo,
    cartItems,
    totals,
    setPaymentMethod,
    handleShippingInfoChange,
    handlePlaceOrder,
  } = useCheckout();

  // Hiển thị loading khi đang tải dữ liệu
  if (loading) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4'></div>
          <p className='text-gray-600'>Đang tải thông tin thanh toán...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50 py-8'>
      <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Header */}
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-gray-900'>Thanh toán</h1>
          <p className='text-gray-600 mt-2'>
            Vui lòng kiểm tra thông tin đơn hàng và điền thông tin giao hàng
          </p>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Cột trái: Form thông tin */}
          <div className='lg:col-span-2 space-y-6'>
            {/* Form thông tin giao hàng */}
            <ShippingForm
              shippingInfo={shippingInfo}
              onShippingInfoChange={handleShippingInfoChange}
            />

            {/* Lựa chọn phương thức thanh toán */}
            <PaymentMethodSelector
              paymentMethod={paymentMethod}
              onPaymentMethodChange={setPaymentMethod}
              wallet={wallet}
              total={totals.total}
            />
          </div>

          {/* Cột phải: Thông tin đơn hàng */}
          <div className='space-y-6'>
            {/* Tóm tắt đơn hàng */}
            <OrderSummary items={cartItems} totals={totals} />

            {/* Nút đặt hàng */}
            <button
              onClick={handlePlaceOrder}
              disabled={
                submitting ||
                (paymentMethod === 'wallet' && wallet?.balance < totals.total)
              }
              className='w-full bg-primary-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors'
            >
              {submitting ? (
                <div className='flex items-center justify-center'>
                  <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2'></div>
                  Đang xử lý...
                </div>
              ) : (
                <>
                  <i className='fas fa-credit-card mr-2'></i>
                  Đặt hàng ngay
                </>
              )}
            </button>

            {/* Chính sách bảo mật */}
            <div className='text-sm text-gray-600 text-center'>
              <p className='mb-2'>
                <i className='fas fa-shield-alt text-green-500 mr-1'></i>
                Thông tin của bạn được bảo mật an toàn
              </p>
              <p>
                Bằng việc đặt hàng, bạn đồng ý với{' '}
                <a
                  href='/dieu-khoan'
                  className='text-primary-600 hover:underline'
                >
                  Điều khoản sử dụng
                </a>{' '}
                và{' '}
                <a
                  href='/chinh-sach-bao-mat'
                  className='text-primary-600 hover:underline'
                >
                  Chính sách bảo mật
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
