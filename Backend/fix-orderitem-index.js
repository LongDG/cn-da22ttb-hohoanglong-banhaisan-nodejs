/**
 * Script để xóa index cũ của order_item_id và tạo lại index mới
 * Chạy script này một lần để fix lỗi duplicate key
 */

const mongoose = require('mongoose');

async function fixOrderItemIndex() {
  try {
    // Kết nối MongoDB
    await mongoose.connect('mongodb://localhost:27017/BIENTUOI_DB');
    console.log('✅ Đã kết nối MongoDB');

    const db = mongoose.connection.db;
    const collection = db.collection('Order_Items');

    // Xóa tất cả các index cũ
    console.log('🔄 Đang xóa các index cũ...');
    await collection.dropIndexes();
    console.log('✅ Đã xóa tất cả index cũ');

    // Tạo lại index mới cho order_item_id (string)
    console.log('🔄 Đang tạo index mới...');
    await collection.createIndex({ order_item_id: 1 }, { unique: true });
    await collection.createIndex({ order_id: 1 });
    await collection.createIndex({ variant_id: 1 });
    console.log('✅ Đã tạo lại các index mới');

    // Kiểm tra các document có order_item_id là số
    const numericDocs = await collection.find({ 
      order_item_id: { $type: 'number' } 
    }).toArray();

    if (numericDocs.length > 0) {
      console.log(`⚠️  Tìm thấy ${numericDocs.length} document có order_item_id dạng số`);
      console.log('🔄 Đang chuyển đổi sang string...');
      
      for (const doc of numericDocs) {
        await collection.updateOne(
          { _id: doc._id },
          { $set: { order_item_id: doc.order_item_id.toString() } }
        );
      }
      
      console.log('✅ Đã chuyển đổi tất cả order_item_id sang string');
    } else {
      console.log('✅ Tất cả order_item_id đã là string');
    }

    console.log('\n🎉 Hoàn tất! Index đã được fix.');
    process.exit(0);

  } catch (error) {
    console.error('❌ Lỗi:', error.message);
    process.exit(1);
  }
}

fixOrderItemIndex();
