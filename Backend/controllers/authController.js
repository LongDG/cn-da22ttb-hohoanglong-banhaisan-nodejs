const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret';

exports.register = async (req, res) => {
  try {
    const { user_id, name, full_name, email, password, phone_number, role } = req.body;
    const fullName = name || full_name;
    if (!fullName || !email || !password) return res.status(400).json({ success: false, error: 'Họ tên, email và mật khẩu là bắt buộc' });

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ success: false, error: 'Email đã tồn tại' });

    // accept optional user_id (validated in userController logic) — reuse similar approach
    let finalUserId;
    if (user_id !== undefined && user_id !== null && user_id !== '') {
      const provided = parseInt(user_id);
      if (isNaN(provided)) return res.status(400).json({ success: false, error: 'user_id phải là số' });
      const existsId = await User.findOne({ user_id: provided });
      if (existsId) return res.status(400).json({ success: false, error: 'user_id đã tồn tại' });
      finalUserId = provided;
    } else {
      const lastUser = await User.findOne().sort({ user_id: -1 });
      finalUserId = lastUser ? lastUser.user_id + 1 : 1;
    }

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    // Always set new registrations to 'customer' role by default (ignore role from request).
    const user = await User.create({ 
      user_id: finalUserId, 
      full_name: fullName, 
      email, 
      password: hashed, 
      phone_number, 
      role: 'customer' 
    });

    const token = jwt.sign({ user_id: user.user_id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

    const userObj = user.toObject();
    delete userObj.password;

    res.status(201).json({ success: true, data: { user: userObj, token } });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ success: false, error: 'Email và mật khẩu là bắt buộc' });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ success: false, error: 'Email hoặc mật khẩu không đúng' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ success: false, error: 'Email hoặc mật khẩu không đúng' });

    const token = jwt.sign({ user_id: user.user_id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    const userObj = user.toObject();
    delete userObj.password;

    res.json({ success: true, data: { user: userObj, token } });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
