const Product = require('../models/Product');
const Category = require('../models/Category');
const Supplier = require('../models/Supplier');
const ProductVariant = require('../models/ProductVariant');
const OrderItem = require('../models/OrderItem');

exports.getAllProducts = async (req, res) => {
  try {
    const { categoryId, supplierId, status } = req.query;
    let query = {};
    
    if (categoryId) {
      query.category_id = categoryId;
    }
    
    if (supplierId) {
      query.supplier_id = supplierId;
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
    const product = await Product.findOne({ product_id: id });
    
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
    const { product_id, name, description, image_url, category_id, supplier_id, status } = req.body;

    if (!name || !category_id || !supplier_id) {
      return res.status(400).json({
        success: false,
        error: 'Name, category ID, and supplier ID are required'
      });
    }

    // Validate category exists
    const category = await Category.findOne({ category_id: category_id });
    if (!category) {
      return res.status(400).json({
        success: false,
        error: `Category với ID ${category_id} không tồn tại`
      });
    }

    // Validate supplier exists
    const supplier = await Supplier.findOne({ supplier_id: supplier_id });
    if (!supplier) {
      return res.status(400).json({
        success: false,
        error: `Supplier với ID ${supplier_id} không tồn tại`
      });
    }

    let finalProductId;

    if (product_id !== undefined && product_id !== null && product_id !== '') {
      // check duplicate
      const existing = await Product.findOne({ product_id: product_id });
      if (existing) {
        return res.status(400).json({ success: false, error: 'product_id already exists' });
      }

      finalProductId = product_id;
    } else {
      // Auto-generate product_id
      const lastProduct = await Product.findOne().sort({ product_id: -1 });
      // Generate next ID based on last one
      if (lastProduct && lastProduct.product_id) {
        const lastId = lastProduct.product_id;
        if (typeof lastId === 'string' && lastId.startsWith('P')) {
          const num = parseInt(lastId.substring(1));
          finalProductId = 'P' + (num + 1);
        } else {
          finalProductId = 'P1001';
        }
      } else {
        finalProductId = 'P1001';
      }
    }

    const product = await Product.create({
      product_id: finalProductId,
      name,
      description,
      image_url,
      category_id: category_id,
      supplier_id: supplier_id,
      status: status || 'active'
    });

    res.status(201).json({
      success: true,
      data: product,
      message: 'Đã tạo sản phẩm thành công'
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
    
    // Validate category if provided
    if (category_id !== undefined) {
      const category = await Category.findOne({ category_id: category_id });
      if (!category) {
        return res.status(400).json({
          success: false,
          error: `Category với ID ${category_id} không tồn tại`
        });
      }
    }
    
    // Validate supplier if provided
    if (supplier_id !== undefined) {
      const supplier = await Supplier.findOne({ supplier_id: supplier_id });
      if (!supplier) {
        return res.status(400).json({
          success: false,
          error: `Supplier với ID ${supplier_id} không tồn tại`
        });
      }
    }
    
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (image_url !== undefined) updateData.image_url = image_url;
    if (category_id !== undefined) updateData.category_id = category_id;
    if (supplier_id !== undefined) updateData.supplier_id = supplier_id;
    if (status !== undefined) updateData.status = status;
    
    const product = await Product.findOneAndUpdate(
      { product_id: id },
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Không tìm thấy sản phẩm'
      });
    }
    
    res.json({
      success: true,
      data: product,
      message: 'Đã cập nhật sản phẩm thành công'
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
    
    // Check if product exists
    const product = await Product.findOne({ product_id: id });
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Không tìm thấy sản phẩm'
      });
    }
    
    // Check if product has variants
    const variants = await ProductVariant.find({ product_id: id });
    if (variants.length > 0) {
      // Check if any variant is in order items
      const variantIds = variants.map(v => v.variant_id);
      const orderItems = await OrderItem.find({ variant_id: { $in: variantIds } });
      
      if (orderItems.length > 0) {
        return res.status(400).json({
          success: false,
          error: `Không thể xóa sản phẩm. Sản phẩm có ${variants.length} biến thể và ${orderItems.length} biến thể đã có trong đơn hàng.`
        });
      }
      
      return res.status(400).json({
        success: false,
        error: `Không thể xóa sản phẩm. Sản phẩm có ${variants.length} biến thể. Vui lòng xóa các biến thể trước.`
      });
    }
    
    // Safe to delete
    await Product.findOneAndDelete({ product_id: id });
    
    res.json({
      success: true,
      message: 'Đã xóa sản phẩm thành công'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
