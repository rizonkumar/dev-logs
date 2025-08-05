const express = require("express");
const router = express.Router();
const { getContributions } = require("../controllers/githubController");
const { protect } = require("../middleware/authMiddleware");

router.get("/contributions", protect, getContributions);

module.exports = router;
