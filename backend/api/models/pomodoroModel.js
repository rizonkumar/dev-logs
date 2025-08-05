const mongoose = require("mongoose");

const pomodoroSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Todo",
    },
    sessionType: {
      type: String,
      enum: ["WORK", "BREAK"],
      required: true,
      default: "WORK",
    },
    tag: {
      type: String,
      trim: true,
    },
    duration: {
      type: Number,
      required: true,
      default: 25,
    },
    startTime: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["COMPLETED", "IN_PROGRESS"],
      default: "IN_PROGRESS",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Pomodoro", pomodoroSchema);
