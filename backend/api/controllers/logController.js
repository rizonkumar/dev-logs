const asyncHandler = require("../middleware/asyncHandler");
const logService = require("../services/logService");

const getLogs = asyncHandler(async (req, res) => {
  const logs = await logService.getAllLogs();
  res.status(200).json(logs);
});

const createLog = asyncHandler(async (req, res) => {
  const { entry, date } = req.body;
  const newLog = await logService.createNewLog({ entry, date });
  res.status(201).json(newLog);
});

module.exports = {
  getLogs,
  createLog,
};
