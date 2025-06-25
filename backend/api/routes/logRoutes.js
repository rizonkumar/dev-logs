const express = require("express");

const router = express.Router();

const { getLogs, createLog } = require("../controllers/logController.js");
const { validateCreateLog } = require("../validators/logValidator.js");
const validate = require("../middleware/validationMiddleware.js");

router.get("/", getLogs);
router.post("/", validateCreateLog, validate, createLog);

module.exports = router;
