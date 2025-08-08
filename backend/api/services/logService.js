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
      currentStreak: 0,
      longestStreak: 0,
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

  const toUtcYyyyMmDd = (date) => {
    const d = new Date(date);
    const utc = new Date(
      Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate())
    );
    return utc.toISOString().slice(0, 10);
  };

  const uniqueDateStringsSet = new Set(logs.map((l) => toUtcYyyyMmDd(l.date)));
  const uniqueDateStrings = Array.from(uniqueDateStringsSet).sort();

  let longestStreak = 0;
  let currentRun = 0;
  let prevDate = null;
  for (const dateStr of uniqueDateStrings) {
    const currentDate = new Date(dateStr + "T00:00:00.000Z");
    if (prevDate) {
      const diffDays = Math.round(
        (currentDate - prevDate) / (1000 * 60 * 60 * 24)
      );
      if (diffDays === 1) {
        currentRun += 1;
      } else {
        longestStreak = Math.max(longestStreak, currentRun);
        currentRun = 1;
      }
    } else {
      currentRun = 1;
    }
    prevDate = currentDate;
  }
  longestStreak = Math.max(longestStreak, currentRun);

  // Current streak up to the latest log date (not strictly today)
  let currentStreak = 0;
  if (uniqueDateStrings.length > 0) {
    const latestDateStr = uniqueDateStrings[uniqueDateStrings.length - 1];
    const cursor = new Date(latestDateStr + "T00:00:00.000Z");
    while (uniqueDateStringsSet.has(cursor.toISOString().slice(0, 10))) {
      currentStreak += 1;
      cursor.setUTCDate(cursor.getUTCDate() - 1);
    }
  }

  return {
    totalLogs: logs.length,
    mostActiveDay: dayAbbreviations[mostActiveDay],
    dayStats: Object.keys(dayStats).reduce((acc, day) => {
      acc[dayAbbreviations[day]] = dayStats[day];
      return acc;
    }, {}),
    currentStreak,
    longestStreak,
  };
};

module.exports = {
  getAllLogs,
  createNewLog,
  updateLogById,
  deleteLogById,
  getLogStats,
};
