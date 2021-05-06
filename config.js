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
    plans: [
      {
        name: "starter",
        desc: "1.5% after 24 hours",
        priceRange: "$100.00 - $49900.00",
        min: 100,
        max: 4990,
        profit: 1.5,
        default: true,
      },
      {
        name: "gold",
        desc: "3.5% after 24 hours",
        priceRange: "$50000.00 - $199900.00",
        min: 5000,
        max: 19990,
        profit: 3.5,
      },
      {
        name: "platinium",
        desc: "5% after 24 hours",
        priceRange: "$200000.00 - $599999.00",
        min: 20000,
        max: 59990,
        profit: 5.5,
      },
      {
        name: "diamond",
        desc: "7% after 48 hours",
        priceRange: "$600000.00 and more",
        min: 60000,
        profit: 7,
      },
    ],
    mongo: {
      uri: requireProcessEnv("DB_URI"),
      options: {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
      },
    },
    emailAuthUser: requireProcessEnv("AUTH_USER"),
    emailAuthPass: requireProcessEnv("AUTH_PASS"),
    emailSender: requireProcessEnv("EMAIL_SENDER"),
    host: requireProcessEnv("HOST"),
    jwt_secret: requireProcessEnv("JWT_SECRET"),
    // payeeAccount: requireProcessEnv("PAYEE_ACCOUNT"),
    // payeeName: requireProcessEnv("PAYEE_NAME"),
  },
  development: {},
  production: {},
};

module.exports = { ...config.all, ...config[Environment], Environment };
