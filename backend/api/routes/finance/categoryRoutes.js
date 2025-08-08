const express = require("express");
const router = express.Router();
const { protect } = require("../../middleware/authMiddleware");
const validate = require("../../middleware/validationMiddleware");
const {
  validateCreateCategory,
  validateUpdateCategory,
  validateListCategories,
} = require("../../validators/finance/categoryValidator");
const {
  listCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../../controllers/finance/categoryController");

router.use(protect);

router
  .route("/")
  .get(validateListCategories, validate, listCategories)
  .post(validateCreateCategory, validate, createCategory);

router
  .route("/:id")
  .put(validateUpdateCategory, validate, updateCategory)
  .delete(deleteCategory);

module.exports = router;
