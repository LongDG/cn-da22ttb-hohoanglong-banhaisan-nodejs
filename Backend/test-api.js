// Quick test script to check if API returns data
const mongoose = require('mongoose');
const User = require('./models/User');

const testConnection = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/BIENTUOI_DB';
    console.log('Connecting to:', mongoURI);
    
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB');
    console.log('Database:', mongoose.connection.name);
    
    // Test query
    const users = await User.find();
    console.log(`\n📊 Found ${users.length} users in database`);
    
    if (users.length > 0) {
      console.log('\nUsers:');
      users.forEach(user => {
        console.log(`  - ${user.full_name} (ID: ${user.user_id}, Email: ${user.email})`);
      });
    } else {
      console.log('\n⚠️  No users found! Run: npm run seed');
    }
    
    // Test other collections
    const Product = require('./models/Product');
    const products = await Product.find();
    console.log(`\n📦 Found ${products.length} products`);
    
    const Category = require('./models/Category');
    const categories = await Category.find();
    console.log(`📁 Found ${categories.length} categories`);
    
    await mongoose.connection.close();
    console.log('\n✅ Test completed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

testConnection();

