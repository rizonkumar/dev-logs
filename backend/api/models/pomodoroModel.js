const mongoose = require("mongoose");

const pomodoroSchema = new mongoose.Schema(
  {
    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Todo",
    },
    status: {
      type: String,
      enum: ["COMPLETED", "INTERRUPTED"],
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    startTime: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Pomodoro = mongoose.model("Pomodoro", pomodoroSchema);

module.exports = Pomodoro;
