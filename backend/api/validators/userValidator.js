const { body } = require("express-validator");

const validateRegistration = [
  body("name").notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Please include a valid email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("financeCurrency")
    .optional()
    .isLength({ min: 3, max: 3 })
    .withMessage("financeCurrency must be a 3-letter ISO code e.g. USD, INR, EUR"),
];

const validateLogin = [
  body("email").isEmail().withMessage("Please include a valid email"),
  body("password").exists().withMessage("Password is required"),
];

module.exports = {
  validateRegistration,
  validateLogin,
};
