import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className='bg-gray-900 text-white'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 py-12'>
          {/* Thông tin cơ sở */}
          <div className='space-y-4'>
            <h3 className='text-lg font-semibold text-white mb-4'>
              Thông tin cơ sở
            </h3>
            <div className='space-y-2 text-gray-300'>
              <p className='font-semibold text-white'>Fashion Store</p>
              <p className='flex items-center'>
                <i className='fas fa-map-marker-alt mr-2'></i>
                Đình Quán, Bắc Từ Liêm, Hà Nội
              </p>
              <p className='flex items-center'>
                <i className='fas fa-phone mr-2'></i>
                Hotline: 0908 098 876
              </p>
              <p className='flex items-center'>
                <i className='fas fa-envelope mr-2'></i>
                Email: thephamnb@gmail.vn
              </p>
              <p className='flex items-center'>
                <i className='fas fa-clock mr-2'></i>
                Giờ mở cửa: 8:00 - 22:00 (Thứ 2 - CN)
              </p>
            </div>
          </div>

          {/* Liên hệ và mạng xã hội */}
          <div className='space-y-4'>
            <h3 className='text-lg font-semibold text-white mb-4'>
              Liên hệ & Theo dõi
            </h3>
            <div className='space-y-3'>
              <a
                href='https://facebook.com'
                target='_blank'
                rel='noopener noreferrer'
                className='flex items-center text-gray-300 hover:text-blue-400 transition-colors'
              >
                <i className='fab fa-facebook-f mr-3 w-5'></i>
                Facebook
              </a>
              <a
                href='https://instagram.com'
                target='_blank'
                rel='noopener noreferrer'
                className='flex items-center text-gray-300 hover:text-pink-400 transition-colors'
              >
                <i className='fab fa-instagram mr-3 w-5'></i>
                Instagram
              </a>
              <a
                href='https://youtube.com'
                target='_blank'
                rel='noopener noreferrer'
                className='flex items-center text-gray-300 hover:text-red-400 transition-colors'
              >
                <i className='fab fa-youtube mr-3 w-5'></i>
                YouTube
              </a>
              <a
                href='https://tiktok.com'
                target='_blank'
                rel='noopener noreferrer'
                className='flex items-center text-gray-300 hover:text-purple-400 transition-colors'
              >
                <i className='fab fa-tiktok mr-3 w-5'></i>
                TikTok
              </a>
            </div>

            <div className='mt-6'>
              <h4 className='text-sm font-semibold text-white mb-2'>
                Phương thức thanh toán
              </h4>
              <div className='flex flex-wrap gap-2 text-sm text-gray-300'>
                <span className='bg-gray-800 px-2 py-1 rounded'>💳 Visa</span>
                <span className='bg-gray-800 px-2 py-1 rounded'>
                  💳 MasterCard
                </span>
                <span className='bg-gray-800 px-2 py-1 rounded'>🏦 ATM</span>
                <span className='bg-gray-800 px-2 py-1 rounded'>📱 MoMo</span>
              </div>
            </div>
          </div>

          {/* Chính sách */}
          <div className='space-y-4'>
            <h3 className='text-lg font-semibold text-white mb-4'>
              Chính sách
            </h3>
            <ul className='space-y-2'>
              <li>
                <Link
                  to='/chinh-sach-bao-mat'
                  className='text-gray-300 hover:text-white transition-colors'
                >
                  Chính sách bảo mật
                </Link>
              </li>
              <li>
                <Link
                  to='/chinh-sach-doi-tra'
                  className='text-gray-300 hover:text-white transition-colors'
                >
                  Chính sách đổi trả
                </Link>
              </li>
              <li>
                <Link
                  to='/chinh-sach-giao-hang'
                  className='text-gray-300 hover:text-white transition-colors'
                >
                  Chính sách giao hàng
                </Link>
              </li>
              <li>
                <Link
                  to='/huong-dan-mua-hang'
                  className='text-gray-300 hover:text-white transition-colors'
                >
                  Hướng dẫn mua hàng
                </Link>
              </li>
              <li>
                <Link
                  to='/dieu-khoan-su-dung'
                  className='text-gray-300 hover:text-white transition-colors'
                >
                  Điều khoản sử dụng
                </Link>
              </li>
            </ul>
          </div>

          {/* Tin tức và hỗ trợ */}
          <div className='space-y-4'>
            <h3 className='text-lg font-semibold text-white mb-4'>
              Hỗ trợ khách hàng
            </h3>
            <ul className='space-y-2 mb-6'>
              <li>
                <Link
                  to='/lien-he'
                  className='text-gray-300 hover:text-white transition-colors'
                >
                  Liên hệ
                </Link>
              </li>
              <li>
                <Link
                  to='/faq'
                  className='text-gray-300 hover:text-white transition-colors'
                >
                  Câu hỏi thường gặp
                </Link>
              </li>
              <li>
                <Link
                  to='/huong-dan-thanh-toan'
                  className='text-gray-300 hover:text-white transition-colors'
                >
                  Hướng dẫn thanh toán
                </Link>
              </li>
              <li>
                <Link
                  to='/kiem-tra-don-hang'
                  className='text-gray-300 hover:text-white transition-colors'
                >
                  Kiểm tra đơn hàng
                </Link>
              </li>
              <li>
                <Link
                  to='/bao-hanh'
                  className='text-gray-300 hover:text-white transition-colors'
                >
                  Chính sách bảo hành
                </Link>
              </li>
            </ul>

            <div className='bg-gray-800 rounded-lg p-4'>
              <h4 className='text-sm font-semibold text-white mb-2'>
                Đăng ký nhận tin
              </h4>
              <p className='text-sm text-gray-300 mb-3'>
                Nhận thông tin khuyến mãi mới nhất
              </p>
              <div className='flex'>
                <input
                  type='email'
                  placeholder='Nhập email của bạn'
                  className='flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-l-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500'
                />
                <button className='px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-r-lg transition-colors'>
                  Đăng ký
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className='border-t border-gray-800 py-6'>
          <div className='flex flex-col md:flex-row justify-between items-center'>
            <div className='text-center md:text-left mb-4 md:mb-0'>
              <p className='text-gray-400 text-sm'>
                &copy; 2025 Fashion Store. Tất cả quyền được bảo lưu.
              </p>
              <p className='text-gray-400 text-sm'>
                Thiết kế bởi{' '}
                <strong className='text-white'>Fashion Team</strong>
              </p>
            </div>
            <div className='flex space-x-4 text-sm text-gray-400'>
              <span className='flex items-center'>
                <i className='fas fa-award mr-1'></i>
                Chứng nhận bởi Bộ Công Thương
              </span>
              <span className='flex items-center'>
                <i className='fas fa-shield-alt mr-1'></i>
                An toàn & Bảo mật
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
