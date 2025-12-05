const mongoose = require('mongoose');

// Supplier Schema
const supplierSchema = new mongoose.Schema({
  supplier_id: {
    type: String,
    unique: true,
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  contact_info: {
    type: String,
    trim: true
  }
}, {
  timestamps: false,
  collection: 'Suppliers'
});

// Index (supplier_id already has unique: true which creates index automatically)

const Supplier = mongoose.model('Supplier', supplierSchema);

module.exports = Supplier;
