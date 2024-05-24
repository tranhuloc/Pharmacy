const OrderItem = require('../models/orderItemModel');

// Lấy tất cả các mục đơn hàng của một đơn hàng theo ID đơn hàng
exports.getOrderItemsByOrderId = async (req, res) => {
  try {
    const order_id = req.params.order_id;

    // Lấy tất cả các mục đơn hàng của đơn hàng dựa trên ID đơn hàng
    const orderItems = await OrderItem.find({ order_id: order_id }).populate('product_id');
    res.status(200).json({ success: true, data: orderItems });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Lỗi khi lấy danh sách mục đơn hàng của đơn hàng', error: error.message });
  }
};