const mongoose = require("mongoose");

const logSchema = new mongoose.Schema(
  {
    entry: {
      type: String,
      required: [true, "Please add a log entry"],
    },
    date: {
      type: Date,
      required: [true, "Please provide a date for the log entry"],
    },
    tags: {
      type: [String],
      default: [],
      validate: {
        validator: function (v) {
          return v.every(
            (tag) =>
              typeof tag === "string" &&
              tag.trim().length > 0 &&
              tag.length <= 30
          );
        },
        message:
          "Each tag must be a non-empty string with maximum 30 characters",
      },
    },
  },
  {
    timestamps: true,
  }
);

const Log = mongoose.model("Log", logSchema);

module.exports = mongoose.model("Log", logSchema);
