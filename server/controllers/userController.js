const User = require('../models/userModel');
const Role = require('../models/roleModel');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');

// Thêm mới người dùng
exports.addUser = async (req, res) => {
  try {
    const { fullname, password, phone, email, address, role_id } = req.body;
    const existingUser = await User.findOne({ email });

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    let user_role = role_id;

    if (!role_id) {
      const defaultRole = await Role.findOne({ role_name: 'Người dùng' });

      if (defaultRole) {
        user_role = defaultRole._id;
      }
    }

    if (existingUser) {
      if (existingUser.is_deleted) {
        existingUser.fullname = fullname;
        existingUser.password = hashedPassword;
        existingUser.phone = phone;
        existingUser.email = email;
        existingUser.address = address;
        existingUser.role_id = user_role;
        existingUser.is_deleted = false;
        await existingUser.save();
        return res.status(200).json({ success: true, message: 'Người dùng đã được khôi phục!', data: existingUser });
      } else {
        return res.status(409).json({ success: false, message: 'Người dùng đã tồn tại!' });
      }
    }

    const newUser = new User({
      fullname,
      password: hashedPassword,
      phone,
      email,
      address,
      role_id: user_role,
      is_deleted: false
    });

    await newUser.save();

    return res.status(200).json({ success: true, message: 'Người dùng đã được thêm thành công!', data: newUser });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Lỗi khi thêm người dùng', error: error.message });
  }
};
// Lấy tất cả người dùng
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ is_deleted: false }).populate({
      path: 'role_id',
      match: { is_deleted: false },
      select: 'role_name'
    });
    const filteredUsers = users.filter(user => user.role_id);

    const formattedUsers = filteredUsers.map(user => ({
      ...user._doc,
      role_name: user.role_id.role_name
    }));
    return res.status(200).json({ success: true, data: formattedUsers });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Lỗi khi lấy danh sách người dùng', error: error.message });
  }
};

// Lấy thông tin người dùng bằng ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.user_id);
    if (!user || user.is_deleted) {
      return res.status(404).json({ success: false, message: 'Người dùng không tồn tại' });
    }

    const role = await Role.findById(user.role_id);

    return res.status(200).json({
      success: true, data: {
        _id: user._id,
        fullname: user.fullname,
        email: user.email,
        phone: user.phone,
        address: user.address,
        created_at: user.created_at,
        role_name: role ? role.role_name : '',
        role_id: role ? role._id : ''
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Lỗi khi lấy thông tin người dùng', error: error.message });
  }
};

// Cập nhật thông tin người dùng bằng ID
exports.editUser = async (req, res) => {
  try {
    const { fullname, password, phone, email, address, role_id, flgEmail, flgUserName } = req.body;
    if (flgEmail) {
      const existingUser = await User.findOne({ email, is_deleted: false });

      if (existingUser) {
        return res.status(401).json({ success: false, message: 'Email đã tồn tại!' });
      }
    }
    
    // Kiểm tra xem role_id đã tồn tại và mật khẩu có thay đổi hay không
    const updateFields = {
      fullname,
      phone,
      email,
      address,
    };

    // Nếu mật khẩu có thay đổi, thêm trường password vào danh sách cần cập nhật
    if (password) {

      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      updateFields.password = hashedPassword;
    }

    // Nếu role_id tồn tại, thêm trường role_id vào danh sách cần cập nhật
    if (role_id !== undefined) {
      updateFields.role_id = role_id;
    }

    // Thực hiện cập nhật thông tin người dùng
    const updatedUser = await User.findByIdAndUpdate(
      req.params.user_id,
      updateFields,
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: 'Người dùng không tồn tại' });
    }

    return res.status(200).json({ success: true, message: 'Cập nhật người dùng thành công', data: updatedUser });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Lỗi khi cập nhật thông tin người dùng', error: error.message });
  }
};

// Xóa người dùng bằng ID
exports.deleteUser = async (req, res) => {
  try {
    const user_id = req.params.user_id;
    const user = await User.findByIdAndUpdate(
      user_id,
      { is_deleted: true },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ success: false, message: 'Người dùng không tồn tại' });
    }
    return res.status(200).json({ success: true, message: 'Người dùng đã bị xóa' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Lỗi khi xóa người dùng', error: error.message });
  }
};

// Lấy thông tin người dùng bằng ID
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
  
    const user = await User.findOne({ email, is_deleted: false });

    if (!user) {
      return res.status(401).json({ success: false, message: 'Tên người dùng không tồn tại' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Mật khẩu không đúng' });
    }
    const role = await Role.findById(user.role_id);

    res.json({
      user: user,
      role_name: role ? role.role_name : '',
      message: 'Đăng nhập thành công'
    });
    return res.status(200).json({
      success: true, message: 'Đăng nhập thành công', data: {
        user: user,
        role_name: role ? role.role_name : '',
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Lỗi khi lấy thông tin người dùng', error: error.message });
  }
};

// verify the email exist
exports.checkEmail = async (req, res) => {
  const email = req.params.email;
  try {
    const user = await User.findOne({ email, is_deleted: false });
    if (user) {
      return res.status(200).json({ success: true, data: user.email });
    } else {
      res.status(404).send({ success: false, message: 'Tên người dùng không tồn tại' });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Lỗi trong quá trình kiểm tra tên người dùng', error: error.message });
  }
};

exports.updatePassword = async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    const user = await User.findOne({ email, is_deleted: false });
    if (!user) {
      return res.status(404).json({ success: false, message: 'Người dùng không tồn tại' });
    }
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ success: true, message: 'Cập nhật mật khẩu thành công' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Đã xảy ra lỗi khi cập nhật mật khẩu', error: error.message });
  }
};

exports.sendEmail = (req, res) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    secure: true,
    auth: {
      user: 'thangcao1906@gmail.com',
      pass: 'uhlydqasvvkklfth',
    },
  });
  const { recipient_email, OTP } = req.body;
  const mailOptions = {
    from: 'thangcao1906@gmail.com',
    to: recipient_email,
    subject: 'PASSWORD RESET',
    html: `<html>
             <body>
               <h2>Password Recovery</h2>
               <p>Use this OTP to reset your password. OTP is valid for 1 minute</p>
               <h3>${OTP}</h3>
             </body>
           </html>`,
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).json({ success: false, message: 'Lỗi trong quá trình gửi email', error: error.message });
    } else {
      res.status(200).send({ success: true, message: "Email được gửi thành công" });
    }
  });
};