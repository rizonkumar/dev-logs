const asyncHandler = require("../../middleware/asyncHandler");
const {
  computeContractVsFullTime,
  computeFireProgress,
} = require("../../services/finance/calculatorService");

const contractVsFullTime = asyncHandler(async (req, res) => {
  const result = computeContractVsFullTime(req.body);
  res.status(200).json(result);
});

const fireCalculator = asyncHandler(async (req, res) => {
  const result = computeFireProgress(req.body);
  res.status(200).json(result);
});

module.exports = { contractVsFullTime, fireCalculator };
