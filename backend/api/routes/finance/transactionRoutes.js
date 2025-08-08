const express = require("express");
const router = express.Router();
const { protect } = require("../../middleware/authMiddleware");
const validate = require("../../middleware/validationMiddleware");
const {
  validateCreateTransaction,
  validateUpdateTransaction,
  validateListTransactions,
} = require("../../validators/finance/transactionValidator");
const {
  listTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getTransaction,
} = require("../../controllers/finance/transactionController");

router.use(protect);

router
  .route("/")
  .get(validateListTransactions, validate, listTransactions)
  .post(validateCreateTransaction, validate, createTransaction);

router
  .route("/:id")
  .get(getTransaction)
  .put(validateUpdateTransaction, validate, updateTransaction)
  .delete(deleteTransaction);

module.exports = router;
