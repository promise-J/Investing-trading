const express = require("express");
const passport = require("../services/passport");
const router = express.Router();
const { requiresAuth } = require("../utils");
const { User } = require("../models/user.model");

router.get("/", async function (req, res, next) {
  res.render("index", { title: "Express" });
});

router
  .route("/create-account")
  .get(function (req, res, next) {
    if (req.isAuthenticated()) {
      return res.redirect("/account");
    }
    res.render("create-account", { title: "SignUp" });
  })
  .post(async function (req, res, next) {
    const { password, ...rest } = req.body;

    let user = new User({
      ...rest,
    });

    const hash = user.generateHash(password);
    user.password = hash;

    try {
      user = await user.save();
      await req.flash(
        "success",
        "Account created Successfully. Please Protect your Login Details"
      );
      res.redirect("/login");
    } catch (err) {
      console.log(err);
      if (err.name === "MongoError" && err.code === 11000) {
        await req.flash(
          "error",
          `${Object.keys(err.keyValue)[0]} already exists`
        );
        return res.redirect("/create-account");
      }
      res.redirect("/create-account");
    }
  });

router
  .route("/login")
  .get(async function (req, res, next) {
    if (req.isAuthenticated()) {
      return res.redirect("/account");
    }
    const messages = await req.consumeFlash("success");
    res.render("login", { title: "Login", messages });
  })
  .post(async function (req, res, next) {
    passport.authenticate("local", async function (err, user, info) {
      if (err) {
        return next(err); // will generate a 500 error
      }
      if (!user) {
        return res
          .status(409)
          .render("login", { errMsg: "Invalid Credentials" });
      }
      req.login(user, function (err) {
        if (err) {
          console.error(err);
          return next(err);
        }
        return res.redirect("/account");
      });
    })(req, res, next);
  });

router.get("/forgot-password", async (req, res, next) => {
  res.render("forgot-password");
});

router.post("/forgot-password", async (req, res, next) => {
  const { email } = req.body;
  res.send(email);

  const test = User.find({ email: email });
  if (!test) {
    res.send(email);
  }
  res.send("worked");
});

router.get("/reset-password", async (req, res, next) => {
  res.render("reset-password");
});

router.post("/reset-password", async (req, res, next) => {});

router.get("/logout", requiresAuth, function (req, res, next) {
  req.logout();
  req.session.destroy();
  res.redirect("/account");
});

router.get("/account", requiresAuth, function (req, res, next) {
  console.log(req.user);
  res.render("account", { title: "Account" });
});

router.get("/settings", requiresAuth, function (req, res, next) {
  res.render("settings", { title: "Settings" });
});

router.get("/referrals", requiresAuth, function (req, res, next) {
  res.render("referrals", { title: "referrals" });
});

module.exports = router;
