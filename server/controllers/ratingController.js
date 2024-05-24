const Rating = require('../models/ratingModel');

exports.getAllRating = async (req, res) => {
  try {
    const { userId, productId } = req.params;

    let query = { is_deleted: false };

    if (userId !== "All") {
      query.user_id = userId;
    }

    if (productId !== "All") {
      query.product_id = productId;
    }

    const ratings = await Rating.find(query).populate('user_id');
    res.status(200).json({ success: true, data: ratings });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Lỗi khi lấy đánh giá', error: error.message });
  }
};
exports.getRatingByProductId = async (req, res) => {
  try {
    const ratings = await Rating.find({ product_id: req.params.product_id, is_deleted: false }).populate('user_id');
    res.status(200).json({ success: true, data: ratings });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Lỗi khi lấy đánh giá', error: error.message });
  }
};

exports.addRating = async (req, res) => {
  try {
    const { product_id, user_id, rating, comment, created_at } = req.body;
    let rating_data = await Rating.findOne({ product_id: product_id, user_id: user_id });

    if (rating_data) {
      rating_data.rating = rating;
      rating_data.comment = comment;
      rating_data.created_at = created_at;
      rating_data.is_deleted = false;
      await rating_data.save();
      return res.status(200).json({ success: true, message: 'Đánh giá sản phẩm đã được khôi phục' });
    }

    const newRating = new Rating({
      product_id,
      user_id,
      rating,
      comment,
      created_at,
      is_deleted: false
    });

    await newRating.save();

    res.status(200).json({ success: true, message: 'Đánh giá đã được thêm thành công!' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Lỗi khi thêm đánh giá', error: error.message });
  }
};
exports.deleteRating = async (req, res) => {
  try {
    const rating_id = req.params.rating_id;
    // Xóa rating
    const rating = await Rating.findOneAndUpdate({ _id: rating_id }, { is_deleted: true });

    if (!rating) {
      return res.status(404).json({ success: false, message: 'Đánh giá không tồn tại' });
    }

    res.status(200).json({ success: true, message: 'Đánh giá đã bị xóa' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Lỗi khi xóa đánh giá', error: error.message });
  }
};  