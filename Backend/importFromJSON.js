const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Models
const User = require('./models/User');
const Address = require('./models/Address');
const Category = require('./models/Category');
const Supplier = require('./models/Supplier');
const Product = require('./models/Product');
const ProductVariant = require('./models/ProductVariant');
const Order = require('./models/Order');
const OrderItem = require('./models/OrderItem');
const Payment = require('./models/Payment');
const Voucher = require('./models/Voucher');

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/BIENTUOI_DB';
    await mongoose.connect(mongoURI);
    console.log(`MongoDB Connected: ${mongoose.connection.host}`);
    console.log(`Database: ${mongoose.connection.name}\n`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const loadJSONFile = (filename) => {
  const filePath = path.join(__dirname, '../Database', filename);
  const data = fs.readFileSync(filePath, 'utf8');
  const parsed = JSON.parse(data);
  
  // Convert MongoDB extended JSON to plain objects
  return parsed.map(doc => {
    const cleaned = { ...doc };
    delete cleaned._id; // Let MongoDB generate new _id
    
    // Convert $date to Date object
    for (const key in cleaned) {
      if (cleaned[key] && cleaned[key].$date) {
        cleaned[key] = new Date(cleaned[key].$date);
      }
    }
    
    return cleaned;
  });
};

const importData = async () => {
  try {
    await connectDB();

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await Promise.all([
      User.deleteMany({}),
      Address.deleteMany({}),
      Category.deleteMany({}),
      Supplier.deleteMany({}),
      Product.deleteMany({}),
      ProductVariant.deleteMany({}),
      Order.deleteMany({}),
      OrderItem.deleteMany({}),
      Payment.deleteMany({}),
      Voucher.deleteMany({})
    ]);
    console.log('✅ Cleared existing data\n');

    // Import Users
    console.log('📦 Importing Users...');
    const users = loadJSONFile('BIENTUOI_DB.Users.json');
    await User.insertMany(users);
    console.log(`✅ Imported ${users.length} users\n`);

    // Import Addresses
    console.log('📦 Importing Addresses...');
    const addresses = loadJSONFile('BIENTUOI_DB.Addresses.json');
    await Address.insertMany(addresses);
    console.log(`✅ Imported ${addresses.length} addresses\n`);

    // Import Categories
    console.log('📦 Importing Categories...');
    const categories = loadJSONFile('BIENTUOI_DB.Categories.json');
    await Category.insertMany(categories);
    console.log(`✅ Imported ${categories.length} categories\n`);

    // Import Suppliers
    console.log('📦 Importing Suppliers...');
    const suppliers = loadJSONFile('BIENTUOI_DB.Suppliers.json');
    await Supplier.insertMany(suppliers);
    console.log(`✅ Imported ${suppliers.length} suppliers\n`);

    // Import Products
    console.log('📦 Importing Products...');
    const products = loadJSONFile('BIENTUOI_DB.Products.json');
    await Product.insertMany(products);
    console.log(`✅ Imported ${products.length} products\n`);

    // Import Product Variants
    console.log('📦 Importing Product Variants...');
    const variants = loadJSONFile('BIENTUOI_DB.Product_Variants.json');
    await ProductVariant.insertMany(variants);
    console.log(`✅ Imported ${variants.length} product variants\n`);

    // Import Orders
    console.log('📦 Importing Orders...');
    const orders = loadJSONFile('BIENTUOI_DB.Orders.json');
    await Order.insertMany(orders);
    console.log(`✅ Imported ${orders.length} orders\n`);

    // Import Order Items
    console.log('📦 Importing Order Items...');
    const orderItems = loadJSONFile('BIENTUOI_DB.Order_Items.json');
    await OrderItem.insertMany(orderItems);
    console.log(`✅ Imported ${orderItems.length} order items\n`);

    // Import Payments
    console.log('📦 Importing Payments...');
    const payments = loadJSONFile('BIENTUOI_DB.Payments.json');
    await Payment.insertMany(payments);
    console.log(`✅ Imported ${payments.length} payments\n`);

    // Import Vouchers
    console.log('📦 Importing Vouchers...');
    const vouchers = loadJSONFile('BIENTUOI_DB.Vouchers.json');
    await Voucher.insertMany(vouchers);
    console.log(`✅ Imported ${vouchers.length} vouchers\n`);

    console.log('═══════════════════════════════════════════════════');
    console.log('✅ All data imported successfully from JSON files!');
    console.log('═══════════════════════════════════════════════════\n');
    
    console.log('📋 Test accounts:');
    console.log('   Customer: customer@test.com / 123456');
    console.log('   Admin:    admin@test.com / admin123');
    console.log('═══════════════════════════════════════════════════\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error importing data:', error);
    process.exit(1);
  }
};

importData();
