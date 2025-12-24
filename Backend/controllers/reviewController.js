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
        error: 'Không tìm thấy đánh giá'
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
    const { review_id, product_id, user_id, rating, comment } = req.body;

    if (!product_id || !user_id || rating === undefined) return res.status(400).json({ success: false, error: 'Cần có product_id, user_id và rating' });
    if (rating < 1 || rating > 5) return res.status(400).json({ success: false, error: 'Rating phải nằm trong khoảng từ 1 đến 5' });

    let finalReviewId;
    if (review_id !== undefined && review_id !== null && review_id !== '') {
      const provided = parseInt(review_id);
      if (isNaN(provided)) return res.status(400).json({ success: false, error: 'review_id phải là số' });
      const exists = await Review.findOne({ review_id: provided });
      if (exists) return res.status(400).json({ success: false, error: 'review_id đã tồn tại' });
      finalReviewId = provided;
    } else {
      const lastReview = await Review.findOne().sort({ review_id: -1 });
      finalReviewId = lastReview ? lastReview.review_id + 1 : 1;
    }

    const review = await Review.create({ review_id: finalReviewId, product_id: product_id, user_id: user_id, rating: parseInt(rating), comment: comment || null });
    res.status(201).json({ success: true, data: review, message: 'Review created successfully' });
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
        error: 'Rating phải nằm trong khoảng từ 1 đến 5'
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
        error: 'Không tìm thấy đánh giá'
      });
    }
    
    res.json({
      success: true,
      data: review,
      message: 'Đã cập nhật đánh giá thành công'
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
        error: 'Không tìm thấy đánh giá'
      });
    }
    
    res.json({
      success: true,
      message: 'Đã xóa đánh giá thành công'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
