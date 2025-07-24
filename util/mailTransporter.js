
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host:process.env.MAIL_HOST || "",
  port:process.env.MAIL_PORT || 110,
  secure:true,
  auth: {
    user: process.env.MAIL_USER || "something@something.com",
    pass: process.env.MAIL_PASSWORD || ""
  }
});

module.exports = transporter;