const nodemailer = require("nodemailer");
const emailTemplates = require("./emailTemplates/index.js");

exports.sendMail = (name, email, token) => {
  if (process.env.EMAIL_VERIFICATION_ENABLED === "false") {
    console.log("Email verfication disabled");
    return;
  }
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: "AnimeHub Account Verification",
    html: emailTemplates.accountVerification(name, token),
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email: " + error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};
