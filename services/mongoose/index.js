const { mongo } = require("../../config");
const mongoose = require("mongoose");

Object.keys(mongo.options || {}).forEach((key) => {
  mongoose.set(key, mongo.options[key]);
});

mongoose.connection.on("error", (err) => {
  console.error(`MongoDB connection error ${err}`);
  process.exit(-1);
});

module.exports = mongoose;
