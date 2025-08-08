const express = require("express");
const router = express.Router();
const {
  contractVsFullTime,
  fireCalculator,
} = require("../../controllers/finance/calculatorController");

// Public calculators, no auth
router.post("/contract-vs-fulltime", contractVsFullTime);
router.post("/fire", fireCalculator);

module.exports = router;
