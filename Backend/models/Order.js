const mongoose = require('mongoose');

// Order Schema
const orderSchema = new mongoose.Schema({
  order_id: {
    type: String,
    unique: true,
    required: true
  },
  user_id: {
    type: String,
    required: true,
    ref: 'User'
  },
  order_date: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'completed', 'cancelled', 'Chờ xác nhận', 'Chờ giao', 'Hoàn tất'],
    default: 'Chờ xác nhận'
  },
  payment_status: {
    type: String,
    enum: ['Chưa thanh toán', 'Đã thanh toán', 'pending', 'successful', 'failed'],
    default: 'Chưa thanh toán'
  },
  payment_method: {
    type: String,
    enum: ['COD', 'Momo', 'Bank Transfer', 'Credit Card'],
    default: 'COD'
  },
  distance_km: {
    type: Number,
    min: 0
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
  collection: 'Orders'
});

// Chỉ mục (order_id đã có unique: true)
orderSchema.index({ user_id: 1 });
orderSchema.index({ status: 1 });

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
