const asyncHandler = require("../../middleware/asyncHandler");
const savingsGoalService = require("../../services/finance/savingsGoalService");

const listGoals = asyncHandler(async (req, res) => {
  const goals = await savingsGoalService.listGoals(req.user.id);
  res.status(200).json(goals);
});

const createGoal = asyncHandler(async (req, res) => {
  const created = await savingsGoalService.createGoal(req.user.id, req.body);
  res.status(201).json(created);
});

const addContribution = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updated = await savingsGoalService.addContribution(
    req.user.id,
    id,
    req.body
  );
  res.status(200).json(updated);
});

const deleteGoal = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await savingsGoalService.deleteGoal(req.user.id, id);
  res.status(200).json({ id, message: "Goal removed successfully" });
});

module.exports = {
  listGoals,
  createGoal,
  addContribution,
  deleteGoal,
};
