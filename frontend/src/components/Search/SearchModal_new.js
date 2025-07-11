import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProducts } from '../../services/productService';

const SearchModal = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [popularProducts, setPopularProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate();
  const searchInputRef = useRef(null);

  const popularSearches = [
    'Áo thun',
    'Quần jean',
    'Váy',
    'Áo khoác',
    'Giày sneaker',
    'Túi xách',
    'Đầm',
    'Áo sơ mi',
  ];

  useEffect(() => {
    if (isOpen) {
      // Focus vào input khi modal mở
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);

      // Load popular products
      fetchPopularProducts();
    } else {
      // Reset state khi modal đóng
      setSearchTerm('');
      setSearchResults([]);
      setShowResults(false);
    }
  }, [isOpen]);

  const fetchPopularProducts = async () => {
    try {
      const response = await getProducts({ limit: 6, featured: true });
      const products = response.data?.data?.products || response.data || [];
      setPopularProducts(products);
    } catch (error) {
      console.error('Error fetching popular products:', error);
    }
  };

  const handleSearch = async (term) => {
    if (!term.trim()) {
      setShowResults(false);
      return;
    }

    setLoading(true);
    setShowResults(true);

    try {
      const response = await getProducts({ search: term, limit: 8 });
      const products = response.data?.data?.products || response.data || [];
      setSearchResults(products);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    // Debounce search
    const timeoutId = setTimeout(() => {
      handleSearch(value);
    }, 300);

    return () => clearTimeout(timeoutId);
  };

  const handleProductClick = (product) => {
    const slug = product.slug || product.id;
    navigate(`/san-pham/${slug}`);
    onClose();
    setSearchTerm('');
  };

  const handlePopularSearchClick = (searchText) => {
    setSearchTerm(searchText);
    handleSearch(searchText);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/?search=${encodeURIComponent(searchTerm.trim())}`);
      onClose();
      setSearchTerm('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-start justify-center pt-16'>
      {/* Backdrop */}
      <div className='fixed inset-0 bg-black bg-opacity-50' onClick={onClose} />

      {/* Modal */}
      <div className='relative bg-white rounded-2xl shadow-xl w-full max-w-2xl mx-4 max-h-[80vh] overflow-hidden'>
        {/* Header */}
        <div className='flex justify-between items-center p-6 border-b border-gray-200'>
          <h3 className='text-xl font-semibold text-gray-900'>
            Tìm kiếm sản phẩm
          </h3>
          <button
            className='text-gray-400 hover:text-gray-600 transition-colors'
            onClick={onClose}
          >
            <i className='fas fa-times text-xl'></i>
          </button>
        </div>

        {/* Search Form */}
        <div className='p-6 pb-4'>
          <form onSubmit={handleSearchSubmit}>
            <div className='relative'>
              <input
                ref={searchInputRef}
                type='text'
                placeholder='Tìm kiếm sản phẩm...'
                value={searchTerm}
                onChange={handleInputChange}
                className='w-full pl-4 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-lg'
              />
              <button
                type='submit'
                className='absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-primary-600 transition-colors'
              >
                <i className='fas fa-search'></i>
              </button>
            </div>
          </form>
        </div>

        {/* Content */}
        <div className='px-6 pb-6 max-h-96 overflow-y-auto'>
          {!showResults ? (
            <>
              {/* Popular Searches */}
              <div className='mb-6'>
                <h4 className='text-lg font-medium text-gray-900 mb-3'>
                  Tìm kiếm phổ biến
                </h4>
                <div className='flex flex-wrap gap-2'>
                  {popularSearches.map((search, index) => (
                    <button
                      key={index}
                      className='px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-primary-100 hover:text-primary-700 transition-colors'
                      onClick={() => handlePopularSearchClick(search)}
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>

              {/* Popular Products */}
              {popularProducts.length > 0 && (
                <div>
                  <h4 className='text-lg font-medium text-gray-900 mb-3'>
                    Sản phẩm nổi bật
                  </h4>
                  <div className='grid grid-cols-2 gap-4'>
                    {popularProducts.map((product) => (
                      <div
                        key={product.id}
                        className='flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors'
                        onClick={() => handleProductClick(product)}
                      >
                        <img
                          src={
                            product.images?.[0]
                              ? `http://localhost:5000${product.images[0]}`
                              : '/no-image.png'
                          }
                          alt={product.name}
                          className='w-12 h-12 object-cover rounded-lg'
                        />
                        <div className='flex-1 min-w-0'>
                          <h5 className='text-sm font-medium text-gray-900 truncate'>
                            {product.name}
                          </h5>
                          <p className='text-sm text-primary-600 font-semibold'>
                            {Number(
                              product.sale_price || product.price
                            ).toLocaleString('vi-VN')}{' '}
                            đ
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div>
              <h4 className='text-lg font-medium text-gray-900 mb-3'>
                Kết quả tìm kiếm ({searchResults.length})
              </h4>

              {loading ? (
                <div className='flex items-center justify-center py-8'>
                  <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600'></div>
                  <span className='ml-2 text-gray-600'>Đang tìm kiếm...</span>
                </div>
              ) : searchResults.length > 0 ? (
                <div className='space-y-3'>
                  {searchResults.map((product) => (
                    <div
                      key={product.id}
                      className='flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors'
                      onClick={() => handleProductClick(product)}
                    >
                      <img
                        src={
                          product.images?.[0]
                            ? `http://localhost:5000${product.images[0]}`
                            : '/no-image.png'
                        }
                        alt={product.name}
                        className='w-16 h-16 object-cover rounded-lg'
                      />
                      <div className='flex-1 min-w-0'>
                        <h5 className='text-base font-medium text-gray-900 truncate'>
                          {product.name}
                        </h5>
                        <p className='text-sm text-gray-500 truncate mt-1'>
                          {product.description}
                        </p>
                        <div className='flex items-center space-x-2 mt-2'>
                          <span className='text-lg font-semibold text-primary-600'>
                            {Number(
                              product.sale_price || product.price
                            ).toLocaleString('vi-VN')}{' '}
                            đ
                          </span>
                          {product.sale_price &&
                            product.price > product.sale_price && (
                              <span className='text-sm text-gray-500 line-through'>
                                {Number(product.price).toLocaleString('vi-VN')}{' '}
                                đ
                              </span>
                            )}
                        </div>
                      </div>
                      <div className='text-gray-400'>
                        <i className='fas fa-chevron-right'></i>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className='text-center py-8'>
                  <div className='text-gray-400 text-4xl mb-3'>
                    <i className='fas fa-search'></i>
                  </div>
                  <p className='text-gray-600'>Không tìm thấy sản phẩm nào</p>
                  <p className='text-sm text-gray-500 mt-1'>
                    Thử tìm kiếm với từ khóa khác
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
