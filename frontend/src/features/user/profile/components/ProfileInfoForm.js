import React from 'react';

/**
 * Component form thông tin cá nhân
 * Cho phép xem và chỉnh sửa thông tin user
 */
const ProfileInfoForm = ({
  profileData,
  isEditing,
  loading,
  onProfileChange,
  onUpdateProfile,
  onToggleEdit,
}) => {
  return (
    <div className='bg-white p-6 rounded-lg border border-gray-200'>
      <div className='flex justify-between items-center mb-6'>
        <h3 className='text-lg font-semibold text-gray-900'>
          Thông tin cá nhân
        </h3>
        <button
          onClick={onToggleEdit}
          className='px-4 py-2 text-sm font-medium text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-colors'
        >
          <i className={`fas ${isEditing ? 'fa-times' : 'fa-edit'} mr-2`}></i>
          {isEditing ? 'Hủy' : 'Chỉnh sửa'}
        </button>
      </div>

      <form onSubmit={onUpdateProfile}>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          {/* Họ tên */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Họ và tên
            </label>
            <input
              type='text'
              name='name'
              value={profileData.name}
              onChange={onProfileChange}
              disabled={!isEditing}
              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500'
            />
          </div>

          {/* Email */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Email
            </label>
            <input
              type='email'
              name='email'
              value={profileData.email}
              onChange={onProfileChange}
              disabled={!isEditing}
              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500'
            />
          </div>

          {/* Số điện thoại */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Số điện thoại
            </label>
            <input
              type='tel'
              name='phone'
              value={profileData.phone}
              onChange={onProfileChange}
              disabled={!isEditing}
              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500'
            />
          </div>

          {/* Địa chỉ */}
          <div className='md:col-span-2'>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Địa chỉ
            </label>
            <textarea
              name='address'
              value={profileData.address}
              onChange={onProfileChange}
              disabled={!isEditing}
              rows='3'
              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500'
            />
          </div>
        </div>

        {/* Nút lưu khi đang chỉnh sửa */}
        {isEditing && (
          <div className='mt-6 flex justify-end'>
            <button
              type='submit'
              disabled={loading}
              className='px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors'
            >
              {loading ? (
                <div className='flex items-center'>
                  <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2'></div>
                  Đang lưu...
                </div>
              ) : (
                <>
                  <i className='fas fa-save mr-2'></i>
                  Lưu thay đổi
                </>
              )}
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default ProfileInfoForm;
