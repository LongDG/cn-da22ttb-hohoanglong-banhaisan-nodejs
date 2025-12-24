const mongoose = require('mongoose');
const Order = require('./models/Order');

const cleanupOrders = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/BIENTUOI_DB';
    console.log('🔗 Kết nối MongoDB:', mongoURI);
    await mongoose.connect(mongoURI);
    console.log('✓ Kết nối thành công\n');

    console.log('🧹 Bắt đầu cleanup các trường dư thừa...\n');

    // Đếm số đơn hàng cần update
    const totalOrders = await Order.countDocuments();
    console.log(`📦 Tổng số đơn hàng: ${totalOrders}`);

    // Kiểm tra tên collections
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    console.log('📂 Collections:', collections.map(c => c.name).join(', '));
    
    // Thử cả 2 tên: orders và Orders
    let ordersCollection = db.collection('Orders'); // Viết hoa
    let count = await ordersCollection.countDocuments();
    console.log(`📦 Collection "Orders" có ${count} documents`);
    
    if (count === 0) {
      ordersCollection = db.collection('orders'); // Viết thường
      count = await ordersCollection.countDocuments();
      console.log(`📦 Collection "orders" có ${count} documents`);
    }
    
    const result = await ordersCollection.updateMany(
      {},
      {
        $unset: {
          orderStatus: "",
          paymentMethod: ""
        }
      }
    );

    console.log(`\n✅ Đã cleanup ${result.modifiedCount} đơn hàng (matched: ${result.matchedCount})`);

    // Hiển thị một vài đơn hàng mẫu sau khi cleanup
    console.log('\n📋 Kiểm tra đơn hàng sau cleanup:');
    const sampleOrders = await Order.find().limit(2).lean();
    sampleOrders.forEach((order, idx) => {
      console.log(`\n--- Đơn hàng ${idx + 1} ---`);
      console.log('order_id:', order.order_id);
      console.log('orderCode:', order.orderCode);
      console.log('status:', order.status);
      console.log('payment_status:', order.payment_status);
      console.log('payment_method:', order.payment_method);
      console.log('orderStatus (should be undefined):', order.orderStatus);
      console.log('paymentMethod (should be undefined):', order.paymentMethod);
    });

    console.log('\n✨ Cleanup hoàn tất!');
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Lỗi:', error.message);
    await mongoose.connection.close();
    process.exit(1);
  }
};

cleanupOrders();
