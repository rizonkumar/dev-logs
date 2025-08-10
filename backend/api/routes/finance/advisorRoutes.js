const express = require("express");
const router = express.Router();
const { protect } = require("../../middleware/authMiddleware");
const { getAdvice } = require("../../controllers/finance/advisorController");

router.use(protect);

router.post("/", getAdvice);

module.exports = router;
