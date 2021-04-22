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
});

UserSchema.methods.generateHash = function (password) {
  const salt = bcrypt.genSaltSync(10);

  return bcrypt.hashSync(password, salt);
};

UserSchema.methods.verifyPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};
//=
const User = mongoose.model("User", UserSchema);

module.exports = { User };
