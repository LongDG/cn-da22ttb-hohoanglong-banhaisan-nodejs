const Voucher = require('../models/Voucher');

exports.getAllVouchers = async (req, res) => {
  try {
    const vouchers = await Voucher.find().sort({ voucher_id: 1 });
    res.json({
      success: true,
      data: vouchers,
      count: vouchers.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

exports.getVoucherById = async (req, res) => {
  try {
    const { id } = req.params;
    const voucher = await Voucher.findOne({ voucher_id: parseInt(id) });
    
    if (!voucher) {
      return res.status(404).json({
        success: false,
        error: 'Không tìm thấy voucher'
      });
    }
    
    res.json({
      success: true,
      data: voucher
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

exports.getVoucherByCode = async (req, res) => {
  try {
    const { code } = req.params;
    const voucher = await Voucher.findOne({ code: code.toUpperCase() });
    
    if (!voucher) {
      return res.status(404).json({
        success: false,
        error: 'Không tìm thấy voucher'
      });
    }
    
    const isValid = voucher.isValid();
    
    res.json({
      success: true,
      data: voucher,
      isValid
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

exports.createVoucher = async (req, res) => {
  try {
    const { voucher_id, code, discount_type, value, expiry_date, usage_limit } = req.body;

    if (!code || !discount_type || value === undefined) return res.status(400).json({ success: false, error: 'Mã code, loại giảm giá và giá trị là bắt buộc' });
    if (discount_type !== 'fixed_amount' && discount_type !== 'percentage') return res.status(400).json({ success: false, error: 'Loại giảm giá phải là "fixed_amount" hoặc "percentage"' });

    // Check if code already exists
    const existingVoucher = await Voucher.findOne({ code: code.toUpperCase() });
    if (existingVoucher) return res.status(400).json({ success: false, error: 'Mã voucher đã tồn tại' });

    let finalVoucherId;
    if (voucher_id !== undefined && voucher_id !== null && voucher_id !== '') {
      const provided = parseInt(voucher_id);
      if (isNaN(provided)) return res.status(400).json({ success: false, error: 'voucher_id phải là số' });
      const exists = await Voucher.findOne({ voucher_id: provided });
      if (exists) return res.status(400).json({ success: false, error: 'voucher_id đã tồn tại' });
      finalVoucherId = provided;
    } else {
      const lastVoucher = await Voucher.findOne().sort({ voucher_id: -1 });
      finalVoucherId = lastVoucher ? lastVoucher.voucher_id + 1 : 1;
    }

    const voucher = await Voucher.create({ voucher_id: finalVoucherId, code: code.toUpperCase(), discount_type, value: parseFloat(value), expiry_date: expiry_date ? new Date(expiry_date) : null, usage_limit: usage_limit || null });
    res.status(201).json({ success: true, data: voucher, message: 'Đã tạo voucher thành công' });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

exports.updateVoucher = async (req, res) => {
  try {
    const { id } = req.params;
    const { code, discount_type, value, expiry_date, usage_limit } = req.body;
    
    if (discount_type && discount_type !== 'fixed_amount' && discount_type !== 'percentage') {
      return res.status(400).json({
        success: false,
        error: 'Loại giảm giá phải là "fixed_amount" hoặc "percentage"'
      });
    }
    
    const updateData = {
      discount_type,
      value: value !== undefined ? parseFloat(value) : undefined,
      usage_limit
    };
    
    if (code) {
      updateData.code = code.toUpperCase();
    }
    
    if (expiry_date) {
      updateData.expiry_date = new Date(expiry_date);
    }
    
    // Remove undefined fields
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined) {
        delete updateData[key];
      }
    });
    
    const voucher = await Voucher.findOneAndUpdate(
      { voucher_id: parseInt(id) },
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!voucher) {
      return res.status(404).json({
        success: false,
        error: 'Không tìm thấy voucher'
      });
    }
    
    res.json({
      success: true,
      data: voucher,
      message: 'Đã cập nhật voucher thành công'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

exports.deleteVoucher = async (req, res) => {
  try {
    const { id } = req.params;
    const voucher = await Voucher.findOneAndDelete({ voucher_id: parseInt(id) });
    
    if (!voucher) {
      return res.status(404).json({
        success: false,
        error: 'Không tìm thấy voucher'
      });
    }
    
    res.json({
      success: true,
      message: 'Đã xóa voucher thành công'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Validate voucher for checkout
exports.validateVoucher = async (req, res) => {
  try {
    const { code } = req.params;
    const voucher = await Voucher.findOne({ code: code.toUpperCase() });
    
    if (!voucher) {
      return res.status(404).json({
        success: false,
        error: 'Mã giảm giá không tồn tại'
      });
    }
    
    // Check if voucher is expired
    if (voucher.expiry_date && new Date(voucher.expiry_date) < new Date()) {
      return res.status(400).json({
        success: false,
        error: 'Mã giảm giá đã hết hạn'
      });
    }
    
    // Check usage limit
    if (voucher.usage_limit !== null && voucher.usage_limit <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Mã giảm giá đã hết lượt sử dụng'
      });
    }
    
    res.json({
      voucher_code: voucher.code,
      discount_type: voucher.discount_type,
      discount_value: voucher.value,
      minimum_order_value: voucher.minimum_order_value || 0
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
