// services/email-service.js

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GOOGLE_EMAIL,
    pass: process.env.GOOGLE_APP_PASSWORD,
  },
});

const sendEmail = async ({ to, subject, text, html }) => {
  try {
    const info = await transporter.sendMail({
      from: `no-reply<${process.env.GOOGLE_EMAIL}>`,
      to,
      subject,
      text,
      html,
    });

    console.log("services/email-service.js: Email sent!", info.messageId);
    return info;
  } catch (error) {
    console.error("services/email-service.js", error);
    throw error;
  }
};

module.exports = sendEmail;
