const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile,
} = require("../controllers/userController");
const {
  validateRegistration,
  validateLogin,
} = require("../validators/userValidator");
const validate = require("../middleware/validationMiddleware");
const { protect } = require("../middleware/authMiddleware");

// Public routes
router.post("/register", validateRegistration, validate, registerUser);
router.post("/login", validateLogin, validate, loginUser);

// Private route
router.get("/profile", protect, getUserProfile);

module.exports = router;
