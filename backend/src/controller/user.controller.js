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
const {
  registrationTemplate,
  forgotPasswordTemplate,
} = require("../template/template");
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
    const otp = otpGenerator();
    const expireTime = Date.now() + 3600 * 10000;
    const template = registrationTemplate(
      firstName,
      verificationUrl,
      otp,
      expireTime
    );
    await sendMail(credential, template);
    user.resetPasswordOtp = otpGenerator();
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

  // setting the refresh token in database
  user.refreshToken = refreshToken;

  await user.save();

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
      $and: [
        { credential: credential },
        { resetPasswordExpireTime: { $gt: Date.now() } },
        { resetPasswordOtp: otp },
      ],
    });
    if (!findUser) {
      throw new customError(401, "user not found");
    }
    findUser.resetPasswordOtp = null;
    findUser.resetPasswordExpireTime = null;
    findUser.isUserVerified = true;
    apiResponse.sendSuccess(res, 200, "Email Verifed Successfully!", {
      credential: findUser.credential,
      firstName: findUser.firstName,
    });
  } else {
    throw new customError(401, "Credential must be an email");
  }
});

//forgot password
exports.forgotPassword = asyncHandler(async (req, res) => {
  const { credential } = req.body;
  if (!credential) {
    throw new customError(401, "Credential is missing!!");
  } else {
    if (emailRegex.test(credential)) {
      const user = await User.findOne({ credential: credential });
      if (!user) {
        throw new customError(401, "User on this email is not found!");
      } else {
        // generate otp and send verification link
        const newOtp = otpGenerator();
        const expireTime = Date.now() + 10000 * 3600;
        const verifyLink = `https://jsonplaceholder.typicode.com/`;
        const template = forgotPasswordTemplate(
          newOtp,
          expireTime,
          verifyLink,
          user.firstName
        );
        //sending the email
        await sendMail(credential, template);
        apiResponse.sendSuccess(res, 200, "Email Sent, check you email!");
      }
    } else {
      throw new customError(401, "Credential is not an Email !!");
    }
  }
});

//reset password
exports.resetPassword = asyncHandler(async (req, res) => {
  const { credential, newPassword, confirmPassword } = req.body;
  if (!credential || !newPassword || !confirmPassword) {
    throw new customError(
      401,
      "Credential, new password or confirm password missing!"
    );
  }
  if (newPassword !== confirmPassword) {
    throw new customError(
      401,
      "New Password and Confirmed Password do not match!"
    );
  }
  const user = await User.findOne({ credential: credential });
  if (!user) {
    throw new customError(401, "User not found!");
  }
  user.password = newPassword;
  user.resetPasswordExpireTime = null;
  user.resetPasswordOtp = null;
  await user.save();
  apiResponse.sendSuccess(res, 201, "Password changed successfully!!", user);
});

//logout password
exports.logout = asyncHandler(async (req, res) => {
  console.log(req.user);
  //req.user is just the instance of the information required
  // to manipulate the user information we need to query the db
  // find the user and get the job done
  const findUser = await User.findById(req.user._id);
  if (!findUser) {
    throw new customError(401, "User not found!");
  } else {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: isProduction ? true : false,
      sameSite: "none",
      path: "/",
    });
    findUser.refreshToken = null;
    await findUser.save();
    apiResponse.sendSuccess(
      res,
      201,
      "Logout Successful!!",
      findUser.credential
    );
  }
});

exports.getMe = asyncHandler(async (req, res) => {
  const id = req.user._id;
  if (!id) {
    throw new customError(401, "id not found!");
  }
  const me = await User.findById(id);
  if (!me) {
    throw new customError(401, "user not found!");
  }
  apiResponse.sendSuccess(res, 201, "User retrived successfully!", me);
});

// get refresh token
exports.postRefreshToken = asyncHandler(async (req, res) => {
  const token = req.headers.cookie.replace("refreshToken=", " ");
  if (!token) {
    throw new customError(401, "Token not found!");
  }
  const findUser = await User.findOne({ refreshToken: token });
  if (!findUser) {
    throw new customError(401, "user not found");
  }
  const accessToken = await findUser.generateAccessToken();
  apiResponse.sendSuccess(res, 200, "Posting refresh token Successful", {
    accessToken: accessToken,
    userName: findUser.firstName,
    credential: findUser.credential,
  });
});
