const asyncHandler = require("../middleware/asyncHandler");
const pomodoroService = require("../services/pomodoroService");

const logPomodoro = asyncHandler(async (req, res) => {
  const newSession = await pomodoroService.createPomodoroSession(
    req.user.id,
    req.body
  );
  res.status(201).json(newSession);
});

const getStats = asyncHandler(async (req, res) => {
  const stats = await pomodoroService.getPomodoroStats(req.user.id);
  res.status(200).json(stats);
});

const getHistory = asyncHandler(async (req, res) => {
  const history = await pomodoroService.getPomodoroHistory(req.user.id);
  res.status(200).json(history);
});

module.exports = {
  logPomodoro,
  getStats,
  getHistory,
};
