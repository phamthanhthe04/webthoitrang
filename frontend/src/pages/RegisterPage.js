import React, { useState } from 'react';
import authService from '../services/authService';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await authService.register(formData);
      setSuccess('Đăng ký thành công!');
      setTimeout(() => navigate('/dang-nhap'), 1500);
    } catch (error) {
      setError(error || 'Đăng ký thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8'>
      <div className='w-full max-w-md'>
        <div className='bg-white rounded-2xl shadow-lg p-8'>
          <div className='text-center mb-8'>
            <h2 className='text-3xl font-bold text-gray-900'>Đăng ký</h2>
            <p className='text-gray-600 mt-2'>
              Tạo tài khoản mới để bắt đầu mua sắm
            </p>
          </div>

          <form onSubmit={handleSubmit} className='space-y-6'>
            {error && (
              <div className='bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg'>
                {error}
              </div>
            )}
            {success && (
              <div className='bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg'>
                {success}
              </div>
            )}

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Họ tên
                </label>
                <div className='relative'>
                  <input
                    type='text'
                    name='name'
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder='Nhập họ tên'
                    className='w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors'
                  />
                  <i className='fas fa-user absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400'></i>
                </div>
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Email
                </label>
                <div className='relative'>
                  <input
                    type='email'
                    name='email'
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder='Nhập email'
                    className='w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors'
                  />
                  <i className='fas fa-envelope absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400'></i>
                </div>
              </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Mật khẩu
                </label>
                <div className='relative'>
                  <input
                    type='password'
                    name='password'
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder='Nhập mật khẩu'
                    className='w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors'
                  />
                  <i className='fas fa-lock absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400'></i>
                </div>
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Số điện thoại
                </label>
                <div className='relative'>
                  <input
                    type='text'
                    name='phone'
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder='Nhập số điện thoại'
                    className='w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors'
                  />
                  <i className='fas fa-phone absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400'></i>
                </div>
              </div>
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Địa chỉ
              </label>
              <div className='relative'>
                <input
                  type='text'
                  name='address'
                  value={formData.address}
                  onChange={handleChange}
                  placeholder='Nhập địa chỉ'
                  className='w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors'
                />
                <i className='fas fa-map-marker-alt absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400'></i>
              </div>
            </div>

            <div className='flex items-center'>
              <input
                type='checkbox'
                required
                className='h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded'
              />
              <label className='ml-2 block text-sm text-gray-700'>
                Tôi đồng ý với{' '}
                <button
                  type='button'
                  className='text-primary-600 hover:text-primary-700 underline'
                >
                  Điều khoản dịch vụ
                </button>
              </label>
            </div>

            <button
              type='submit'
              disabled={loading}
              className='w-full bg-primary-600 text-white py-3 px-4 rounded-lg hover:bg-primary-700 focus:ring-4 focus:ring-primary-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium'
            >
              {loading ? (
                <div className='flex items-center justify-center'>
                  <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2'></div>
                  Đang đăng ký...
                </div>
              ) : (
                <div className='flex items-center justify-center'>
                  <i className='fas fa-user-plus mr-2'></i>
                  Đăng ký
                </div>
              )}
            </button>
          </form>

          <div className='mt-8 relative'>
            <div className='absolute inset-0 flex items-center'>
              <div className='w-full border-t border-gray-300'></div>
            </div>
            <div className='relative flex justify-center text-sm'>
              <span className='px-2 bg-white text-gray-500'>
                Hoặc đăng ký với
              </span>
            </div>
          </div>

          <div className='mt-6 grid grid-cols-2 gap-3'>
            <button className='w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors'>
              <i className='fab fa-google text-red-500 mr-2'></i>
              Google
            </button>
            <button className='w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors'>
              <i className='fab fa-facebook-f text-blue-600 mr-2'></i>
              Facebook
            </button>
          </div>

          <div className='mt-6 text-center'>
            <p className='text-sm text-gray-600'>
              Đã có tài khoản?{' '}
              <a
                href='/dang-nhap'
                className='font-medium text-primary-600 hover:text-primary-700'
              >
                Đăng nhập ngay
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
