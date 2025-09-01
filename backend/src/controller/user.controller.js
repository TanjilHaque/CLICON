require("dotenv").config();
const User = require("../models/user.model");
const { apiResponse } = require("../uitils/apiResponse");
const { customError } = require("../uitils/customError");
const { asyncHandler } = require("../uitils/asyncHandler");
const {
  validateRegistration,
  validateLogin,
} = require("../validation/user.validation");
const { sendMail, otpGenerator } = require("../helpers/helpers");
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

  //sending verification email
  if (emailRegex.test(credential)) {
    const verificationUrl = `https://dummyjson.com/`;
    const expireTime = Date.now() * 3600 * 10000;
    const template = registrationTemplate(
      firstName,
      verificationUrl,
      otpGenerator,
      expireTime
    );
    await sendMail(credential, template);
    user.resetPasswordOtp = otpGenerator;
    user.resetPasswordExpireTime = expireTime;
    await user.save();
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
  //console.log(isPasswordCorrect);
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
    sameSite: "none",
    path: "/",
    maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
  });

  apiResponse.sendSuccess(res, 200, "Login Successful", {
    accessToken: accessToken,
    userName: user.firstName,
    credential: user.credential,
  });
});

//verify the user
exports.emailVerifcation = asyncHandler(async (req, res) => {
  const { credential, otp } = req.body;
  if (emailRegex.test(credential)) {
    if (!otp) {
      throw new customError(401, "OTP not found");
    }
    const findUser = await User.findOne({
      credential: credential,
      resetPasswordExpireTime: { $gt: Date.now() },
      resetPasswordOtp: otp,
    });
    if (!findUser) {
      throw new customError(401, "user not found");
    }
  } else {
    throw new customError(401, "Credential must be an email");
  }
});
