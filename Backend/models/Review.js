const mongoose = require('mongoose');

// Review Schema
const reviewSchema = new mongoose.Schema({
  review_id: {
    type: Number,
    unique: true,
    required: true
  },
  product_id: {
    type: Number,
    required: true,
    ref: 'Product'
  },
  user_id: {
    type: Number,
    required: true,
    ref: 'User'
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    trim: true
  },
  created_at: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: false,
  collection: 'reviews'
});

// Index (review_id already has unique: true)
reviewSchema.index({ product_id: 1 });
reviewSchema.index({ user_id: 1 });

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
