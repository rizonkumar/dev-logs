const jwt = require("jsonwebtoken");
const asyncHandler = require("./asyncHandler");
const User = require("../models/userModel");
const { generateAccessToken } = require("../utils/generateToken");

const protect = asyncHandler(async (req, res, next) => {
  let token;
  let refreshToken;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
    refreshToken = req.headers["x-refresh-token"];
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError" && refreshToken) {
      try {
        const decoded = jwt.verify(
          refreshToken,
          process.env.JWT_REFRESH_SECRET
        );
        const user = await User.findById(decoded.id).select("-password");

        if (!user) {
          res.status(401);
          throw new Error("Not authorized, user not found");
        }

        const newAccessToken = generateAccessToken(user._id);

        res.setHeader("x-new-access-token", newAccessToken);

        req.user = user;
        next();
      } catch (refreshError) {
        res.status(401);
        throw new Error("Not authorized, invalid refresh token");
      }
    } else {
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  }
});

module.exports = { protect };
