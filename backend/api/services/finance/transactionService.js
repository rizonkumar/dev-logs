const FinanceTransaction = require("../../models/finance/transactionModel");
const FinanceCategory = require("../../models/finance/categoryModel");
const FinanceProject = require("../../models/finance/projectModel");

const normalizeBooleanParam = (value) => {
  if (value === undefined || value === null) return undefined;
  if (typeof value === "boolean") return value;
  const v = String(value).toLowerCase();
  if (v === "true" || v === "1") return true;
  if (v === "false" || v === "0") return false;
  return undefined;
};

const splitCsv = (value) => {
  if (value === undefined || value === null) return undefined;
  if (Array.isArray(value)) return value.filter(Boolean);
  return String(value)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
};

const ensureCategoryOwnershipAndType = async (
  userId,
  categoryId,
  expectedType
) => {
  const category = await FinanceCategory.findOne({
    _id: categoryId,
    user: userId,
  });
  if (!category) {
    const error = new Error("Category not found or user not authorized");
    error.statusCode = 404;
    throw error;
  }
  if (expectedType && category.type !== expectedType) {
    const error = new Error(
      `Category type mismatch. Expected ${expectedType} category.`
    );
    error.statusCode = 400;
    throw error;
  }
  return category;
};

const ensureProjectOwnership = async (userId, projectId) => {
  if (!projectId) return null;
  const project = await FinanceProject.findOne({
    _id: projectId,
    user: userId,
  });
  if (!project) {
    const error = new Error("Project not found or user not authorized");
    error.statusCode = 404;
    throw error;
  }
  return project;
};

const getAllTransactions = async (userId, queryParams = {}) => {
  const {
    q,
    type,
    incomeType,
    category,
    project,
    isBusinessExpense,
    status,
    from,
    to,
    dateField,
    limit,
    sort,
  } = queryParams;

  const filter = { user: userId };

  const types = splitCsv(type);
  if (types && types.length) filter.type = { $in: types };

  const incomeTypes = splitCsv(incomeType);
  if (incomeTypes && incomeTypes.length)
    filter.incomeType = { $in: incomeTypes };

  const statuses = splitCsv(status);
  if (statuses && statuses.length) filter.status = { $in: statuses };

  const categoryIds = splitCsv(category);
  if (categoryIds && categoryIds.length) filter.category = { $in: categoryIds };

  const projectIds = splitCsv(project);
  if (projectIds && projectIds.length) filter.project = { $in: projectIds };

  const biz = normalizeBooleanParam(isBusinessExpense);
  if (biz !== undefined) filter.isBusinessExpense = biz;

  if (q && typeof q === "string" && q.trim().length > 0) {
    filter.$or = [
      { description: { $regex: q.trim(), $options: "i" } },
      { tags: { $in: [new RegExp(q.trim(), "i")] } },
    ];
  }

  const field = dateField === "dueDate" ? "dueDate" : "transactionDate";
  if (from || to) {
    filter[field] = {};
    if (from) {
      const fromDate = new Date(from);
      if (!isNaN(fromDate)) {
        if (field === "transactionDate") fromDate.setHours(0, 0, 0, 0);
        filter[field].$gte = fromDate;
      }
    }
    if (to) {
      const toDate = new Date(to);
      if (!isNaN(toDate)) {
        if (field === "transactionDate") toDate.setHours(23, 59, 59, 999);
        filter[field].$lte = toDate;
      }
    }
  }

  const sortOption = (() => {
    if (sort === "oldest") return { transactionDate: 1, createdAt: 1 };
    if (sort === "amount_desc") return { amount: -1, transactionDate: -1 };
    if (sort === "amount_asc") return { amount: 1, transactionDate: -1 };
    return { transactionDate: -1, createdAt: -1 };
  })();

  const query = FinanceTransaction.find(filter)
    .populate("category")
    .populate("project")
    .sort(sortOption);

  const lim = Number(limit);
  if (!Number.isNaN(lim) && lim > 0) query.limit(lim);

  return await query.exec();
};

const createTransaction = async (userId, data) => {
  const {
    type,
    incomeType,
    amount,
    currency,
    transactionDate,
    status,
    dueDate,
    description,
    category,
    project,
    isBusinessExpense,
    tags = [],
  } = data;

  const expectedCategoryType = type === "INCOME" ? "INCOME" : "EXPENSE";
  await ensureCategoryOwnershipAndType(userId, category, expectedCategoryType);
  await ensureProjectOwnership(userId, project);

  const cleanedTags = Array.isArray(tags)
    ? [...new Set(tags.map((t) => String(t).trim()).filter(Boolean))]
    : [];

  const transaction = await FinanceTransaction.create({
    user: userId,
    type,
    incomeType,
    amount,
    currency,
    transactionDate,
    status,
    dueDate,
    description,
    category,
    project,
    isBusinessExpense,
    tags: cleanedTags,
  });

  return transaction;
};

const updateTransactionById = async (userId, transactionId, updateData) => {
  if (updateData.category) {
    const expectedCategoryType = updateData.type
      ? updateData.type === "INCOME"
        ? "INCOME"
        : "EXPENSE"
      : undefined; // If type is not changing, skip type check here

    const existing = await FinanceTransaction.findOne({
      _id: transactionId,
      user: userId,
    });
    if (!existing) {
      const error = new Error("Transaction not found or user not authorized");
      error.statusCode = 404;
      throw error;
    }

    await ensureCategoryOwnershipAndType(
      userId,
      updateData.category,
      expectedCategoryType ||
        (existing.type === "INCOME" ? "INCOME" : "EXPENSE")
    );
  }

  if (updateData.project) {
    await ensureProjectOwnership(userId, updateData.project);
  }

  if (updateData.tags) {
    updateData.tags = [
      ...new Set(updateData.tags.map((t) => String(t).trim()).filter(Boolean)),
    ];
  }

  const transaction = await FinanceTransaction.findOne({
    _id: transactionId,
    user: userId,
  });
  if (!transaction) {
    const error = new Error("Transaction not found or user not authorized");
    error.statusCode = 404;
    throw error;
  }

  Object.assign(transaction, updateData);
  await transaction.save();
  return transaction;
};

const deleteTransactionById = async (userId, transactionId) => {
  const transaction = await FinanceTransaction.findOne({
    _id: transactionId,
    user: userId,
  });
  if (!transaction) {
    const error = new Error("Transaction not found or user not authorized");
    error.statusCode = 404;
    throw error;
  }
  await transaction.deleteOne();
  return transaction;
};

const getTransactionById = async (userId, transactionId) => {
  const transaction = await FinanceTransaction.findOne({
    _id: transactionId,
    user: userId,
  })
    .populate("category")
    .populate("project");
  if (!transaction) {
    const error = new Error("Transaction not found or user not authorized");
    error.statusCode = 404;
    throw error;
  }
  return transaction;
};

module.exports = {
  getAllTransactions,
  createTransaction,
  updateTransactionById,
  deleteTransactionById,
  getTransactionById,
};
