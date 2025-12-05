const { calculateShippingFee, getShippingFeeDescription, isInnerCity } = require('../utils/shippingFee');

/**
 * Test tính phí ship
 * POST /api/shipping/calculate
 */
exports.calculateShippingFee = async (req, res) => {
  try {
    const { distance_km, order_amount, shipping_address } = req.body;

    if (distance_km === undefined || order_amount === undefined) {
      return res.status(400).json({
        success: false,
        error: 'distance_km và order_amount là bắt buộc'
      });
    }

    const distance = parseFloat(distance_km) || 0;
    const amount = parseFloat(order_amount) || 0;
    const address = shipping_address || '';

    const fee = calculateShippingFee(distance, amount, address);
    const description = getShippingFeeDescription(distance, amount, address);
    const isInner = isInnerCity(address);

    res.json({
      success: true,
      data: {
        distance_km: distance,
        order_amount: amount,
        shipping_address: address,
        shipping_fee: fee,
        shipping_fee_description: description,
        is_inner_city: isInner,
        is_freeship: fee === 0
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * Lấy thông tin quy tắc tính phí ship
 * GET /api/shipping/rules
 */
exports.getShippingRules = async (req, res) => {
  try {
    const rules = {
      distance_rules: [
        {
          distance_range: 'Dưới 5km',
          freeship_threshold: 500000,
          fee: 20000,
          description: 'Hóa đơn trên 500k → FREESHIP, dưới 500k → 20.000đ'
        },
        {
          distance_range: 'Dưới 8km',
          freeship_threshold: 1000000,
          fee: 30000,
          description: 'Hóa đơn trên 1 triệu → FREESHIP, dưới 1 triệu → 30.000đ'
        },
        {
          distance_range: 'Trên 8km',
          freeship_threshold: 2000000,
          fee: 40000,
          description: 'Hóa đơn trên 2 triệu → FREESHIP, dưới 2 triệu → 40.000đ'
        }
      ],
      inner_city_rule: {
        description: 'Trong nội thành TP.HCM (trừ Nhà Bè, Q9, Bình Chánh, Thủ Đức, Hóc Môn, Q12)',
        freeship_threshold: 3000000,
        description_full: 'Hóa đơn trên 3 triệu → FREESHIP'
      },
      inner_districts: [
        'Quận 1', 'Quận 2', 'Quận 3', 'Quận 4', 'Quận 5', 'Quận 6', 'Quận 7', 'Quận 8',
        'Quận 10', 'Quận 11', 'Quận Bình Thạnh', 'Quận Tân Bình', 'Quận Tân Phú',
        'Quận Phú Nhuận', 'Quận Gò Vấp'
      ],
      outer_districts: [
        'Nhà Bè', 'Quận 9', 'Bình Chánh', 'Thủ Đức', 'Hóc Môn', 'Quận 12',
        'Cần Giờ', 'Củ Chi'
      ]
    };

    res.json({
      success: true,
      data: rules
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

