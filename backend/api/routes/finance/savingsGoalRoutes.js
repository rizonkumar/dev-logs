const express = require("express");
const router = express.Router();
const { protect } = require("../../middleware/authMiddleware");
const validate = require("../../middleware/validationMiddleware");
const {
  validateCreateGoal,
  validateAddContribution,
} = require("../../validators/finance/savingsGoalValidator");
const {
  listGoals,
  createGoal,
  addContribution,
  deleteGoal,
} = require("../../controllers/finance/savingsGoalController");

router.use(protect);

router.route("/").get(listGoals).post(validateCreateGoal, validate, createGoal);

router
  .route("/:id/contributions")
  .post(validateAddContribution, validate, addContribution);

router.route("/:id").delete(deleteGoal);

module.exports = router;
