const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');
const ProductVariant = require('../models/ProductVariant');

exports.getAllOrders = async (req, res) => {
  try {
    const { userId, status } = req.query;
    let query = {};
    
    if (userId) {
      query.user_id = parseInt(userId);
    }
    
    if (status) {
      query.status = status;
    }
    
    const orders = await Order.find(query).sort({ order_id: -1 });
    res.json({
      success: true,
      data: orders,
      count: orders.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findOne({ order_id: parseInt(id) });
    
    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }
    
    // Get order items
    const orderItems = await OrderItem.find({ order_id: parseInt(id) });
    
    res.json({
      success: true,
      data: {
        ...order.toObject(),
        items: orderItems
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

exports.createOrder = async (req, res) => {
  try {
    const { user_id, shipping_address, shipping_fee, discount_amount, notes, items } = req.body;
    
    if (!user_id || !shipping_address || !items || items.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'User ID, shipping address, and items are required'
      });
    }
    
    // Calculate total amount
    let totalAmount = shipping_fee || 0;
    for (const item of items) {
      const variant = await ProductVariant.findOne({ variant_id: parseInt(item.variant_id) });
      if (!variant) {
        return res.status(400).json({
          success: false,
          error: `Product variant ${item.variant_id} not found`
        });
      }
      
      if (variant.stock_quantity < item.quantity) {
        return res.status(400).json({
          success: false,
          error: `Insufficient stock for variant ${item.variant_id}`
        });
      }
      
      const price = variant.sale_price || variant.price;
      totalAmount += price * item.quantity;
    }
    
    totalAmount -= discount_amount || 0;
    
    // Get the next order_id
    const lastOrder = await Order.findOne().sort({ order_id: -1 });
    const nextOrderId = lastOrder ? lastOrder.order_id + 1 : 1001;
    
    // Create order
    const order = await Order.create({
      order_id: nextOrderId,
      user_id: parseInt(user_id),
      shipping_address,
      shipping_fee: shipping_fee || 0,
      discount_amount: discount_amount || 0,
      total_amount: totalAmount,
      notes: notes || null,
      status: 'pending'
    });
    
    // Create order items and update stock
    const orderItems = [];
    let lastOrderItem = await OrderItem.findOne().sort({ order_item_id: -1 });
    let nextOrderItemId = lastOrderItem ? lastOrderItem.order_item_id + 1 : 1;
    
    for (const item of items) {
      const variant = await ProductVariant.findOne({ variant_id: parseInt(item.variant_id) });
      const price = variant.sale_price || variant.price;
      
      const orderItem = await OrderItem.create({
        order_item_id: nextOrderItemId++,
        order_id: order.order_id,
        variant_id: parseInt(item.variant_id),
        quantity: parseInt(item.quantity),
        price_at_purchase: price
      });
      
      // Update stock
      await ProductVariant.findOneAndUpdate(
        { variant_id: parseInt(item.variant_id) },
        { $inc: { stock_quantity: -parseInt(item.quantity) } }
      );
      
      orderItems.push(orderItem);
    }
    
    res.status(201).json({
      success: true,
      data: {
        ...order.toObject(),
        items: orderItems
      },
      message: 'Order created successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

exports.updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, shipping_address, notes } = req.body;
    
    const order = await Order.findOneAndUpdate(
      { order_id: parseInt(id) },
      { status, shipping_address, notes },
      { new: true, runValidators: true }
    );
    
    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }
    
    res.json({
      success: true,
      data: order,
      message: 'Order updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Delete order items first
    await OrderItem.deleteMany({ order_id: parseInt(id) });
    
    const order = await Order.findOneAndDelete({ order_id: parseInt(id) });
    
    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Order deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
