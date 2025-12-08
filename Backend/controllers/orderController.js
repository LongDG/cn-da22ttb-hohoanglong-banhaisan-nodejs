const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');
const ProductVariant = require('../models/ProductVariant');
const Payment = require('../models/Payment');
const { calculateShippingFee } = require('../utils/shippingFee');
const mongoose = require('mongoose');

exports.getAllOrders = async (req, res) => {
  try {
    const { userId, status } = req.query;
    let query = {};
    
    // Customer can only see their own orders, admin can see all
    if (req.user.role === 'customer') {
      query.user_id = req.user.user_id;
    } else if (userId) {
      // Admin can filter by userId if provided
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
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const { 
      order_id, 
      shipping_address, 
      shipping_fee, 
      discount_amount, 
      notes, 
      items,
      payment_method = 'COD',
      distance_km
    } = req.body;
    
    // Use authenticated user's ID
    const user_id = req.user.user_id;
    
    if (!shipping_address || !items || items.length === 0) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        success: false,
        error: 'Cần có địa chỉ giao hàng và các mặt hàng'
      });
    }
    
    // Validate và calculate total amount (chưa bao gồm phí ship)
    let subtotalAmount = 0;
    const variantUpdates = [];
    
    for (const item of items) {
      const variant = await ProductVariant.findOne({ variant_id: parseInt(item.variant_id) }).session(session);
      if (!variant) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({
          success: false,
          error: `Không tìm thấy biến thể sản phẩm ${item.variant_id}`
        });
      }
      
      if (variant.stock_quantity < item.quantity) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({
          success: false,
          error: `Không đủ hàng cho biến thể ${item.variant_id}. Tồn kho: ${variant.stock_quantity}, yêu cầu: ${item.quantity}`
        });
      }
      
      const price = variant.sale_price || variant.price;
      subtotalAmount += price * item.quantity;
      
      variantUpdates.push({
        variant_id: parseInt(item.variant_id),
        quantity: parseInt(item.quantity),
        price
      });
    }
    
    // Áp dụng giảm giá
    subtotalAmount -= discount_amount || 0;
    
    // Tính phí ship tự động nếu không được cung cấp
    let finalShippingFee = shipping_fee;
    if (finalShippingFee === undefined || finalShippingFee === null) {
      finalShippingFee = calculateShippingFee(
        distance_km || 0,
        subtotalAmount,
        shipping_address
      );
    }
    
    // Tổng tiền cuối cùng = subtotal + phí ship
    const totalAmount = subtotalAmount + finalShippingFee;
    
    // Determine order_id (accept provided or auto-generate)
    let finalOrderId;
    if (order_id !== undefined && order_id !== null && order_id !== '') {
      const provided = parseInt(order_id);
      if (isNaN(provided)) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({ success: false, error: 'order_id phải là số' });
      }
      const existsOrder = await Order.findOne({ order_id: provided }).session(session);
      if (existsOrder) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({ success: false, error: 'order_id đã tồn tại' });
      }
      finalOrderId = provided;
    } else {
      const lastOrder = await Order.findOne().sort({ order_id: -1 }).session(session);
      finalOrderId = lastOrder ? lastOrder.order_id + 1 : 1001;
    }
    
    // Xác định trạng thái ban đầu cho đơn COD
    const initialStatus = payment_method === 'COD' ? 'Chờ xác nhận' : 'pending';
    const initialPaymentStatus = payment_method === 'COD' ? 'Chưa thanh toán' : 'pending';
    
    // Create order với status và payment_status phù hợp
    const order = await Order.create([{
      order_id: finalOrderId,
      user_id: parseInt(user_id),
      shipping_address,
      shipping_fee: finalShippingFee,
      discount_amount: discount_amount || 0,
      total_amount: totalAmount,
      notes: notes || null,
      status: initialStatus,
      payment_status: initialPaymentStatus,
      payment_method: payment_method || 'COD',
      distance_km: distance_km || null
    }], { session });
    
    // Create order items and update stock
    const orderItems = [];
    let lastOrderItem = await OrderItem.findOne().sort({ order_item_id: -1 }).session(session);
    let nextOrderItemId = lastOrderItem ? lastOrderItem.order_item_id + 1 : 1;

    for (const item of items) {
      const variantUpdate = variantUpdates.find(v => v.variant_id === parseInt(item.variant_id));
      const price = variantUpdate.price;

      // allow provided order_item_id per item
      let finalOrderItemId;
      if (item.order_item_id !== undefined && item.order_item_id !== null && item.order_item_id !== '') {
        const providedItemId = parseInt(item.order_item_id);
        if (isNaN(providedItemId)) {
          await session.abortTransaction();
          session.endSession();
          return res.status(400).json({ success: false, error: `order_item_id ${item.order_item_id} phải là số` });
        }
        const existsItem = await OrderItem.findOne({ order_item_id: providedItemId }).session(session);
        if (existsItem) {
          await session.abortTransaction();
          session.endSession();
          return res.status(400).json({ success: false, error: `order_item_id ${providedItemId} đã tồn tại` });
        }
        finalOrderItemId = providedItemId;
      } else {
        finalOrderItemId = nextOrderItemId++;
      }

      const orderItem = await OrderItem.create([{
        order_item_id: finalOrderItemId,
        order_id: order[0].order_id,
        variant_id: parseInt(item.variant_id),
        quantity: parseInt(item.quantity),
        price_at_purchase: price
      }], { session });

      // Update stock
      await ProductVariant.findOneAndUpdate(
        { variant_id: parseInt(item.variant_id) },
        { $inc: { stock_quantity: -parseInt(item.quantity) } },
        { session }
      );

      orderItems.push(orderItem[0]);
    }
    
    // Tạo Payment record cho đơn COD
    if (payment_method === 'COD') {
      const lastPayment = await Payment.findOne().sort({ payment_id: -1 }).session(session);
      const nextPaymentId = lastPayment ? lastPayment.payment_id + 1 : 1;
      
      await Payment.create([{
        payment_id: nextPaymentId,
        order_id: finalOrderId,
        amount: totalAmount,
        payment_method: 'COD',
        status: 'pending',
        payment_status: 'Chưa thanh toán'
      }], { session });
    }
    
    // Commit transaction
    await session.commitTransaction();
    session.endSession();
    
    res.status(201).json({
      success: true,
      data: {
        ...order[0].toObject(),
        items: orderItems
      },
      message: 'Đơn hàng đã được tạo thành công'
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

exports.updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, shipping_address, notes, payment_status } = req.body;
    
    // Validate status
    const validStatuses = ['pending', 'processing', 'shipped', 'completed', 'cancelled', 'Chờ xác nhận', 'Chờ giao', 'Hoàn tất'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: `Trạng thái không hợp lệ. Các trạng thái hợp lệ: ${validStatuses.join(', ')}`
      });
    }
    
    const updateData = {};
    if (status !== undefined) updateData.status = status;
    if (shipping_address !== undefined) updateData.shipping_address = shipping_address;
    if (notes !== undefined) updateData.notes = notes;
    if (payment_status !== undefined) updateData.payment_status = payment_status;
    
    const order = await Order.findOneAndUpdate(
      { order_id: parseInt(id) },
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Không tìm thấy đơn hàng'
      });
    }
    
    // Nếu cập nhật payment_status, cũng cập nhật Payment record
    if (payment_status) {
      await Payment.findOneAndUpdate(
        { order_id: parseInt(id) },
        { 
          payment_status: payment_status,
          status: payment_status === 'Đã thanh toán' ? 'successful' : 'pending'
        },
        { new: true }
      );
    }
    
    // Ghi log thay đổi trạng thái
    console.log(`[ORDER STATUS UPDATE] Order #${order.order_id}: ${status || 'no change'}, Payment: ${payment_status || 'no change'}`);
    
    res.json({
      success: true,
      data: order,
      message: `Cập nhật đơn hàng thành công. Trạng thái: ${order.status}`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * Cập nhật trạng thái thanh toán COD khi giao hàng xong
 * Khi nhân viên giao hàng thu tiền xong, gọi API này để:
 * - payment_status = "Đã thanh toán"
 * - order_status = "Hoàn tất"
 */
exports.completeCODOrder = async (req, res) => {
  try {
    const { id } = req.params;
    
    const order = await Order.findOne({ order_id: parseInt(id) });
    
    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Không tìm thấy đơn hàng'
      });
    }
    
    // Chỉ áp dụng cho đơn COD
    if (order.payment_method !== 'COD') {
      return res.status(400).json({
        success: false,
        error: 'Chỉ có thể hoàn tất đơn hàng COD bằng API này'
      });
    }
    
    // Cập nhật Order
    const updatedOrder = await Order.findOneAndUpdate(
      { order_id: parseInt(id) },
      {
        payment_status: 'Đã thanh toán',
        status: 'Hoàn tất'
      },
      { new: true, runValidators: true }
    );
    
    // Cập nhật Payment
    await Payment.findOneAndUpdate(
      { order_id: parseInt(id) },
      {
        payment_status: 'Đã thanh toán',
        status: 'successful'
      },
      { new: true }
    );
    
    console.log(`[COD ORDER COMPLETED] Order #${order.order_id} - Payment received`);
    
    res.json({
      success: true,
      data: updatedOrder,
      message: 'Đơn hàng COD đã được hoàn tất. Thanh toán đã được xác nhận.'
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
