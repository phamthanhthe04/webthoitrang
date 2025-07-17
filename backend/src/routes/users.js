const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { auth, isAdmin } = require('../middleware/auth');

// Admin routes - sẽ được gọi từ /admin/users nên không cần auth ở đây
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUser);
router.put('/:id/status', userController.updateUserStatus);
router.put('/:id/role', userController.updateUserRole);
router.delete('/:id', userController.deleteUser);
router.put('/bulk-update', userController.bulkUpdateUsers);

module.exports = router;
