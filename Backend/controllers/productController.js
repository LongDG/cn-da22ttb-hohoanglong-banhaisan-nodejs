const Product = require('../models/Product');

exports.getAllProducts = async (req, res) => {
  try {
    const { categoryId, supplierId, status } = req.query;
    let query = {};
    
    if (categoryId) {
      query.category_id = parseInt(categoryId);
    }
    
    if (supplierId) {
      query.supplier_id = parseInt(supplierId);
    }
    
    if (status) {
      query.status = status;
    }
    
    const products = await Product.find(query).sort({ product_id: 1 });
    res.json({
      success: true,
      data: products,
      count: products.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findOne({ product_id: parseInt(id) });
    
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }
    
    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const { name, description, image_url, category_id, supplier_id, status } = req.body;
    
    if (!name || !category_id || !supplier_id) {
      return res.status(400).json({
        success: false,
        error: 'Name, category ID, and supplier ID are required'
      });
    }
    
    // Get the next product_id
    const lastProduct = await Product.findOne().sort({ product_id: -1 });
    const nextProductId = lastProduct ? lastProduct.product_id + 1 : 1;
    
    const product = await Product.create({
      product_id: nextProductId,
      name,
      description,
      image_url,
      category_id: parseInt(category_id),
      supplier_id: parseInt(supplier_id),
      status: status || 'active'
    });
    
    res.status(201).json({
      success: true,
      data: product,
      message: 'Product created successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, image_url, category_id, supplier_id, status } = req.body;
    
    const product = await Product.findOneAndUpdate(
      { product_id: parseInt(id) },
      { name, description, image_url, category_id, supplier_id, status },
      { new: true, runValidators: true }
    );
    
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }
    
    res.json({
      success: true,
      data: product,
      message: 'Product updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findOneAndDelete({ product_id: parseInt(id) });
    
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
