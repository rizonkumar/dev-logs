const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    clerkId: { type: String, index: true, unique: true, sparse: true },
    name: { type: String, required: [true, "Please add a name"] },
    email: {
      type: String,
      required: [true, "Please add an email"],
      unique: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please add a valid email",
      ],
    },
    password: {
      type: String,
      required: false,
      minlength: 6,
      select: false,
    },
    profileImage: {
      type: String,
      default: "https://placehold.co/400x400/7c3aed/ffffff?text=User",
    },
    title: { type: String, default: "Software Developer" },
    bio: { type: String, default: "Building the future, one commit at a time" },
    company: { type: String, default: "" },
    portfolioUrl: { type: String, default: "" },
    githubUrl: { type: String, default: "" },
    githubUsername: { type: String, default: "" },
    githubToken: { type: String, default: "" },
    financeCurrency: {
      type: String,
      default: "USD",
      uppercase: true,
      trim: true,
      minlength: 3,
      maxlength: 3,
    },
    pomodoroWorkMinutes: { type: Number, default: 25 },
    pomodoroBreakMinutes: { type: Number, default: 5 },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
