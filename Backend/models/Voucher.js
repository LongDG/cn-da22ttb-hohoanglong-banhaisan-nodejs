const mongoose = require('mongoose');

// Voucher Schema
const voucherSchema = new mongoose.Schema({
  voucher_id: {
    type: Number,
    unique: true,
    required: true
  },
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true
  },
  discount_type: {
    type: String,
    enum: ['fixed_amount', 'percentage'],
    required: true
  },
  value: {
    type: Number,
    required: true,
    min: 0
  },
  expiry_date: {
    type: Date,
    required: true
  },
  usage_limit: {
    type: Number,
    default: null
  },
  used_count: {
    type: Number,
    default: 0,
    min: 0
  }
}, {
  timestamps: false,
  collection: 'vouchers'
});

// Index (voucher_id and code already have unique: true which creates index automatically)

// Method to check if voucher is valid
voucherSchema.methods.isValid = function() {
  const now = new Date();
  if (this.expiry_date < now) return false;
  if (this.usage_limit && this.used_count >= this.usage_limit) return false;
  return true;
};

const Voucher = mongoose.model('Voucher', voucherSchema);

module.exports = Voucher;
