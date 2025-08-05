const asyncHandler = require("../middleware/asyncHandler");
const logService = require("../services/logService");

const getLogs = asyncHandler(async (req, res) => {
  const { tags } = req.query;
  const tagArray = tags ? tags.split(",").map((tag) => tag.trim()) : undefined;
  const logs = await logService.getAllLogs(req.user.id, { tags: tagArray });
  res.status(200).json(logs);
});

const createLog = asyncHandler(async (req, res) => {
  const { entry, date, tags } = req.body;
  const newLog = await logService.createNewLog(req.user.id, {
    entry,
    date,
    tags,
  });
  res.status(201).json(newLog);
});

const updateLog = asyncHandler(async (req, res) => {
  const logId = req.params.id;
  const updatedLog = await logService.updateLogById(
    req.user.id,
    logId,
    req.body
  );
  res.status(200).json(updatedLog);
});

const deleteLog = asyncHandler(async (req, res) => {
  const logId = req.params.id;
  await logService.deleteLogById(req.user.id, logId);
  res.status(200).json({ id: logId, message: "Log removed successfully" });
});

const getLogStats = asyncHandler(async (req, res) => {
  const stats = await logService.getLogStats(req.user.id);
  res.status(200).json(stats);
});

module.exports = {
  getLogs,
  createLog,
  updateLog,
  deleteLog,
  getLogStats,
};
