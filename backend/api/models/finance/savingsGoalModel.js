const mongoose = require("mongoose");

const contributionSchema = new mongoose.Schema(
  {
    amount: { type: Number, required: true, min: 0 },
    date: { type: Date, required: true },
    note: { type: String, trim: true, default: "" },
    transaction: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FinanceTransaction",
    },
  },
  { _id: false }
);

const savingsGoalSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    name: { type: String, required: true, trim: true },
    targetAmount: { type: Number, required: true, min: 0 },
    targetDate: { type: Date },
    contributions: { type: [contributionSchema], default: [] },
  },
  { timestamps: true }
);

savingsGoalSchema.virtual("currentAmount").get(function () {
  return (this.contributions || []).reduce(
    (sum, c) => sum + (c.amount || 0),
    0
  );
});

module.exports = mongoose.model("FinanceSavingsGoal", savingsGoalSchema);
