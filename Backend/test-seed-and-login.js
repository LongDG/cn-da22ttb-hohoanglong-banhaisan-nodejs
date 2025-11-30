// Test seed dữ liệu và đăng nhập
const axios = require('axios');

const API_URL = process.env.API_URL || 'http://localhost:3000/api';

const testSeedAndLogin = async () => {
  try {
    console.log('═══════════════════════════════════════════════════');
    console.log('🌱 SEED DATA & TEST LOGIN');
    console.log('═══════════════════════════════════════════════════\n');

    // Step 1: Check if server is running
    console.log('📡 Step 1: Checking server connection...');
    try {
      await axios.get(API_URL.replace('/api', ''));
      console.log('   ✅ Server is running\n');
    } catch (error) {
      console.error('   ❌ Server is not running!');
      console.error(`   Start server with: npm run start:memory`);
      process.exit(1);
    }

    // Step 2: Seed data
    console.log('🌱 Step 2: Seeding data...');
    try {
      const seedResponse = await axios.post(`${API_URL}/seed`);
      if (seedResponse.data.success) {
        console.log('   ✅ Data seeded successfully!\n');
      } else {
        console.log('   ⚠️  Seed response:', seedResponse.data);
      }
    } catch (error) {
      if (error.response) {
        console.error('   ❌ Seed failed:', error.response.data?.error || error.message);
      } else {
        console.error('   ❌ Seed failed:', error.message);
      }
      process.exit(1);
    }

    // Step 3: Test login
    console.log('🔐 Step 3: Testing login...\n');

    const testAccounts = [
      {
        name: 'Admin',
        email: 'admin@test.com',
        password: 'admin123',
        expectedRole: 'admin'
      },
      {
        name: 'Customer',
        email: 'customer@test.com',
        password: '123456',
        expectedRole: 'customer'
      }
    ];

    let passed = 0;
    let failed = 0;

    for (const account of testAccounts) {
      try {
        console.log(`🧪 Testing: ${account.name} (${account.email})`);
        
        const loginResponse = await axios.post(`${API_URL}/auth/login`, {
          email: account.email,
          password: account.password
        });

        if (loginResponse.data.success) {
          const { user, token } = loginResponse.data.data;
          console.log(`   ✅ Login SUCCESS!`);
          console.log(`   - User ID: ${user.user_id}`);
          console.log(`   - Name: ${user.full_name}`);
          console.log(`   - Role: ${user.role} ${user.role === account.expectedRole ? '✓' : '✗'}`);
          console.log(`   - Token: ${token.substring(0, 30)}...\n`);
          passed++;
        } else {
          console.log(`   ❌ Login FAILED: ${loginResponse.data.error}\n`);
          failed++;
        }
      } catch (error) {
        const errorMsg = error.response?.data?.error || error.message;
        console.log(`   ❌ Login FAILED: ${errorMsg}\n`);
        failed++;
      }
    }

    // Summary
    console.log('═══════════════════════════════════════════════════');
    console.log('📊 SUMMARY');
    console.log('═══════════════════════════════════════════════════');
    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log('═══════════════════════════════════════════════════\n');

    if (failed === 0) {
      console.log('🎉 All tests passed!');
      process.exit(0);
    } else {
      console.log('⚠️  Some tests failed.');
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

testSeedAndLogin();

