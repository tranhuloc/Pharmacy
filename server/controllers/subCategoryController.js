const Category = require('../models/categoryModel');
const Subcategory = require('../models/subcategoryModel');

// Lấy tất cả danh mục con
exports.getSubCategories = async (req, res) => {
  try {
    const subcategories = await Subcategory.find({ is_deleted: false }).populate({
      path: 'category_id',
      match: { is_deleted: false },
      select: 'category_name'
    });
    const filteredSubcategories = subcategories.filter(subcategory => subcategory.category_id);

    const formattedSubcategories = filteredSubcategories.map(subcategory => ({
      ...subcategory._doc,
      category_name: subcategory.category_id.category_name
    }));
    res.status(200).json({ success: true, data: formattedSubcategories });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Lỗi khi lấy danh sách mục đơn hàng của đơn hàng', error: error.message });
  }
};

// Lấy tất cả danh mục con theo category_id
exports.getSubcategoriesByCategory = async (req, res) => {
  try {
    const category_id = req.params.category_id;

    if (category_id == 0) {
      const categories = await Category.find({ is_deleted: false }).sort({ _id: 1 }).limit(1);
      if (categories.length > 0) {
        const firstCategoryId = categories[0]._id;
        const subcategories = await Subcategory.find({ category_id: firstCategoryId, is_deleted: false });
        res.json(subcategories);
      } else {
        res.json([]);
      }
    } else {
      const subcategories = await Subcategory.find({ category_id: category_id, is_deleted: false });
      res.status(200).json({ success: true, data: subcategories });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Lỗi khi lấy danh sách danh mục con', error: error.message });
  }
};

exports.getAllCategoriesWithSubcategories = async (req, res) => {
  try {
    // Lấy tất cả các category
    const categories = await Category.find({ is_deleted: false });
    
    // Mảng chứa thông tin categories và subcategories
    const categoriesWithSubcategories = [];

    for (const category of categories) {
      // Lấy danh sách subcategories của category hiện tại
      const subcategories = await Subcategory.find({ category_id: category._id, is_deleted: false });

      // Tạo một đối tượng chứa thông tin category và subcategories của nó
      const categoryData = {
        category,
        subcategories
      };

      // Thêm đối tượng categoryData vào mảng categoriesWithSubcategories
      categoriesWithSubcategories.push(categoryData);
    }

    res.status(200).json({ success: true, data: categoriesWithSubcategories });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Lỗi khi lấy danh sách category và subcategory', error: error.message });
  }
};

exports.addSubCategory = async (req, res) => {
  try {
    const { subcategory_name, category_id } = req.body;
    const existingSubCategory = await Subcategory.findOne({ subcategory_name: subcategory_name, category_id: category_id });
    if (existingSubCategory) {
      if (existingSubCategory.is_deleted) {
        existingSubCategory.category_id = category_id;
        existingSubCategory.subcategory_name = subcategory_name;
        existingSubCategory.is_deleted = false;
        existingSubCategory.updated_at = Date.now();
        await existingSubCategory.save();
        return res.status(200).json({ success: true, message: 'Danh mục con đã được khôi phục!', data: existingSubCategory });
      } else {
        return res.status(404).json({ success: false, message: 'Danh mục con đã tồn tại' });
      }
    }

    const newSubCategory = new Subcategory({
      category_id,
      subcategory_name: subcategory_name,
      is_deleted: false,
      created_at: Date.now(),
      updated_at: Date.now()
    });

    await newSubCategory.save();
    return res.status(200).json({ success: true, message: 'Danh mục con đã được thêm thành công!', data: newSubCategory });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Lỗi khi thêm danh mục con', error: error.message });
  }
};

exports.getSubCategoryById = async (req, res) => {
  try {
    const subcategory = await Subcategory.findById(req.params.subcategory_id).populate({
      path: 'category_id',
      match: { is_deleted: false },
      select: 'category_name'
    });
    if (!subcategory || subcategory.is_deleted || !subcategory.category_id) {
      return res.status(404).json({ success: false, message: 'Danh mục con không tồn tại' });
    }
    const formattedSubcategories = {
      ...subcategory._doc,
      category_name: subcategory.category_id.category_name
    };
    res.status(200).json({ success: true, data: formattedSubcategories });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Lỗi khi lấy thông tin danh mục con', error: error.message });
  }
};

exports.editSubCategory = async (req, res) => {
  try {
    const { subcategory_name, category_id } = req.body;

    const updateFields = {
      category_id: category_id,
      subcategory_name: subcategory_name,
      updated_at: Date.now()
    };

    // Thực hiện cập nhật thông tin Danh mục
    const updatedSubCategory = await Subcategory.findByIdAndUpdate(
      req.params.subcategory_id,
      updateFields,
      { new: true }
    );

    if (!updatedSubCategory) {
      return res.status(404).json({ success: false, message: 'Danh mục con không tồn tại' });
    }

    res.status(200).json({ success: true, message: 'Cập nhật danh mục con thành công', data: updatedSubCategory });

  } catch (error) {
    return res.status(500).json({ success: false, message: 'Lỗi khi cập nhật thông tin danh mục con', error: error.message });
  }
};

// Xóa Danh mục bằng ID
exports.deleteSubCategory = async (req, res) => {
  try {
    const subcategory_id = req.params.subcategory_id;
    const subcategory = await Subcategory.findByIdAndUpdate(
      subcategory_id,
      { is_deleted: true, updated_at: Date.now() },
      { new: true }
    );

    if (!subcategory) {
      return res.status(404).json({ success: false, message: 'Danh mục con không tồn tại' });
    }

    res.status(200).json({ success: true, message: 'Danh mục con đã bị xóa' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Lỗi khi xóa danh mục con', error: error.message });
  }
};