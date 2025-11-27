const Review = require('../models/Review');

exports.getAllReviews = async (req, res) => {
  try {
    const { productId, userId } = req.query;
    let query = {};
    
    if (productId) {
      query.product_id = parseInt(productId);
    }
    
    if (userId) {
      query.user_id = parseInt(userId);
    }
    
    const reviews = await Review.find(query).sort({ review_id: 1 });
    res.json({
      success: true,
      data: reviews,
      count: reviews.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

exports.getReviewById = async (req, res) => {
  try {
    const { id } = req.params;
    const review = await Review.findOne({ review_id: parseInt(id) });
    
    if (!review) {
      return res.status(404).json({
        success: false,
        error: 'Review not found'
      });
    }
    
    res.json({
      success: true,
      data: review
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

exports.createReview = async (req, res) => {
  try {
    const { product_id, user_id, rating, comment } = req.body;
    
    if (!product_id || !user_id || rating === undefined) {
      return res.status(400).json({
        success: false,
        error: 'Product ID, user ID, and rating are required'
      });
    }
    
    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        error: 'Rating must be between 1 and 5'
      });
    }
    
    // Get the next review_id
    const lastReview = await Review.findOne().sort({ review_id: -1 });
    const nextReviewId = lastReview ? lastReview.review_id + 1 : 1;
    
    const review = await Review.create({
      review_id: nextReviewId,
      product_id: parseInt(product_id),
      user_id: parseInt(user_id),
      rating: parseInt(rating),
      comment: comment || null
    });
    
    res.status(201).json({
      success: true,
      data: review,
      message: 'Review created successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

exports.updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;
    
    if (rating !== undefined && (rating < 1 || rating > 5)) {
      return res.status(400).json({
        success: false,
        error: 'Rating must be between 1 and 5'
      });
    }
    
    const review = await Review.findOneAndUpdate(
      { review_id: parseInt(id) },
      { rating, comment },
      { new: true, runValidators: true }
    );
    
    if (!review) {
      return res.status(404).json({
        success: false,
        error: 'Review not found'
      });
    }
    
    res.json({
      success: true,
      data: review,
      message: 'Review updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const review = await Review.findOneAndDelete({ review_id: parseInt(id) });
    
    if (!review) {
      return res.status(404).json({
        success: false,
        error: 'Review not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
