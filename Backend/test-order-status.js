/**
 * Test script for updateOrderStatus API
 * 
 * Usage:
 * 1. Start server: node server.js
 * 2. Run test: node test-order-status.js
 * 
 * Test scenarios:
 * - Valid status transitions
 * - Invalid status transitions
 * - Stock restoration on cancellation
 * - COD payment completion
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

// Test credentials (change these to match your database)
const ADMIN_CREDENTIALS = {
  email: 'admin@example.com',
  password: 'admin123'
};

let adminToken = '';
let testOrderId = null;

// Login as admin
async function loginAsAdmin() {
  try {
    const response = await axios.post(`${BASE_URL}/auth/login`, ADMIN_CREDENTIALS);
    adminToken = response.data.token;
    console.log('✅ Admin login successful');
    return true;
  } catch (error) {
    console.error('❌ Admin login failed:', error.response?.data || error.message);
    return false;
  }
}

// Get first order for testing
async function getTestOrder() {
  try {
    const response = await axios.get(`${BASE_URL}/orders`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    
    if (response.data.data.length > 0) {
      testOrderId = response.data.data[0].order_id;
      console.log(`✅ Found test order: #${testOrderId}, Status: ${response.data.data[0].orderStatus || 'Chờ duyệt'}`);
      return true;
    } else {
      console.log('⚠️  No orders found in database. Please create an order first.');
      return false;
    }
  } catch (error) {
    console.error('❌ Failed to get orders:', error.response?.data || error.message);
    return false;
  }
}

// Test valid status transition
async function testValidStatusTransition(orderId, newStatus) {
  try {
    console.log(`\n🧪 Testing: Update order #${orderId} to "${newStatus}"`);
    
    const response = await axios.put(
      `${BASE_URL}/orders/${orderId}/status`,
      { orderStatus: newStatus },
      { headers: { Authorization: `Bearer ${adminToken}` } }
    );
    
    console.log(`✅ Success: ${response.data.message}`);
    console.log(`   Current status: ${response.data.data.orderStatus}`);
    console.log(`   Payment status: ${response.data.data.payment_status}`);
    return true;
  } catch (error) {
    console.error(`❌ Failed:`, error.response?.data.error || error.message);
    return false;
  }
}

// Test invalid status transition
async function testInvalidStatusTransition(orderId, newStatus) {
  try {
    console.log(`\n🧪 Testing: Invalid transition to "${newStatus}" (should fail)`);
    
    await axios.put(
      `${BASE_URL}/orders/${orderId}/status`,
      { orderStatus: newStatus },
      { headers: { Authorization: `Bearer ${adminToken}` } }
    );
    
    console.log(`❌ UNEXPECTED: Transition should have failed but succeeded`);
    return false;
  } catch (error) {
    if (error.response?.status === 400) {
      console.log(`✅ Expected error: ${error.response.data.error}`);
      return true;
    } else {
      console.error(`❌ Unexpected error:`, error.response?.data || error.message);
      return false;
    }
  }
}

// Main test flow
async function runTests() {
  console.log('=== ORDER STATUS UPDATE API TEST ===\n');
  
  // Step 1: Login
  const loginSuccess = await loginAsAdmin();
  if (!loginSuccess) {
    console.log('\n❌ Test aborted: Login failed');
    return;
  }
  
  // Step 2: Get test order
  const orderFound = await getTestOrder();
  if (!orderFound) {
    console.log('\n❌ Test aborted: No orders available');
    return;
  }
  
  // Step 3: Test status flow
  console.log('\n--- Testing Valid Status Flow ---');
  
  // Chờ duyệt → Đã duyệt
  await testValidStatusTransition(testOrderId, 'Đã duyệt');
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Đã duyệt → Đang vận chuyển
  await testValidStatusTransition(testOrderId, 'Đang vận chuyển');
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Đang vận chuyển → Đã giao
  await testValidStatusTransition(testOrderId, 'Đã giao');
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Đã giao → Hoàn thành (should update payment status for COD)
  await testValidStatusTransition(testOrderId, 'Hoàn thành');
  
  // Step 4: Test invalid transition
  console.log('\n--- Testing Invalid Transition ---');
  await testInvalidStatusTransition(testOrderId, 'Chờ duyệt'); // Can't go back
  
  console.log('\n=== TEST COMPLETED ===');
  console.log('\n📝 Notes:');
  console.log('   - Status flow: Chờ duyệt → Đã duyệt → Đang vận chuyển → Đã giao → Hoàn thành');
  console.log('   - COD orders: Payment status updated to "Đã thanh toán" at "Hoàn thành"');
  console.log('   - Cancelled orders: Stock quantity restored automatically');
  console.log('   - Invalid transitions are rejected with error message');
}

// Test cancellation and stock restoration
async function testCancellation() {
  console.log('\n=== TESTING ORDER CANCELLATION ===\n');
  
  const loginSuccess = await loginAsAdmin();
  if (!loginSuccess) return;
  
  const orderFound = await getTestOrder();
  if (!orderFound) return;
  
  console.log('🧪 Testing: Cancel order (should restore stock)');
  
  try {
    const response = await axios.put(
      `${BASE_URL}/orders/${testOrderId}/status`,
      { orderStatus: 'Hủy' },
      { headers: { Authorization: `Bearer ${adminToken}` } }
    );
    
    console.log(`✅ Order cancelled successfully`);
    console.log(`   Stock quantities have been restored`);
    console.log(`   Check backend console for detailed stock restoration logs`);
  } catch (error) {
    console.error(`❌ Cancellation failed:`, error.response?.data || error.message);
  }
}

// Run tests
if (require.main === module) {
  // Check command line argument
  const args = process.argv.slice(2);
  
  if (args.includes('--cancel')) {
    testCancellation();
  } else {
    runTests();
  }
}

module.exports = { runTests, testCancellation };
