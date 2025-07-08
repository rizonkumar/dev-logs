const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema(
  {
    task: {
      type: String,
      required: [true, "Please add a task"],
      trim: true,
    },
    status: {
      type: String,
      enum: ["TODO", "IN_PROGRESS", "IN_REVIEW", "DONE"],
      default: "TODO",
      required: true,
    },
    isCompleted: {
      type: Boolean,
      required: true,
      default: false,
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
    // user: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   required: true,
    //   ref: 'User',
    // },
  },
  {
    timestamps: true,
  }
);

const Todo = mongoose.model("Todo", todoSchema);

module.exports = Todo;
