const mongoose = require('mongoose');

// Tắt auto create/index collection (tránh cảnh báo duplicate index)
mongoose.set('autoCreate', false);
mongoose.set('autoIndex', false);
// Tắt cảnh báo strictQuery (MongoDB 7+)
mongoose.set('strictQuery', false);

const connectDB = async () => {
  try {
    // Nếu USE_MEMORY_DB=true, sử dụng in-memory database
    if (process.env.USE_MEMORY_DB === 'true') {
      const { connectDBMemory } = require('./database-memory');
      return await connectDBMemory();
    }
    
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/BIENTUOI_DB';
    
    // Check if already connected
    if (mongoose.connection.readyState === 1) {
      console.log('MongoDB already connected');
      return;
    }
    
    const conn = await mongoose.connect(mongoURI);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log(`Database: ${conn.connection.name}`);
    
    // Log connection status
    mongoose.connection.on('error', err => {
      console.error('MongoDB connection error:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
