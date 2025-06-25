const { body, param } = require("express-validator");

const validateCreateLog = [
  body("entry").notEmpty().withMessage("Entry is required"),
  body("date")
    .notEmpty()
    .withMessage("Date is required")
    .isISO8601()
    .toDate()
    .withMessage("Please provide a valid date in YYYY-MM-DD format"),
];

const validateUpdateLog = [
  param("id").isMongoId().withMessage("Invalid log ID format"),

  body("entry").optional().notEmpty().withMessage("Log entry cannot be empty"),

  body("date")
    .optional()
    .isISO8601()
    .toDate()
    .withMessage("Please provide a valid date in YYYY-MM-DD format"),
];

module.exports = { validateCreateLog, validateUpdateLog };
