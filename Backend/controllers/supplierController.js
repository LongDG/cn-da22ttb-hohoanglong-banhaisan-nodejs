const Supplier = require('../models/Supplier');

exports.getAllSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.find().sort({ supplier_id: 1 });
    res.json({
      success: true,
      data: suppliers,
      count: suppliers.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

exports.getSupplierById = async (req, res) => {
  try {
    const { id } = req.params;
    const supplier = await Supplier.findOne({ supplier_id: parseInt(id) });
    
    if (!supplier) {
      return res.status(404).json({
        success: false,
        error: 'Không tìm thấy nhà cung cấp'
      });
    }
    
    res.json({
      success: true,
      data: supplier
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

exports.createSupplier = async (req, res) => {
  try {
    const { supplier_id, name, contact_info } = req.body;

    if (!name) return res.status(400).json({ success: false, error: 'Tên nhà cung cấp là bắt buộc' });

    let finalSupplierId;
    if (supplier_id !== undefined && supplier_id !== null && supplier_id !== '') {
      const provided = parseInt(supplier_id);
      if (isNaN(provided)) return res.status(400).json({ success: false, error: 'supplier_id phải là số' });
      const exists = await Supplier.findOne({ supplier_id: provided });
      if (exists) return res.status(400).json({ success: false, error: 'supplier_id đã tồn tại' });
      finalSupplierId = provided;
    } else {
      const lastSupplier = await Supplier.findOne().sort({ supplier_id: -1 });
      finalSupplierId = lastSupplier ? lastSupplier.supplier_id + 1 : 1;
    }

    const supplier = await Supplier.create({ supplier_id: finalSupplierId, name, contact_info });
    res.status(201).json({ success: true, data: supplier, message: 'Đã tạo nhà cung cấp thành công' });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

exports.updateSupplier = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, contact_info } = req.body;
    
    const supplier = await Supplier.findOneAndUpdate(
      { supplier_id: parseInt(id) },
      { name, contact_info },
      { new: true, runValidators: true }
    );
    
    if (!supplier) {
      return res.status(404).json({
        success: false,
        error: 'Không tìm thấy nhà cung cấp'
      });
    }
    
    res.json({
      success: true,
      data: supplier,
      message: 'Đã cập nhật nhà cung cấp thành công'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

exports.deleteSupplier = async (req, res) => {
  try {
    const { id } = req.params;
    const supplier = await Supplier.findOneAndDelete({ supplier_id: parseInt(id) });
    
    if (!supplier) {
      return res.status(404).json({
        success: false,
        error: 'Không tìm thấy nhà cung cấp'
      });
    }
    
    res.json({
      success: true,
      message: 'Đã xóa nhà cung cấp thành công'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
