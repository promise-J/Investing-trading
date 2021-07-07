const path = require("path");
const express = require("express"),
  session = require("express-session"),
  { flash } = require("express-flash-message");
const MongoDBStore = require("connect-mongodb-session")(session);

const mongoose = require("./services/mongoose"),
  passport = require("./services/passport");

const ejs = require("ejs");
const { port, mongo, secretKey, host } = require("./config");

const db = mongoose.connection;
const app = express();

const store = new MongoDBStore({
  uri: mongo.uri,
  collection: "mySessions",
});

store.on("error", function (error) {
  console.log(error);
});

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
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
    },
    store: store,
    resave: false,
    saveUninitialized: true,
  })
);

app.use(flash({ sessionKeyName: "flashMessage", useCookieSession: true }));

app.use(passport.initialize());
app.use(passport.session());

app.use("/", require("./routes"));
app.use("/admin", require("./routes/admin"));

db.once("connected", function () {
  return console.log(`🍃 connected to ${mongo.uri}`);
});

app.listen(port, () => {
  console.log(`🚀 listening at http://localhost:${port}`);
});
