const mongoose = require("mongoose");

const PROJECT_STATUS = ["ACTIVE", "ARCHIVED"];

const financeProjectSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    name: { type: String, required: true, trim: true },
    client: { type: String, trim: true },
    description: { type: String, trim: true, default: "" },
    status: {
      type: String,
      enum: PROJECT_STATUS,
      default: "ACTIVE",
      index: true,
    },
    startDate: { type: Date },
    endDate: { type: Date },
  },
  { timestamps: true }
);

financeProjectSchema.index({ user: 1, name: 1 }, { unique: true });

module.exports = mongoose.model("FinanceProject", financeProjectSchema);
