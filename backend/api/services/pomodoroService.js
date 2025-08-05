const Pomodoro = require("../models/pomodoroModel");

const createPomodoroSession = async (userId, sessionData) => {
  const { title, sessionType, tag, duration, startTime } = sessionData;
  return await Pomodoro.create({
    user: userId,
    title,
    sessionType,
    tag,
    duration,
    startTime,
  });
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

const getPomodoroHistory = async (userId) => {
  return await Pomodoro.find({ user: userId, status: "COMPLETED" }).sort({
    createdAt: -1,
  });
};

module.exports = {
  createPomodoroSession,
  getPomodoroStats,
  getPomodoroHistory,
};
