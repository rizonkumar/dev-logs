const asyncHandler = require("../middleware/asyncHandler");
const githubService = require("../services/githubService");
const User = require("../models/userModel");

const getContributions = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    res.status(404);
    throw new Error("User not found.");
  }

  const username = user.githubUsername;
  const token = user.githubToken;

  if (!username || !token) {
    res.status(400);
    throw new Error("GitHub username or token not configured in user profile.");
  }

  const contributionData = await githubService.getContributionData(
    username,
    token
  );

  res.status(200).json(contributionData);
});

module.exports = {
  getContributions,
};
