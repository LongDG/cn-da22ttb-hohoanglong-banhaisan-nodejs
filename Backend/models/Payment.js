const mongoose = require('mongoose');

// Payment Schema
const paymentSchema = new mongoose.Schema({
  payment_id: {
    type: String,
    unique: true,
    required: true
  },
  order_id: {
    type: String,
    required: true,
    ref: 'Order'
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  payment_method: {
    type: String,
    required: true,
    enum: ['COD', 'Momo', 'Bank Transfer', 'Credit Card'],
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'successful', 'failed', 'cancelled', 'Chưa thanh toán', 'Đã thanh toán'],
    default: 'pending'
  },
  payment_status: {
    type: String,
    enum: ['Chưa thanh toán', 'Đã thanh toán', 'pending', 'successful', 'failed'],
    default: 'Chưa thanh toán'
  },
  transaction_id: {
    type: String,
    trim: true
  },
  created_at: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: false,
  collection: 'Payments'
});

// Chỉ mục (payment_id đã có unique: true)
paymentSchema.index({ order_id: 1 });

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
