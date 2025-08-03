const express = require("express");
const router = express.Router();
const { logPomodoro, getStats } = require("../controllers/pomodoroController");

router.route("/").post(logPomodoro);
router.route("/stats").get(getStats);

module.exports = router;
