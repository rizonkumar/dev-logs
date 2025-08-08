const { body, param, query } = require("express-validator");

const validateCreateBudget = [
  body("category").isMongoId().withMessage("Valid category is required"),
  body("month").isInt({ min: 1, max: 12 }),
  body("year").isInt({ min: 2000, max: 2100 }),
  body("amount").isFloat({ min: 0 }),
  body("currency").optional().isString(),
];

const validateUpdateBudget = [
  param("id").isMongoId().withMessage("Invalid budget ID"),
  body("category").optional().isMongoId(),
  body("month").optional().isInt({ min: 1, max: 12 }),
  body("year").optional().isInt({ min: 2000, max: 2100 }),
  body("amount").optional().isFloat({ min: 0 }),
  body("currency").optional().isString(),
];

const validateListBudgets = [
  query("category").optional().isMongoId(),
  query("month").optional().isInt({ min: 1, max: 12 }),
  query("year").optional().isInt({ min: 2000, max: 2100 }),
];

const validateBudgetProgress = [
  query("categoryId").isMongoId(),
  query("month").isInt({ min: 1, max: 12 }),
  query("year").isInt({ min: 2000, max: 2100 }),
];

module.exports = {
  validateCreateBudget,
  validateUpdateBudget,
  validateListBudgets,
  validateBudgetProgress,
};
