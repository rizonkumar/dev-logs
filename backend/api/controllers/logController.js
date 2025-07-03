const asyncHandler = require("../middleware/asyncHandler");
const logService = require("../services/logService");

const getLogs = asyncHandler(async (req, res) => {
  const { category } = req.query;
  const logs = await logService.getAllLogs({ category });
  res.status(200).json(logs);
});

const createLog = asyncHandler(async (req, res) => {
  const { entry, date, category } = req.body;
  const newLog = await logService.createNewLog({ entry, date, category });
  res.status(201).json(newLog);
});

const updateLog = asyncHandler(async (req, res) => {
  const logId = req.params.id;

  const updateData = {};
  if (req.body.entry) updateData.entry = req.body.entry;
  if (req.body.date) updateData.date = req.body.date;
  if (req.body.category) updateData.category = req.body.category;

  if (Object.keys(updateData).length === 0) {
    res.status(400);
    throw new Error("No fields to update provided");
  }

  const updatedLog = await logService.updateLogById(logId, updateData);

  if (!updatedLog) {
    res.status(404);
    throw new Error("Log not found");
  }

  res.status(200).json(updatedLog);
});

const deleteLog = asyncHandler(async (req, res) => {
  const logId = req.params.id;
  const deletedLog = await logService.deleteLogById(logId);
  if (!deletedLog) {
    res.status(404);
    throw new Error("Log not found");
  }
  res.status(200).json({ id: logId, message: "Log removed successfully" });
});

const getLogStats = asyncHandler(async (req, res) => {
  const stats = await logService.getLogStats();
  res.status(200).json(stats);
});

module.exports = {
  getLogs,
  createLog,
  updateLog,
  deleteLog,
  getLogStats,
};
