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
        error: 'Category not found'
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
    const { name, parent_id } = req.body;
    
    if (!name) {
      return res.status(400).json({
        success: false,
        error: 'Category name is required'
      });
    }
    
    // Get the next category_id
    const lastCategory = await Category.findOne().sort({ category_id: -1 });
    const nextCategoryId = lastCategory ? lastCategory.category_id + 1 : 1;
    
    const category = await Category.create({
      category_id: nextCategoryId,
      name,
      parent_id: parent_id || null
    });
    
    res.status(201).json({
      success: true,
      data: category,
      message: 'Category created successfully'
    });
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
        error: 'Category not found'
      });
    }
    
    res.json({
      success: true,
      data: category,
      message: 'Category updated successfully'
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
        error: 'Category not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
