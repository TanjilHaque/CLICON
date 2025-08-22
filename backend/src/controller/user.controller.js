require("dotenv").config();
const User = require("../models/user.model");
const { apiResponse } = require("../uitils/apiResponse");
const { customError } = require("../uitils/customError");
const { asyncHandler } = require("../uitils/asyncHandler");
const {
  validateRegistration,
  validateLogin,
} = require("../validation/user.validation");
const { sendMail } = require("../helpers/helpers");
const { registrationTemplate } = require("../template/template");
const bdPhoneRegex = /^(?:\+8801[3-9]\d{8}|01[3-9]\d{8})$/;
const emailRegex = /^[\w.-]+@[\w.-]+\.[A-Za-z]{2,}$/;

//register the user
exports.registration = asyncHandler(async (req, res) => {
  const value = await validateRegistration(req);
  const { firstName, credential, password } = value;
  //save the user info in database
  const user = await new User({
    firstName,
    credential,
    password,
  }).save();
  if (!user) {
    throw new customError(500, "Retgistration failed try again!");
  }

  //email verification
  if (emailRegex.test(credential)) {
    const verificationUrl = `https://dummyjson.com/`;
    const template = registrationTemplate(firstName, verificationUrl);
    await sendMail(credential, template);
    apiResponse.sendSuccess(res, 201, "Registration successful", {
      firstName,
      credential,
    });
  }
  // phone number verification
  else if (bdPhoneRegex) {
    // will do it later...
  } else {
    console.log("Email or Phone number is not valid.");
  }
});

//login the user
exports.login = asyncHandler(async (req, res) => {
  const value = await validateLogin(req);
  const { credential, password } = value;
  const user = await User.findOne({ credential: credential });
  const isPasswordCorrect = await user.compareHashPassword(password);
  if (!isPasswordCorrect) {
    throw new customError(
      400,
      "Your Email/Phone number or Password is incorrect"
    );
  }

  //make accessToken and refreshToken
  const accessToken = await user.generateAccessToken();
  const refreshToken = await user.generateRefreshToken();

  //handling cookie
  const isProduction = process.env.NODE_ENV === "production";
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: isProduction ? true : false,
    sameSite: none,
    path: "/",
    maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
  });
});
