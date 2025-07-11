import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import debounce from 'lodash/debounce';
import { searchProducts } from '../../features/products/productsSlice';

const SearchContainer = styled.div`
  position: relative;
`;

const SearchInput = styled.input`
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 300px;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const SuggestionsList = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  max-height: 400px;
  overflow-y: auto;
  z-index: 1000;
`;

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const suggestions = useSelector((state) => state.products.searchResults);

  const debouncedSearch = useCallback(
    debounce((term) => {
      if (term.length >= 2) {
        setIsLoading(true);
        dispatch(searchProducts(term)).finally(() => setIsLoading(false));
      }
    }, 300),
    []
  );

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedSearch(value);
  };

  return (
    <SearchContainer>
      <SearchInput
        type='text'
        placeholder='Tìm kiếm sản phẩm...'
        value={searchTerm}
        onChange={handleSearch}
        aria-label='Search products'
      />

      {isLoading && <div className='loading-spinner' />}

      {suggestions.length > 0 && (
        <SuggestionsList>
          {suggestions.map((product) => (
            <div key={product.id} className='suggestion-item'>
              <img src={product.thumbnail} alt={product.name} />
              <div>
                <h4>{product.name}</h4>
                <p>{product.price.toLocaleString('vi-VN')}đ</p>
              </div>
            </div>
          ))}
        </SuggestionsList>
      )}
    </SearchContainer>
  );
};

export default SearchBar;
