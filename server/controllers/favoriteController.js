const Favorite = require('../models/favoriteModel');

// Lấy tất cả sản phẩm yêu thích của một người dùng
exports.getAllFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.find({ user_id: req.params.user_id, is_deleted: false }).populate('product_id');
    res.status(200).json({ success: true, data: favorites });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi khi lấy sản phẩm yêu thích', error: error.message });
  }
};

// Thêm hoặc cập nhật sản phẩm vào danh sách yêu thích
exports.addOrUpdateFavorite = async (req, res) => {
  try {
    const { product_id, user_id } = req.body;

    // Kiểm tra nếu sản phẩm đã tồn tại trong danh sách yêu thích của người dùng
    let favorite = await Favorite.findOne({ product_id: product_id, user_id: user_id });

    // Nếu sản phẩm đã tồn tại, cập nhật lại thời gian tạo và đánh dấu là chưa xóa
    if (favorite) {
      if (favorite.is_deleted) {
        favorite.created_at = Date.now();
        favorite.is_deleted = false;
        await favorite.save();
        return res.status(200).json({ success: true, message: 'Sản phẩm đã được cập nhật trong danh sách yêu thích!' });
      } else {
        return res.status(409).json({ success: false, message: 'Đã tồn tại!' });
      }
    }

    // Nếu sản phẩm chưa tồn tại, tạo mới bản ghi
    const newFavorite = new Favorite({
      product_id: product_id,
      user_id: user_id,
      created_at: Date.now(),
      is_deleted: false
    });

    await newFavorite.save();
    res.status(200).json({ success: true, message: 'Sản phẩm đã được thêm vào danh sách yêu thích!' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi khi thêm hoặc cập nhật sản phẩm yêu thích', error: error.message });
  }
};

// Xóa sản phẩm khỏi danh sách yêu thích của người dùng
exports.deleteFavorite = async (req, res) => {
  try {
    const { user_id, product_id } = req.params;
    const favorite = await Favorite.findOneAndUpdate({ user_id: user_id, product_id: product_id }, { is_deleted: true });

    if (!favorite) {
      return res.status(404).json({ success: false, message: 'Sản phẩm yêu thích không tồn tại' });
    }

    res.status(200).json({ success: true, message: 'Sản phẩm đã được xóa khỏi danh sách yêu thích!' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi khi xóa sản phẩm yêu thích', error: error.message });
  }
};
