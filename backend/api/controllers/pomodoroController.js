const asyncHandler = require("../middleware/asyncHandler");
const pomodoroService = require("../services/pomodoroService");

// @desc    Log a new pomodoro session
// @route   POST /api/pomodoros
const logPomodoro = asyncHandler(async (req, res) => {
  const newSession = await pomodoroService.createPomodoroSession(
    req.user.id,
    req.body
  );
  res.status(201).json(newSession);
});

// @desc    Get pomodoro stats
// @route   GET /api/pomodoros/stats
const getStats = asyncHandler(async (req, res) => {
  const stats = await pomodoroService.getPomodoroStats(req.user.id);
  res.status(200).json(stats);
});

module.exports = {
  logPomodoro,
  getStats,
};
