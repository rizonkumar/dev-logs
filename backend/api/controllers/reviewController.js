const asyncHandler = require("../middleware/asyncHandler");
const reviewService = require("../services/reviewService");

const getReviews = asyncHandler(async (req, res) => {
  const reviews = await reviewService.getAllReviews(req.user.id);
  res.status(200).json(reviews);
});

const createReview = asyncHandler(async (req, res) => {
  const newReview = await reviewService.createNewReview(req.user.id, req.body);
  res.status(201).json(newReview);
});

const updateReview = asyncHandler(async (req, res) => {
  const reviewId = req.params.id;
  const updatedReview = await reviewService.updateReviewById(
    req.user.id,
    reviewId,
    req.body
  );
  res.status(200).json(updatedReview);
});

const deleteReview = asyncHandler(async (req, res) => {
  const reviewId = req.params.id;
  await reviewService.deleteReviewById(req.user.id, reviewId);
  res.status(200).json({ id: reviewId, message: "Review removed" });
});

module.exports = {
  getReviews,
  createReview,
  updateReview,
  deleteReview,
};
