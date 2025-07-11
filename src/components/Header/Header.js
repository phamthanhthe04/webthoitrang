// src/components/Header/Header.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../features/auth/authSlice';
import { HeaderIcons } from './HeaderStyles/HeaderStylesIcon.js';
import CartModal from '../Cart/CartModal';
import SearchModal from '../Search/SearchModal';
import logo from '../../assets/images/logo.jpg';

const Header = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/dang-nhap');
  };

  const toggleCartModal = () => {
    setIsCartModalOpen(!isCartModalOpen);
  };

  const toggleSearchModal = () => {
    setIsSearchModalOpen(!isSearchModalOpen);
  };

  return (
    <header className='bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex items-center justify-between py-4'>
          {/* Logo Section */}
          <div className='flex items-center'>
            <Link
              to='/'
              className='flex items-center text-decoration-none hover:opacity-80 transition-opacity'
            >
              <img
                className='h-10 w-10 rounded-lg object-cover'
                src={logo}
                alt='Fashion Logo'
              />
              <h1 className='ml-3 text-2xl font-bold text-primary-600'>
                Fashion
              </h1>
            </Link>
          </div>

          {/* Navigation Menu */}
          <nav className='hidden md:flex'>
            <ul className='flex items-center space-x-8'>
              <li>
                <Link
                  to='/'
                  className='text-gray-700 hover:text-primary-600 font-medium transition-colors'
                >
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link
                  to='/nam'
                  className='text-gray-700 hover:text-primary-600 font-medium transition-colors'
                >
                  Nam
                </Link>
              </li>
              <li>
                <Link
                  to='/nu'
                  className='text-gray-700 hover:text-primary-600 font-medium transition-colors'
                >
                  Nữ
                </Link>
              </li>
              <li>
                <Link
                  to='/tre-em'
                  className='text-gray-700 hover:text-primary-600 font-medium transition-colors'
                >
                  Trẻ em
                </Link>
              </li>
              <li>
                <Link
                  to='/khuyen-mai'
                  className='text-gray-700 hover:text-primary-600 font-medium transition-colors'
                >
                  Khuyến mại
                </Link>
              </li>
            </ul>
          </nav>

          {/* Right Side Icons & Auth */}
          <div className='flex items-center space-x-4'>
            {/* Search Button */}
            <button
              className='p-2 text-gray-600 hover:text-primary-600 hover:bg-gray-100 rounded-lg transition-colors'
              onClick={toggleSearchModal}
              aria-label='Search'
            >
              <HeaderIcons.SearchIcon />
            </button>

            {/* Cart Button */}
            <button
              className='p-2 text-gray-600 hover:text-primary-600 hover:bg-gray-100 rounded-lg transition-colors relative'
              onClick={toggleCartModal}
              aria-label='Shopping Cart'
            >
              <HeaderIcons.CartIcon />
              {/* Cart Badge - you can add item count here */}
              {/* <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">3</span> */}
            </button>

            {/* Wishlist Button */}
            <Link
              to='/wishlist'
              className='p-2 text-gray-600 hover:text-primary-600 hover:bg-gray-100 rounded-lg transition-colors'
              aria-label='Wishlist'
            >
              <HeaderIcons.HeartIcon />
            </Link>

            {/* Authentication Section */}
            {isAuthenticated ? (
              <div className='flex items-center space-x-3'>
                {/* User Profile Link */}
                <Link
                  to='/profile'
                  className='p-2 text-gray-600 hover:text-primary-600 hover:bg-gray-100 rounded-lg transition-colors'
                  aria-label='Profile'
                >
                  <HeaderIcons.UserIcon />
                </Link>

                {/* User Greeting */}
                <span className='hidden lg:block text-sm text-gray-600'>
                  Xin chào, {user?.name || user?.email}!
                </span>

                {/* Admin Panel Link */}
                {user?.role === 'admin' && (
                  <Link
                    to='/admin'
                    className='flex items-center space-x-1 px-3 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors text-sm font-medium'
                  >
                    <i className='fas fa-cogs'></i>
                    <span className='hidden sm:block'>Admin Panel</span>
                  </Link>
                )}

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className='px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium'
                >
                  Đăng xuất
                </button>
              </div>
            ) : (
              <div className='flex items-center space-x-2'>
                <Link
                  to='/dang-nhap'
                  className='px-3 py-2 text-gray-700 hover:text-primary-600 rounded-lg transition-colors text-sm font-medium'
                >
                  Đăng nhập
                </Link>
                <Link
                  to='/dang-ky'
                  className='px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors text-sm font-medium'
                >
                  Đăng ký
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button className='md:hidden p-2 text-gray-600 hover:text-primary-600 hover:bg-gray-100 rounded-lg transition-colors'>
              <svg
                className='w-6 h-6'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M4 6h16M4 12h16M4 18h16'
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Cart Modal */}
      <CartModal
        isOpen={isCartModalOpen}
        onClose={() => setIsCartModalOpen(false)}
      />

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
      />
    </header>
  );
};

export default Header;
