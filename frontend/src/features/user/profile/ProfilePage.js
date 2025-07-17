import React from 'react';
import { useProfile } from './hooks/useProfile';
import ProfileTabs from './components/ProfileTabs';
import ProfileInfoForm from './components/ProfileInfoForm';
import PasswordChangeForm from './components/PasswordChangeForm';
import OrdersList from './components/OrdersList';
import OrderDetailModal from './components/OrderDetailModal';

/**
 * Component chính của trang profile người dùng
 * Tích hợp tất cả các tab và chức năng quản lý tài khoản
 */
const ProfilePage = () => {
  const {
    activeTab,
    profileData,
    passwordData,
    isEditing,
    loading,
    orders,
    loadingOrders,
    selectedOrder,
    setActiveTab,
    setIsEditing,
    handleProfileChange,
    handlePasswordChange,
    handleUpdateProfile,
    handleChangePassword,
    handleViewOrderDetail,
    handleBackToOrdersList,
    handleLogout,
    getOrderStatusBadge,
  } = useProfile();

  return (
    <div className='min-h-screen bg-gray-50 py-8'>
      <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Header */}
        <div className='mb-8'>
          <div className='flex justify-between items-center'>
            <div>
              <h1 className='text-3xl font-bold text-gray-900'>
                Tài khoản của tôi
              </h1>
              <p className='text-gray-600 mt-2'>
                Quản lý thông tin cá nhân và đơn hàng của bạn
              </p>
            </div>

            {/* Nút đăng xuất */}
            <button
              onClick={handleLogout}
              className='px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors'
            >
              <i className='fas fa-sign-out-alt mr-2'></i>
              Đăng xuất
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className='bg-white rounded-2xl shadow-lg overflow-hidden'>
          {/* Navigation Tabs */}
          <div className='px-6 pt-6'>
            <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />
          </div>

          {/* Tab Content */}
          <div className='p-6'>
            {activeTab === 'profile' && (
              <ProfileInfoForm
                profileData={profileData}
                isEditing={isEditing}
                loading={loading}
                onProfileChange={handleProfileChange}
                onUpdateProfile={handleUpdateProfile}
                onToggleEdit={() => setIsEditing(!isEditing)}
              />
            )}

            {activeTab === 'orders' && (
              <>
                {selectedOrder ? (
                  <OrderDetailModal
                    order={selectedOrder}
                    onBack={handleBackToOrdersList}
                    getOrderStatusBadge={getOrderStatusBadge}
                  />
                ) : (
                  <OrdersList
                    orders={orders}
                    loading={loadingOrders}
                    onViewOrderDetail={handleViewOrderDetail}
                    getOrderStatusBadge={getOrderStatusBadge}
                  />
                )}
              </>
            )}

            {activeTab === 'password' && (
              <PasswordChangeForm
                passwordData={passwordData}
                loading={loading}
                onPasswordChange={handlePasswordChange}
                onChangePassword={handleChangePassword}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
