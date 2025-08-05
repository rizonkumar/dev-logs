const express = require("express");
const router = express.Router();
const {
  logPomodoro,
  getStats,
  getHistory,
} = require("../controllers/pomodoroController");
const { protect } = require("../middleware/authMiddleware");

router.use(protect);

router.route("/").post(logPomodoro);
router.route("/stats").get(getStats);
router.route("/history").get(getHistory);

module.exports = router;
