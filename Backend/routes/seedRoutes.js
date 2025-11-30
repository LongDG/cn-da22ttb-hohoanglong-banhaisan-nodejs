const express = require('express');
const router = express.Router();
const seedDataToCurrentDB = require('../seedDataToCurrentDB');

// Route để seed dữ liệu (chỉ dùng cho development/testing)
router.post('/seed', async (req, res) => {
  try {
    console.log('\n🌱 Starting seed via API...\n');
    await seedDataToCurrentDB();
    res.json({
      success: true,
      message: 'Dữ liệu đã được seed thành công!',
      accounts: {
        admin: 'admin@test.com / admin123',
        customer: 'customer@test.com / 123456'
      }
    });
  } catch (error) {
    console.error('Seed error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;

