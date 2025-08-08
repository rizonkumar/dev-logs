const { body, param } = require("express-validator");

const validateCreateGoal = [
  body("name").trim().notEmpty().withMessage("name is required"),
  body("targetAmount").isFloat({ min: 0 }),
  body("targetDate").optional().isISO8601().toDate(),
];

const validateAddContribution = [
  param("id").isMongoId().withMessage("Invalid goal ID"),
  body("amount").isFloat({ min: 0 }),
  body("date").optional().isISO8601().toDate(),
  body("note").optional().isString(),
  body("transaction").optional().isMongoId(),
];

module.exports = {
  validateCreateGoal,
  validateAddContribution,
};
