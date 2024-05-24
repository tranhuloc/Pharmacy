const Order = require('../models/orderModel');
const OrderItem = require('../models/orderItemModel');
const User = require('../models/userModel');
const Product = require('../models/productModel');

// Lấy tất cả đơn hàng
exports.getAllOrders = async (req, res) => {
  try {
    const status = req.params.status;
    const query = status !== 'Tất cả' ? { status } : {};

    const orders = await Order.find(query);
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Lỗi khi lấy danh sách đơn hàng', error: error.message });
  }
};

// Lấy thông tin đơn hàng theo ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.order_id);
    if (!order) {
      return res.status(404).json({ message: 'Đơn hàng không tồn tại' });
    }
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Lỗi khi lấy thông tin đơn hàng', error: error.message });
  }
};

// Tạo đơn hàng mới
exports.createOrder = async (req, res) => {

  try {
    const newOrder = new Order({
      user_id: req.body.user_id,
      receiver: req.body.receiver,
      phone: req.body.phone,
      address: req.body.address,
      order_date: req.body.order_date,
      total_price: req.body.total_price,
      status: req.body.status,
      note: req.body.note,
      is_deleted: false
    });
    const order = await newOrder.save();

    for (const order_item of req.body.order_items) {
      const item = new OrderItem({
        order_id: order._id,
        product_id: order_item.product_id,
        color: order_item.color,
        size: order_item.size,
        quantity: order_item.quantity,
        is_deleted: false
      });

      await item.save();

      await Product.findOneAndUpdate(
        { _id: order_item.product_id },
        {
          $inc: { stock_quantity: -order_item.quantity },
        },
        { new: true }
      );
    }
    res.status(200).json({ success: true, message: 'Tạo mới đơn hàng thành công' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Lỗi khi tạo đơn hàng', error: error.message });
  }
};

// Cập nhật đơn hàng theo ID
exports.editOrder = async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(req.params.order_id, req.body, { new: true });
    if (!updatedOrder) {
      return res.status(404).json({ message: 'Đơn hàng không tồn tại' });
    }
    res.status(200).json({ success: true, message: 'Cập nhật đơn hàng thành công', data: updatedOrder });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Lỗi khi cập nhật đơn hàng', error: error.message });
  }
};

// Xóa đơn hàng theo ID
exports.deleteOrder = async (req, res) => {
  try {
    const order_id = req.params.order_id;

    // Xóa đơn hàng
    const order = await Order.findOneAndUpdate({ _id: order_id }, { is_deleted: true });

    if (!order) {
      return res.status(404).json({ success: false, message: 'Đơn hàng không tồn tại' });
    }

    res.status(200).json({ success: true, message: 'Đơn hàng và các mục đơn hàng đã bị xóa' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Lỗi khi xóa đơn hàng', error: error.message });
  }
};

// Lấy tất cả đơn hàng của một người dùng theo ID người dùng
exports.getOrdersByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;
    // Kiểm tra xem người dùng có tồn tại hay không
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Người dùng không tồn tại' });
    }

    // Lấy tất cả đơn hàng của người dùng dựa trên ID người dùng
    const orders = await Order.find({ user_id: userId }).populate('user_id');
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Lỗi khi lấy danh sách đơn hàng của người dùng', error: error.message });
  }
};

exports.changeStatusOrder = async (req, res) => {
  try {
    const order_id = req.params.order_id;
    const newStatus = req.params.newStatus;

    // Tìm và cập nhật trạng thái của đơn hàng
    const updatedOrder = await Order.findOne(
      { _id: order_id }
    );

    if (!updatedOrder) {
      return res.status(404).json({ success: true, message: 'Đơn hàng không tồn tại' });
    }

    // Nếu trạng thái mới là "Hủy đơn", thực hiện tăng số lượng sản phẩm trong orderdetail
    if (newStatus === "Hủy đơn") {
      // Lấy danh sách orderdetail của đơn hàng
      const orderDetails = await OrderItem.find({ order_id: order_id });

      // Duyệt qua từng orderdetail và tăng số lượng sản phẩm
      for (const orderDetail of orderDetails) {
        await Product.findOneAndUpdate(
          { _id: orderDetail.product_id },
          {
            $inc: { stock_quantity: +orderDetail.quantity },
          },
          { new: true }
        );
      }
    }
    if (updatedOrder.status === "Hủy đơn" && newStatus !== "Hủy đơn") {
      // Lấy danh sách orderdetail của đơn hàng
      const orderDetails = await OrderItem.find({ order_id: order_id });

      // Duyệt qua từng orderdetail và giảm số lượng sản phẩm
      for (const orderDetail of orderDetails) {
        await Product.findOneAndUpdate(
          { _id: orderDetail.product_id },
          {
            $inc: { stock_quantity: -orderDetail.quantity },
          },
          { new: true }
        );
      }
    }
    // Tìm và cập nhật trạng thái của đơn hàng
    await Order.findOneAndUpdate(
      { _id: order_id },
      { status: newStatus },
      { new: true }
    );

    res.status(200).json({ message: `Đơn đặt hàng #${order_id} đã được cập nhật thành trạng thái "${newStatus}"` });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Lỗi khi thay đổi trạng thái đơn đặt hàng', error: error.message });
  }
};
