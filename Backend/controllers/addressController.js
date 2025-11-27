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
        error: 'Address not found'
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
    const { user_id, recipient_name, phone_number, full_address, is_default } = req.body;
    
    if (!user_id || !recipient_name || !full_address) {
      return res.status(400).json({
        success: false,
        error: 'User ID, recipient name, and full address are required'
      });
    }
    
    // If this is set as default, unset others for the same user
    if (is_default) {
      await Address.updateMany(
        { user_id: parseInt(user_id) },
        { is_default: false }
      );
    }
    
    // Get the next address_id
    const lastAddress = await Address.findOne().sort({ address_id: -1 });
    const nextAddressId = lastAddress ? lastAddress.address_id + 1 : 1;
    
    const address = await Address.create({
      address_id: nextAddressId,
      user_id: parseInt(user_id),
      recipient_name,
      phone_number,
      full_address,
      is_default: is_default || false
    });
    
    res.status(201).json({
      success: true,
      data: address,
      message: 'Address created successfully'
    });
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
    
    // If this is set as default, unset others for the same user
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
        error: 'Address not found'
      });
    }
    
    res.json({
      success: true,
      data: address,
      message: 'Address updated successfully'
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
        error: 'Address not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Address deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
