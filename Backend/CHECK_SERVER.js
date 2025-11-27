// Script to check if server can read data from MongoDB
const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/User');
const Product = require('./models/Product');

const app = express();
const PORT = 3001; // Use different port to avoid conflict

const testServer = async () => {
  try {
    // Connect to MongoDB
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/BIENTUOI_DB';
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB');
    console.log('Database:', mongoose.connection.name);
    
    // Test endpoint
    app.get('/test/users', async (req, res) => {
      try {
        const users = await User.find();
        res.json({
          success: true,
          count: users.length,
          data: users
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error.message
        });
      }
    });
    
    app.get('/test/products', async (req, res) => {
      try {
        const products = await Product.find();
        res.json({
          success: true,
          count: products.length,
          data: products
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error.message
        });
      }
    });
    
    // Start server
    app.listen(PORT, () => {
      console.log(`\n✅ Test server running on http://localhost:${PORT}`);
      console.log(`\nTest endpoints:`);
      console.log(`  GET http://localhost:${PORT}/test/users`);
      console.log(`  GET http://localhost:${PORT}/test/products`);
      console.log(`\nPress Ctrl+C to stop\n`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

testServer();

