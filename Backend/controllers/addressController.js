const Address = require('../models/Address');

exports.getAllAddresses = async (req, res) => {
  try {
    const { userId } = req.query;
    let query = {};
    
    if (userId) {
      query.user_id = parseInt(userId);
    }
    
    const addresses = await Address.find(query).sort({ address_id: 1 });
    res.json({
      success: true,
      data: addresses,
      count: addresses.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

exports.getAddressById = async (req, res) => {
  try {
    const { id } = req.params;
    const address = await Address.findOne({ address_id: parseInt(id) });
    
    if (!address) {
      return res.status(404).json({
        success: false,
        error: 'không tìm thấy địa chỉ'
      });
    }
    
    res.json({
      success: true,
      data: address
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

exports.createAddress = async (req, res) => {
  try {
    const { address_id, user_id, recipient_name, phone_number, full_address, is_default } = req.body;
    
    if (!user_id || !recipient_name || !full_address) {
      return res.status(400).json({
        success: false,
        error: 'Cần có ID người dùng, tên người nhận và địa chỉ đầy đủ'
      });
    }
    
    // nếu cài đặt này là mặc định, hãy bỏ cài đặt khác cho cùng một người dùng
    if (is_default) {
      await Address.updateMany(
        { user_id: parseInt(user_id) },
        { is_default: false }
      );
    }
    
    let finalAddressId;
    if (address_id !== undefined && address_id !== null && address_id !== '') {
      const provided = parseInt(address_id);
      if (isNaN(provided)) return res.status(400).json({ success: false, error: 'address_id phải là số' });
      const exists = await Address.findOne({ address_id: provided });
      if (exists) return res.status(400).json({ success: false, error: 'address_id đã tồn tại' });
      finalAddressId = provided;
    } else {
      const lastAddress = await Address.findOne().sort({ address_id: -1 });
      finalAddressId = lastAddress ? lastAddress.address_id + 1 : 1;
    }

    const address = await Address.create({
      address_id: finalAddressId,
      user_id: parseInt(user_id),
      recipient_name,
      phone_number,
      full_address,
      is_default: is_default || false
    });

    res.status(201).json({ success: true, data: address, message: 'Tạo địa chỉ thành công' });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

exports.updateAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const { recipient_name, phone_number, full_address, is_default } = req.body;
    
    // nếu cài đặt này là mặc định, hãy bỏ cài đặt khác cho cùng một người dùng
    if (is_default) {
      const address = await Address.findOne({ address_id: parseInt(id) });
      if (address) {
        await Address.updateMany(
          { user_id: address.user_id, address_id: { $ne: parseInt(id) } },
          { is_default: false }
        );
      }
    }
    
    const address = await Address.findOneAndUpdate(
      { address_id: parseInt(id) },
      { recipient_name, phone_number, full_address, is_default },
      { new: true, runValidators: true }
    );
    
    if (!address) {
      return res.status(404).json({
        success: false,
        error: 'không tìm thấy địa chỉ'
      });
    }
    
    res.json({
      success: true,
      data: address,
      message: 'Cập nhật địa chỉ thành công'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

exports.deleteAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const address = await Address.findOneAndDelete({ address_id: parseInt(id) });
    
    if (!address) {
      return res.status(404).json({
        success: false,
        error: 'không tìm thấy địa chỉ'
      });
    }
    
    res.json({
      success: true,
      message: 'Đã xóa địa chỉ thành công'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
