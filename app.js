const path = require("path");
const express = require("express"),
  session = require("express-session"),
  { flash } = require("express-flash-message");

const mongoose = require("./services/mongoose"),
  passport = require("./services/passport");

const { port, mongo, secretKey, host } = require("./config");
const ejs = require("ejs");
const db = mongoose.connection;
const app = express();

app.set("port", port);
app.set("views", __dirname + "/views");

app.engine("ejs", (filename, payload = {}, cb) => {
  ejs.renderFile(filename, { ...payload, host }, {}, cb);
});
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "public")));
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

app.use("/", require("./routes"));

db.once("connected", function () {
  return console.log(`🍃 connected to ${mongo.uri}`);
});

app.listen(port, () => {
  console.log(`🚀 listening at http://localhost:${port}`);
});
