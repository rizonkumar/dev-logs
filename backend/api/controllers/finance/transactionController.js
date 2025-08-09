const asyncHandler = require("../../middleware/asyncHandler");
const transactionService = require("../../services/finance/transactionService");

const listTransactions = asyncHandler(async (req, res) => {
  const result = await transactionService.getAllTransactions(
    req.user.id,
    req.query || {}
  );
  res.status(200).json(result);
});

const createTransaction = asyncHandler(async (req, res) => {
  const created = await transactionService.createTransaction(
    req.user.id,
    req.body
  );
  res.status(201).json(created);
});

const updateTransaction = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updated = await transactionService.updateTransactionById(
    req.user.id,
    id,
    req.body
  );
  res.status(200).json(updated);
});

const deleteTransaction = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await transactionService.deleteTransactionById(req.user.id, id);
  res.status(200).json({ id, message: "Transaction removed successfully" });
});

const getTransaction = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const transaction = await transactionService.getTransactionById(
    req.user.id,
    id
  );
  res.status(200).json(transaction);
});

module.exports = {
  listTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getTransaction,
};
