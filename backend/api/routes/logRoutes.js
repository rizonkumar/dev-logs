const express = require("express");

const router = express.Router();

const {
  getLogs,
  createLog,
  updateLog,
  deleteLog,
} = require("../controllers/logController.js");
const {
  validateCreateLog,
  validateUpdateLog,
} = require("../validators/logValidator.js");
const validate = require("../middleware/validationMiddleware.js");

router.route("/").get(getLogs).post(validateCreateLog, validate, createLog);

router
  .route("/:id")
  .put(validateUpdateLog, validate, updateLog)
  .delete(deleteLog);

module.exports = router;
