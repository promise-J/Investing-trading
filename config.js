const path = require("path");

const Environment = process.env.NODE_ENV || "development";

if (process.env.NODE_ENV !== "production") {
  const dotenv = require("dotenv");
  dotenv.config({
    path: path.join(__dirname, ".env"),
  });
}

const requireProcessEnv = (name) => {
  if (!process.env[name]) {
    throw new Error(`You must set the  ${name}  environment variable`);
  }
  return process.env[name];
};

const config = {
  all: {
    port: process.env.PORT || 9000,
    secretKey: requireProcessEnv("SECRET"),
    mongo: {
      uri: requireProcessEnv("DB_URI"),
      options: {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
      },
    },
  },
  development: {},
  production: {},
};

module.exports = { ...config.all, ...config[Environment], Environment };
