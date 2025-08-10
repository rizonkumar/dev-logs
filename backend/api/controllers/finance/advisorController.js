const asyncHandler = require("../../middleware/asyncHandler");
const advisorService = require("../../services/finance/advisorService");

const getAdvice = asyncHandler(async (req, res) => {
  const { question, month, year, privacy } = req.body || {};
  const data = await advisorService.getBudgetAdvice(req.user.id, {
    question,
    month,
    year,
    privacy,
  });
  res.status(200).json(data);
});

module.exports = { getAdvice };
