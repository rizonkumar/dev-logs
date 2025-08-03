const Review = require("../models/reviewModel");

const getAllReviews = async () => {
  return await Review.find({}).sort({ weekOf: -1 });
};

const createNewReview = async (reviewData) => {
  return await Review.create(reviewData);
};

const updateReviewById = async (reviewId, updateData) => {
  return await Review.findByIdAndUpdate(reviewId, updateData, {
    new: true,
    runValidators: true,
  });
};

const deleteReviewById = async (reviewId) => {
  return await Review.findByIdAndDelete(reviewId);
};

module.exports = {
  getAllReviews,
  createNewReview,
  updateReviewById,
  deleteReviewById,
};
