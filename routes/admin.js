const express = require("express");
const { User } = require("../models/user.model");
const { Transaction } = require("../models/transaction.model");
const { Plan } = require("../models/plan.model");

const ejs = require("ejs");
const { requiresAdmin } = require("../utils");
const router = express.Router();

router.use(requiresAdmin);

router
  .route("/")
  .get(async function (req, res, next) {
    console.log(req.body);
    res.render("admin/index", { title: "admin" });
  })
  .post(async function (req, res) {
    console.log(req.body);
    return res.redirect("/admin/");
  });

router
  .route("/withdrawal_request")
  .get(async function (req, res, next) {
    const pendingWithdrawals = await Transaction.find({
      type: "withdraw",
      status: "PENDING",
    })
      .populate("user")
      .lean()
      .exec();

    res.render("admin/withdrawal_request", {
      title: "admin",
      entries: pendingWithdrawals,
      keys: [
        "username",
        "email",
        "amount",
        "currency",
        "status",
        "transactionId",
        "created_on",
      ],
    });
  })
  .post(async function (req, res) {
    console.log(req.body);
    return res.redirect("/admin/withdrawal_request");
  });

router
  .route("/deposited_orders")
  .get(async function (req, res, next) {
    const pendingWithdrawals = await Transaction.find({
      type: "deposit",
      status: "PENDING",
    })
      .populate("user")
      .lean()
      .exec();

    res.render("admin/deposited_orders", {
      title: "admin",
      entries: pendingWithdrawals,
      keys: [
        "username",
        "email",
        "amount",
        "currency",
        "status",
        "transactionId",
        "created_on",
      ],
    });
  })
  .post(async function (req, res) {
    console.log(req.body);
    return res.redirect("/admin/deposited_orders");
  });

module.exports = router;
