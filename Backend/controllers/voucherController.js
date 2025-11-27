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
        error: 'Voucher not found'
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
        error: 'Voucher not found'
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
    const { code, discount_type, value, expiry_date, usage_limit } = req.body;
    
    if (!code || !discount_type || value === undefined) {
      return res.status(400).json({
        success: false,
        error: 'Code, discount type, and value are required'
      });
    }
    
    if (discount_type !== 'fixed_amount' && discount_type !== 'percentage') {
      return res.status(400).json({
        success: false,
        error: 'Discount type must be "fixed_amount" or "percentage"'
      });
    }
    
    // Check if code already exists
    const existingVoucher = await Voucher.findOne({ code: code.toUpperCase() });
    if (existingVoucher) {
      return res.status(400).json({
        success: false,
        error: 'Voucher code already exists'
      });
    }
    
    // Get the next voucher_id
    const lastVoucher = await Voucher.findOne().sort({ voucher_id: -1 });
    const nextVoucherId = lastVoucher ? lastVoucher.voucher_id + 1 : 1;
    
    const voucher = await Voucher.create({
      voucher_id: nextVoucherId,
      code: code.toUpperCase(),
      discount_type,
      value: parseFloat(value),
      expiry_date: expiry_date ? new Date(expiry_date) : null,
      usage_limit: usage_limit || null
    });
    
    res.status(201).json({
      success: true,
      data: voucher,
      message: 'Voucher created successfully'
    });
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
        error: 'Discount type must be "fixed_amount" or "percentage"'
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
        error: 'Voucher not found'
      });
    }
    
    res.json({
      success: true,
      data: voucher,
      message: 'Voucher updated successfully'
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
        error: 'Voucher not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Voucher deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
