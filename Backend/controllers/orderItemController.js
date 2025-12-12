const OrderItem = require('../models/OrderItem');
const { nanoid } = require('nanoid');

exports.getAllOrderItems = async (req, res) => {
  try {
    const { orderId, variantId } = req.query;
    const query = {};
    if (orderId) query.order_id = orderId;
    if (variantId) query.variant_id = variantId;

    const items = await OrderItem.find(query);
    res.json({ success: true, data: items, count: items.length });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getOrderItemById = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await OrderItem.findOne({ order_item_id: id });
    if (!item) return res.status(404).json({ success: false, error: 'Không tìm thấy mục đơn hàng' });
    res.json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.createOrderItem = async (req, res) => {
  try {
    const { order_item_id, order_id, variant_id, quantity, price_at_purchase } = req.body;
    if (!order_id || !variant_id || !quantity || price_at_purchase === undefined) return res.status(400).json({ success: false, error: 'Cần có order_id, variant_id, quantity và price_at_purchase' });

    let finalOrderItemId;
    if (order_item_id !== undefined && order_item_id !== null && order_item_id !== '') {
      const exists = await OrderItem.findOne({ order_item_id: order_item_id });
      if (exists) return res.status(400).json({ success: false, error: 'order_item_id đã tồn tại' });
      finalOrderItemId = order_item_id;
    } else {
      // Generate unique ID using nanoid
      finalOrderItemId = nanoid(12);
    }

    const item = await OrderItem.create({ order_item_id: finalOrderItemId, order_id: order_id, variant_id: variant_id, quantity: parseInt(quantity), price_at_purchase: parseFloat(price_at_purchase) });
    res.status(201).json({ success: true, data: item, message: 'Đã tạo mục đơn hàng thành công' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.updateOrderItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity, price_at_purchase } = req.body;

    const update = {};
    if (quantity !== undefined) update.quantity = parseInt(quantity);
    if (price_at_purchase !== undefined) update.price_at_purchase = parseFloat(price_at_purchase);

    const item = await OrderItem.findOneAndUpdate({ order_item_id: parseInt(id) }, update, { new: true, runValidators: true });
    if (!item) return res.status(404).json({ success: false, error: 'Không tìm thấy mục đơn hàng' });
    res.json({ success: true, data: item, message: 'Đã cập nhật mục đơn hàng thành công' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.deleteOrderItem = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await OrderItem.findOneAndDelete({ order_item_id: parseInt(id) });
    if (!item) return res.status(404).json({ success: false, error: 'Không tìm thấy mục đơn hàng' });
    res.json({ success: true, message: 'Đã xóa mục đơn hàng thành công' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
