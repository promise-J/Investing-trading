const express = require("express"),
  path = require("path"),
  session = require("express-session");

const mongoose = require("./services/mongoose");

const { port, mongo, secretKey } = require("./config");

const db = mongoose.createConnection(mongo.uri);
const app = express();

app.set("port", port);
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: secretKey,
    name: "sessionId",
    resave: false,
    saveUninitialized: true,
  })
);

app.use("/", require("./routes/index.route"));
app.use("/users", require("./routes/users.route"));
app.use("/transactions", require("./routes/transactions.route."));

db.once("connected", function () {
  return console.log(`Successfully connected to ${mongo.uri}`);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
