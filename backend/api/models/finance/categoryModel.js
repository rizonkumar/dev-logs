const mongoose = require("mongoose");

const CATEGORY_TYPES = ["INCOME", "EXPENSE"];

const financeCategorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: CATEGORY_TYPES,
      required: true,
      index: true,
    },
    icon: {
      type: String,
      trim: true,
    },
    color: {
      type: String,
      trim: true,
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

financeCategorySchema.index({ user: 1, name: 1, type: 1 }, { unique: true });

module.exports = mongoose.model("FinanceCategory", financeCategorySchema);
