const asyncHandler = require("../middleware/asyncHandler");
const githubService = require("../services/githubService");

const getContributions = asyncHandler(async (req, res) => {
  const username = req.user.githubUsername;
  const token = req.user.githubToken;

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
