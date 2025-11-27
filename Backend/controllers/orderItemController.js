const OrderItem = require('../models/OrderItem');

exports.getAllOrderItems = async (req, res) => {
  try {
    const { orderId, variantId } = req.query;
    const query = {};
    if (orderId) query.order_id = parseInt(orderId);
    if (variantId) query.variant_id = parseInt(variantId);

    const items = await OrderItem.find(query).sort({ order_item_id: 1 });
    res.json({ success: true, data: items, count: items.length });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getOrderItemById = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await OrderItem.findOne({ order_item_id: parseInt(id) });
    if (!item) return res.status(404).json({ success: false, error: 'Order item not found' });
    res.json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.createOrderItem = async (req, res) => {
  try {
    const { order_id, variant_id, quantity, price_at_purchase } = req.body;
    if (!order_id || !variant_id || !quantity || price_at_purchase === undefined) {
      return res.status(400).json({ success: false, error: 'order_id, variant_id, quantity and price_at_purchase are required' });
    }

    const last = await OrderItem.findOne().sort({ order_item_id: -1 });
    const nextId = last ? last.order_item_id + 1 : 1;

    const item = await OrderItem.create({
      order_item_id: nextId,
      order_id: parseInt(order_id),
      variant_id: parseInt(variant_id),
      quantity: parseInt(quantity),
      price_at_purchase: parseFloat(price_at_purchase)
    });

    res.status(201).json({ success: true, data: item, message: 'Order item created successfully' });
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
    if (!item) return res.status(404).json({ success: false, error: 'Order item not found' });
    res.json({ success: true, data: item, message: 'Order item updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.deleteOrderItem = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await OrderItem.findOneAndDelete({ order_item_id: parseInt(id) });
    if (!item) return res.status(404).json({ success: false, error: 'Order item not found' });
    res.json({ success: true, message: 'Order item deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
