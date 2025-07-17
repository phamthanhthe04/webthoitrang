const express = require('express');
const router = express.Router();
const {
  createOrder,
  getUserOrders,
  getOrder,
  getAllOrders,
  updateOrderStatus,
  testOrderTimestamps,
} = require('../controllers/orderController');
const { auth, isAdmin } = require('../middleware/auth');

// User routes
router.post('/', auth, createOrder);
router.get('/my-orders', auth, getUserOrders);
router.get('/my-orders/:id', auth, getOrder);

// Test route
router.get('/test-timestamps', testOrderTimestamps);

// Admin routes - sẽ được gọi từ /admin/orders nên không cần auth ở đây
router.get('/', getAllOrders);
router.put('/:id/status', updateOrderStatus);

module.exports = router;
