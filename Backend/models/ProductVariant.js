const mongoose = require('mongoose');

// ProductVariant Schema
const productVariantSchema = new mongoose.Schema({
  variant_id: {
    type: Number,
    unique: true,
    required: true
  },
  product_id: {
    type: Number,
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
  }
}, {
  timestamps: false,
  collection: 'product_variants'
});

// Index (variant_id already has unique: true)
productVariantSchema.index({ product_id: 1 });

const ProductVariant = mongoose.model('ProductVariant', productVariantSchema);

module.exports = ProductVariant;
