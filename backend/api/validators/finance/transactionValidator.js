const { body, param, query } = require("express-validator");

const validateCreateTransaction = [
  body("type")
    .isIn(["INCOME", "EXPENSE"])
    .withMessage("type must be INCOME or EXPENSE"),
  body("incomeType")
    .optional()
    .isIn([
      "FULL_TIME",
      "FREELANCE",
      "CONTRACT",
      "RSU",
      "SIDE_PROJECT",
      "SPONSORSHIP",
      "OTHER",
    ])
    .withMessage("Invalid incomeType"),
  body("amount")
    .isFloat({ min: 0 })
    .withMessage("amount must be non-negative number"),
  body("currency").optional().isString(),
  body("transactionDate").optional().isISO8601().toDate(),
  body("status")
    .optional()
    .isIn(["POSTED", "SCHEDULED"])
    .withMessage("Invalid status"),
  body("dueDate").optional().isISO8601().toDate(),
  body("description").optional().isString(),
  body("category").isMongoId().withMessage("Valid category is required"),
  body("project").optional().isMongoId(),
  body("isBusinessExpense").optional().isBoolean(),
  body("tags").optional().isArray(),
  body("tags.*").optional().isString(),
];

const validateUpdateTransaction = [
  param("id").isMongoId().withMessage("Invalid transaction ID"),
  body("type")
    .optional()
    .isIn(["INCOME", "EXPENSE"])
    .withMessage("type must be INCOME or EXPENSE"),
  body("incomeType")
    .optional()
    .isIn([
      "FULL_TIME",
      "FREELANCE",
      "CONTRACT",
      "RSU",
      "SIDE_PROJECT",
      "SPONSORSHIP",
      "OTHER",
    ])
    .withMessage("Invalid incomeType"),
  body("amount")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("amount must be non-negative number"),
  body("currency").optional().isString(),
  body("transactionDate").optional().isISO8601().toDate(),
  body("status")
    .optional()
    .isIn(["POSTED", "SCHEDULED"])
    .withMessage("Invalid status"),
  body("dueDate").optional().isISO8601().toDate(),
  body("description").optional().isString(),
  body("category").optional().isMongoId(),
  body("project").optional().isMongoId(),
  body("isBusinessExpense").optional().isBoolean(),
  body("tags").optional().isArray(),
  body("tags.*").optional().isString(),
];

const validateListTransactions = [
  query("type").optional().isString(),
  query("incomeType").optional().isString(),
  query("category").optional().isString(),
  query("project").optional().isString(),
  query("isBusinessExpense").optional().isString(),
  query("status").optional().isString(),
  query("from").optional().isISO8601(),
  query("to").optional().isISO8601(),
  query("dateField").optional().isIn(["transactionDate", "dueDate"]),
  query("limit").optional().isInt({ min: 1, max: 200 }),
  query("page").optional().isInt({ min: 1 }),
  query("sort")
    .optional()
    .isIn(["newest", "oldest", "amount_desc", "amount_asc"]),
];

module.exports = {
  validateCreateTransaction,
  validateUpdateTransaction,
  validateListTransactions,
};
