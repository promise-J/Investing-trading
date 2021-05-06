const express = require("express");
const { User } = require("../models/user.model");
const { Transaction } = require("../models/transaction.model");
const { Plan } = require("../models/plan.model");

const ejs = require("ejs");
const { requiresAdmin } = require("../utils");
const router = express.Router();

router.use(requiresAdmin);

router.get("/", async function (req, res, next) {
  res.render("admin/index", { title: "admin" });
});

module.exports = router;
