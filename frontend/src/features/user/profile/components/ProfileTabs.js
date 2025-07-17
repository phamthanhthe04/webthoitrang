import React from 'react';

/**
 * Component navigation tabs cho trang profile
 * Bao gồm thông tin cá nhân, đơn hàng, đổi mật khẩu
 */
const ProfileTabs = ({ activeTab, onTabChange }) => {
  const tabs = [
    {
      id: 'profile',
      label: 'Thông tin cá nhân',
      icon: 'fas fa-user',
    },
    {
      id: 'orders',
      label: 'Đơn hàng của tôi',
      icon: 'fas fa-shopping-bag',
    },
    {
      id: 'password',
      label: 'Đổi mật khẩu',
      icon: 'fas fa-lock',
    },
  ];

  return (
    <div className='border-b border-gray-200'>
      <nav className='-mb-px flex space-x-8'>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`
              flex items-center py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap
              ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }
            `}
          >
            <i className={`${tab.icon} mr-2`}></i>
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default ProfileTabs;
