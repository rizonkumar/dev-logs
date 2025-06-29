const Log = require("../models/logModel");

const getAllLogs = async () => {
  const logs = await Log.find({}).sort({ date: -1 });
  return logs;
};

const createNewLog = async (logData) => {
  console.log("Log Data", logData);
  const log = await Log.create({
    entry: logData.entry,
    date: logData.date,
  });
  return log;
};

const updateLogById = async (logId, logData) => {
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

  console.log("Most Active Day", mostActiveDay);
  console.log("Day Abbreviations", dayAbbreviations);
  console.log("Day Stats", dayStats);

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
