const Pharmacy = require('../models/pharmacyModel');

// Lấy tất cả nhà thuốc
exports.getAllPharmacies = async (req, res) => {
  try {
    const pharmacies = await Pharmacy.find({ is_deleted: false });
    res.status(200).json({ success: true, data: pharmacies });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi khi lấy danh sách nhà thuốc', error: error.message });
  }
};

// Thêm nhà thuốc mới
exports.addPharmacy = async (req, res) => {
  try {
    const { pharmacy_name, address, latitude, longitude } = req.body;
    const existingPharmacy = await Pharmacy.findOne({ pharmacy_name });

    if (existingPharmacy) {
      if (existingPharmacy.is_deleted) {
        existingPharmacy.is_deleted = false;
        existingPharmacy.address = address;
        existingPharmacy.latitude = latitude;
        existingPharmacy.longitude = longitude;
        existingPharmacy.updated_at = Date.now();
        await existingPharmacy.save();
        return res.status(200).json({ success: true, message: 'Nhà thuốc đã được khôi phục!', data: existingPharmacy });
      } else {
        return res.status(409).json({ success: false, message: 'Nhà thuốc đã tồn tại!' });
      }
    }

    const newPharmacy = new Pharmacy({
      pharmacy_name, 
      address, 
      latitude, 
      longitude,
      is_deleted: false,
      created_at: Date.now(),
      updated_at: Date.now()
    });

    await newPharmacy.save();
    res.status(200).json({ success: true, message: 'Nhà thuốc đã được thêm thành công!', data: newPharmacy });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi khi thêm nhà thuốc', error: error.message });
  }
};

// Lấy thông tin nhà thuốc bằng ID
exports.getPharmacyById = async (req, res) => {
  try {
    const pharmacy = await Pharmacy.findById(req.params.pharmacy_id);
    if (!pharmacy || pharmacy.is_deleted) {
      return res.status(404).json({ success: false, message: 'Nhà thuốc không tồn tại' });
    }

    res.status(200).json({ success: true, data: pharmacy });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi khi lấy thông tin nhà thuốc', error: error.message });
  }
};

// Cập nhật thông tin nhà thuốc
exports.editPharmacy = async (req, res) => {
  try {
    const { pharmacy_name, address, latitude, longitude } = req.body;

    const updatedPharmacy = await Pharmacy.findByIdAndUpdate(
      req.params.pharmacy_id,
      { pharmacy_name, address, latitude, longitude, updated_at: Date.now() },
      { new: true }
    );

    if (!updatedPharmacy || updatedPharmacy.is_deleted) {
      return res.status(404).json({ success: false, message: 'Nhà thuốc không tồn tại' });
    }

    res.status(200).json({ success: true, message: 'Cập nhật nhà thuốc thành công', data: updatedPharmacy });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi khi cập nhật thông tin nhà thuốc', error: error.message });
  }
};

// Xóa nhà thuốc bằng ID (cập nhật is_deleted thành true)
exports.deletePharmacy = async (req, res) => {
  try {
    const pharmacy = await Pharmacy.findByIdAndUpdate(
      req.params.pharmacy_id,
      { is_deleted: true, updated_at: Date.now() },
      { new: true }
    );

    if (!pharmacy) {
      return res.status(404).json({ success: false, message: 'Nhà thuốc không tồn tại' });
    }

    res.status(200).json({ success: true, message: 'Nhà thuốc đã bị xóa', data: pharmacy });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi khi xóa nhà thuốc', error: error.message });
  }
};
