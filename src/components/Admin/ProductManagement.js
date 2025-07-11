import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../../features/products/productsSlice';

const ProductManagement = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    category: '',
    stock: '',
    imageUrl: '',
  });

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedProduct) {
        await dispatch(
          updateProduct({ id: selectedProduct.id, ...formData })
        ).unwrap();
      } else {
        await dispatch(createProduct(formData)).unwrap();
      }
      resetForm();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      price: product.price,
      description: product.description,
      category: product.category,
      stock: product.stock,
      imageUrl: product.image_url,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
      try {
        await dispatch(deleteProduct(id)).unwrap();
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  const resetForm = () => {
    setSelectedProduct(null);
    setFormData({
      name: '',
      price: '',
      description: '',
      category: '',
      stock: '',
      imageUrl: '',
    });
    setIsModalOpen(false);
  };

  if (loading) return <div className='loading'>Đang tải...</div>;
  if (error) return <div className='error'>{error}</div>;

  return (
    <div className='product-management'>
      <div className='product-management__header'>
        <h2>Quản lý Sản phẩm</h2>
        <button
          className='button button-primary'
          onClick={() => setIsModalOpen(true)}
        >
          Thêm Sản phẩm
        </button>
      </div>

      {/* Product List */}
      <div className='product-table-container'>
        <table className='product-table'>
          <thead>
            <tr>
              <th>Hình ảnh</th>
              <th>Tên sản phẩm</th>
              <th>Giá</th>
              <th>Danh mục</th>
              <th>Tồn kho</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className='product-image'
                  />
                </td>
                <td>{product.name}</td>
                <td>
                  {new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND',
                  }).format(product.price)}
                </td>
                <td>{product.category}</td>
                <td>{product.stock}</td>
                <td>
                  <div className='action-buttons'>
                    <button
                      className='button button-edit'
                      onClick={() => handleEdit(product)}
                    >
                      Sửa
                    </button>
                    <button
                      className='button button-delete'
                      onClick={() => handleDelete(product.id)}
                    >
                      Xóa
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Product Form Modal */}
      {isModalOpen && (
        <div className='modal-overlay'>
          <div className='modal'>
            <h3>{selectedProduct ? 'Sửa Sản phẩm' : 'Thêm Sản phẩm'}</h3>
            <form onSubmit={handleSubmit}>
              <div className='form-group'>
                <label htmlFor='name'>Tên sản phẩm</label>
                <input
                  type='text'
                  id='name'
                  name='name'
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className='form-group'>
                <label htmlFor='price'>Giá</label>
                <input
                  type='number'
                  id='price'
                  name='price'
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className='form-group'>
                <label htmlFor='description'>Mô tả</label>
                <textarea
                  id='description'
                  name='description'
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className='form-group'>
                <label htmlFor='category'>Danh mục</label>
                <input
                  type='text'
                  id='category'
                  name='category'
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className='form-group'>
                <label htmlFor='stock'>Số lượng tồn</label>
                <input
                  type='number'
                  id='stock'
                  name='stock'
                  value={formData.stock}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className='form-group'>
                <label htmlFor='imageUrl'>URL hình ảnh</label>
                <input
                  type='text'
                  id='imageUrl'
                  name='imageUrl'
                  value={formData.imageUrl}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className='modal-buttons'>
                <button type='submit' className='button button-primary'>
                  {selectedProduct ? 'Cập nhật' : 'Thêm'}
                </button>
                <button
                  type='button'
                  className='button button-secondary'
                  onClick={resetForm}
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagement;
