const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');
const ProductVariant = require('../models/ProductVariant');
const Payment = require('../models/Payment');
const { calculateShippingFee } = require('../utils/shippingFee');
const { generateUniqueOrderCode } = require('../utils/orderCodeGenerator');
const { nanoid } = require('nanoid');
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
      query.user_id = userId;
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
    const order = await Order.findOne({ order_id: id });
    
    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'khong tìm thấy đơn hàng'
      });
    }
    
    // Get order items
    const orderItems = await OrderItem.find({ order_id: id });
    
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
    console.log('[CREATE ORDER] Request body:', JSON.stringify(req.body, null, 2));
    
    const { 
      order_id, 
      shipping_address, 
      shipping_fee, 
      discount_amount, 
      notes, 
      items,
      payment_method = 'cod',
      paymentMethod = 'cod',
      distance_km
    } = req.body;
    
    // Use authenticated user's ID
    const user_id = req.user.user_id;
    
    console.log('[CREATE ORDER] User ID:', user_id);
    console.log('[CREATE ORDER] Items count:', items?.length);
    
    // Validation
    if (!shipping_address || !items || items.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Cần có địa chỉ giao hàng và các mặt hàng'
      });
    }

    // Validate payment method
    const finalPaymentMethod = paymentMethod || payment_method;
    if (!['cod', 'banking'].includes(finalPaymentMethod)) {
      return res.status(400).json({
        success: false,
        error: 'Phương thức thanh toán không hợp lệ. Chỉ chấp nhận: cod, banking'
      });
    }

    // Generate unique order code (SF-XXXXXX)
    const orderCode = await generateUniqueOrderCode(Order);
    console.log('[CREATE ORDER] Generated orderCode:', orderCode);
    
    // Validate và calculate total amount (chưa bao gồm phí ship)
    let subtotalAmount = 0;
    const variantUpdates = [];
    
    console.log('[CREATE ORDER] Processing items...');
    for (const item of items) {
      console.log('[CREATE ORDER] Processing item:', item);
      
      const variant = await ProductVariant.findOne({ variant_id: item.variant_id });
      if (!variant) {
        console.error('[CREATE ORDER] Variant not found:', item.variant_id);
        return res.status(400).json({
          success: false,
          error: `Không tìm thấy biến thể sản phẩm ${item.variant_id}`
        });
      }
      
      console.log('[CREATE ORDER] Found variant:', variant.variant_id, 'stock:', variant.stock_quantity);
      
      if (variant.stock_quantity < item.quantity) {
        return res.status(400).json({
          success: false,
          error: `Không đủ hàng cho biến thể ${item.variant_id}. Tồn kho: ${variant.stock_quantity}, yêu cầu: ${item.quantity}`
        });
      }
      
      const price = variant.sale_price || variant.price;
      subtotalAmount += price * item.quantity;
      
      variantUpdates.push({
        variant_id: item.variant_id,
        quantity: parseInt(item.quantity),
        price
      });
    }
    
    console.log('[CREATE ORDER] Subtotal:', subtotalAmount);
    
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
    
    // Generate unique order_id using nanoid (không còn auto-increment)
    const finalOrderId = nanoid(16); // Tạo ID 16 ký tự ngẫu nhiên
    console.log('[CREATE ORDER] Generated order_id:', finalOrderId);
    
    // Create order
    const order = await Order.create({
      order_id: finalOrderId,
      orderCode,  // SF-XXXXXX format
      user_id: user_id,
      shipping_address,
      shipping_fee: finalShippingFee,
      discount_amount: discount_amount || 0,
      total_amount: totalAmount,
      notes: notes || null,
      status: 'pending',
      payment_status: finalPaymentMethod === 'cod' ? 'Chưa thanh toán' : 'Đã thanh toán',
      payment_method: finalPaymentMethod === 'cod' ? 'COD' : 'Bank Transfer',
      distance_km: distance_km || null
    });
    
    // Create order items and update stock
    const orderItems = [];

    for (const item of items) {
      const variantUpdate = variantUpdates.find(v => v.variant_id === item.variant_id);
      const price = variantUpdate.price;

      // Generate unique order_item_id using nanoid
      const order_item_id = nanoid(12); // 12 characters, URL-safe

      const orderItem = await OrderItem.create({
        order_item_id: order_item_id,
        order_id: order.order_id,
        variant_id: item.variant_id,
        quantity: parseInt(item.quantity),
        price_at_purchase: price
      });

      // Update stock
      await ProductVariant.findOneAndUpdate(
        { variant_id: item.variant_id },
        { $inc: { stock_quantity: -parseInt(item.quantity) } }
      );

      orderItems.push(orderItem);
    }
    
    // Tạo Payment record cho đơn COD
    if (finalPaymentMethod === 'cod') {
      const lastPayment = await Payment.findOne().sort({ payment_id: -1 });
      const nextPaymentId = lastPayment ? lastPayment.payment_id + 1 : 1;
      
      await Payment.create({
        payment_id: nextPaymentId,
        order_id: finalOrderId,
        amount: totalAmount,
        payment_method: 'COD',
        status: 'pending',
        payment_status: 'Chưa thanh toán'
      });
    }
    
    res.status(201).json({
      success: true,
      data: {
        ...order.toObject(),
        items: orderItems,
        orderCode: order.orderCode,  // Include orderCode in response
        orderStatus: order.orderStatus
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
    const { status, shipping_address, notes, payment_status } = req.body;
    
    // Validate status
    const validStatuses = ['pending', 'processing', 'shipping', 'completed', 'cancelled'];
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
      { order_id: id },
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
        { order_id: id },
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
 * Cập nhật trạng thái đơn hàng với logic flow và stock management
 * Status flow: Chờ duyệt → Đã duyệt → Đang vận chuyển → Đã giao → Hoàn thành
 * Nếu status = 'Hủy', restore lại stock_quantity
 */
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { orderStatus } = req.body;

    // Validate orderStatus
    const validStatuses = ['Chờ duyệt', 'Đã duyệt', 'Đang vận chuyển', 'Đã giao', 'Hoàn thành', 'Hủy'];
    if (!orderStatus || !validStatuses.includes(orderStatus)) {
      return res.status(400).json({
        success: false,
        error: `orderStatus không hợp lệ. Các trạng thái: ${validStatuses.join(', ')}`
      });
    }

    // Find order
    const order = await Order.findOne({ order_id: id });
    
    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Không tìm thấy đơn hàng'
      });
    }

    // Define status flow
    const statusFlow = {
      'Chờ duyệt': ['Đã duyệt', 'Hủy'],
      'Đã duyệt': ['Đang vận chuyển', 'Hủy'],
      'Đang vận chuyển': ['Đã giao', 'Hủy'],
      'Đã giao': ['Hoàn thành'],
      'Hoàn thành': [],
      'Hủy': []
    };

    // Check if status transition is valid
    const currentStatus = order.orderStatus || 'Chờ duyệt';
    const allowedNextStatuses = statusFlow[currentStatus] || [];
    
    if (!allowedNextStatuses.includes(orderStatus) && currentStatus !== orderStatus) {
      return res.status(400).json({
        success: false,
        error: `Không thể chuyển từ "${currentStatus}" sang "${orderStatus}". Trạng thái tiếp theo hợp lệ: ${allowedNextStatuses.join(', ') || 'Không có'}`
      });
    }

    // If status is 'Hủy', restore stock quantity
    if (orderStatus === 'Hủy' && currentStatus !== 'Hủy') {
      // Get all order items
      const orderItems = await OrderItem.find({ order_id: id });
      
      // Restore stock for each item
      for (const item of orderItems) {
        await ProductVariant.findOneAndUpdate(
          { variant_id: item.variant_id },
          { $inc: { stock_quantity: parseInt(item.quantity) } }
        );
        
        console.log(`[STOCK RESTORED] Variant ${item.variant_id}: +${item.quantity}`);
      }
    }

    // Update order status
    const updateData = { orderStatus };

    // If status is 'Hoàn thành' and payment method is COD, update payment status
    if (orderStatus === 'Hoàn thành' && order.payment_method === 'COD') {
      updateData.payment_status = 'Đã thanh toán';
      
      // Also update Payment record
      await Payment.findOneAndUpdate(
        { order_id: id },
        {
          payment_status: 'Đã thanh toán',
          status: 'successful'
        }
      );
      
      console.log(`[COD PAYMENT COMPLETED] Order #${id} - Payment received on delivery`);
    }

    const updatedOrder = await Order.findOneAndUpdate(
      { order_id: id },
      updateData,
      { new: true, runValidators: true }
    );

    console.log(`[ORDER STATUS UPDATE] Order #${id}: ${currentStatus} → ${orderStatus}`);

    res.json({
      success: true,
      data: updatedOrder,
      message: `Cập nhật trạng thái đơn hàng thành công: ${orderStatus}`
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
    
    const order = await Order.findOne({ order_id: id });
    
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
      { order_id: id },
      {
        payment_status: 'Đã thanh toán',
        status: 'Hoàn tất'
      },
      { new: true, runValidators: true }
    );
    
    // Cập nhật Payment
    await Payment.findOneAndUpdate(
      { order_id: id },
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
    await OrderItem.deleteMany({ order_id: id });
    
    const order = await Order.findOneAndDelete({ order_id: id });
    
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
