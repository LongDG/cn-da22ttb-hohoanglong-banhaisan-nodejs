const mongoose = require('mongoose');

// OrderItem Schema
const orderItemSchema = new mongoose.Schema({
  order_item_id: {
    type: String,
    unique: true,
    required: true
  },
  order_id: {
    type: String,
    required: true,
    ref: 'Order'
  },
  variant_id: {
    type: String,
    required: true,
    ref: 'ProductVariant'
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  price_at_purchase: {
    type: Number,
    required: true,
    min: 0
  }
}, {
  timestamps: false,
  collection: 'Order_Items'
});

// Chỉ mục (order_item_id đã có unique: true)
orderItemSchema.index({ order_id: 1 });
orderItemSchema.index({ variant_id: 1 });

const OrderItem = mongoose.model('OrderItem', orderItemSchema);

module.exports = OrderItem;
