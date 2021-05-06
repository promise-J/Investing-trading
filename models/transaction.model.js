const mongoose = require("../services/mongoose");

const TransctionSchema = mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ["withdraw", "deposit", "bonus", "referral"],
  },
  currency: {
    type: String,
    default: "cash",
    enum: ["bitcoin", "eth", "cash"],
  },
  status: {
    type: String,
    default: "PENDING",
    enum: ["AVAILABLE", "LOCKED", "PENDING", "DECLINED", "WITHDRAWN"],
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  amount: {
    type: Number,
    required: true,
  },
  // plan: { type: mongoose.Schema.Types.ObjectId, ref: "Plan" },
  transactionId: String,
  created_on: {
    type: Date,
    default: Date.now,
  },
});

const Transaction = mongoose.model("Transaction", TransctionSchema);

module.exports = { Transaction };
