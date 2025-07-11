import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  addToWishlist,
  removeFromWishlist,
  selectIsInWishlist,
} from '../../features/wishlist/wishlistSlice';
import { toast } from 'react-toastify';

const WishlistIcon = ({ productId, size = 'medium' }) => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const isInWishlist = useSelector(selectIsInWishlist(productId));

  const handleToggleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error('Vui lòng đăng nhập để sử dụng tính năng yêu thích!');
      return;
    }

    try {
      if (isInWishlist) {
        await dispatch(removeFromWishlist(productId)).unwrap();
        toast.success('Đã xóa khỏi danh sách yêu thích!');
      } else {
        await dispatch(addToWishlist(productId)).unwrap();
        toast.success('Đã thêm vào danh sách yêu thích!');
      }
    } catch (error) {
      toast.error(error || 'Có lỗi xảy ra!');
    }
  };

  const sizeClasses = {
    small: 'w-8 h-8 text-sm',
    medium: 'w-10 h-10 text-base',
    large: 'w-12 h-12 text-lg',
  };

  return (
    <button
      className={`
        ${sizeClasses[size]} 
        ${
          isInWishlist
            ? 'bg-red-500 text-white hover:bg-red-600'
            : 'bg-white text-gray-600 hover:bg-red-50 hover:text-red-500'
        } 
        rounded-full shadow-lg border-2 border-white 
        flex items-center justify-center 
        transition-all duration-200 
        hover:scale-110 
        focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2
      `}
      onClick={handleToggleWishlist}
      title={isInWishlist ? 'Xóa khỏi yêu thích' : 'Thêm vào yêu thích'}
    >
      <i className={`fas fa-heart ${isInWishlist ? 'animate-pulse' : ''}`}></i>
    </button>
  );
};

export default WishlistIcon;
