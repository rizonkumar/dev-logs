const Pomodoro = require("../models/pomodoroModel");

const createPomodoroSession = async (sessionData) => {
  return await Pomodoro.create(sessionData);
};

const getPomodoroStats = async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const count = await Pomodoro.countDocuments({
    status: "COMPLETED",
    createdAt: { $gte: today },
  });

  return { sessionsToday: count };
};

module.exports = {
  createPomodoroSession,
  getPomodoroStats,
};
