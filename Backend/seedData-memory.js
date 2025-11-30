const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { MongoMemoryServer } = require('mongodb-memory-server');

const User = require('./models/User');
const Address = require('./models/Address');
const Category = require('./models/Category');
const Supplier = require('./models/Supplier');
const Product = require('./models/Product');
const ProductVariant = require('./models/ProductVariant');
const Review = require('./models/Review');
const Order = require('./models/Order');
const OrderItem = require('./models/OrderItem');
const Payment = require('./models/Payment');
const Voucher = require('./models/Voucher');

let mongoServer;

const connectDB = async () => {
  try {
    mongoServer = await MongoMemoryServer.create();
    const mongoURI = mongoServer.getUri();
    
    const conn = await mongoose.connect(mongoURI);

    console.log(`MongoDB In-Memory Connected: ${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    
    // Clear existing data
    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Address.deleteMany({});
    await Category.deleteMany({});
    await Supplier.deleteMany({});
    await Product.deleteMany({});
    await ProductVariant.deleteMany({});
    await Review.deleteMany({});
    await Order.deleteMany({});
    await OrderItem.deleteMany({});
    await Payment.deleteMany({});
    await Voucher.deleteMany({});

    console.log('✓ Cleared existing data\n');

    // Hash password helper
    const hashPassword = async (password) => {
      const salt = await bcrypt.genSalt(10);
      return await bcrypt.hash(password, salt);
    };

    // Seed Users
    console.log('Seeding Users...');
    const users = await User.insertMany([
      {
        user_id: 1,
        full_name: "Nguyễn Văn An",
        email: "customer@test.com",
        password: await hashPassword("123456"),
        phone_number: "0909123456",
        role: "customer",
        created_at: new Date("2024-01-15T08:30:00Z")
      },
      {
        user_id: 2,
        full_name: "Trần Thị Bình",
        email: "admin@test.com",
        password: await hashPassword("admin123"),
        phone_number: "0912345678",
        role: "admin",
        created_at: new Date("2024-01-10T09:15:00Z")
      },
      {
        user_id: 3,
        full_name: "Lê Văn Cường",
        email: "cuong@test.com",
        password: await hashPassword("123456"),
        phone_number: "0923456789",
        role: "customer",
        created_at: new Date("2024-02-20T10:00:00Z")
      },
      {
        user_id: 4,
        full_name: "Phạm Thị Dung",
        email: "dung@test.com",
        password: await hashPassword("123456"),
        phone_number: "0934567890",
        role: "customer",
        created_at: new Date("2024-03-05T14:20:00Z")
      }
    ]);
    console.log(`✓ Seeded ${users.length} users\n`);

    // Seed Addresses
    console.log('Seeding Addresses...');
    const addresses = await Address.insertMany([
      {
        address_id: 1,
        user_id: 1,
        recipient_name: "Nguyễn Văn An",
        phone_number: "0909123456",
        full_address: "Số 123, Đường Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP.HCM",
        is_default: true
      },
      {
        address_id: 2,
        user_id: 1,
        recipient_name: "Nguyễn Văn An",
        phone_number: "0909123456",
        full_address: "12 Đường Lê Lợi, Phường Bến Thành, Quận 1, TP.HCM",
        is_default: false
      },
      {
        address_id: 3,
        user_id: 3,
        recipient_name: "Lê Văn Cường",
        phone_number: "0923456789",
        full_address: "456 Đường Võ Văn Tần, Phường 6, Quận 3, TP.HCM",
        is_default: true
      }
    ]);
    console.log(`✓ Seeded ${addresses.length} addresses\n`);

    // Seed Categories
    console.log('Seeding Categories...');
    const categories = await Category.insertMany([
      { category_id: 1, name: "Tôm", parent_id: null },
      { category_id: 2, name: "Cua", parent_id: null },
      { category_id: 3, name: "Cá", parent_id: null },
      { category_id: 4, name: "Mực", parent_id: null },
      { category_id: 5, name: "Nghêu Sò Ốc", parent_id: null },
      { category_id: 6, name: "Tôm sú", parent_id: 1 },
      { category_id: 7, name: "Tôm hùm", parent_id: 1 },
      { category_id: 8, name: "Cá hồi", parent_id: 3 },
      { category_id: 9, name: "Cá thu", parent_id: 3 }
    ]);
    console.log(`✓ Seeded ${categories.length} categories\n`);

    // Seed Suppliers
    console.log('Seeding Suppliers...');
    const suppliers = await Supplier.insertMany([
      {
        supplier_id: 1,
        name: "Vựa Hải Sản Vũng Tàu",
        contact_info: "Địa chỉ: 123 Lê Lợi, Vũng Tàu | ĐT: 0254-888888 | Email: vungtau@seafood.vn"
      },
      {
        supplier_id: 2,
        name: "Hải Sản Cà Mau",
        contact_info: "Địa chỉ: 456 Trần Phú, Cà Mau | ĐT: 0290-777777 | Email: camau@seafood.vn"
      },
      {
        supplier_id: 3,
        name: "Nhập Khẩu Hải Sản Na Uy",
        contact_info: "Địa chỉ: 789 Nguyễn Trãi, Hà Nội | ĐT: 024-666666 | Email: nauy@seafood.vn"
      },
      {
        supplier_id: 4,
        name: "Hải Sản Phú Quốc",
        contact_info: "Địa chỉ: 321 Trần Hưng Đạo, Phú Quốc | ĐT: 0297-555555 | Email: phuquoc@seafood.vn"
      }
    ]);
    console.log(`✓ Seeded ${suppliers.length} suppliers\n`);

    // Seed Products
    console.log('Seeding Products...');
    const products = await Product.insertMany([
      {
        product_id: 1,
        name: "Tôm sú thiên nhiên",
        description: "Tôm sú tươi sống được đánh bắt từ vùng biển Cà Mau, thịt chắc, ngọt tự nhiên. Đóng gói cẩn thận, giao hàng trong 3 giờ.",
        image_url: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=500",
        category_id: 1,
        supplier_id: 2,
        status: "active"
      },
      {
        product_id: 2,
        name: "Cá hồi Na Uy",
        description: "Cá hồi nhập khẩu từ Na Uy, giàu Omega-3, thịt mềm, béo ngậy. Phù hợp cho sushi, sashimi hoặc nướng.",
        image_url: "https://images.unsplash.com/photo-1544943910-04c54e3a9a5a?w=500",
        category_id: 3,
        supplier_id: 3,
        status: "active"
      },
      {
        product_id: 3,
        name: "Cua hoàng đế Alaska",
        description: "Cua hoàng đế Alaska size lớn, thịt chắc, ngọt đậm đà. Được bảo quản lạnh sâu, giữ nguyên độ tươi ngon.",
        image_url: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500",
        category_id: 2,
        supplier_id: 1,
        status: "active"
      },
      {
        product_id: 4,
        name: "Mực ống tươi",
        description: "Mực ống tươi sống, size lớn, thịt dày, giòn ngon. Phù hợp để nướng, chiên hoặc làm sashimi.",
        image_url: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=500",
        category_id: 4,
        supplier_id: 2,
        status: "active"
      },
      {
        product_id: 5,
        name: "Tôm hùm bông",
        description: "Tôm hùm bông size lớn, thịt chắc, ngọt tự nhiên. Đặc sản Phú Quốc, được đánh bắt và vận chuyển trong ngày.",
        image_url: "https://images.unsplash.com/photo-1588168333984-ff9d9fa4a3b8?w=500",
        category_id: 1,
        supplier_id: 4,
        status: "active"
      },
      {
        product_id: 6,
        name: "Nghêu hạt",
        description: "Nghêu hạt tươi sống, sạch cát, thịt ngọt. Phù hợp để nấu canh chua, xào me hoặc nướng mỡ hành.",
        image_url: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=500",
        category_id: 5,
        supplier_id: 2,
        status: "active"
      },
      {
        product_id: 7,
        name: "Cá thu đao",
        description: "Cá thu đao tươi sống, thịt chắc, ít xương. Phù hợp để nướng, kho tộ hoặc chiên giòn.",
        image_url: "https://images.unsplash.com/photo-1544943910-04c54e3a9a5a?w=500",
        category_id: 3,
        supplier_id: 1,
        status: "active"
      },
      {
        product_id: 8,
        name: "Sò điệp",
        description: "Sò điệp tươi sống, size lớn, thịt ngọt, béo. Phù hợp để nướng phô mai, xào bơ tỏi hoặc sashimi.",
        image_url: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=500",
        category_id: 5,
        supplier_id: 4,
        status: "active"
      }
    ]);
    console.log(`✓ Seeded ${products.length} products\n`);

    // Seed Product Variants
    console.log('Seeding Product Variants...');
    const productVariants = await ProductVariant.insertMany([
      // Tôm sú (product_id: 1)
      {
        variant_id: 1,
        product_id: 1,
        name: "500g",
        price: 150000,
        sale_price: 120000,
        stock_quantity: 50
      },
      {
        variant_id: 2,
        product_id: 1,
        name: "1kg",
        price: 280000,
        sale_price: 230000,
        stock_quantity: 30
      },
      {
        variant_id: 3,
        product_id: 1,
        name: "2kg",
        price: 550000,
        sale_price: 450000,
        stock_quantity: 15
      },
      // Cá hồi (product_id: 2)
      {
        variant_id: 4,
        product_id: 2,
        name: "300g",
        price: 250000,
        sale_price: 200000,
        stock_quantity: 40
      },
      {
        variant_id: 5,
        product_id: 2,
        name: "500g",
        price: 400000,
        sale_price: 350000,
        stock_quantity: 25
      },
      {
        variant_id: 6,
        product_id: 2,
        name: "1kg",
        price: 750000,
        sale_price: 680000,
        stock_quantity: 20
      },
      // Cua hoàng đế (product_id: 3)
      {
        variant_id: 7,
        product_id: 3,
        name: "1 con (0.8-1kg)",
        price: 1200000,
        sale_price: 1000000,
        stock_quantity: 10
      },
      {
        variant_id: 8,
        product_id: 3,
        name: "1 con (1.2-1.5kg)",
        price: 1800000,
        sale_price: 1500000,
        stock_quantity: 8
      },
      // Mực ống (product_id: 4)
      {
        variant_id: 9,
        product_id: 4,
        name: "500g",
        price: 180000,
        sale_price: 150000,
        stock_quantity: 35
      },
      {
        variant_id: 10,
        product_id: 4,
        name: "1kg",
        price: 350000,
        sale_price: 300000,
        stock_quantity: 25
      },
      // Tôm hùm bông (product_id: 5)
      {
        variant_id: 11,
        product_id: 5,
        name: "1 con (0.5-0.7kg)",
        price: 800000,
        sale_price: 650000,
        stock_quantity: 12
      },
      {
        variant_id: 12,
        product_id: 5,
        name: "1 con (0.8-1kg)",
        price: 1200000,
        sale_price: 1000000,
        stock_quantity: 8
      },
      // Nghêu hạt (product_id: 6)
      {
        variant_id: 13,
        product_id: 6,
        name: "1kg",
        price: 80000,
        sale_price: 65000,
        stock_quantity: 60
      },
      {
        variant_id: 14,
        product_id: 6,
        name: "2kg",
        price: 150000,
        sale_price: 120000,
        stock_quantity: 40
      },
      // Cá thu đao (product_id: 7)
      {
        variant_id: 15,
        product_id: 7,
        name: "1 con (0.5-0.7kg)",
        price: 120000,
        sale_price: 100000,
        stock_quantity: 30
      },
      {
        variant_id: 16,
        product_id: 7,
        name: "1 con (0.8-1kg)",
        price: 180000,
        sale_price: 150000,
        stock_quantity: 20
      },
      // Sò điệp (product_id: 8)
      {
        variant_id: 17,
        product_id: 8,
        name: "500g (8-10 con)",
        price: 250000,
        sale_price: 200000,
        stock_quantity: 25
      },
      {
        variant_id: 18,
        product_id: 8,
        name: "1kg (15-20 con)",
        price: 480000,
        sale_price: 380000,
        stock_quantity: 15
      }
    ]);
    console.log(`✓ Seeded ${productVariants.length} product variants\n`);

    // Seed Reviews
    console.log('Seeding Reviews...');
    const reviews = await Review.insertMany([
      {
        review_id: 1,
        product_id: 1,
        user_id: 1,
        rating: 5,
        comment: "Tôm rất tươi, giao nhanh, đóng gói cẩn thận. Sẽ mua lại!",
        created_at: new Date("2024-11-01T12:00:00Z")
      },
      {
        review_id: 2,
        product_id: 2,
        user_id: 1,
        rating: 5,
        comment: "Cá hồi ngon, thịt béo, phù hợp làm sushi. Rất hài lòng!",
        created_at: new Date("2024-11-03T15:30:00Z")
      },
      {
        review_id: 3,
        product_id: 3,
        user_id: 3,
        rating: 4,
        comment: "Cua to, thịt chắc. Hơi đắt nhưng chất lượng tốt.",
        created_at: new Date("2024-11-05T10:20:00Z")
      },
      {
        review_id: 4,
        product_id: 1,
        user_id: 4,
        rating: 5,
        comment: "Tôm sú tươi ngon, giá hợp lý. Giao hàng đúng giờ.",
        created_at: new Date("2024-11-08T14:15:00Z")
      }
    ]);
    console.log(`✓ Seeded ${reviews.length} reviews\n`);

    // Seed Orders
    console.log('Seeding Orders...');
    const orders = await Order.insertMany([
      {
        order_id: 1001,
        user_id: 1,
        order_date: new Date("2024-11-09T09:00:00Z"),
        status: "completed",
        shipping_address: "Số 123, Đường Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP.HCM",
        shipping_fee: 30000,
        discount_amount: 50000,
        total_amount: 200000,
        notes: "Giao trước 10h sáng nếu được"
      },
      {
        order_id: 1002,
        user_id: 1,
        order_date: new Date("2024-11-12T14:30:00Z"),
        status: "processing",
        shipping_address: "Số 123, Đường Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP.HCM",
        shipping_fee: 30000,
        discount_amount: 0,
        total_amount: 350000,
        notes: null
      },
      {
        order_id: 1003,
        user_id: 3,
        order_date: new Date("2024-11-15T11:00:00Z"),
        status: "pending",
        shipping_address: "456 Đường Võ Văn Tần, Phường 6, Quận 3, TP.HCM",
        shipping_fee: 30000,
        discount_amount: 200000,
        total_amount: 1500000,
        notes: "Giao vào buổi chiều"
      }
    ]);
    console.log(`✓ Seeded ${orders.length} orders\n`);

    // Seed Order Items
    console.log('Seeding Order Items...');
    const orderItems = await OrderItem.insertMany([
      {
        order_item_id: 1,
        order_id: 1001,
        variant_id: 1,
        quantity: 2,
        price_at_purchase: 120000
      },
      {
        order_item_id: 2,
        order_id: 1002,
        variant_id: 4,
        quantity: 1,
        price_at_purchase: 200000
      },
      {
        order_item_id: 3,
        order_id: 1002,
        variant_id: 9,
        quantity: 1,
        price_at_purchase: 150000
      },
      {
        order_item_id: 4,
        order_id: 1003,
        variant_id: 7,
        quantity: 1,
        price_at_purchase: 1000000
      },
      {
        order_item_id: 5,
        order_id: 1003,
        variant_id: 11,
        quantity: 1,
        price_at_purchase: 650000
      }
    ]);
    console.log(`✓ Seeded ${orderItems.length} order items\n`);

    // Seed Payments
    console.log('Seeding Payments...');
    const payments = await Payment.insertMany([
      {
        payment_id: 501,
        order_id: 1001,
        amount: 200000,
        payment_method: "Momo",
        status: "successful",
        transaction_id: "MOMO123456",
        created_at: new Date("2024-11-09T09:05:00Z")
      },
      {
        payment_id: 502,
        order_id: 1002,
        amount: 350000,
        payment_method: "Bank Transfer",
        status: "successful",
        transaction_id: "BANK789012",
        created_at: new Date("2024-11-12T14:35:00Z")
      },
      {
        payment_id: 503,
        order_id: 1003,
        amount: 1500000,
        payment_method: "COD",
        status: "pending",
        transaction_id: null,
        created_at: new Date("2024-11-15T11:05:00Z")
      }
    ]);
    console.log(`✓ Seeded ${payments.length} payments\n`);

    // Seed Vouchers
    console.log('Seeding Vouchers...');
    const vouchers = await Voucher.insertMany([
      {
        voucher_id: 1,
        code: "SALE50K",
        discount_type: "fixed_amount",
        value: 50000,
        expiry_date: new Date("2024-12-31T23:59:59Z"),
        usage_limit: 100,
        used_count: 5
      },
      {
        voucher_id: 2,
        code: "SALE10P",
        discount_type: "percentage",
        value: 10,
        expiry_date: new Date("2024-12-25T23:59:59Z"),
        usage_limit: 50,
        used_count: 12
      },
      {
        voucher_id: 3,
        code: "WELCOME100K",
        discount_type: "fixed_amount",
        value: 100000,
        expiry_date: new Date("2025-01-31T23:59:59Z"),
        usage_limit: 200,
        used_count: 45
      },
      {
        voucher_id: 4,
        code: "SALE20P",
        discount_type: "percentage",
        value: 20,
        expiry_date: new Date("2024-11-30T23:59:59Z"),
        usage_limit: 30,
        used_count: 8
      }
    ]);
    console.log(`✓ Seeded ${vouchers.length} vouchers\n`);

    console.log('═══════════════════════════════════════════════════');
    console.log('✅ Seed data completed successfully!');
    console.log('═══════════════════════════════════════════════════');
    console.log('\n📋 Tài khoản test:');
    console.log('   Customer: customer@test.com / 123456');
    console.log('   Admin:    admin@test.com / admin123');
    console.log('   Customer: cuong@test.com / 123456');
    console.log('   Customer: dung@test.com / 123456');
    console.log('\n💡 Running in IN-MEMORY mode');
    console.log('⚠️  Data will be lost when process ends');
    console.log('═══════════════════════════════════════════════════\n');
    
    // Keep connection alive
    console.log('Database is ready. Press Ctrl+C to stop...\n');
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    if (mongoServer) {
      await mongoServer.stop();
    }
    process.exit(1);
  }
};

// Run seed if this file is executed directly
if (require.main === module) {
  seedData();
}

module.exports = seedData;

