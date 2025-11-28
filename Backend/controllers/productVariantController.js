const ProductVariant = require('../models/ProductVariant');

exports.getAllProductVariants = async (req, res) => {
  try {
    const { productId } = req.query;
    let query = {};
    
    if (productId) {
      query.product_id = parseInt(productId);
    }
    
    const variants = await ProductVariant.find(query).sort({ variant_id: 1 });
    res.json({
      success: true,
      data: variants,
      count: variants.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

exports.getProductVariantById = async (req, res) => {
  try {
    const { id } = req.params;
    const variant = await ProductVariant.findOne({ variant_id: parseInt(id) });
    
    if (!variant) {
      return res.status(404).json({
        success: false,
        error: 'Không tìm thấy biến thể sản phẩm'
      });
    }
    
    res.json({
      success: true,
      data: variant
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

exports.createProductVariant = async (req, res) => {
  try {
    const { variant_id, product_id, name, price, sale_price, stock_quantity } = req.body;

    if (!product_id || !name || price === undefined) return res.status(400).json({ success: false, error: 'Cần có product_id, name và price' });

    let finalVariantId;
    if (variant_id !== undefined && variant_id !== null && variant_id !== '') {
      const provided = parseInt(variant_id);
      if (isNaN(provided)) return res.status(400).json({ success: false, error: 'variant_id phải là số' });
      const exists = await ProductVariant.findOne({ variant_id: provided });
      if (exists) return res.status(400).json({ success: false, error: 'variant_id đã tồn tại' });
      finalVariantId = provided;
    } else {
      const lastVariant = await ProductVariant.findOne().sort({ variant_id: -1 });
      finalVariantId = lastVariant ? lastVariant.variant_id + 1 : 1;
    }

    const variant = await ProductVariant.create({ variant_id: finalVariantId, product_id: parseInt(product_id), name, price: parseFloat(price), sale_price: sale_price ? parseFloat(sale_price) : null, stock_quantity: stock_quantity || 0 });
    res.status(201).json({ success: true, data: variant, message: 'Đã tạo biến thể sản phẩm thành công' });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

exports.updateProductVariant = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, sale_price, stock_quantity } = req.body;
    
    const variant = await ProductVariant.findOneAndUpdate(
      { variant_id: parseInt(id) },
      { name, price, sale_price, stock_quantity },
      { new: true, runValidators: true }
    );
    
    if (!variant) {
      return res.status(404).json({
        success: false,
        error: 'Không tìm thấy biến thể sản phẩm'
      });
    }
    
    res.json({
      success: true,
      data: variant,
      message: 'Đã cập nhật biến thể sản phẩm thành công'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

exports.deleteProductVariant = async (req, res) => {
  try {
    const { id } = req.params;
    const variant = await ProductVariant.findOneAndDelete({ variant_id: parseInt(id) });
    
    if (!variant) {
      return res.status(404).json({
        success: false,
        error: 'Không tìm thấy biến thể sản phẩm'
      });
    }
    
    res.json({
      success: true,
      message: 'Đã xóa biến thể sản phẩm thành công'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
