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
        profit: 1.5,
      },
      {
        name: "gold",
        desc: "3.5% after 24 hours",
        priceRange: "$50000.00 - $199900.00",
        profit: 3.5,
      },
      {
        name: "platinium",
        desc: "5% after 24 hours",
        priceRange: "$200000.00 - $599999.00",
        profit: 5.5,
      },
      {
        name: "diamond",
        desc: "7% after 48 hours",
        priceRange: "$600000.00 and more",
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
  },
  development: {},
  production: {},
};

module.exports = { ...config.all, ...config[Environment], Environment };
