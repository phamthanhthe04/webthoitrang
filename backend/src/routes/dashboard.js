const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { authenticateToken, requireRole } = require('../middleware/auth');

// Middleware để yêu cầu quyền admin
const requireAdmin = requireRole(['admin']);

// Routes cho dashboard
router.get(
  '/stats',
  authenticateToken,
  requireAdmin,
  dashboardController.getDashboardStats
);
router.get(
  '/revenue',
  authenticateToken,
  requireAdmin,
  dashboardController.getRevenueStats
);
router.get(
  '/products',
  authenticateToken,
  requireAdmin,
  dashboardController.getProductStats
);

module.exports = router;
