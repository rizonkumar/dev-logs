const express = require("express");
const router = express.Router();
const {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
  getTodo,
} = require("../controllers/todoController");
const {
  validateCreateTodo,
  validateUpdateTodo,
} = require("../validators/todoValidator");
const validate = require("../middleware/validationMiddleware");
const { protect } = require("../middleware/authMiddleware");

router.use(protect);

router.route("/").get(getTodos).post(validateCreateTodo, validate, createTodo);

router
  .route("/:id")
  .get(getTodo)
  .put(validateUpdateTodo, validate, updateTodo)
  .delete(deleteTodo);

module.exports = router;
