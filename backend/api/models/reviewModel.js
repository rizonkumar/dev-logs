const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    weekOf: {
      type: Date,
      required: true,
    },
    accomplishments: {
      type: String,
      required: [true, "Please list your accomplishments"],
      trim: true,
    },
    challenges: {
      type: String,
      required: [true, "Please list your challenges"],
      trim: true,
    },
    nextWeekPriorities: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

reviewSchema.index({ user: 1, weekOf: 1 }, { unique: true });

module.exports = mongoose.model("Review", reviewSchema);
