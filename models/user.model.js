const mongoose = require("../services/mongoose");
const bcrypt = require("bcryptjs");
const UserSchema = mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  perfectMoneyAccount: {
    type: String,
  },
  etherumAddress: {
    type: String,
  },
  bitcoinAddress: {
    type: String,
  },
  secretQuestion: {
    type: String,
  },
  secretAnswer: {
    type: String,
  },

  created_on: {
    type: Date,
    default: Date.now,
  },
  userPlan: {
    type: String,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
});

UserSchema.methods.generateHash = function (password) {
  const salt = bcrypt.genSaltSync(10);

  return bcrypt.hashSync(password, salt);
};

// Returns object fields that can be altered
UserSchema.methods.flexibleFields = function () {
  const obj = {};
  let fields = [
    "fullName",
    "perfectMoneyAccount",
    "bitcoinAddress",
    "etherumAddress",
    "email",
  ];
  fields.forEach((f) => (obj[f] = this[f]));

  return obj;
};

UserSchema.methods.verifyPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

UserSchema.methods.getAccountBalance = async function () {
  const value = await this.model("Transaction").aggregate([
    {
      $match: {
        user: this._id,
        status: { $in: ["AVAILABLE", "WITHDRAWN"] },
      },
    },
    {
      $group: {
        _id: null,
        amount: {
          $sum: {
            $cond: [
              { $eq: ["$type", "deposit"] },
              "$amount",
              { $multiply: ["$amount", -1] },
            ],
          },
        },
      },
    },
  ]);

  return value[0].amount;
};

UserSchema.methods.getLockedDepositsBalance = async function () {
  const value = await this.model("Transaction").aggregate([
    {
      $match: {
        user: this._id,
        type: "deposit",
        status: { $eq: "LOCKED" },
      },
    },
    {
      $group: {
        _id: null,
        amount: {
          $sum: "$amount",
        },
      },
    },
  ]);

  return value[0].amount;
};

UserSchema.methods.getWithdrawnBalance = async function () {
  const value = await this.model("Transaction").aggregate([
    {
      $match: {
        user: this._id,
        type: "withdraw",
        status: { $eq: "WITHDRAWN" },
      },
    },
    {
      $group: {
        _id: null,
        amount: {
          $sum: "$amount",
        },
      },
    },
  ]);

  return value[0].amount;
};

UserSchema.methods.getPendingWithdrawBalance = async function () {
  const value = await this.model("Transaction").aggregate([
    {
      $match: {
        user: this._id,
        type: "withdraw",
        status: { $eq: "PENDING" },
      },
    },
    {
      $group: {
        _id: null,
        amount: {
          $sum: "$amount",
        },
      },
    },
  ]);

  return value[0].amount;
};

// UserSchema.methods.getEarnedBalance = async function () {
//   const value = await this.model("Transaction").aggregate([
//     {
//       $match: {
//         user: this._id,
//         type: "withdraw",
//         status: { $eq: "PENDING" },
//       },
//     },
//     {
//       $group: {
//         _id: null,
//         amount: {
//           $sum: "$amount",
//         },
//       },
//     },
//   ]);

//   return value[0].amount;
// };
//=
const User = mongoose.model("User", UserSchema);

module.exports = { User };
