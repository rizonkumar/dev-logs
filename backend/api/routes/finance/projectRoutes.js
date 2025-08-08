const express = require("express");
const router = express.Router();
const { protect } = require("../../middleware/authMiddleware");
const validate = require("../../middleware/validationMiddleware");
const {
  validateCreateProject,
  validateUpdateProject,
} = require("../../validators/finance/projectValidator");
const {
  listProjects,
  createProject,
  updateProject,
  deleteProject,
  getProfitability,
} = require("../../controllers/finance/projectController");

router.use(protect);

router
  .route("/")
  .get(listProjects)
  .post(validateCreateProject, validate, createProject);

router
  .route("/:id")
  .put(validateUpdateProject, validate, updateProject)
  .delete(deleteProject);

router.route("/:id/profitability").get(getProfitability);

module.exports = router;
