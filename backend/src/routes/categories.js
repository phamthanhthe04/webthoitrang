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

// Admin routes
router.post('/', auth, isAdmin, createCategory);
router.put('/:id', auth, isAdmin, updateCategory);
router.delete('/:id', auth, isAdmin, deleteCategory);

module.exports = router;
