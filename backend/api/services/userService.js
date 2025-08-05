const User = require("../models/userModel");

const createUser = async (userData) => {
  const { name, email, password } = userData;
  const userExists = await User.findOne({ email });
  if (userExists) {
    const error = new Error("User already exists");
    error.statusCode = 400;
    throw error;
  }
  const user = await User.create({ name, email, password });
  return user;
};

const authenticateUser = async (email, password) => {
  const user = await User.findOne({ email }).select("+password");
  if (user && (await user.matchPassword(password))) {
    return user;
  } else {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }
};

const getUserById = async (userId) => {
  const user = await User.findById(userId).select("-password");

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }
  return user;
};

const updateUserProfile = async (userId, updateData) => {
  const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
    new: true,
    runValidators: true,
  }).select("-password");

  if (!updatedUser) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }
  return updatedUser;
};

module.exports = {
  createUser,
  authenticateUser,
  getUserById,
  updateUserProfile,
};
