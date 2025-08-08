const express = require("express");
const router = express.Router();
const { protect } = require("../../middleware/authMiddleware");
const validate = require("../../middleware/validationMiddleware");
const {
  validateCreateBudget,
  validateUpdateBudget,
  validateListBudgets,
  validateBudgetProgress,
} = require("../../validators/finance/budgetValidator");
const {
  listBudgets,
  createBudget,
  updateBudget,
  deleteBudget,
  getBudgetProgress,
} = require("../../controllers/finance/budgetController");

router.use(protect);

router
  .route("/")
  .get(validateListBudgets, validate, listBudgets)
  .post(validateCreateBudget, validate, createBudget);

router
  .route("/progress")
  .get(validateBudgetProgress, validate, getBudgetProgress);

router
  .route("/:id")
  .put(validateUpdateBudget, validate, updateBudget)
  .delete(deleteBudget);

module.exports = router;
