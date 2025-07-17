const express = require('express');
const router = express.Router();
const { auth, isAdmin } = require('../middleware/auth');

// Dashboard routes - đã có middleware auth và isAdmin trong dashboard.js
router.use('/dashboard', require('./dashboard'));

// Product admin routes - thêm middleware auth và isAdmin
router.use('/products', auth, isAdmin, require('./products'));

// Order admin routes - thêm middleware auth và isAdmin
router.use('/orders', auth, isAdmin, require('./orders'));

// User admin routes - thêm middleware auth và isAdmin
router.use('/users', auth, isAdmin, require('./users'));

// Category admin routes - thêm middleware auth và isAdmin
router.use('/categories', auth, isAdmin, require('./categories'));

// Wallet admin routes - các route wallet/admin đã có middleware riêng
router.use('/wallet', require('./wallet'));

module.exports = router;
