const asyncHandler = require("../middleware/asyncHandler");
const reviewService = require("../services/reviewService");

// @desc    Get all reviews
// @route   GET /api/reviews
const getReviews = asyncHandler(async (req, res) => {
  const reviews = await reviewService.getAllReviews();
  res.status(200).json(reviews);
});

// @desc    Create a new review
// @route   POST /api/reviews
const createReview = asyncHandler(async (req, res) => {
  const { weekOf, accomplishments, challenges, nextWeekPriorities } = req.body;
  const newReview = await reviewService.createNewReview({
    weekOf,
    accomplishments,
    challenges,
    nextWeekPriorities,
  });
  res.status(201).json(newReview);
});

// @desc    Update a review
// @route   PUT /api/reviews/:id
const updateReview = asyncHandler(async (req, res) => {
  const reviewId = req.params.id;
  const updatedReview = await reviewService.updateReviewById(
    reviewId,
    req.body
  );

  if (!updatedReview) {
    res.status(404);
    throw new Error("Review not found");
  }
  res.status(200).json(updatedReview);
});

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
const deleteReview = asyncHandler(async (req, res) => {
  const reviewId = req.params.id;
  const deletedReview = await reviewService.deleteReviewById(reviewId);

  if (!deletedReview) {
    res.status(404);
    throw new Error("Review not found");
  }
  res.status(200).json({ id: reviewId, message: "Review removed" });
});

module.exports = {
  getReviews,
  createReview,
  updateReview,
  deleteReview,
};
