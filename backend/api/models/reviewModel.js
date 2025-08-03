const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    weekOf: {
      type: Date,
      required: true,
      unique: true,
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

module.exports = mongoose.model("Review", reviewSchema);
