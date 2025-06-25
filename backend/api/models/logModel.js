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
  },
  {
    timestamps: true,
  }
);

const Log = mongoose.model("Log", logSchema);

module.exports = mongoose.model("Log", logSchema);
