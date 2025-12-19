const mongoose = require('mongoose');

// ProductVariant Schema
const productVariantSchema = new mongoose.Schema({
  variant_id: {
    type: String,
    unique: true,
    required: true
  },
  product_id: {
    type: String,
    required: true,
    ref: 'Product'
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  sale_price: {
    type: Number,
    default: null,
    min: 0
  },
  stock_quantity: {
    type: Number,
    default: 0,
    min: 0
  },
  weight: {
    type: Number,
    default: 1,
    min: 0
  },
  unit: {
    type: String,
    default: 'kg',
    enum: ['kg', 'g', 'lít', 'con']
  },
  status: {
    type: String,
    default: 'active',
    enum: ['active', 'inactive']
  }
}, {
  timestamps: false,
  collection: 'Product_Variants'
});

// Chỉ mục (variant_id đã có unique: true)
productVariantSchema.index({ product_id: 1 });

const ProductVariant = mongoose.model('ProductVariant', productVariantSchema);

module.exports = ProductVariant;
