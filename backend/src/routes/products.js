const express = require('express');
const router = express.Router();
const {
  getAllProducts,
  getProduct,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
  bulkDeleteProducts,
  updateProductStatus,
  uploadProductImages,
} = require('../controllers/productController');
const { auth, isAdmin } = require('../middleware/auth');

// Public routes
router.get('/', getAllProducts);
router.get('/slug/:slug', getProductBySlug);
router.get('/:id', getProduct);

// Admin routes - sẽ được gọi từ /admin/products nên không cần auth ở đây
router.post('/', uploadProductImages, createProduct);
router.put('/:id', uploadProductImages, updateProduct);
router.delete('/:id', deleteProduct);
router.delete('/bulk-delete', bulkDeleteProducts);
router.put('/:id/status', updateProductStatus);

module.exports = router;
