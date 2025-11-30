const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

// Tạo MongoDB in-memory server
const connectDBMemory = async () => {
  try {
    // Tạo MongoDB Memory Server
    mongoServer = await MongoMemoryServer.create();
    const mongoURI = mongoServer.getUri();
    
    // Check if already connected
    if (mongoose.connection.readyState === 1) {
      console.log('MongoDB already connected');
      return;
    }
    
    const conn = await mongoose.connect(mongoURI);

    console.log('═══════════════════════════════════════════════════');
    console.log('✅ MongoDB In-Memory Server Started');
    console.log(`📦 Database: ${conn.connection.name}`);
    console.log('💡 Note: Data will be lost when server stops');
    console.log('═══════════════════════════════════════════════════\n');
    
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

// Đóng kết nối và dọn dẹp
const disconnectDB = async () => {
  try {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    if (mongoServer) {
      await mongoServer.stop();
    }
    console.log('MongoDB in-memory server stopped');
  } catch (error) {
    console.error('Error disconnecting:', error);
  }
};

// Xử lý khi process kết thúc
process.on('SIGINT', async () => {
  await disconnectDB();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await disconnectDB();
  process.exit(0);
});

module.exports = { connectDBMemory, disconnectDB };

