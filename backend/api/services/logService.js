const Log = require("../models/logModel");

const getAllLogs = async (filters = {}) => {
  const query = {};
  if (filters.tags && filters.tags.length > 0) {
    query.tags = { $in: filters.tags };
  }
  const logs = await Log.find(query).sort({ date: -1 });
  return logs;
};

const createNewLog = async (logData) => {
  const { entry, date, tags = [] } = logData;
  const cleanedTags = [
    ...new Set(tags.map((tag) => tag.trim()).filter((tag) => tag.length > 0)),
  ];

  const log = await Log.create({
    entry,
    date,
    tags: cleanedTags,
  });
  return log;
};

const updateLogById = async (logId, logData) => {
  if (logData.tags) {
    logData.tags = [
      ...new Set(
        logData.tags.map((tag) => tag.trim()).filter((tag) => tag.length > 0)
      ),
    ];
  }

  const updatedLog = await Log.findByIdAndUpdate(logId, logData, {
    new: true,
  });
  return updatedLog;
};

const deleteLogById = async (logId) => {
  const deletedLog = await Log.findByIdAndDelete(logId);
  return deletedLog;
};

const getLogStats = async () => {
  const logs = await Log.find();

  if (!logs || logs.length === 0) {
    return {
      totalLogs: 0,
      mostActiveDay: "Mon",
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
