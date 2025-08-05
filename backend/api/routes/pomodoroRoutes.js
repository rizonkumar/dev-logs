const express = require("express");
const router = express.Router();
const { logPomodoro, getStats } = require("../controllers/pomodoroController");
const { protect } = require("../middleware/authMiddleware");

router.use(protect);

router.route("/").post(logPomodoro);
router.route("/stats").get(getStats);

module.exports = router;
