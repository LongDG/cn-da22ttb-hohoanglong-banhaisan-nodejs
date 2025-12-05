const mongoose = require('mongoose');

// Product Schema
const productSchema = new mongoose.Schema({
  product_id: {
    type: String,
    unique: true,
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  image_url: {
    type: String,
    trim: true
  },
  category_id: {
    type: String,
    required: true,
    ref: 'Category'
  },
  supplier_id: {
    type: String,
    required: true,
    ref: 'Supplier'
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  }
}, {
  timestamps: false,
  collection: 'Products'
});

// Chỉ mục (product_id đã có unique: true)
productSchema.index({ category_id: 1 });
productSchema.index({ supplier_id: 1 });
productSchema.index({ status: 1 });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
