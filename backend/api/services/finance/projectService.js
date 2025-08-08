const FinanceProject = require("../../models/finance/projectModel");
const FinanceTransaction = require("../../models/finance/transactionModel");

const listProjects = async (userId) => {
  return await FinanceProject.find({ user: userId }).sort({ name: 1 });
};

const createProject = async (userId, data) => {
  const { name, client, description, status, startDate, endDate } = data;
  return await FinanceProject.create({
    user: userId,
    name,
    client,
    description,
    status,
    startDate,
    endDate,
  });
};

const updateProject = async (userId, id, data) => {
  const project = await FinanceProject.findOne({ _id: id, user: userId });
  if (!project) {
    const error = new Error("Project not found or user not authorized");
    error.statusCode = 404;
    throw error;
  }
  Object.assign(project, data);
  await project.save();
  return project;
};

const deleteProject = async (userId, id) => {
  const project = await FinanceProject.findOne({ _id: id, user: userId });
  if (!project) {
    const error = new Error("Project not found or user not authorized");
    error.statusCode = 404;
    throw error;
  }
  await project.deleteOne();
  return project;
};

const getProjectProfitability = async (userId, projectId) => {
  const project = await FinanceProject.findOne({
    _id: projectId,
    user: userId,
  });
  if (!project) {
    const error = new Error("Project not found or user not authorized");
    error.statusCode = 404;
    throw error;
  }
  const [incomeAgg] = await FinanceTransaction.aggregate([
    { $match: { user: project.user, project: project._id, type: "INCOME" } },
    { $group: { _id: null, total: { $sum: "$amount" } } },
  ]);
  const [expenseAgg] = await FinanceTransaction.aggregate([
    { $match: { user: project.user, project: project._id, type: "EXPENSE" } },
    { $group: { _id: null, total: { $sum: "$amount" } } },
  ]);
  const totalIncome = incomeAgg ? incomeAgg.total : 0;
  const totalExpense = expenseAgg ? expenseAgg.total : 0;
  return { totalIncome, totalExpense, profit: totalIncome - totalExpense };
};

module.exports = {
  listProjects,
  createProject,
  updateProject,
  deleteProject,
  getProjectProfitability,
};
