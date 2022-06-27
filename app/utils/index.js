"use strict";
require("dotenv").config();
const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function sendEmail() {
    var htmlMessage = `You have raised password reset request. Please click on below URL to reset Password
                      <a href="${process.env.FRONTEND_URL}/pages/auth/resetPwd/${encryptText}"> Verify our Account</a>`;

    const message = {
      to: toEmail,
      from: process.env.SENDER_EMAIL,
      subject: "Password Reset",
      html: htmlMessage,
    };

    console.log("testing")
    return sgMail.send(message);

}

module.exports = { sendEmail };
