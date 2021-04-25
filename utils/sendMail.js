const nodemailer = require("nodemailer");

const { emailAuthUser, emailAuthPass, emailSender } = require("../config");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: emailAuthUser,
    pass: emailAuthPass,
  },
});

async function sendMail(html, ...recipients) {
  await transporter.sendMail({
    from: emailSender,
    to: recipients,
    subject: "Password Reset Request ",
    html,
  });
}

module.exports = sendMail;
