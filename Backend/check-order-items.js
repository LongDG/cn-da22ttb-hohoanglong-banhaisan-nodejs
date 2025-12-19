const mongoose = require('mongoose');
const OrderItem = require('./models/OrderItem');

const checkOrderItems = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/BIENTUOI_DB';
    console.log('🔗 Kết nối MongoDB:', mongoURI);
    await mongoose.connect(mongoURI);
    console.log('✓ Kết nối thành công\n');

    const count = await OrderItem.countDocuments();
    console.log(`📦 Tổng số Order Items: ${count}`);

    if (count > 0) {
      const samples = await OrderItem.find().limit(3).lean();
      console.log('\n📋 Mẫu Order Items:');
      samples.forEach((item, idx) => {
        console.log(`\n--- Item ${idx + 1} ---`);
        console.log('order_item_id:', item.order_item_id);
        console.log('order_id:', item.order_id);
        console.log('variant_id:', item.variant_id);
        console.log('quantity:', item.quantity);
        console.log('price_at_purchase:', item.price_at_purchase);
      });
    } else {
      console.log('\n⚠️ Không có Order Items trong database!');
      console.log('💡 Cần đặt hàng để tạo dữ liệu Order Items.');
    }

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Lỗi:', error.message);
    await mongoose.connection.close();
    process.exit(1);
  }
};

checkOrderItems();
