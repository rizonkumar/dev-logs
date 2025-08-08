const FinanceTransaction = require("../../models/finance/transactionModel");

const getOverview = async (userId) => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0);
  const endOfMonth = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    0,
    23,
    59,
    59,
    999
  );

  const [incomeAgg] = await FinanceTransaction.aggregate([
    {
      $match: {
        user: userId,
        type: "INCOME",
        status: "POSTED",
        transactionDate: { $gte: startOfMonth, $lte: endOfMonth },
      },
    },
    { $group: { _id: null, amount: { $sum: "$amount" } } },
  ]);

  const [expenseAgg] = await FinanceTransaction.aggregate([
    {
      $match: {
        user: userId,
        type: "EXPENSE",
        status: "POSTED",
        transactionDate: { $gte: startOfMonth, $lte: endOfMonth },
      },
    },
    { $group: { _id: null, amount: { $sum: "$amount" } } },
  ]);

  const recentTransactions = await FinanceTransaction.find({ user: userId })
    .sort({ createdAt: -1 })
    .limit(10)
    .populate("category")
    .populate("project");

  const upcomingBills = await FinanceTransaction.find({
    user: userId,
    type: "EXPENSE",
    status: "SCHEDULED",
  })
    .sort({ dueDate: 1 })
    .limit(10)
    .populate("category");

  const income = incomeAgg ? incomeAgg.amount : 0;
  const expense = expenseAgg ? expenseAgg.amount : 0;
  const balance = income - expense;

  return { balance, income, expense, recentTransactions, upcomingBills };
};

module.exports = { getOverview };
