const { body, param } = require("express-validator");

const validateCreateTodo = [
  body("task")
    .trim()
    .notEmpty()
    .withMessage("Task description cannot be empty"),
  body("status")
    .optional()
    .isIn(["TODO", "IN_PROGRESS", "IN_REVIEW", "DONE"])
    .withMessage("Invalid status"),
  body("tags")
    .optional()
    .custom((value) => {
      if (Array.isArray(value)) {
        return value.every(
          (tag) => typeof tag === "string" && tag.trim().length > 0 && tag.length <= 30
        );
      }
      if (typeof value === "string") {
        // allow comma-separated string
        return value
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
          .every((t) => t.length > 0 && t.length <= 30);
      }
      return false;
    })
    .withMessage("Tags must be an array of non-empty strings or a comma-separated string"),
];

const validateUpdateTodo = [
  param("id").isMongoId().withMessage("Invalid Todo ID format"),

  body("task")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Task description cannot be empty"),

  body("isCompleted")
    .optional()
    .isBoolean()
    .withMessage("isCompleted must be a boolean value (true or false)"),
  body("status")
    .optional()
    .isIn(["TODO", "IN_PROGRESS", "IN_REVIEW", "DONE"])
    .withMessage("Invalid status"),
  body("tags")
    .optional()
    .custom((value) => {
      if (Array.isArray(value)) {
        return value.every(
          (tag) => typeof tag === "string" && tag.trim().length > 0 && tag.length <= 30
        );
      }
      if (typeof value === "string") {
        return value
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
          .every((t) => t.length > 0 && t.length <= 30);
      }
      return false;
    })
    .withMessage("Tags must be an array of non-empty strings or a comma-separated string"),
];

module.exports = {
  validateCreateTodo,
  validateUpdateTodo,
};
