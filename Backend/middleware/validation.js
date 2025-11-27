// Validation middleware example
exports.validateUser = (req, res, next) => {
  const { name, email } = req.body;
  
  if (!name || name.trim().length === 0) {
    return res.status(400).json({
      success: false,
      error: 'Name is required'
    });
  }
  
  if (!email || !email.includes('@')) {
    return res.status(400).json({
      success: false,
      error: 'Valid email is required'
    });
  }
  
  next();
};

exports.validateTodo = (req, res, next) => {
  const { title, userId } = req.body;
  
  if (!title || title.trim().length === 0) {
    return res.status(400).json({
      success: false,
      error: 'Title is required'
    });
  }
  
  if (!userId) {
    return res.status(400).json({
      success: false,
      error: 'UserId is required'
    });
  }
  
  next();
};

