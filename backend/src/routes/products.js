const express = require('express');
const router = express.Router();
const {
  getAllProducts,
  getProduct,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const { auth, isAdmin } = require('../middleware/auth');

// Public routes
router.get('/', getAllProducts);
router.get('/slug/:slug', getProductBySlug); // Thêm route lấy sản phẩm theo slug
router.get('/:id', getProduct);

// Admin routes
router.post('/', auth, isAdmin, createProduct);
router.put('/:id', auth, isAdmin, updateProduct);
router.delete('/:id', auth, isAdmin, deleteProduct);

module.exports = router;
