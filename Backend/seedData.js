const mongoose = require('mongoose');
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

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/BIENTUOI_DB';
    
    const conn = await mongoose.connect(mongoURI);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log(`Database: ${conn.connection.name}`);
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

    console.log('Cleared existing data');

    // Seed Users
    const users = await User.insertMany([
      {
        user_id: 1,
        full_name: "Nguyễn Văn A",
        email: "nguyenvana@example.com",
        password: "hashed_password_123",
        phone_number: "0909123456",
        role: "customer",
        created_at: new Date("2025-11-10T08:30:00Z")
      },
      {
        user_id: 2,
        full_name: "Trần Thị B",
        email: "tranthib@example.com",
        password: "hashed_password_456",
        phone_number: "0912345678",
        role: "admin",
        created_at: new Date("2025-11-09T09:15:00Z")
      }
    ]);
    console.log(`Seeded ${users.length} users`);

    // Seed Addresses
    const addresses = await Address.insertMany([
      {
        address_id: 1,
        user_id: 1,
        recipient_name: "Nguyễn Văn A",
        phone_number: "0909123456",
        full_address: "Số 123, Đường ABC, Phường 5, Quận 10, TP.HCM",
        is_default: true
      },
      {
        address_id: 2,
        user_id: 1,
        recipient_name: "Nguyễn Văn A",
        phone_number: "0909123456",
        full_address: "12 Đường Hoa Mai, Phú Nhuận, TP.HCM",
        is_default: false
      }
    ]);
    console.log(`Seeded ${addresses.length} addresses`);

    // Seed Categories
    const categories = await Category.insertMany([
      { category_id: 1, name: "Cá", parent_id: null },
      { category_id: 2, name: "Tôm", parent_id: null },
      { category_id: 3, name: "Cá nước ngọt", parent_id: 1 }
    ]);
    console.log(`Seeded ${categories.length} categories`);

    // Seed Suppliers
    const suppliers = await Supplier.insertMany([
      {
        supplier_id: 1,
        name: "Vựa hải sản Vũng Tàu",
        contact_info: "ĐC: 123 Lê Lợi, Vũng Tàu - ĐT: 0254-888888"
      }
    ]);
    console.log(`Seeded ${suppliers.length} suppliers`);

    // Seed Products
    const products = await Product.insertMany([
      {
        product_id: 1,
        name: "Tôm sú thiên nhiên",
        description: "Tôm sú tươi sống được đánh bắt từ vùng biển Cà Mau.",
        image_url: "/uploads/products/tom-su.jpg",
        category_id: 2,
        supplier_id: 1,
        status: "active"
      },
      {
        product_id: 2,
        name: "Cá hồi Na Uy",
        description: "Cá hồi nhập khẩu, giàu Omega-3.",
        image_url: "/uploads/products/ca-hoi.jpg",
        category_id: 1,
        supplier_id: 1,
        status: "active"
      }
    ]);
    console.log(`Seeded ${products.length} products`);

    // Seed Product Variants
    const productVariants = await ProductVariant.insertMany([
      {
        variant_id: 1,
        product_id: 1,
        name: "Khay 500g",
        price: 120000,
        sale_price: 100000,
        stock_quantity: 25
      },
      {
        variant_id: 2,
        product_id: 1,
        name: "1kg nguyên con",
        price: 230000,
        sale_price: null,
        stock_quantity: 10
      }
    ]);
    console.log(`Seeded ${productVariants.length} product variants`);

    // Seed Reviews
    const reviews = await Review.insertMany([
      {
        review_id: 1,
        product_id: 1,
        user_id: 1,
        rating: 5,
        comment: "Tôm rất tươi, giao nhanh.",
        created_at: new Date("2025-11-01T12:00:00Z")
      },
      {
        review_id: 2,
        product_id: 2,
        user_id: 1,
        rating: 4,
        comment: "Cá ngon, đóng gói cẩn thận.",
        created_at: new Date("2025-11-03T15:30:00Z")
      }
    ]);
    console.log(`Seeded ${reviews.length} reviews`);

    // Seed Orders
    const orders = await Order.insertMany([
      {
        order_id: 1001,
        user_id: 1,
        order_date: new Date("2025-11-09T09:00:00Z"),
        status: "processing",
        shipping_address: "Số 123, Đường ABC, Phường 5, Quận 10, TP.HCM",
        shipping_fee: 30000,
        discount_amount: 50000,
        total_amount: 170000,
        notes: "Giao trước 10h sáng nếu được"
      }
    ]);
    console.log(`Seeded ${orders.length} orders`);

    // Seed Order Items
    const orderItems = await OrderItem.insertMany([
      {
        order_item_id: 1,
        order_id: 1001,
        variant_id: 1,
        quantity: 2,
        price_at_purchase: 100000
      },
      {
        order_item_id: 2,
        order_id: 1001,
        variant_id: 2,
        quantity: 1,
        price_at_purchase: 230000
      }
    ]);
    console.log(`Seeded ${orderItems.length} order items`);

    // Seed Payments
    const payments = await Payment.insertMany([
      {
        payment_id: 501,
        order_id: 1001,
        amount: 170000,
        payment_method: "Momo",
        status: "successful",
        transaction_id: "MOMO123456"
      }
    ]);
    console.log(`Seeded ${payments.length} payments`);

    // Seed Vouchers
    const vouchers = await Voucher.insertMany([
      {
        voucher_id: 1,
        code: "SALE50K",
        discount_type: "fixed_amount",
        value: 50000,
        expiry_date: new Date("2025-12-31T00:00:00Z"),
        usage_limit: 100
      },
      {
        voucher_id: 2,
        code: "SALE10P",
        discount_type: "percentage",
        value: 10,
        expiry_date: new Date("2025-12-25T00:00:00Z"),
        usage_limit: 50
      }
    ]);
    console.log(`Seeded ${vouchers.length} vouchers`);

    console.log('Seed data completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

// Run seed if this file is executed directly
if (require.main === module) {
  seedData();
}

module.exports = seedData;
