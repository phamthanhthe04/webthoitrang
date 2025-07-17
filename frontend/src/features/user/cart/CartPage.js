import React from 'react';
import { useCart } from './hooks/useCart';
import EmptyCart from './components/EmptyCart';
import CartItem from './components/CartItem';
import CartSummary from './components/CartSummary';

/**
 * Component trang giỏ hàng
 * Tích hợp tất cả các component và hook logic
 */
const CartPage = () => {
  const {
    cartItems,
    total,
    isEmpty,
    handleQuantityChange,
    handleRemoveItem,
    handleClearCart,
  } = useCart();

  // Hiển thị empty state nếu giỏ hàng trống
  if (isEmpty) {
    return <EmptyCart />;
  }

  return (
    <div className='min-h-screen bg-gray-50 py-8'>
      <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='bg-white rounded-2xl shadow-lg p-8'>
          {/* Header */}
          <h2 className='text-3xl font-bold text-gray-900 mb-8'>
            Giỏ hàng của bạn
          </h2>

          {/* Danh sách sản phẩm */}
          <div className='space-y-6'>
            {cartItems.map((item) => (
              <CartItem
                key={item.id + item.size + item.color}
                item={item}
                onQuantityChange={handleQuantityChange}
                onRemoveItem={handleRemoveItem}
              />
            ))}
          </div>

          {/* Tổng kết và hành động */}
          <CartSummary total={total} onClearCart={handleClearCart} />
        </div>
      </div>
    </div>
  );
};

export default CartPage;
