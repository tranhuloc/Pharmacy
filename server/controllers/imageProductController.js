const Image = require('../models/imageProductModel');
const Product = require('../models/productModel');

// Lấy tất cả hình ảnh của một sản phẩm theo ID sản phẩm
exports.getImagesByProductId = async (req, res) => {
  try {
    const product_id = req.params.product_id;
console.log(product_id);
    // Lấy tất cả hình ảnh của sản phẩm dựa trên ID sản phẩm
    const images = await Image.find({ product_id: product_id, is_deleted: false });
    console.log(images);
    res.status(200).json({ success: true, data: images });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Lỗi khi lấy danh sách hình ảnh sản phẩm', error: error.message });
  }
};

exports.deleteImages = async (req, res) => {
  try {
    const image_id = req.params.image_id;

    const image = await Image.findOneAndUpdate({ image_id: image_id }, { is_deleted: true, updated_at: Date.now() });

    if (!image) {
      return res.status(404).json({ success: false, message: 'Hình ảnh không tồn tại' });
    }

    const product_id = image.product_id;

    const imageUrlsToDelete = await Image.find({ product_id: product_id });

    // Cập nhật thông tin sản phẩm
    await Product.findByIdAndUpdate(product_id, {
      url_image: imageUrlsToDelete[0].image_url,
    });
    res.status(200).json({ success: true, message: 'Xóa hình ảnh thành công!', data: imageUrlsToDelete });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: 'Lỗi khi xóa hình ảnh sản phẩm', error: error.message });
  }
};