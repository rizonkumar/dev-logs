// @desc    Get all logs
// @route   GET /api/logs
// @access  Public (for now)
const getLogs = async (req, res) => {
  res.status(200).json({ message: "Get all logs" });
};

// @desc    Create a new log
// @route   POST /api/logs
// @access  Public (for now)
const createLog = async (req, res) => {
  res.status(200).json({ message: "Create a log" });
};

module.exports = {
  getLogs,
  createLog,
};
