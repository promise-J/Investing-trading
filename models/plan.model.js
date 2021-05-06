const mongoose = require("../services/mongoose");

const planSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  desc: {
    type: String,
    required: true,
  },

  default: {
    type: Boolean,
    default: false,
  },
  min: {
    type: Number,
  },
  max: {
    type: Number,
  },

  profit: {
    type: Number,
    required: true,
  },

  deposits: [{ type: mongoose.Schema.Types.ObjectId, ref: "Transaction" }],

  created_on: {
    type: Date,
    default: Date.now,
  },
});

const Plan = mongoose.model("Plan", planSchema);

module.exports = { Plan };
