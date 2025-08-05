const Review = require("../models/reviewModel");

const getAllReviews = async (userId) => {
  return await Review.find({ user: userId }).sort({ weekOf: -1 });
};

const createNewReview = async (userId, reviewData) => {
  return await Review.create({ ...reviewData, user: userId });
};

const updateReviewById = async (userId, reviewId, updateData) => {
  const review = await Review.findOne({ _id: reviewId, user: userId });

  if (!review) {
    const error = new Error("Review not found or user not authorized");
    error.statusCode = 404;
    throw error;
  }

  Object.assign(review, updateData);
  await review.save();
  return review;
};

const deleteReviewById = async (userId, reviewId) => {
  const review = await Review.findOne({ _id: reviewId, user: userId });
  if (!review) {
    const error = new Error("Review not found or user not authorized");
    error.statusCode = 404;
    throw error;
  }
  await review.deleteOne();
  return review;
};

module.exports = {
  getAllReviews,
  createNewReview,
  updateReviewById,
  deleteReviewById,
};
