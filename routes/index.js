const express = require("express");
const passport = require("../services/passport");
const router = express.Router();
const { requiresAuth } = require("../utils");
const { User } = require("../models/user.model");
const { plans } = require("../config");

const jwt = require("jsonwebtoken");
const jwt_secret = process.env.JWT_SECRET;
let current_user;
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
          .render("login", { errMsg: "Invalid Credentials", title: "login" });
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
  res.render("forgot-password", {title: "forgot password"});
});

router.post("/forgot-password", async (req, res, next) => {
  const { email } = req.body;
  console.log(email);
  User.findOne({ email: email }, function (err, user) {
    if (!user) return res.status(401).render("login", {title: 'login', message: "email not found"}); 

    const userData = {
      email: user.email,
      id: user.id,
    };

    const token = jwt.sign(userData, jwt_secret, { expiresIn: "15m" });

    const link = `http://localhost:9000/reset-password/${token}`;
    console.log(link);
    return res.send("A link has been sent to your email to reset the password");
  });
});

router.get(`/reset-password/:token`, async (req, res, next) => {
  const { token } = req.params;
  const {id, email} = jwt.verify(token, jwt_secret)

  try {
    res.render("reset-password", { email: email, title: 'password reset'});
  } catch (error) {
    console.log(error.message);
    res.status(401).send(error.message);
  }
});

router.post("/reset-password/:token", async (req, res, next) => {
  const { token } = req.params;
  const { password, password2 } = req.body;

  try {
    const {email} = jwt.verify(token, jwt_secret);
    if (password !== password2) return;
    const user = await User.findOne({email: email})
    if(!user){
      res.send('not found')
    }

    user.password = user.generateHash(password)
    await user.save()

    res.redirect('/login')
  } catch (error) {
    res.send(error.message);
  }
});

router.get("/logout", requiresAuth, function (req, res, next) {
  req.logout();
  req.session.destroy();
  res.redirect("/account");
});

router.get("/account", requiresAuth, function (req, res, next) {
  res.render("account", { title: "account", user: req.user });
});

router.route("/deposit").get(requiresAuth, function (req, res, next) {
  res.render("deposit", { title: "deposit", plans });
});

router.get("/settings", requiresAuth, function (req, res, next) {
  res.render("settings", { title: "settings" });
});

router.get("/referrals", requiresAuth, function (req, res, next) {
  res.render("referrals", { title: "referrals" });
});

router.get("/deposit_list", requiresAuth, function (req, res, next) {
  res.render("deposit_list", { title: "deposit_list" });
});

router.get("/withdraw", requiresAuth, function (req, res, next) {
  res.render("withdraw", { title: "withdraw" });
});

router.get("/history", requiresAuth, function (req, res, next) {
  res.render("history", { title: "history" });
});

module.exports = router;
