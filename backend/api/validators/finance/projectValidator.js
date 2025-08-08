const { body, param } = require("express-validator");

const validateCreateProject = [
  body("name").trim().notEmpty().withMessage("name is required"),
  body("client").optional().isString(),
  body("description").optional().isString(),
  body("status").optional().isIn(["ACTIVE", "ARCHIVED"]),
  body("startDate").optional().isISO8601().toDate(),
  body("endDate").optional().isISO8601().toDate(),
];

const validateUpdateProject = [
  param("id").isMongoId().withMessage("Invalid project ID"),
  body("name").optional().trim().notEmpty(),
  body("client").optional().isString(),
  body("description").optional().isString(),
  body("status").optional().isIn(["ACTIVE", "ARCHIVED"]),
  body("startDate").optional().isISO8601().toDate(),
  body("endDate").optional().isISO8601().toDate(),
];

module.exports = {
  validateCreateProject,
  validateUpdateProject,
};
