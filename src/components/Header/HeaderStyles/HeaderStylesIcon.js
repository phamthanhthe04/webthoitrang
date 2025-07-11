import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useSelector } from 'react-redux';
import { selectCartTotalQuantity } from '../../../features/cart/cartSlice';
import {
  faSearch,
  faUser,
  faShoppingCart,
  faHeart,
  faPhone,
  faEnvelope,
  faTruck,
  faMapMarkerAlt,
  faBars,
  faGlobe,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';

// Icon Tìm kiếm
export const SearchIcon = () => <FontAwesomeIcon icon={faSearch} />;

// Icon Tài khoản
export const UserIcon = () => <FontAwesomeIcon icon={faUser} />;

// Icon Giỏ hàng với badge
export const CartIcon = () => {
  const cartQuantity = useSelector(selectCartTotalQuantity);

  return (
    <div className='cart-icon-container'>
      <FontAwesomeIcon icon={faShoppingCart} />
      {cartQuantity > 0 && (
        <span className='cart-badge'>
          {cartQuantity > 99 ? '99+' : cartQuantity}
        </span>
      )}
    </div>
  );
};

// Icon Yêu thích
export const HeartIcon = () => <FontAwesomeIcon icon={faHeart} />;

// Icon Điện thoại
export const PhoneIcon = () => <FontAwesomeIcon icon={faPhone} />;

// Icon Email
export const EmailIcon = () => <FontAwesomeIcon icon={faEnvelope} />;

// Icon Vận chuyển
export const ShippingIcon = () => <FontAwesomeIcon icon={faTruck} />;

// Icon Địa chỉ
export const LocationIcon = () => <FontAwesomeIcon icon={faMapMarkerAlt} />;

// Icon Menu (hamburger)
export const MenuIcon = () => <FontAwesomeIcon icon={faBars} />;

// Icon Ngôn ngữ
export const LanguageIcon = () => <FontAwesomeIcon icon={faGlobe} />;

// Icon Đóng (X)
export const CloseIcon = () => <FontAwesomeIcon icon={faTimes} />;

// Tạo object chứa tất cả icon để dễ import
export const HeaderIcons = {
  SearchIcon,
  UserIcon,
  CartIcon,
  HeartIcon,
  PhoneIcon,
  EmailIcon,
  ShippingIcon,
  LocationIcon,
  MenuIcon,
  LanguageIcon,
  CloseIcon,
};

export default HeaderIcons;
