const Log = require("../models/logModel");

const getAllLogs = async (userId, filters = {}) => {
  const query = { user: userId };
  if (filters.tags && filters.tags.length > 0) {
    query.tags = { $in: filters.tags };
  }
  const logs = await Log.find(query).sort({ date: -1 });
  return logs;
};

const createNewLog = async (userId, logData) => {
  const { entry, date, tags = [] } = logData;
  const cleanedTags = [
    ...new Set(tags.map((tag) => tag.trim()).filter((tag) => tag.length > 0)),
  ];

  const log = await Log.create({
    user: userId,
    entry,
    date,
    tags: cleanedTags,
  });
  return log;
};

const updateLogById = async (userId, logId, logData) => {
  if (logData.tags) {
    logData.tags = [
      ...new Set(
        logData.tags.map((tag) => tag.trim()).filter((tag) => tag.length > 0)
      ),
    ];
  }

  const log = await Log.findOne({ _id: logId, user: userId });

  if (!log) {
    const error = new Error("Log not found or user not authorized");
    error.statusCode = 404;
    throw error;
  }

  Object.assign(log, logData);
  await log.save();
  return log;
};

const deleteLogById = async (userId, logId) => {
  const log = await Log.findOne({ _id: logId, user: userId });

  if (!log) {
    const error = new Error("Log not found or user not authorized");
    error.statusCode = 404;
    throw error;
  }

  await log.deleteOne();
  return log;
};

const getLogStats = async (userId) => {
  const logs = await Log.find({ user: userId });

  if (!logs || logs.length === 0) {
    return {
      totalLogs: 0,
      mostActiveDay: "N/A",
      dayStats: {},
    };
  }

  const dayStats = {
    Sunday: 0,
    Monday: 0,
    Tuesday: 0,
    Wednesday: 0,
    Thursday: 0,
    Friday: 0,
    Saturday: 0,
  };

  const dayAbbreviations = {
    Sunday: "Sun",
    Monday: "Mon",
    Tuesday: "Tue",
    Wednesday: "Wed",
    Thursday: "Thu",
    Friday: "Fri",
    Saturday: "Sat",
  };

  logs.forEach((log) => {
    const dayOfWeek = new Date(log.date).toLocaleDateString("en-US", {
      weekday: "long",
      timeZone: "UTC",
    });
    dayStats[dayOfWeek]++;
  });

  const mostActiveDay = Object.keys(dayStats).reduce((a, b) =>
    dayStats[a] > dayStats[b] ? a : b
  );

  return {
    totalLogs: logs.length,
    mostActiveDay: dayAbbreviations[mostActiveDay],
    dayStats: Object.keys(dayStats).reduce((acc, day) => {
      acc[dayAbbreviations[day]] = dayStats[day];
      return acc;
    }, {}),
  };
};

module.exports = {
  getAllLogs,
  createNewLog,
  updateLogById,
  deleteLogById,
  getLogStats,
};
