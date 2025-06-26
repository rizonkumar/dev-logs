const asyncHandler = require("../middleware/asyncHandler");
const githubService = require("../services/githubService");

const getContributions = asyncHandler(async (req, res) => {
  const username = process.env.GITHUB_USERNAME;
  const token = process.env.GITHUB_TOKEN;

  if (!username || !token) {
    res.status(500);
    throw new Error("GitHub username or token not configured in .env file");
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
