import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { categoryService } from '../services/categoryService';
import ProductGrid from './Product/ProductGrid';

const CategoryPage = ({ categoryType }) => {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Mapping category types to slugs
    const categoryMap = {
      nam: ['ao-nam', 'quan-nam', 'giay-nam'],
      nu: ['ao-nu', 'quan-nu', 'giay-nu'],
      'tre-em': ['ao-tre-em', 'quan-tre-em', 'giay-tre-em'],
    };

    const fetchCategoryProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        // Lấy tất cả categories trước
        const categoriesRes = await categoryService.getCategories();
        const allCategories =
          categoriesRes.data?.data || categoriesRes.data || [];

        // Filter categories theo type
        const relevantSlugs = categoryMap[categoryType] || [];
        const relevantCategories = allCategories.filter(
          (cat) =>
            relevantSlugs.some((slug) =>
              cat.slug?.includes(slug.split('-')[1])
            ) || // includes 'nam', 'nu', 'tre-em'
            cat.name?.toLowerCase().includes(categoryType)
        );

        if (relevantCategories.length === 0) {
          setProducts([]);
          setCategory({ name: `Sản phẩm ${categoryType}`, slug: categoryType });
          return;
        }

        // Lấy products từ tất cả categories liên quan
        const allProducts = [];
        for (const cat of relevantCategories) {
          try {
            const productsRes = await categoryService.getProductsByCategorySlug(
              cat.slug
            );
            const categoryProducts =
              productsRes.data?.data || productsRes.data || [];
            allProducts.push(...categoryProducts);
          } catch (err) {
            console.warn(
              `Error fetching products for category ${cat.slug}:`,
              err
            );
          }
        }

        setProducts(allProducts);
        setCategory({
          name: `Sản phẩm ${categoryType}`,
          description: `Bộ sưu tập thời trang dành cho ${categoryType}`,
          slug: categoryType,
        });
      } catch (err) {
        console.error('Error fetching category products:', err);
        setError(`Không thể tải sản phẩm ${categoryType}`);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    if (categoryType) {
      fetchCategoryProducts();
    }
  }, [categoryType]);

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gray-50'>
        <div className='text-center'>
          <div className='loading-spinner mx-auto mb-4'></div>
          <p className='text-gray-600 text-lg'>
            🔄 Đang tải sản phẩm {categoryType}...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gray-50'>
        <div className='text-center max-w-md mx-auto'>
          <div className='text-red-500 text-6xl mb-4'>❌</div>
          <h2 className='text-2xl font-bold text-gray-800 mb-2'>
            Có lỗi xảy ra
          </h2>
          <p className='text-gray-600'>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className='mt-4 bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg transition-colors'
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Category Header */}
      <section className='bg-gradient-to-r from-primary-500 to-purple-600 text-white py-16'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
          <h1 className='text-4xl md:text-5xl font-bold mb-4'>
            {category?.name || `Sản phẩm ${categoryType}`}
          </h1>
          {category?.description && (
            <p className='text-xl opacity-90 mb-4'>{category.description}</p>
          )}
          <div className='text-lg opacity-80'>
            {products.length > 0
              ? `${products.length} sản phẩm`
              : 'Chưa có sản phẩm nào'}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className='py-16'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          {products.length === 0 ? (
            <div className='text-center max-w-md mx-auto'>
              <div className='text-gray-400 text-6xl mb-4'>📦</div>
              <h3 className='text-2xl font-bold text-gray-800 mb-2'>
                Chưa có sản phẩm {categoryType}
              </h3>
              <p className='text-gray-600 mb-6'>
                Hãy quay lại sau để xem các sản phẩm mới nhất!
              </p>
              <Link
                to='/'
                className='inline-block bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg transition-colors'
              >
                ← Quay về trang chủ
              </Link>
            </div>
          ) : (
            <ProductGrid
              products={products}
              loading={loading}
              error={error}
              emptyMessage={`Chưa có sản phẩm ${categoryType}`}
            />
          )}
        </div>
      </section>
    </div>
  );
};

export default CategoryPage;
