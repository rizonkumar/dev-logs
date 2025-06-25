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

module.exports = { getAllLogs, createNewLog };
