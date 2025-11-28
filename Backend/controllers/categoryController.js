const Category = require('../models/Category');

exports.getAllCategories = async (req, res) => {
  try {
    const { parentId } = req.query;
    let query = {};
    
    if (parentId) {
      query.parent_id = parseInt(parentId);
    }
    
    const categories = await Category.find(query).sort({ category_id: 1 });
    res.json({
      success: true,
      data: categories,
      count: categories.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

exports.getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findOne({ category_id: parseInt(id) });
    
    if (!category) {
      return res.status(404).json({
        success: false,
        error: 'Không tìm thấy danh mục'
      });
    }
    
    res.json({
      success: true,
      data: category
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const { category_id, name, parent_id } = req.body;

    if (!name) return res.status(400).json({ success: false, error: 'Tên danh mục là bắt buộc' });

    let finalCategoryId;
    if (category_id !== undefined && category_id !== null && category_id !== '') {
      const provided = parseInt(category_id);
      if (isNaN(provided)) return res.status(400).json({ success: false, error: 'category_id phải là số' });
      const exists = await Category.findOne({ category_id: provided });
      if (exists) return res.status(400).json({ success: false, error: 'category_id đã tồn tại' });
      finalCategoryId = provided;
    } else {
      const lastCategory = await Category.findOne().sort({ category_id: -1 });
      finalCategoryId = lastCategory ? lastCategory.category_id + 1 : 1;
    }

    const category = await Category.create({ category_id: finalCategoryId, name, parent_id: parent_id || null });
    res.status(201).json({ success: true, data: category, message: 'Tạo danh mục thành công' });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, parent_id } = req.body;
    
    const category = await Category.findOneAndUpdate(
      { category_id: parseInt(id) },
      { name, parent_id },
      { new: true, runValidators: true }
    );
    
    if (!category) {
      return res.status(404).json({
        success: false,
        error: 'Không tìm thấy danh mục'
      });
    }
    
    res.json({
      success: true,
      data: category,
      message: 'Cập nhật danh mục thành công'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findOneAndDelete({ category_id: parseInt(id) });
    
    if (!category) {
      return res.status(404).json({
        success: false,
        error: 'Không tìm thấy danh mục'
      });
    }
    
    res.json({
      success: true,
      message: 'Đã xóa danh mục thành công'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
