const { body, param, query } = require("express-validator");

const validateCreateCategory = [
  body("name").trim().notEmpty().withMessage("name is required"),
  body("type").isIn(["INCOME", "EXPENSE"]).withMessage("Invalid type"),
  body("icon").optional().isString(),
  body("color").optional().isString(),
];

const validateUpdateCategory = [
  param("id").isMongoId().withMessage("Invalid category ID"),
  body("name").optional().trim().notEmpty(),
  body("type").optional().isIn(["INCOME", "EXPENSE"]),
  body("icon").optional().isString(),
  body("color").optional().isString(),
];

const validateListCategories = [
  query("type").optional().isIn(["INCOME", "EXPENSE"]),
];

module.exports = {
  validateCreateCategory,
  validateUpdateCategory,
  validateListCategories,
};
