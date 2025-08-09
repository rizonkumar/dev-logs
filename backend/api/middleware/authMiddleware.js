const asyncHandler = require("./asyncHandler");
const { clerkClient, requireAuth } = require("@clerk/express");
const User = require("../models/userModel");

const protect = [
  requireAuth(),
  asyncHandler(async (req, res, next) => {
    const clerkUserId = req.auth.userId;
    if (!clerkUserId) {
      res.status(401);
      throw new Error("Not authorized");
    }

    let user = await User.findOne({ clerkId: clerkUserId }).select("-password");
    if (!user) {
      const clerkUser = await clerkClient.users.getUser(clerkUserId);
      const primaryEmail = clerkUser.emailAddresses?.[0]?.emailAddress || "";

      const existingByEmail = primaryEmail
        ? await User.findOne({ email: primaryEmail }).select("-password")
        : null;

      if (existingByEmail) {
        existingByEmail.clerkId = clerkUserId;
        await existingByEmail.save();
        user = existingByEmail;
      } else {
        const created = await User.create({
          clerkId: clerkUserId,
          name: clerkUser.firstName || clerkUser.username || "User",
          email: primaryEmail,
          password: Math.random().toString(36).slice(2) + "_CLERK",
        });
        user = await User.findById(created._id).select("-password");
      }
    }

    req.user = user;
    next();
  }),
];

module.exports = { protect };
