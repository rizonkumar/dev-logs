const FinanceBudget = require("../../models/finance/budgetModel");
const FinanceCategory = require("../../models/finance/categoryModel");
const FinanceTransaction = require("../../models/finance/transactionModel");
const { Types } = require("mongoose");

const ensureCategoryOwnership = async (userId, categoryId) => {
  const category = await FinanceCategory.findOne({
    _id: categoryId,
    user: userId,
  });
  if (!category) {
    const error = new Error("Category not found or user not authorized");
    error.statusCode = 404;
    throw error;
  }
  return category;
};

const listBudgets = async (userId, query = {}) => {
  const filter = { user: userId };
  if (query.month) filter.month = Number(query.month);
  if (query.year) filter.year = Number(query.year);
  if (query.category) filter.category = query.category;
  return await FinanceBudget.find(filter)
    .populate("category")
    .sort({ year: -1, month: -1 });
};

const createBudget = async (userId, data) => {
  const { category, month, year, amount, currency } = data;
  await ensureCategoryOwnership(userId, category);
  return await FinanceBudget.create({
    user: userId,
    category,
    month,
    year,
    amount,
    currency,
  });
};

const updateBudget = async (userId, id, data) => {
  const budget = await FinanceBudget.findOne({ _id: id, user: userId });
  if (!budget) {
    const error = new Error("Budget not found or user not authorized");
    error.statusCode = 404;
    throw error;
  }
  if (data.category) await ensureCategoryOwnership(userId, data.category);
  Object.assign(budget, data);
  await budget.save();
  return budget;
};

const deleteBudget = async (userId, id) => {
  const budget = await FinanceBudget.findOne({ _id: id, user: userId });
  if (!budget) {
    const error = new Error("Budget not found or user not authorized");
    error.statusCode = 404;
    throw error;
  }
  await budget.deleteOne();
  return budget;
};

const getBudgetProgress = async (userId, { month, year, categoryId }) => {
  const filter = {
    user: new Types.ObjectId(userId),
    type: "EXPENSE",
    category: new Types.ObjectId(categoryId),
    transactionDate: {
      $gte: new Date(year, month - 1, 1, 0, 0, 0),
      $lte: new Date(year, month, 0, 23, 59, 59, 999),
    },
  };
  const expenses = await FinanceTransaction.aggregate([
    { $match: filter },
    { $group: { _id: null, spent: { $sum: "$amount" } } },
  ]);
  const spent = expenses.length > 0 ? expenses[0].spent : 0;

  const budget = await FinanceBudget.findOne({
    user: userId,
    category: categoryId,
    month,
    year,
  });
  return {
    spent,
    budgetAmount: budget ? budget.amount : 0,
    currency: budget ? budget.currency : "USD",
  };
};

module.exports = {
  listBudgets,
  createBudget,
  updateBudget,
  deleteBudget,
  getBudgetProgress,
};
