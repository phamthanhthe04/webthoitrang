const express = require('express');
const router = express.Router();
const {
  getAllCategories,
  getCategory,
  getCategoryBySlug,
  getProductsByCategorySlug,
  createCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/categoryController');
const { auth, isAdmin } = require('../middleware/auth');

// Public routes
router.get('/', getAllCategories);
router.get('/slug/:slug', getCategoryBySlug);
router.get('/slug/:slug/products', getProductsByCategorySlug);
router.get('/:id', getCategory);

// Admin routes - sẽ được gọi từ /admin/categories nên không cần auth ở đây
router.post('/', createCategory);
router.put('/:id', updateCategory);
router.delete('/:id', deleteCategory);

module.exports = router;
