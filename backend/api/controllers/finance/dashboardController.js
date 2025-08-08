const asyncHandler = require("../../middleware/asyncHandler");
const dashboardService = require("../../services/finance/dashboardService");

const getOverview = asyncHandler(async (req, res) => {
  const data = await dashboardService.getOverview(req.user.id);
  res.status(200).json(data);
});

module.exports = { getOverview };
