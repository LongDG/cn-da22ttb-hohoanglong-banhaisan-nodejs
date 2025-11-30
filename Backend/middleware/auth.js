const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Bắt buộc phải có JWT_SECRET, không fallback mặc định (an toàn hơn)
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  // Throw sớm để không chạy server ở chế độ thiếu bảo mật
  throw new Error('JWT_SECRET chưa được thiết lập. Thêm vào file .env (ví dụ JWT_SECRET=your_strong_secret).');
}

// Middleware để xác thực JWT token
exports.authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1] || req.headers['x-access-token'];

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Không có token xác thực. Vui lòng đăng nhập.'
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    // Tìm user để đảm bảo user vẫn tồn tại
    const user = await User.findOne({ user_id: decoded.user_id });
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Người dùng không tồn tại'
      });
    }

    req.user = {
      user_id: user.user_id,
      email: user.email,
      role: user.role
    };

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: 'Token đã hết hạn. Vui lòng đăng nhập lại.'
      });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        error: 'Token không hợp lệ'
      });
    }
    return res.status(500).json({
      success: false,
      error: 'Lỗi xác thực: ' + error.message
    });
  }
};

// Middleware để kiểm tra role (admin only)
exports.requireAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return res.status(403).json({
    success: false,
    error: 'Chỉ quản trị viên mới có quyền truy cập'
  });
};

// Middleware để kiểm tra role (customer hoặc admin)
exports.requireAuth = (req, res, next) => {
  if (req.user && (req.user.role === 'customer' || req.user.role === 'admin')) {
    return next();
  }
  return res.status(403).json({
    success: false,
    error: 'Bạn cần đăng nhập để thực hiện thao tác này'
  });
};

