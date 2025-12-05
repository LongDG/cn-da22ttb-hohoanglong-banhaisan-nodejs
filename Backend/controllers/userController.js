const User = require('../models/User');
const bcrypt = require('bcryptjs');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ user_id: 1 });
    res.json({
      success: true,
      data: users,
      count: users.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findOne({ user_id: id });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'không tìm thấy người dùng'
      });
    }
    
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { user_id, full_name, email, password, phone_number, role } = req.body;

    if (!full_name || !email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Họ tên, email và mật khẩu là bắt buộc'
      });
    }

    // kiểm tra email đã tồn tại chưa
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'Email đã tồn tại'
      });
    }

    let finalUserId;
    if (user_id !== undefined && user_id !== null && user_id !== '') {
      const exists = await User.findOne({ user_id: user_id });
      if (exists) return res.status(400).json({ success: false, error: 'user_id đã tồn tại' });
      finalUserId = user_id;
    } else {
      // Auto-generate user_id
      const lastUser = await User.findOne().sort({ user_id: -1 });
      if (lastUser && lastUser.user_id) {
        const lastId = lastUser.user_id;
        if (typeof lastId === 'string' && lastId.startsWith('U')) {
          const num = parseInt(lastId.substring(1));
          finalUserId = 'U' + (num + 1);
        } else {
          finalUserId = 'U001';
        }
      } else {
        finalUserId = 'U001';
      }
    }

    // Hash password trước khi lưu
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      user_id: finalUserId,
      full_name,
      email,
      password: hashedPassword,
      phone_number,
      role: role || 'customer'
    });

    res.status(201).json({ success: true, data: user, message: 'Tạo người dùng thành công' });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { full_name, email, password, phone_number, role } = req.body;
    
    const updateData = { full_name, email, phone_number, role };
    
    // Chỉ hash password nếu có cung cấp password mới
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }
    
    const user = await User.findOneAndUpdate(
      { user_id: id },
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'không tìm thấy người dùng'
      });
    }
    
    // Xóa password khỏi response
    const userObj = user.toObject();
    delete userObj.password;
    
    res.json({
      success: true,
      data: userObj,
      message: 'Cập nhật người dùng thành công'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findOneAndDelete({ user_id: id });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'không tìm thấy người dùng'
      });
    }
    
    res.json({
      success: true,
      message: 'Xóa người dùng thành công'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
