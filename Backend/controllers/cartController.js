const Cart = require('../models/Cart');
const CartItem = require('../models/CartItem');
const ProductVariant = require('../models/ProductVariant');
const Product = require('../models/Product');

// Get or create cart for user
exports.getOrCreateCart = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    
    let cart = await Cart.findOne({ user_id });
    
    if (!cart) {
      // Create new cart
      const lastCart = await Cart.findOne().sort({ cart_id: -1 });
      const cart_id = lastCart ? lastCart.cart_id + 1 : 1;
      
      cart = await Cart.create({
        cart_id,
        user_id
      });
    }
    
    // Get cart items with product details
    const cartItems = await CartItem.find({ cart_id: cart.cart_id });
    const itemsWithDetails = await Promise.all(
      cartItems.map(async (item) => {
        const variant = await ProductVariant.findOne({ variant_id: item.variant_id });
        if (!variant) return null;
        
        const product = await Product.findOne({ product_id: variant.product_id });
        
        return {
          cart_item_id: item.cart_item_id,
          variant_id: item.variant_id,
          quantity: item.quantity,
          variant: {
            variant_id: variant.variant_id,
            name: variant.name,
            price: variant.price,
            sale_price: variant.sale_price,
            stock_quantity: variant.stock_quantity,
          },
          product: product ? {
            product_id: product.product_id,
            name: product.name,
            image_url: product.image_url,
          } : null
        };
      })
    );
    
    const validItems = itemsWithDetails.filter(item => item !== null);
    
    res.json({
      success: true,
      data: {
        cart_id: cart.cart_id,
        user_id: cart.user_id,
        items: validItems,
        created_at: cart.created_at,
        updated_at: cart.updated_at
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Add item to cart
exports.addItemToCart = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const { variant_id, quantity } = req.body;
    
    if (!variant_id || !quantity || quantity < 1) {
      return res.status(400).json({
        success: false,
        error: 'variant_id và quantity (>= 1) là bắt buộc'
      });
    }
    
    // Get or create cart
    let cart = await Cart.findOne({ user_id });
    if (!cart) {
      const lastCart = await Cart.findOne().sort({ cart_id: -1 });
      const cart_id = lastCart ? lastCart.cart_id + 1 : 1;
      cart = await Cart.create({ cart_id, user_id });
    }
    
    // Check if variant exists
    const variant = await ProductVariant.findOne({ variant_id: variant_id });
    if (!variant) {
      return res.status(404).json({
        success: false,
        error: 'Không tìm thấy biến thể sản phẩm'
      });
    }
    
    // Check if item already exists in cart
    const existingItem = await CartItem.findOne({
      cart_id: cart.cart_id,
      variant_id: variant_id
    });
    
    if (existingItem) {
      // Update quantity
      const newQuantity = existingItem.quantity + parseInt(quantity);
      if (newQuantity > variant.stock_quantity) {
        return res.status(400).json({
          success: false,
          error: `Không đủ hàng. Tồn kho: ${variant.stock_quantity}`
        });
      }
      
      existingItem.quantity = newQuantity;
      await existingItem.save();
      
      await Cart.findOneAndUpdate(
        { cart_id: cart.cart_id },
        { updated_at: new Date() }
      );
      
      return res.json({
        success: true,
        data: existingItem,
        message: 'Đã cập nhật số lượng trong giỏ hàng'
      });
    } else {
      // Create new cart item
      const lastItem = await CartItem.findOne().sort({ cart_item_id: -1 });
      const cart_item_id = lastItem ? lastItem.cart_item_id + 1 : 1;
      
      if (parseInt(quantity) > variant.stock_quantity) {
        return res.status(400).json({
          success: false,
          error: `Không đủ hàng. Tồn kho: ${variant.stock_quantity}`
        });
      }
      
      const cartItem = await CartItem.create({
        cart_item_id,
        cart_id: cart.cart_id,
        variant_id: variant_id,
        quantity: parseInt(quantity)
      });
      
      await Cart.findOneAndUpdate(
        { cart_id: cart.cart_id },
        { updated_at: new Date() }
      );
      
      return res.status(201).json({
        success: true,
        data: cartItem,
        message: 'Đã thêm vào giỏ hàng'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Update cart item quantity
exports.updateCartItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;
    const user_id = req.user.user_id;
    
    if (!quantity || quantity < 1) {
      return res.status(400).json({
        success: false,
        error: 'quantity phải >= 1'
      });
    }
    
    const cartItem = await CartItem.findOne({ cart_item_id: id });
    if (!cartItem) {
      return res.status(404).json({
        success: false,
        error: 'Không tìm thấy sản phẩm trong giỏ hàng'
      });
    }
    
    // Verify cart belongs to user
    const cart = await Cart.findOne({ cart_id: cartItem.cart_id });
    if (!cart || cart.user_id !== user_id) {
      return res.status(403).json({
        success: false,
        error: 'Không có quyền truy cập'
      });
    }
    
    // Check stock
    const variant = await ProductVariant.findOne({ variant_id: cartItem.variant_id });
    if (!variant) {
      return res.status(404).json({
        success: false,
        error: 'Không tìm thấy biến thể sản phẩm'
      });
    }
    
    if (parseInt(quantity) > variant.stock_quantity) {
      return res.status(400).json({
        success: false,
        error: `Không đủ hàng. Tồn kho: ${variant.stock_quantity}`
      });
    }
    
    cartItem.quantity = parseInt(quantity);
    await cartItem.save();
    
    await Cart.findOneAndUpdate(
      { cart_id: cart.cart_id },
      { updated_at: new Date() }
    );
    
    res.json({
      success: true,
      data: cartItem,
      message: 'Đã cập nhật số lượng'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Remove item from cart
exports.removeCartItem = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.user_id;
    
    const cartItem = await CartItem.findOne({ cart_item_id: id });
    if (!cartItem) {
      return res.status(404).json({
        success: false,
        error: 'Không tìm thấy sản phẩm trong giỏ hàng'
      });
    }
    
    // Verify cart belongs to user
    const cart = await Cart.findOne({ cart_id: cartItem.cart_id });
    if (!cart || cart.user_id !== user_id) {
      return res.status(403).json({
        success: false,
        error: 'Không có quyền truy cập'
      });
    }
    
    await CartItem.findOneAndDelete({ cart_item_id: id });
    
    await Cart.findOneAndUpdate(
      { cart_id: cart.cart_id },
      { updated_at: new Date() }
    );
    
    res.json({
      success: true,
      message: 'Đã xóa sản phẩm khỏi giỏ hàng'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Clear cart
exports.clearCart = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    
    const cart = await Cart.findOne({ user_id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        error: 'Không tìm thấy giỏ hàng'
      });
    }
    
    await CartItem.deleteMany({ cart_id: cart.cart_id });
    
    await Cart.findOneAndUpdate(
      { cart_id: cart.cart_id },
      { updated_at: new Date() }
    );
    
    res.json({
      success: true,
      message: 'Đã xóa tất cả sản phẩm khỏi giỏ hàng'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Admin: Get all carts
exports.getAllCarts = async (req, res) => {
  try {
    const carts = await Cart.find().sort({ cart_id: -1 });
    
    const cartsWithDetails = await Promise.all(
      carts.map(async (cart) => {
        const items = await CartItem.find({ cart_id: cart.cart_id });
        return {
          ...cart.toObject(),
          item_count: items.length
        };
      })
    );
    
    res.json({
      success: true,
      data: cartsWithDetails,
      count: cartsWithDetails.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Admin: Get cart by user ID
exports.getCartByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const cart = await Cart.findOne({ user_id: userId });
    
    if (!cart) {
      return res.status(404).json({
        success: false,
        error: 'Không tìm thấy giỏ hàng'
      });
    }
    
    const cartItems = await CartItem.find({ cart_id: cart.cart_id });
    const itemsWithDetails = await Promise.all(
      cartItems.map(async (item) => {
        const variant = await ProductVariant.findOne({ variant_id: item.variant_id });
        if (!variant) return null;
        
        const product = await Product.findOne({ product_id: variant.product_id });
        
        return {
          cart_item_id: item.cart_item_id,
          variant_id: item.variant_id,
          quantity: item.quantity,
          variant: {
            variant_id: variant.variant_id,
            name: variant.name,
            price: variant.price,
            sale_price: variant.sale_price,
            stock_quantity: variant.stock_quantity,
          },
          product: product ? {
            product_id: product.product_id,
            name: product.name,
            image_url: product.image_url,
          } : null
        };
      })
    );
    
    const validItems = itemsWithDetails.filter(item => item !== null);
    
    res.json({
      success: true,
      data: {
        ...cart.toObject(),
        items: validItems
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

