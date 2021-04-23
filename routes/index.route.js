const express = require("express");
const passport = require("../services/passport");
const router = express.Router();
const jwt = require('jsonwebtoken')
const { requiresAuth } = require("../utils");
const { User } = require('../models/user.model')
const jwt_secret = process.env.JWT_SECRET
let current_user

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


router.get('/login/forgot-password', async (req, res, next)=> {
  res.render("forgot-password")
})

router.post('/login/forgot-password', async (req, res, next)=> {
  const { email } = req.body
  console.log(email);
  User.findOne({email: email}, function(err, user){
    if(!user) return res.status(401).send('user not found') //user does not exists. 

    // user exists. create a one time link 
    current_user = user
    const secret = jwt_secret+user.password
    const userData = {
      email: user.email,
      id: user.id
    }

    const token = jwt.sign(userData, secret, {expiresIn: '15m'})

    const link = `http://localhost:9000/login/reset-password/${user.id}/${token}`
    console.log(link);
    return res.send('A link has been sent to your email to reset the password')
  })
   
})

router.get(`/login/reset-password/:id/:token`, async (req, res, next)=> {
  const {id, token} = req.params
  res.send(req.params)
  // res.render('reset-password')
  // check if id exists in user's data base
  console.log(current_user)
  if(id !== current_user.id) {
    res.send('id is not available')
    return
  }

  // here id exists
  const secret = jwt_secret+current_user.password
  try {    
    const userData = jwt.verify(token, secret)
    res.render('reset-password', {email: current_user.email})
  } catch (error) {
    console.log(error.message);
    res.status(401).send(error.message)
  }

})

router.post('/login/reset-password/:id/:token', async (req, res, next)=> {
   const { id, token } = rq.params
   const {password, password2} = req.body
   if(id !== current_user.id){
     res.send('user id is not valid')
     return
   }

   const secret = jwt_secret+current_user.password
   try {
     const userData = jwt.verify(token, secret)
     if(password!== password2) return 
    //  since we used the email and id to create the userData, we would find the user and update the password
    current_user.paassword = password
    res.send(current_user)
   } catch (error) {
     res.send(error.message)
   }
  //  res.send(current_user)
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
