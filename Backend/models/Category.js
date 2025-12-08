const mongoose = require('mongoose');

// Category Schema
const categorySchema = new mongoose.Schema({
  category_id: {
    type: String,
    unique: true,
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  parent_id: {
    type: String,
    default: null,
    ref: 'Category'
  }
}, {
  timestamps: false,
  collection: 'Categories'
});

// Chỉ mục cho các truy vấn nhanh hơn (category_id đã có unique: true)
categorySchema.index({ parent_id: 1 });

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
