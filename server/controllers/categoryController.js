const Category = require('../models/categoryModel');

// Lấy tất cả danh mục sản phẩm
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find({ is_deleted: false });
    res.status(200).json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi khi lấy danh mục sản phẩm', error: error.message });
  }
};

// Thêm danh mục mới
exports.addCategory = async (req, res) => {
  try {
    const { category_name } = req.body;
    const existingCategory = await Category.findOne({ category_name: category_name });
    if (existingCategory) {
      if (existingCategory.is_deleted) {
        existingCategory.is_deleted = false;
        existingCategory.created_at = Date.now();
        await existingCategory.save();
        return res.status(200).json({ success: true, message: 'Danh mục đã được khôi phục!', data: existingCategory });
      } else {
        return res.status(409).json({ success: false, message: 'Danh mục đã tồn tại!' });
      }
    }

    const newCategory = new Category({
      category_name,
      is_deleted: false,
      created_at: Date.now(),
      updated_at: Date.now()
    });

    await newCategory.save();
    res.status(200).json({ success: true, message: 'Danh mục đã được thêm thành công!', data: newCategory });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi khi thêm danh mục', error: error.message });
  }
};

// Lấy danh mục theo ID
exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.category_id);
    if (!category || category.is_deleted) {
      return res.status(404).json({ success: false, message: 'Danh mục không tồn tại' });
    }

    res.status(200).json({ success: true, data: category });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi khi lấy thông tin danh mục', error: error.message });
  }
};

// Chỉnh sửa danh mục
exports.editCategory = async (req, res) => {
  try {
    const { category_name } = req.body;

    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.category_id,
      { category_name, updated_at: Date.now() },
      { new: true }
    );

    if (!updatedCategory || updatedCategory.is_deleted) {
      return res.status(404).json({ success: false, message: 'Danh mục không tồn tại' });
    }

    res.status(200).json({ success: true, message: 'Cập nhật danh mục thành công', data: updatedCategory });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi khi cập nhật thông tin danh mục', error: error.message });
  }
};

// Xóa danh mục (cập nhật is_deleted thành true)
exports.deleteCategory = async (req, res) => {
  try {
    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.category_id,
      { is_deleted: true, updated_at: Date.now() },
      { new: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({ success: false, message: 'Danh mục không tồn tại' });
    }

    res.status(200).json({ success: true, message: 'Danh mục đã bị xóa', data: updatedCategory });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi khi xóa danh mục', error: error.message });
  }
};
