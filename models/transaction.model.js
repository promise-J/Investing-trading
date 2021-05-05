const mongoose = require("../services/mongoose");

const TransctionSchema = mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ["withdraw", "deposit", "referral"],
  },
  user: { type: Schema.Types.ObjectId, ref: "User" },
  amount: {
    type: Number,
    required: true,
  },
  payingAccountId: String,
  created_on: {
    type: Date,
    default: Date.now,
  },
});

TransctionSchema.methods.calculateBalance = function () {};

const Transction = mongoose.model("Transction", TransctionSchema);

module.exports = { Transction };
