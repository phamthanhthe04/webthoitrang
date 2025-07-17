import React from 'react';

/**
 * Component form đổi mật khẩu
 * Bao gồm mật khẩu hiện tại, mật khẩu mới và xác nhận
 */
const PasswordChangeForm = ({
  passwordData,
  loading,
  onPasswordChange,
  onChangePassword,
}) => {
  return (
    <div className='bg-white p-6 rounded-lg border border-gray-200'>
      <h3 className='text-lg font-semibold text-gray-900 mb-6'>Đổi mật khẩu</h3>

      <form onSubmit={onChangePassword} className='max-w-md'>
        <div className='space-y-4'>
          {/* Mật khẩu hiện tại */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Mật khẩu hiện tại
            </label>
            <input
              type='password'
              name='currentPassword'
              value={passwordData.currentPassword}
              onChange={onPasswordChange}
              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent'
              required
            />
          </div>

          {/* Mật khẩu mới */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Mật khẩu mới
            </label>
            <input
              type='password'
              name='newPassword'
              value={passwordData.newPassword}
              onChange={onPasswordChange}
              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent'
              minLength='6'
              required
            />
            <p className='text-sm text-gray-600 mt-1'>
              Mật khẩu phải có ít nhất 6 ký tự
            </p>
          </div>

          {/* Xác nhận mật khẩu mới */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Xác nhận mật khẩu mới
            </label>
            <input
              type='password'
              name='confirmPassword'
              value={passwordData.confirmPassword}
              onChange={onPasswordChange}
              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent'
              required
            />
          </div>
        </div>

        {/* Nút đổi mật khẩu */}
        <div className='mt-6'>
          <button
            type='submit'
            disabled={loading}
            className='px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors'
          >
            {loading ? (
              <div className='flex items-center'>
                <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2'></div>
                Đang xử lý...
              </div>
            ) : (
              <>
                <i className='fas fa-key mr-2'></i>
                Đổi mật khẩu
              </>
            )}
          </button>
        </div>
      </form>

      {/* Lưu ý bảo mật */}
      <div className='mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg'>
        <h4 className='font-medium text-blue-900 mb-2'>
          <i className='fas fa-info-circle mr-2'></i>
          Lưu ý bảo mật
        </h4>
        <ul className='text-sm text-blue-700 space-y-1'>
          <li>• Sử dụng mật khẩu mạnh với ít nhất 6 ký tự</li>
          <li>• Kết hợp chữ hoa, chữ thường, số và ký tự đặc biệt</li>
          <li>• Không chia sẻ mật khẩu với bất kỳ ai</li>
          <li>• Thay đổi mật khẩu định kỳ để đảm bảo an toàn</li>
        </ul>
      </div>
    </div>
  );
};

export default PasswordChangeForm;
