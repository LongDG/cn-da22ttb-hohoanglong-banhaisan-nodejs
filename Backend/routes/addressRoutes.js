const express = require('express');
const router = express.Router();
const addressController = require('../controllers/addressController');
const { authenticate } = require('../middleware/auth');

// Get addresses - if authenticated, auto-filter by user_id
router.get('/', authenticate, addressController.getAllAddresses);
router.get('/:id', authenticate, addressController.getAddressById);
router.post('/', authenticate, addressController.createAddress);
router.put('/:id', authenticate, addressController.updateAddress);
router.delete('/:id', authenticate, addressController.deleteAddress);

module.exports = router;

