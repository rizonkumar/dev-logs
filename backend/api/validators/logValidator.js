const { body } = require("express-validator");

const validateCreateLog = [
  body("entry").notEmpty().withMessage("Entry is required"),
  body("date")
    .notEmpty()
    .withMessage("Date is required")
    .isISO8601()
    .toDate()
    .withMessage("Please provide a valid date in YYYY-MM-DD format"),
];

module.exports = { validateCreateLog };
