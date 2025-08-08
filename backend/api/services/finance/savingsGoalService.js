const FinanceSavingsGoal = require("../../models/finance/savingsGoalModel");

const listGoals = async (userId) => {
  return await FinanceSavingsGoal.find({ user: userId }).sort({
    createdAt: -1,
  });
};

const createGoal = async (userId, data) => {
  const { name, targetAmount, targetDate } = data;
  return await FinanceSavingsGoal.create({
    user: userId,
    name,
    targetAmount,
    targetDate,
  });
};

const addContribution = async (userId, goalId, data) => {
  const goal = await FinanceSavingsGoal.findOne({ _id: goalId, user: userId });
  if (!goal) {
    const error = new Error("Goal not found or user not authorized");
    error.statusCode = 404;
    throw error;
  }
  goal.contributions.push({
    amount: data.amount,
    date: data.date || new Date(),
    note: data.note || "",
    transaction: data.transaction,
  });
  await goal.save();
  return goal;
};

const deleteGoal = async (userId, id) => {
  const goal = await FinanceSavingsGoal.findOne({ _id: id, user: userId });
  if (!goal) {
    const error = new Error("Goal not found or user not authorized");
    error.statusCode = 404;
    throw error;
  }
  await goal.deleteOne();
  return goal;
};

module.exports = {
  listGoals,
  createGoal,
  addContribution,
  deleteGoal,
};
