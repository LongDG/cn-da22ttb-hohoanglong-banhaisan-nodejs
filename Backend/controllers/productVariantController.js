const ProductVariant = require('../models/ProductVariant');

exports.getAllProductVariants = async (req, res) => {
  try {
    const { productId } = req.query;
    console.log('Query params:', req.query); // Debug
    console.log('productId received:', productId); // Debug
    let query = {};
    
    if (productId) {
      query.product_id = productId; // Use String ID directly
      console.log('Query filter:', query); // Debug
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
    const variant = await ProductVariant.findOne({ variant_id: id }); // Use String ID directly
    
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
    const { variant_id, product_id, name, price, sale_price, stock_quantity, weight, unit, status } = req.body;

    if (!product_id || !name || price === undefined) {
      return res.status(400).json({ 
        success: false, 
        error: 'Cần có product_id, name và price' 
      });
    }

    let finalVariantId;
    if (variant_id !== undefined && variant_id !== null && variant_id !== '') {
      // Nếu variant_id là string (như "V001"), giữ nguyên
      if (typeof variant_id === 'string' && variant_id.startsWith('V')) {
        const exists = await ProductVariant.findOne({ variant_id });
        if (exists) {
          return res.status(400).json({ 
            success: false, 
            error: 'variant_id đã tồn tại' 
          });
        }
        finalVariantId = variant_id;
      } else {
        // Nếu là số, convert
        const provided = parseInt(variant_id);
        if (isNaN(provided)) {
          return res.status(400).json({ 
            success: false, 
            error: 'variant_id không hợp lệ' 
          });
        }
        const exists = await ProductVariant.findOne({ variant_id: provided });
        if (exists) {
          return res.status(400).json({ 
            success: false, 
            error: 'variant_id đã tồn tại' 
          });
        }
        finalVariantId = provided;
      }
    } else {
      // Auto-generate string variant_id
      const lastVariant = await ProductVariant.findOne().sort({ created_at: -1 });
      if (lastVariant && typeof lastVariant.variant_id === 'string') {
        const match = lastVariant.variant_id.match(/V(\d+)/);
        if (match) {
          const num = parseInt(match[1]) + 1;
          finalVariantId = `V${String(num).padStart(3, '0')}`;
        } else {
          finalVariantId = 'V001';
        }
      } else {
        finalVariantId = 'V001';
      }
    }

    const variantData = {
      variant_id: finalVariantId,
      product_id,
      name,
      price: parseFloat(price),
      sale_price: sale_price ? parseFloat(sale_price) : null,
      stock_quantity: stock_quantity || 0,
      weight: weight || 1,
      unit: unit || 'kg',
      status: status || 'active'
    };

    const variant = await ProductVariant.create(variantData);
    res.status(201).json({ 
      success: true, 
      data: variant, 
      message: 'Đã tạo biến thể sản phẩm thành công' 
    });
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
    const { product_id, name, price, sale_price, stock_quantity, weight, unit, status } = req.body;
    
    const updateData = {};
    if (product_id !== undefined) updateData.product_id = product_id;
    if (name !== undefined) updateData.name = name;
    if (price !== undefined) updateData.price = price;
    if (sale_price !== undefined) updateData.sale_price = sale_price;
    if (stock_quantity !== undefined) updateData.stock_quantity = stock_quantity;
    if (weight !== undefined) updateData.weight = weight;
    if (unit !== undefined) updateData.unit = unit;
    if (status !== undefined) updateData.status = status;
    
    const variant = await ProductVariant.findOneAndUpdate(
      { variant_id: id },
      updateData,
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
