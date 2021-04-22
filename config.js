const path = require("path");

const Environment = process.env.NODE_ENV || "development";

if (process.env.NODE_ENV !== "production") {
  /**
   * @dot-env
   * the package ensures both the .env and .env.example files are in sync
   *
   */
  const dotenv = require("dotenv-safe");
  dotenv.config({
    path: path.join(__dirname, ".env"),
    example: path.join(__dirname, ".env.example"),
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
      uri: "mongodb://localhost/Investing-trading",
      options: {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useCreateIndex: true,
      },
    },
  },
  production: {
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
};

module.exports = { ...config.all, ...config[Environment] };
