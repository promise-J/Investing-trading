const express = require("express");
const { User } = require("../models/user.model");
const { requiresAuth } = require("../utils");
const router = express.Router();

router.post("/", async function (req, res, next) {
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
    // console.log(err);
    if (err.name === "MongoError" && err.code === 11000) {
      await req.flash(
        "error",
        `${Object.keys(err.keyValue)[0]} already exists`
      );
      res.redirect("/create-account");
    }
  }
});

router.use(requiresAuth);

module.exports = router;
