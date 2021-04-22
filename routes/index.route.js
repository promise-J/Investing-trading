const express = require("express");
const passport = require("../services/passport");
const router = express.Router();
const { requiresAuth } = require("../utils");
const { User } = require('../models/user.model')

router.get("/", async function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.get("/create-account", function (req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/account");
  }
  res.render("create-account", { title: "SignUp" });
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


// router('/login/forget-password')
//   .get(async function(req, res){
//     res.json({msg: 'forget password'})
//   })
//   .post(async function(req, res){
    
//   })


// router('/login/reset-password')
//   .get(async function(req, res){
//     res.json({msg: 'forget password'})
//   })
//   .post(async function(req, res){
    
//   })

router.get('/login/forgot-password', async (req, res, next)=> {
  res.render("forgot-password")
})

router.post('/login/forgot-password', async (req, res, next)=> {
  const { email } = req.body
  res.send(email)

  
  const test = User.find({email: email})
  if(!test){
    res.send(email)
  }
  res.send('worked')
})

router.get('/login/reset-password', async (req, res, next)=> {
  res.render('reset-password')
})

router.post('/login/reset-password', async (req, res, next)=> {
  
})


router.get("/logout", requiresAuth, function (req, res, next) {
  req.logout();
  req.session.destroy();
  res.redirect("/account");
});

router.get("/account", requiresAuth, function (req, res, next) {
  console.log(req.user);
  res.render("account", { title: "Express" });
});

router.get("/settings", requiresAuth, function (req, res, next) {
  res.render("settings", { title: "Express" });
});

router.get("/referals", requiresAuth, function (req, res, next) {
  res.render("referals", { title: "Express" });
});

module.exports = router;
