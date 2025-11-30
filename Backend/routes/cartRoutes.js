const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { authenticate, requireAdmin } = require('../middleware/auth');

// User routes (authenticated)
router.get('/', authenticate, cartController.getOrCreateCart);
router.post('/items', authenticate, cartController.addItemToCart);
router.put('/items/:id', authenticate, cartController.updateCartItem);
router.delete('/items/:id', authenticate, cartController.removeCartItem);
router.delete('/clear', authenticate, cartController.clearCart);

// Admin routes
router.get('/admin/all', authenticate, requireAdmin, cartController.getAllCarts);
router.get('/admin/user/:userId', authenticate, requireAdmin, cartController.getCartByUserId);

module.exports = router;

