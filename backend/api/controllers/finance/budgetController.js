const asyncHandler = require("../../middleware/asyncHandler");
const budgetService = require("../../services/finance/budgetService");

const listBudgets = asyncHandler(async (req, res) => {
  const budgets = await budgetService.listBudgets(req.user.id, req.query || {});
  res.status(200).json(budgets);
});

const createBudget = asyncHandler(async (req, res) => {
  const created = await budgetService.createBudget(req.user.id, req.body);
  res.status(201).json(created);
});

const updateBudget = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updated = await budgetService.updateBudget(req.user.id, id, req.body);
  res.status(200).json(updated);
});

const deleteBudget = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await budgetService.deleteBudget(req.user.id, id);
  res.status(200).json({ id, message: "Budget removed successfully" });
});

const getBudgetProgress = asyncHandler(async (req, res) => {
  const { month, year, categoryId } = req.query;
  const progress = await budgetService.getBudgetProgress(req.user.id, {
    month: Number(month),
    year: Number(year),
    categoryId,
  });
  res.status(200).json(progress);
});

module.exports = {
  listBudgets,
  createBudget,
  updateBudget,
  deleteBudget,
  getBudgetProgress,
};
