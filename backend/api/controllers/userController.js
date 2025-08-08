const asyncHandler = require("../middleware/asyncHandler");
const userService = require("../services/userService");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/generateToken");

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, financeCurrency } = req.body;
  const user = await userService.createUser({
    name,
    email,
    password,
    financeCurrency,
  });
  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      profileImage: user.profileImage,
      title: user.title,
      bio: user.bio,
      company: user.company,
      portfolioUrl: user.portfolioUrl,
      githubUrl: user.githubUrl,
      githubUsername: user.githubUsername,
      githubToken: user.githubToken,
      financeCurrency: user.financeCurrency,
      token: generateAccessToken(user._id),
      refreshToken: generateRefreshToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await userService.authenticateUser(email, password);
  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    profileImage: user.profileImage,
    title: user.title,
    bio: user.bio,
    company: user.company,
    portfolioUrl: user.portfolioUrl,
    githubUrl: user.githubUrl,
    githubUsername: user.githubUsername,
    githubToken: user.githubToken,
    financeCurrency: user.financeCurrency,
    token: generateAccessToken(user._id),
    refreshToken: generateRefreshToken(user._id),
  });
});

const getUserProfile = asyncHandler(async (req, res) => {
  const user = await userService.getUserById(req.user.id);

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    profileImage: user.profileImage,
    title: user.title,
    bio: user.bio,
    company: user.company,
    portfolioUrl: user.portfolioUrl,
    githubUrl: user.githubUrl,
    githubUsername: user.githubUsername,
    githubToken: user.githubToken,
    financeCurrency: user.financeCurrency,
  });
});

const updateUserProfile = asyncHandler(async (req, res) => {
  const updateData = { ...req.body };

  if (req.file) {
    updateData.profileImage = req.file.path;
  }

  const updatedUser = await userService.updateUserProfile(
    req.user.id,
    updateData
  );

  res.json({
    _id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    profileImage: updatedUser.profileImage,
    title: updatedUser.title,
    bio: updatedUser.bio,
    company: updatedUser.company,
    portfolioUrl: updatedUser.portfolioUrl,
    githubUrl: updatedUser.githubUrl,
    githubUsername: updatedUser.githubUsername,
    githubToken: updatedUser.githubToken,
    financeCurrency: updatedUser.financeCurrency,
    token: generateAccessToken(updatedUser._id),
    refreshToken: generateRefreshToken(updatedUser._id),
  });
});

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
};
