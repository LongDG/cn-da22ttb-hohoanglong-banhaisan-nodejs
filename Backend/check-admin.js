// Script kiểm tra admin user trong database
const mongoose = require('mongoose');
const User = require('./models/User');

const checkAdmin = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/BIENTUOI_DB';
    console.log('Kết nối tới MongoDB:', mongoURI);
    
    await mongoose.connect(mongoURI);
    console.log('✓ Kết nối MongoDB thành công\n');

    // Kiểm tra tất cả users
    const allUsers = await User.find({});
    console.log(`📊 Tổng số users trong database: ${allUsers.length}\n`);

    if (allUsers.length === 0) {
      console.log('⚠️  Không có user nào trong database!');
      console.log('Hãy chạy: node seedData.js\n');
    } else {
      console.log('Danh sách users:');
      allUsers.forEach(user => {
        console.log(`  - ID: ${user.user_id}, Email: ${user.email}, Role: ${user.role}, Name: ${user.full_name}`);
      });
    }

    // Kiểm tra admin user cụ thể
    const adminUser = await User.findOne({ email: 'admin@test.com' });
    console.log('\n👤 Kiểm tra admin@test.com:');
    if (adminUser) {
      console.log('  ✓ User tồn tại');
      console.log(`  - ID: ${adminUser.user_id}`);
      console.log(`  - Email: ${adminUser.email}`);
      console.log(`  - Role: ${adminUser.role}`);
      console.log(`  - Name: ${adminUser.full_name}`);
      console.log(`  - Password hash: ${adminUser.password.substring(0, 20)}...`);
    } else {
      console.log('  ✗ User không tồn tại!');
      console.log('  Hãy chạy: node seedData.js');
    }

    await mongoose.connection.close();
    console.log('\n✓ Kiểm tra xong');
  } catch (error) {
    console.error('❌ Lỗi:', error.message);
    process.exit(1);
  }
};

checkAdmin();
