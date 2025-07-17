import React from 'react';

/**
 * Component modal tái sử dụng cho admin với các tùy chọn linh hoạt
 * @param {boolean} show - Hiển thị modal hay không
 * @param {Function} onClose - Hàm đóng modal
 * @param {string} title - Tiêu đề modal
 * @param {ReactNode} children - Nội dung bên trong modal
 * @param {string} size - Kích thước modal ('small', 'default', 'large', 'extra-large')
 * @param {Function} onConfirm - Hàm xác nhận (chỉ dùng khi showFooter=true)
 * @param {string} confirmText - Text button xác nhận
 * @param {string} cancelText - Text button hủy
 * @param {string} confirmButtonClass - CSS class cho button xác nhận
 * @param {boolean} showFooter - Hiển thị footer với buttons hay không
 * @param {boolean} loading - Trạng thái loading cho button
 */
const AdminModal = ({
  show,
  onClose,
  title,
  children,
  size = 'default', // 'small', 'default', 'large'
  onConfirm,
  confirmText = 'Xác nhận',
  cancelText = 'Hủy',
  confirmButtonClass = 'bg-blue-600 hover:bg-blue-700',
  showFooter = false,
  loading = false,
}) => {
  // Không render gì nếu modal không được hiển thị
  if (!show) return null;

  // Định nghĩa các class CSS cho các size khác nhau
  const sizeClasses = {
    small: 'max-w-md',
    default: 'max-w-lg',
    large: 'max-w-2xl',
    'extra-large': 'max-w-4xl',
  };

  return (
    <div className='fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50'>
      {/* Container modal với kích thước responsive */}
      <div
        className={`relative top-20 mx-auto p-5 border ${sizeClasses[size]} shadow-lg rounded-md bg-white`}
      >
        <div className='mt-3'>
          {/* Header của modal với title và button đóng */}
          <div className='flex justify-between items-center mb-4'>
            <h3 className='text-lg font-medium text-gray-900'>{title}</h3>
            <button
              onClick={onClose}
              className='text-gray-400 hover:text-gray-600 transition-colors'
            >
              <i className='fas fa-times'></i>
            </button>
          </div>

          {/* Nội dung chính của modal */}
          <div className='mb-4'>{children}</div>

          {/* Footer với các button action (chỉ hiển thị khi showFooter=true) */}
          {showFooter && (
            <div className='flex justify-end space-x-3'>
              <button
                type='button'
                onClick={onClose}
                className='px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors'
                disabled={loading} // Disable khi đang loading
              >
                {cancelText}
              </button>
              <button
                type='button'
                onClick={onConfirm}
                className={`px-4 py-2 text-white rounded-md transition-colors ${confirmButtonClass} ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                disabled={loading}
              >
                {loading ? (
                  // Hiển thị spinner khi đang loading
                  <div className='flex items-center'>
                    <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2'></div>
                    Đang xử lý...
                  </div>
                ) : (
                  confirmText
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminModal;
