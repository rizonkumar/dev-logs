const mongoose = require("mongoose");

const INCOME_TYPES = [
  "FULL_TIME",
  "FREELANCE",
  "CONTRACT",
  "RSU",
  "SIDE_PROJECT",
  "SPONSORSHIP",
  "OTHER",
];

const TRANSACTION_TYPES = ["INCOME", "EXPENSE"];
const TRANSACTION_STATUS = ["POSTED", "SCHEDULED"];

const financeTransactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: TRANSACTION_TYPES,
      required: true,
      index: true,
    },
    incomeType: {
      type: String,
      enum: INCOME_TYPES,
      default: undefined,
    },
    amount: {
      type: Number,
      required: true,
      min: [0, "Amount must be non-negative"],
    },
    currency: {
      type: String,
      default: "USD",
      trim: true,
      uppercase: true,
    },
    transactionDate: {
      type: Date,
      required: function () {
        return this.status === "POSTED";
      },
    },
    status: {
      type: String,
      enum: TRANSACTION_STATUS,
      default: "POSTED",
      index: true,
    },
    dueDate: {
      type: Date,
      required: function () {
        return this.status === "SCHEDULED";
      },
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FinanceCategory",
      required: true,
      index: true,
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FinanceProject",
      default: undefined,
      index: true,
    },
    isBusinessExpense: {
      type: Boolean,
      default: false,
      index: true,
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

financeTransactionSchema.pre("validate", function (next) {
  if (this.type === "INCOME" && !this.incomeType) {
    this.incomeType = "OTHER";
  }
  if (this.status === "POSTED" && !this.transactionDate) {
    this.invalidate(
      "transactionDate",
      "transactionDate is required for POSTED transactions"
    );
  }
  if (this.status === "SCHEDULED" && !this.dueDate) {
    this.invalidate(
      "dueDate",
      "dueDate is required for SCHEDULED transactions"
    );
  }
  next();
});

financeTransactionSchema.index({ user: 1, transactionDate: -1 });
financeTransactionSchema.index({ user: 1, dueDate: 1 });

module.exports = mongoose.model("FinanceTransaction", financeTransactionSchema);
