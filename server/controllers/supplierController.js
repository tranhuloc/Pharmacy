const Supplier = require('../models/supplierModel');

// Lấy tất cả các supplier
exports.getAllSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.find({ is_deleted: false });
    res.status(200).json({ success: true, data: suppliers });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi khi lấy danh sách nhà cung cấp', error: error.message });
  }
};

exports.addSupplier = async (req, res) => {
  try {
    const { supplier_name, contact_info } = req.body;
    const existingSupplier = await Supplier.findOne({ supplier_name: supplier_name, is_deleted: false });
    if (existingSupplier) {
      return res.status(409).json({ success: false, message: 'Nhà cung cấp đã tồn tại!' });
    }

    const deletedSupplier = await Supplier.findOne({ supplier_name: supplier_name, is_deleted: true });
    if (deletedSupplier) {
      if (deletedSupplier.is_deleted) {
        deletedSupplier.supplier_name = supplier_name;
        deletedSupplier.is_deleted = false;
        deletedSupplier.updated_at = Date.now();
        deletedSupplier.contact_info = contact_info || deletedSupplier.contact_info;
        await deletedSupplier.save();
        return res.status(200).json({ success: true, message: 'Nhà cung cấp đã được khôi phục!', data: deletedSupplier });
      } else {
        return res.status(409).json({ success: false, message: 'Nhà cung cấp đã tồn tại!' });
      }
    }

    const newSupplier = new Supplier({
      supplier_name,
      contact_info,
      is_deleted: false,
      created_at: Date.now(),
      updated_at: Date.now()
    });

    await newSupplier.save();
    return res.status(200).json({ success: true, message: 'Nhà cung cấp đã được thêm thành công!', data: newSupplier });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi khi thêm nhà cung cấp', error: error.message });
  }
};

exports.getSupplierById = async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.supplier_id);
    if (!supplier || supplier.is_deleted) {
      return res.status(404).json({ success: false, message: 'Nhà cung cấp không tồn tại' });
    }

    res.status(200).json({ success: true, data: supplier });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi khi lấy thông tin nhà cung cấp', error: error.message });
  }
};

exports.editSupplier = async (req, res) => {
  try {
    const { supplier_name, contact_info } = req.body;

    const updatedSupplier = await Supplier.findByIdAndUpdate(
      req.params.supplier_id,
      { supplier_name, contact_info, updated_at: Date.now() },
      { new: true }
    );

    if (!updatedSupplier || updatedSupplier.is_deleted) {
      return res.status(404).json({ success: false, message: 'Nhà cung cấp không tồn tại' });
    }

    res.status(200).json({ success: true, message: 'Cập nhật cung cấp thành công', data: updatedSupplier });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi khi cập nhật thông tin nhà cung cấp', error: error.message });
  }
};

// Xóa nhà cung cấp bằng ID (Cập nhật is_deleted thành true)
exports.deleteSupplier = async (req, res) => {
  try {
    const updatedSupplier = await Supplier.findByIdAndUpdate(
      req.params.supplier_id,
      { is_deleted: true, updated_at: Date.now() },
      { new: true }
    );

    if (!updatedSupplier) {
      return res.status(404).json({ success: false, message: 'Nhà cung cấp không tồn tại' });
    }

    res.status(200).json({ success: true, message: 'Nhà cung cấp đã bị xóa', data: updatedSupplier });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi khi xóa nhà cung cấp', error: error.message });
  }
};
