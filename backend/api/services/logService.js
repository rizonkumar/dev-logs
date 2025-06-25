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

module.exports = { getAllLogs, createNewLog, updateLogById, deleteLogById };
