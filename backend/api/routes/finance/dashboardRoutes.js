const express = require("express");
const router = express.Router();
const { protect } = require("../../middleware/authMiddleware");
const {
  getOverview,
} = require("../../controllers/finance/dashboardController");

router.use(protect);

router.get("/overview", getOverview);

module.exports = router;
