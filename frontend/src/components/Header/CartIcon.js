import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FaShoppingCart } from 'react-icons/fa';

const CartIcon = () => {
  const [isOpen, setIsOpen] = useState(false);
  const cartItems = useSelector((state) => state.cart?.items || []);
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <FaShoppingCart size={24} />

      <AnimatePresence>
        {cartCount > 0 && (
          <span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
          >
            {cartCount}
          </span>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && cartItems.length > 0 && (
          <div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
          >
            {cartItems.map((item) => (
              <div key={item.id} className='cart-item'>
                <img src={item.image} alt={item.name} />
                <div>
                  <h4>{item.name}</h4>
                  <p>
                    {item.quantity} x {item.price.toLocaleString('vi-VN')}đ
                  </p>
                </div>
              </div>
            ))}

            <div className='cart-total'>
              <strong>Tổng cộng:</strong>
              <span>
                {cartItems
                  .reduce((sum, item) => sum + item.price * item.quantity, 0)
                  .toLocaleString('vi-VN')}
                đ
              </span>
            </div>

            <Link to='/cart' className='view-cart-button'>
              Xem giỏ hàng
            </Link>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CartIcon;
