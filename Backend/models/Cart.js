const mongoose = require('mongoose');

// Cart Schema
const cartSchema = new mongoose.Schema({
  cart_id: {
    type: Number,
    unique: true,
    required: true
  },
  user_id: {
    type: Number,
    required: true,
    ref: 'User',
    unique: true
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: false,
  collection: 'Carts'
});

// Index
cartSchema.index({ user_id: 1 });

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;

