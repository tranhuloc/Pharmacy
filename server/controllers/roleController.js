
const Role = require('../models/roleModel');

// Xử lý logic liên quan đến quyền
exports.getRoles = async (req, res) => {
    const roles = await Role.find();
    return res.status(200).json({ success: false, data: roles });
  };
  