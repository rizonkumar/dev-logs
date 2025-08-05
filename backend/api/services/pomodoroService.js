const Pomodoro = require("../models/pomodoroModel");

const createPomodoroSession = async (userId, sessionData) => {
  return await Pomodoro.create({ ...sessionData, user: userId });
};

const getPomodoroStats = async (userId) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const count = await Pomodoro.countDocuments({
    user: userId,
    status: "COMPLETED",
    createdAt: { $gte: today },
  });

  return { sessionsToday: count };
};

module.exports = {
  createPomodoroSession,
  getPomodoroStats,
};
