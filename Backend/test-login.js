// Test đăng nhập với các tài khoản đã seed
const axios = require('axios');

const API_URL = process.env.API_URL || 'http://localhost:3000/api/auth';

const testAccounts = [
  {
    name: 'Admin',
    email: 'admin@test.com',
    password: 'admin123',
    expectedRole: 'admin'
  },
  {
    name: 'Customer 1',
    email: 'customer@test.com',
    password: '123456',
    expectedRole: 'customer'
  },
  {
    name: 'Customer 2',
    email: 'cuong@test.com',
    password: '123456',
    expectedRole: 'customer'
  },
  {
    name: 'Customer 3',
    email: 'dung@test.com',
    password: '123456',
    expectedRole: 'customer'
  }
];

const testLogin = async (account) => {
  try {
    console.log(`\n🧪 Testing login for: ${account.name}`);
    console.log(`   Email: ${account.email}`);
    
    const response = await axios.post(`${API_URL}/login`, {
      email: account.email,
      password: account.password
    });

    if (response.data.success) {
      const { user, token } = response.data.data;
      
      console.log(`   ✅ Login SUCCESS!`);
      console.log(`   - User ID: ${user.user_id}`);
      console.log(`   - Full Name: ${user.full_name}`);
      console.log(`   - Role: ${user.role} ${user.role === account.expectedRole ? '✓' : '✗ (Expected: ' + account.expectedRole + ')'}`);
      console.log(`   - Token: ${token.substring(0, 30)}...`);
      
      return { success: true, user, token };
    } else {
      console.log(`   ❌ Login FAILED: ${response.data.error || 'Unknown error'}`);
      return { success: false, error: response.data.error };
    }
  } catch (error) {
    if (error.response) {
      const errorMsg = error.response.data?.error || error.response.statusText;
      console.log(`   ❌ Login FAILED: ${errorMsg}`);
      return { success: false, error: errorMsg };
    } else {
      console.log(`   ❌ Login FAILED: ${error.message}`);
      return { success: false, error: error.message };
    }
  }
};

const testWrongPassword = async () => {
  try {
    console.log(`\n🧪 Testing login with WRONG password`);
    console.log(`   Email: admin@test.com`);
    console.log(`   Password: wrongpassword`);
    
    await axios.post(`${API_URL}/login`, {
      email: 'admin@test.com',
      password: 'wrongpassword'
    });
    
    console.log(`   ❌ Should have failed but succeeded!`);
    return { success: false };
  } catch (error) {
    if (error.response && error.response.status === 400) {
      const errorMsg = error.response.data?.error || 'Unknown error';
      console.log(`   ✅ Correctly rejected: ${errorMsg}`);
      return { success: true };
    } else {
      console.log(`   ❌ Unexpected error: ${error.message}`);
      return { success: false };
    }
  }
};

const testNonExistentUser = async () => {
  try {
    console.log(`\n🧪 Testing login with NON-EXISTENT user`);
    console.log(`   Email: notexist@test.com`);
    
    await axios.post(`${API_URL}/login`, {
      email: 'notexist@test.com',
      password: '123456'
    });
    
    console.log(`   ❌ Should have failed but succeeded!`);
    return { success: false };
  } catch (error) {
    if (error.response && error.response.status === 400) {
      const errorMsg = error.response.data?.error || 'Unknown error';
      console.log(`   ✅ Correctly rejected: ${errorMsg}`);
      return { success: true };
    } else {
      console.log(`   ❌ Unexpected error: ${error.message}`);
      return { success: false };
    }
  }
};

const runTests = async () => {
  console.log('═══════════════════════════════════════════════════');
  console.log('🔐 TESTING LOGIN FUNCTIONALITY');
  console.log('═══════════════════════════════════════════════════');
  console.log(`API URL: ${API_URL}`);
  console.log('═══════════════════════════════════════════════════');

  const results = {
    passed: 0,
    failed: 0,
    tests: []
  };

  // Test 1-4: Login với các tài khoản đã seed
  for (const account of testAccounts) {
    const result = await testLogin(account);
    results.tests.push({ name: account.name, ...result });
    if (result.success) {
      results.passed++;
    } else {
      results.failed++;
    }
  }

  // Test 5: Login với password sai
  const wrongPasswordTest = await testWrongPassword();
  results.tests.push({ name: 'Wrong Password Test', ...wrongPasswordTest });
  if (wrongPasswordTest.success) {
    results.passed++;
  } else {
    results.failed++;
  }

  // Test 6: Login với user không tồn tại
  const nonExistentTest = await testNonExistentUser();
  results.tests.push({ name: 'Non-Existent User Test', ...nonExistentTest });
  if (nonExistentTest.success) {
    results.passed++;
  } else {
    results.failed++;
  }

  // Summary
  console.log('\n═══════════════════════════════════════════════════');
  console.log('📊 TEST SUMMARY');
  console.log('═══════════════════════════════════════════════════');
  console.log(`✅ Passed: ${results.passed}`);
  console.log(`❌ Failed: ${results.failed}`);
  console.log(`📝 Total:  ${results.passed + results.failed}`);
  console.log('═══════════════════════════════════════════════════\n');

  if (results.failed === 0) {
    console.log('🎉 All tests passed!');
    process.exit(0);
  } else {
    console.log('⚠️  Some tests failed. Check the output above.');
    process.exit(1);
  }
};

// Check if server is running
axios.get(API_URL.replace('/api/auth', ''))
  .then(() => {
    runTests();
  })
  .catch(error => {
    console.error('❌ ERROR: Cannot connect to server!');
    console.error(`   Make sure server is running at: ${API_URL.replace('/api/auth', '')}`);
    console.error(`   Error: ${error.message}`);
    console.error('\n💡 Start server with: npm run start:memory');
    process.exit(1);
  });

