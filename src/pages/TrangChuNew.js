import React, { useEffect, useState } from 'react';
import { getProducts } from '../services/productService';
import { useSearchParams } from 'react-router-dom';
import ProductGrid from '../components/Product/ProductGrid';

const TrangChu = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get search params from URL
        const searchQuery = searchParams.get('search');
        const params = {};
        if (searchQuery) {
          params.search = searchQuery;
        }

        const res = await getProducts(params);

        // Handle different response structures
        if (res?.data?.data?.products) {
          setProducts(res.data.data.products);
        } else if (res && res.data && Array.isArray(res.data)) {
          setProducts(res.data);
        } else if (res && Array.isArray(res)) {
          setProducts(res);
        } else {
          console.warn('Cấu trúc dữ liệu sản phẩm không như mong đợi:', res);
          setProducts([]);
        }
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Không thể tải danh sách sản phẩm. Vui lòng thử lại sau.');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchParams]);

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Hero Section */}
      <section className='bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-20'>
        <div className='container mx-auto px-4 text-center'>
          <h1 className='text-4xl md:text-6xl font-bold mb-6 animate-fade-in'>
            {searchParams.get('search')
              ? `Kết quả tìm kiếm: "${searchParams.get('search')}"`
              : 'Thời Trang Hiện Đại'}
          </h1>
          <p className='text-xl md:text-2xl opacity-90 animate-slide-up'>
            {searchParams.get('search')
              ? `Tìm thấy ${products.length} sản phẩm`
              : 'Khám phá bộ sưu tập thời trang mới nhất'}
          </p>
        </div>
      </section>

      {/* Products Section */}
      <section className='py-16'>
        <div className='container mx-auto px-4'>
          {/* Section Header */}
          <div className='text-center mb-12'>
            <h2 className='text-3xl font-bold text-gray-800 mb-4'>
              {searchParams.get('search')
                ? 'Kết quả tìm kiếm'
                : 'Sản phẩm nổi bật'}
            </h2>
            <div className='w-24 h-1 bg-blue-500 mx-auto rounded-full'></div>
          </div>

          {/* Products Grid */}
          <ProductGrid
            products={products}
            loading={loading}
            error={error}
            emptyMessage={
              searchParams.get('search')
                ? `Không tìm thấy sản phẩm nào cho "${searchParams.get(
                    'search'
                  )}"`
                : 'Chưa có sản phẩm nào'
            }
          />

          {/* Load More Button */}
          {products.length > 0 && !loading && (
            <div className='text-center mt-12'>
              <button className='bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105'>
                Xem thêm sản phẩm
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default TrangChu;
