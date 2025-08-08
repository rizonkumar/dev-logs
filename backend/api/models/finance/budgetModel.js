const mongoose = require("mongoose");

const financeBudgetSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FinanceCategory",
      required: true,
      index: true,
    },
    month: {
      type: Number,
      required: true,
      min: 1,
      max: 12,
      index: true,
    },
    year: {
      type: Number,
      required: true,
      min: 2000,
      max: 2100,
      index: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      default: "USD",
      trim: true,
      uppercase: true,
    },
  },
  { timestamps: true }
);

financeBudgetSchema.index(
  { user: 1, category: 1, month: 1, year: 1 },
  { unique: true }
);

module.exports = mongoose.model("FinanceBudget", financeBudgetSchema);
