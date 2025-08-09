const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
} = require("../controllers/userController");
const {
  validateRegistration,
  validateLogin,
} = require("../validators/userValidator");
const validate = require("../middleware/validationMiddleware");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

// Public routes (disabled with Clerk; keep endpoints returning 405)
router.post("/register", registerUser);
router.post("/login", loginUser);

// Private routes
router
  .route("/profile")
  .get(protect, getUserProfile)
  .put(protect, upload.single("profileImage"), updateUserProfile);

module.exports = router;
