const mongoose = require('mongoose');
const OrderItem = require('./models/OrderItem');
const Order = require('./models/Order');

const testTopSelling = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/BIENTUOI_DB';
    console.log('🔗 Kết nối MongoDB:', mongoURI);
    await mongoose.connect(mongoURI);
    console.log('✓ Kết nối thành công\n');

    // Test date threshold (30 days)
    const dateThreshold = new Date();
    dateThreshold.setDate(dateThreshold.getDate() - 30);
    console.log('📅 Date threshold (30 days):', dateThreshold.toISOString());

    // Check orders
    const ordersCount = await Order.countDocuments({ status: 'completed' });
    console.log(`\n📦 Orders với status='completed': ${ordersCount}`);

    const orderSamples = await Order.find({ status: 'completed' }).limit(2).lean();
    orderSamples.forEach((o, i) => {
      console.log(`  ${i+1}. order_id: ${o.order_id}, date: ${o.order_date}, status: ${o.status}`);
    });

    // Test aggregate
    console.log('\n🔍 Testing aggregate query...');
    const topVariants = await OrderItem.aggregate([
      {
        $lookup: {
          from: 'Orders',
          localField: 'order_id',
          foreignField: 'order_id',
          as: 'order'
        }
      },
      {
        $unwind: '$order'
      },
      {
        $match: {
          'order.order_date': { $gte: dateThreshold },
          'order.status': 'completed'
        }
      },
      {
        $group: {
          _id: '$variant_id',
          totalQuantity: { $sum: '$quantity' },
          totalRevenue: { $sum: { $multiply: ['$quantity', '$price_at_purchase'] } }
        }
      },
      {
        $sort: { totalQuantity: -1 }
      },
      {
        $limit: 10
      }
    ]);

    console.log(`\n✅ Kết quả aggregate: ${topVariants.length} variants`);
    topVariants.forEach((v, i) => {
      console.log(`  ${i+1}. variant_id: ${v._id}, quantity: ${v.totalQuantity}, revenue: ${v.totalRevenue}`);
    });

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Lỗi:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
};

testTopSelling();
