const express = require('express');
const router = express.Router();
const shippingController = require('../controllers/shippingController');
const { authenticate, requireAdmin } = require('../middleware/auth');

// Public route để test tính phí ship
router.post('/calculate', shippingController.calculateShippingFee);
router.get('/rules', shippingController.getShippingRules);

module.exports = router;

