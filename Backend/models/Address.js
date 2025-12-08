const mongoose = require('mongoose');

// Address Schema lược đồ địa chỉ
const addressSchema = new mongoose.Schema({
  address_id: {
    type: String,
    unique: true,
    required: true
  },
  user_id: {
    type: String,
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
  collection: 'Addresses'
});

// Chỉ mục cho các truy vấn nhanh hơn (address_id đã có unique: true)
addressSchema.index({ user_id: 1 });

const Address = mongoose.model('Address', addressSchema);

module.exports = Address;
