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
        error: 'Product variant not found'
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
    const { product_id, name, price, sale_price, stock_quantity } = req.body;
    
    if (!product_id || !name || price === undefined) {
      return res.status(400).json({
        success: false,
        error: 'Product ID, name, and price are required'
      });
    }
    
    // Get the next variant_id
    const lastVariant = await ProductVariant.findOne().sort({ variant_id: -1 });
    const nextVariantId = lastVariant ? lastVariant.variant_id + 1 : 1;
    
    const variant = await ProductVariant.create({
      variant_id: nextVariantId,
      product_id: parseInt(product_id),
      name,
      price: parseFloat(price),
      sale_price: sale_price ? parseFloat(sale_price) : null,
      stock_quantity: stock_quantity || 0
    });
    
    res.status(201).json({
      success: true,
      data: variant,
      message: 'Product variant created successfully'
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
    const { name, price, sale_price, stock_quantity } = req.body;
    
    const variant = await ProductVariant.findOneAndUpdate(
      { variant_id: parseInt(id) },
      { name, price, sale_price, stock_quantity },
      { new: true, runValidators: true }
    );
    
    if (!variant) {
      return res.status(404).json({
        success: false,
        error: 'Product variant not found'
      });
    }
    
    res.json({
      success: true,
      data: variant,
      message: 'Product variant updated successfully'
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
        error: 'Product variant not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Product variant deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
