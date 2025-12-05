const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { authenticate, requireAdmin } = require('../middleware/auth');

// Authenticated routes (customer can see their own orders, admin can see all)
router.get('/', authenticate, orderController.getAllOrders);
router.get('/:id', authenticate, orderController.getOrderById);
router.post('/', authenticate, orderController.createOrder);

// Admin only routes
router.put('/:id', authenticate, requireAdmin, orderController.updateOrder);
router.put('/:id/complete-cod', authenticate, requireAdmin, orderController.completeCODOrder);
router.delete('/:id', authenticate, requireAdmin, orderController.deleteOrder);

module.exports = router;

