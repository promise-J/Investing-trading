const express = require("express"),
  session = require("express-session"),
  { flash } = require("express-flash-message");

const mongoose = require("./services/mongoose"),
  passport = require("./services/passport");

const { port, mongo, secretKey } = require("./config");

const db = mongoose.connection;
const app = express();

app.set("port", port);
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: secretKey,
    name: "sessionId",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(flash({ sessionKeyName: "flashMessage", useCookieSession: true }));

app.use(passport.initialize());
app.use(passport.session());
app.use("/", require("./routes/index.route"));
app.use("/users", require("./routes/users.route"));
app.use("/transactions", require("./routes/transactions.route"));

db.once("connected", function () {
  return console.log(`🍃 connected to ${mongo.uri}`);
});

app.listen(port, () => {
  console.log(`🚀 listening at http://localhost:${port}`);
});
