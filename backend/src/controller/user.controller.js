const User = require("../models/user.model");
const { apiResponse } = require("../uitils/apiResponse");
const { customError } = require("../uitils/customError");
const { asyncHandler } = require("../uitils/asyncHandler");
const { validateUser } = require("../validation/user.validation");
const { sendMail } = require("../helpers/helpers");
const { registrationTemplate } = require("../template/template");
const bdPhoneRegex = /^(?:\+8801[3-9]\d{8}|01[3-9]\d{8})$/;
const emailRegex = /^[\w.-]+@[\\w.-]+\\.[A-Za-z]{2,}$/;

//register the user
exports.registration = asyncHandler(async (req, res) => {
  const value = await validateUser(req);
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
  if (emailRegex.test(user.credential)) {
    const verificationUrl = `https://dummyjson.com/`;
    const template = registrationTemplate(firstName, verificationUrl);
    await sendMail(credential, template);
    apiResponse.sendSuccess(res, 201, "Registration successful", {
      firstName,
      credential,
    });
  } else if (bdPhoneRegex) {
  } else {
    console.log("Email or Phone number is not valid.");
  }
});

//login the user
exports.login = asyncHandler(async (req, res) => {
  const value = await validateUser(req);
  const { credential, password } = value;
  const user = await User.findOne({ credential: credential });
  console.log(credential);
});
