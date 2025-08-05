const User = require("../models/userModel");

/**
 * Creates a new user in the database.
 * @param {object} userData - The user data (name, email, password).
 * @returns {Promise<User>} The created user object.
 */
const createUser = async (userData) => {
  const { name, email, password } = userData;

  const userExists = await User.findOne({ email });
  if (userExists) {
    const error = new Error("User already exists");
    error.statusCode = 400;
    throw error;
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  return user;
};

/**
 * Authenticates a user.
 * @param {string} email - The user's email.
 * @param {string} password - The user's password.
 * @returns {Promise<User>} The authenticated user object.
 */
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

/**
 * Finds a user by their ID.
 * @param {string} userId - The ID of the user.
 * @returns {Promise<User>} The found user object.
 */
const getUserById = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }
  return user;
};

module.exports = {
  createUser,
  authenticateUser,
  getUserById,
};
