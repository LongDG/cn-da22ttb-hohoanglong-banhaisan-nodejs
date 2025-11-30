const mongoose = require('mongoose');

// CartItem Schema
const cartItemSchema = new mongoose.Schema({
  cart_item_id: {
    type: Number,
    unique: true,
    required: true
  },
  cart_id: {
    type: Number,
    required: true,
    ref: 'Cart'
  },
  variant_id: {
    type: Number,
    required: true,
    ref: 'ProductVariant'
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  }
}, {
  timestamps: false,
  collection: 'Cart_Items'
});

// Index
cartItemSchema.index({ cart_id: 1 });
cartItemSchema.index({ variant_id: 1 });

const CartItem = mongoose.model('CartItem', cartItemSchema);

module.exports = CartItem;

