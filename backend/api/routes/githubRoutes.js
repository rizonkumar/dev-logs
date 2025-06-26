const express = require("express");
const router = express.Router();

const { getContributions } = require("../controllers/githubController");

router.get("/contributions", getContributions);

module.exports = router;
