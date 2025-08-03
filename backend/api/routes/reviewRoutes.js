const express = require("express");
const router = express.Router();

const {
  getReviews,
  createReview,
  updateReview,
  deleteReview,
} = require("../controllers/reviewController");

router.route("/").get(getReviews).post(createReview);

router.route("/:id").put(updateReview).delete(deleteReview);

module.exports = router;
