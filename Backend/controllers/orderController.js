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
        error: 'khong tìm thấy đơn hàng'
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
    const { order_id, user_id, shipping_address, shipping_fee, discount_amount, notes, items } = req.body;
    
    if (!user_id || !shipping_address || !items || items.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Cần có ID người dùng, địa chỉ giao hàng và các mặt hàng'
      });
    }
    
    // Calculate total amount
    let totalAmount = shipping_fee || 0;
    for (const item of items) {
      const variant = await ProductVariant.findOne({ variant_id: parseInt(item.variant_id) });
      if (!variant) {
        return res.status(400).json({
          success: false,
          error: `Không tìm thấy biến thể sản phẩm ${item.variant_id}`
        });
      }
      
      if (variant.stock_quantity < item.quantity) {
        return res.status(400).json({
          success: false,
          error: `Không đủ hàng cho biến thể ${item.variant_id}`
        });
      }
      
      const price = variant.sale_price || variant.price;
      totalAmount += price * item.quantity;
    }
    
    totalAmount -= discount_amount || 0;
    
    // Determine order_id (accept provided or auto-generate)
    let finalOrderId;
    if (order_id !== undefined && order_id !== null && order_id !== '') {
      const provided = parseInt(order_id);
      if (isNaN(provided)) return res.status(400).json({ success: false, error: 'order_id phải là số' });
      const existsOrder = await Order.findOne({ order_id: provided });
      if (existsOrder) return res.status(400).json({ success: false, error: 'order_id đã tồn tại' });
      finalOrderId = provided;
    } else {
      const lastOrder = await Order.findOne().sort({ order_id: -1 });
      finalOrderId = lastOrder ? lastOrder.order_id + 1 : 1001;
    }
    
    // Create order
    const order = await Order.create({ order_id: finalOrderId, user_id: parseInt(user_id), shipping_address, shipping_fee: shipping_fee || 0, discount_amount: discount_amount || 0, total_amount: totalAmount, notes: notes || null, status: 'đang chờ xử lý' });
    
    // Create order items and update stock
    const orderItems = [];
    let lastOrderItem = await OrderItem.findOne().sort({ order_item_id: -1 });
    let nextOrderItemId = lastOrderItem ? lastOrderItem.order_item_id + 1 : 1;

    for (const item of items) {
      const variant = await ProductVariant.findOne({ variant_id: parseInt(item.variant_id) });
      const price = variant.sale_price || variant.price;

      // allow provided order_item_id per item
      let finalOrderItemId;
      if (item.order_item_id !== undefined && item.order_item_id !== null && item.order_item_id !== '') {
        const providedItemId = parseInt(item.order_item_id);
        if (isNaN(providedItemId)) return res.status(400).json({ success: false, error: `order_item_id ${item.order_item_id} phải là số` });
        const existsItem = await OrderItem.findOne({ order_item_id: providedItemId });
        if (existsItem) return res.status(400).json({ success: false, error: `order_item_id ${providedItemId} đã tồn tại` });
        finalOrderItemId = providedItemId;
      } else {
        finalOrderItemId = nextOrderItemId++;
      }

      const orderItem = await OrderItem.create({ order_item_id: finalOrderItemId, order_id: order.order_id, variant_id: parseInt(item.variant_id), quantity: parseInt(item.quantity), price_at_purchase: price });

      // Update stock
      await ProductVariant.findOneAndUpdate({ variant_id: parseInt(item.variant_id) }, { $inc: { stock_quantity: -parseInt(item.quantity) } });

      orderItems.push(orderItem);
    }
    
    res.status(201).json({
      success: true,
      data: {
        ...order.toObject(),
        items: orderItems
      },
      message: 'Đơn hàng đã được tạo thành công'
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
        error: 'Không tìm thấy đơn hàng'
      });
    }
    
    res.json({
      success: true,
      data: order,
      message: 'Cập nhật đơn hàng thành công'
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
        error: 'Không tìm thấy đơn hàng'
      });
    }
    
    res.json({
      success: true,
      message: 'Đã xóa đơn hàng thành công'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
