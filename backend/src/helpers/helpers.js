const nodemailer = require("nodemailer");
require("dotenv").config();

//creating our account
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  secure: process.env.NODE_ENV === "development" ? false : true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.APP_PASSWORD,
  },
});

//sending the mail
const sendMail = async () => {
  const info = await transporter.sendMail({
    from: "Clicon Ecommerce",
    to: "tanjil8778@gmail.com",
    subject: "Confirm Registration",
    html: "<b>Hello world?</b>", // HTML body
  });

  console.log("Message sent:", info.messageId);
};
