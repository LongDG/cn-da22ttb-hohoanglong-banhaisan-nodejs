const mongoose = require('mongoose');

// User Schema
const userSchema = new mongoose.Schema({
  user_id: {
    type: String,
    unique: true,
    required: true
  },
  full_name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  phone_number: {
    type: String,
    trim: true
  },
  role: {
    type: String,
    enum: ['customer', 'admin'],
    default: 'customer'
  },
  created_at: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: false,
  collection: 'Users'
});

// Index for faster queries (email and user_id already have unique: true which creates index automatically)
// Only add index for fields that don't have unique constraint but need fast queries

const User = mongoose.model('User', userSchema);

module.exports = User;
