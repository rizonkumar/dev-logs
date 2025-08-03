const asyncHandler = require("../middleware/asyncHandler");
const pomodoroService = require("../services/pomodoroService");

// @desc    Log a new pomodoro session
// @route   POST /api/pomodoros
const logPomodoro = asyncHandler(async (req, res) => {
  const { task, status, duration, startTime } = req.body;
  const newSession = await pomodoroService.createPomodoroSession({
    task,
    status,
    duration,
    startTime,
  });
  res.status(201).json(newSession);
});

// @desc    Get pomodoro stats
// @route   GET /api/pomodoros/stats
const getStats = asyncHandler(async (req, res) => {
  const stats = await pomodoroService.getPomodoroStats();
  res.status(200).json(stats);
});

module.exports = {
  logPomodoro,
  getStats,
};
