const Payment = require('../models/Payment');
const Order = require('../models/Order');

exports.getAllPayments = async (req, res) => {
  try {
    const { orderId } = req.query;
    let query = {};
    
    if (orderId) {
      query.order_id = parseInt(orderId);
    }
    
    const payments = await Payment.find(query).sort({ payment_id: 1 });
    res.json({
      success: true,
      data: payments,
      count: payments.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

exports.getPaymentById = async (req, res) => {
  try {
    const { id } = req.params;
    const payment = await Payment.findOne({ payment_id: parseInt(id) });
    
    if (!payment) {
      return res.status(404).json({
        success: false,
        error: 'Payment not found'
      });
    }
    
    res.json({
      success: true,
      data: payment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

exports.createPayment = async (req, res) => {
  try {
    const { order_id, amount, payment_method, transaction_id } = req.body;
    
    if (!order_id || !amount || !payment_method) {
      return res.status(400).json({
        success: false,
        error: 'Order ID, amount, and payment method are required'
      });
    }
    
    // Check if order exists
    const order = await Order.findOne({ order_id: parseInt(order_id) });
    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }
    
    // Get the next payment_id
    const lastPayment = await Payment.findOne().sort({ payment_id: -1 });
    const nextPaymentId = lastPayment ? lastPayment.payment_id + 1 : 501;
    
    const payment = await Payment.create({
      payment_id: nextPaymentId,
      order_id: parseInt(order_id),
      amount: parseFloat(amount),
      payment_method,
      transaction_id: transaction_id || null,
      status: 'pending'
    });
    
    res.status(201).json({
      success: true,
      data: payment,
      message: 'Payment created successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

exports.updatePayment = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, transaction_id } = req.body;
    
    const payment = await Payment.findOneAndUpdate(
      { payment_id: parseInt(id) },
      { status, transaction_id },
      { new: true, runValidators: true }
    );
    
    if (!payment) {
      return res.status(404).json({
        success: false,
        error: 'Payment not found'
      });
    }
    
    // If payment is successful, update order status
    if (status === 'successful') {
      const order = await Order.findOne({ order_id: payment.order_id });
      if (order && order.status === 'pending') {
        await Order.findOneAndUpdate(
          { order_id: payment.order_id },
          { status: 'processing' }
        );
      }
    }
    
    res.json({
      success: true,
      data: payment,
      message: 'Payment updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

exports.deletePayment = async (req, res) => {
  try {
    const { id } = req.params;
    const payment = await Payment.findOneAndDelete({ payment_id: parseInt(id) });
    
    if (!payment) {
      return res.status(404).json({
        success: false,
        error: 'Payment not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Payment deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
