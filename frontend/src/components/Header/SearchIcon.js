import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

const SearchIcon = () => {
  return (
    <div className='header-icon'>
      <FontAwesomeIcon icon={faSearch} className='icon' />
      <span className='icon-text'>Tìm kiếm</span>
    </div>
  );
};

export default SearchIcon;
