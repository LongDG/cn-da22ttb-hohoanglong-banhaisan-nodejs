const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticate, requireAdmin } = require('../middleware/auth');

// Public routes
router.get('/:id', authenticate, userController.getUserById);

// Change password route (user can change their own password)
router.put('/:id/change-password', authenticate, userController.changePassword);

// Admin only routes
router.get('/', authenticate, requireAdmin, userController.getAllUsers);
router.post('/', authenticate, requireAdmin, userController.createUser);
router.put('/:id', authenticate, requireAdmin, userController.updateUser);
router.delete('/:id', authenticate, requireAdmin, userController.deleteUser);

module.exports = router;
