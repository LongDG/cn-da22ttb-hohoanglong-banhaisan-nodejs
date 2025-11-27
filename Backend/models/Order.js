const mongoose = require('mongoose');

// Order Schema
const orderSchema = new mongoose.Schema({
  order_id: {
    type: Number,
    unique: true,
    required: true
  },
  user_id: {
    type: Number,
    required: true,
    ref: 'User'
  },
  order_date: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'completed', 'cancelled'],
    default: 'pending'
  },
  shipping_address: {
    type: String,
    required: true
  },
  shipping_fee: {
    type: Number,
    default: 0,
    min: 0
  },
  discount_amount: {
    type: Number,
    default: 0,
    min: 0
  },
  total_amount: {
    type: Number,
    required: true,
    min: 0
  },
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: false,
  collection: 'orders'
});

// Index (order_id already has unique: true)
orderSchema.index({ user_id: 1 });
orderSchema.index({ status: 1 });

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
