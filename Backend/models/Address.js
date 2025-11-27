const mongoose = require('mongoose');

// Address Schema
const addressSchema = new mongoose.Schema({
  address_id: {
    type: Number,
    unique: true,
    required: true
  },
  user_id: {
    type: Number,
    required: true,
    ref: 'User'
  },
  recipient_name: {
    type: String,
    required: true,
    trim: true
  },
  phone_number: {
    type: String,
    trim: true
  },
  full_address: {
    type: String,
    required: true
  },
  is_default: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: false,
  collection: 'addresses'
});

// Index for faster queries (address_id already has unique: true)
addressSchema.index({ user_id: 1 });

const Address = mongoose.model('Address', addressSchema);

module.exports = Address;
