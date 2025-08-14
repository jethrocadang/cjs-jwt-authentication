// utils/templates/verify-email-template.js

module.exports = function verifyEmailTemplate({ firstName, link }) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <title>Verify Your Email</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f6f9fc;
          color: #333;
          padding: 0;
          margin: 0;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #ffffff;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
        }
        h1 {
          font-size: 20px;
          color: #111;
        }
        p {
          font-size: 16px;
          line-height: 1.5;
        }
        a.button {
          display: inline-block;
          background-color: #4CAF50;
          color: white;
          padding: 12px 20px;
          text-decoration: none;
          border-radius: 5px;
          font-weight: bold;
        }
        .footer {
          margin-top: 20px;
          font-size: 12px;
          color: #777;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Email Verification</h1>
        <p>Hi ${firstName || "there"},</p>
        <p>Thanks for signing up! Please verify your email address by clicking the button below:</p>
        <p style="text-align: center;">
          <a class="button" href="${link}" target="_blank">Verify Email</a>
        </p>
        <p>If the button above doesn't work, you can also copy and paste the following link into your browser:</p>
        <p><a href="${link}">${link}</a></p>
        <p class="footer">If you did not create this account, you can safely ignore this email.</p>
      </div>
    </body>
    </html>
  `;
};
