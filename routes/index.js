const express = require("express");
const passport = require("../services/passport");
const jwt = require("jsonwebtoken");
const ejs = require("ejs");

const router = express.Router();
const { requiresAuth, sendMail } = require("../utils");
const { User } = require("../models/user.model");
const { plans, host, jwt_secret } = require("../config");

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

    let user = await new User({
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

router
  .route("/forgot-password")
  .get(async (req, res, next) => {
    res.render("forgot-password", { title: "forgot password" });
  })
  .post(async (req, res, next) => {
    const { email } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user) {
        console.log("no user");
        await req.flash("error", "email noneexistent");
        return res.status(400).redirect("/forgot-password");
      }
      const { username, id } = user;

      const token = await jwt.sign({ email, id }, jwt_secret, {
        expiresIn: "15m",
      });
      const link = `${host}/reset-password/${token}`;

      const html = `
    <p>Hello <%= username %>,</p>
    <p>Please confirm your request to reset password</p>
    <p>Click on the link below</p>
    <p>
    <a href="<%= link %>"><%= link %></a>
  </p>
    <p>Thank you</p>
    <a href="">stead-fast.com</a>
    `;

      sendMail(ejs.render(html, { link, username }), email);

      res.render("info-reset", { title: "Email reset", email });
    } catch (error) {
      console.log(error);
    }
  });

router
  .route("/reset-password/:token")
  .get(async (req, res, next) => {
    const { token } = req.params;
    const { email } = jwt.verify(token, jwt_secret);

    try {
      res.render("reset-password", { email: email, title: "password reset" });
    } catch (error) {
      console.log(error.message);
      res.status(401).send(error.message);
    }
  })
  .post(async (req, res, next) => {
    const { token } = req.params;
    const { password, password2 } = req.body;

    try {
      const { email } = jwt.verify(token, jwt_secret);
      if (password !== password2) return;
      const user = await User.findOne({ email: email });
      if (!user) {
        res.send("not found");
      }

      user.password = user.generateHash(password);
      await user.save();

      res.redirect("/login");
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

router
  .route("/deposit")
  .get(requiresAuth, function (req, res, next) {
    res.render("deposit", { title: "deposit", plans });
  })
  .post(requiresAuth, function (req, res, next) {
    console.log(req.body);
    res.redirect("/");
  });

router.get("/settings", requiresAuth, async function (req, res, next) {
  const user = await User.findOne({email: req.user.email})
  
  console.log(user);
  res.render("settings", { title: "settings", user });
})
.post("/settings", requiresAuth, async (req, res, next)=>{
  const currUser = await User.findOne({email: req.user.email})
   const {pass, pass2, email, username } = req.body
   if(pass != pass2) return req.flash('error', 'passwords dont match!')
   
   const updateMany = {
     email: email,
     username: username,
     password: new User.generateHash(password)
   }

   const existing = {
     email: currUser.email,
     username: currUser.username,
     password: currUser.password
   }

   const Hashpassword = currUser.generateHash(pass)
   currUser.password = Hashpassword

   try {
     await currUser.save()
     req.flash('success', 'Password updated')
   } catch (error) {
     req.flash('error', 'error occured')
   }
   res.send('setting worked...')
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
