// Script debug toàn diện - kiểm tra admin user
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const debugAdmin = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/BIENTUOI_DB';
    console.log('🔗 Kết nối MongoDB:', mongoURI);
    
    await mongoose.connect(mongoURI);
    console.log('✓ Kết nối thành công\n');

    // Tìm admin user
    const adminUser = await User.findOne({ email: '110122107ts@gmail.com' });
    
    if (!adminUser) {
      console.log('❌ Admin user không tồn tại!');
      await mongoose.connection.close();
      process.exit(1);
    }

    console.log('📋 Admin User Info:');
    console.log('  - user_id:', adminUser.user_id);
    console.log('  - full_name:', adminUser.full_name);
    console.log('  - email:', adminUser.email);
    console.log('  - role:', adminUser.role);
    console.log('  - role type:', typeof adminUser.role);
    console.log('  - password hash:', adminUser.password.substring(0, 30) + '...');
    console.log('  - created_at:', adminUser.created_at);

    // Test password
    const testPassword = 'admin123';
    const passwordMatch = await bcrypt.compare(testPassword, adminUser.password);
    console.log('\n🔐 Password Test:');
    console.log('  - Test password:', testPassword);
    console.log('  - Password match:', passwordMatch ? '✓ Khớp' : '❌ Không khớp');

    // Kiểm tra JSON stringify
    console.log('\n📤 Simulate Response (like backend):');
    const userObj = adminUser.toObject();
    delete userObj.password;
    const response = { success: true, data: { user: userObj, token: 'test-token' } };
    console.log('  - Response:', JSON.stringify(response, null, 2));

    // Kiểm tra extract như frontend
    console.log('\n📥 Frontend Extract (like authController):');
    const extractedUser = response?.data?.user;
    const extractedRole = extractedUser?.role;
    console.log('  - Extracted role:', extractedRole);
    console.log('  - Is admin:', extractedRole === 'admin' ? '✓ YES' : '❌ NO');

    // Tạo/update admin user mới nếu cần
    if (adminUser.role !== 'admin') {
      console.log('\n⚠️  Role không phải "admin", cập nhật...');
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(testPassword, salt);
      
      await User.findByIdAndUpdate(adminUser._id, {
        role: 'admin',
        password: hashedPassword
      });
      console.log('✓ Đã cập nhật admin user');
    }

    if (passwordMatch === false) {
      console.log('\n⚠️  Password không khớp, cập nhật...');
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(testPassword, salt);
      
      await User.findByIdAndUpdate(adminUser._id, {
        password: hashedPassword
      });
      console.log('✓ Đã cập nhật password');
    }

    console.log('\n✅ Debug hoàn tất!');
    console.log('\n📝 Thông tin đăng nhập:');
    console.log('  - Email: 110122107ts@gmail.com');
    console.log('  - Password: admin123');
    console.log('  - URL: http://localhost:3001/auth');

    await mongoose.connection.close();
  } catch (error) {
    console.error('❌ Lỗi:', error.message);
    process.exit(1);
  }
};

debugAdmin();
