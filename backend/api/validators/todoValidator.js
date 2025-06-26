const { body, param } = require("express-validator");

const validateCreateTodo = [
  body("task")
    .trim()
    .notEmpty()
    .withMessage("Task description cannot be empty"),
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
];

module.exports = {
  validateCreateTodo,
  validateUpdateTodo,
};
