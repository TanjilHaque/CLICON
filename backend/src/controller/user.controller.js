const User = require("../models/user.model");
const { apiResponse } = require("../uitils/apiResponse");
const { customError } = require("../uitils/customError");
const { asyncHandler } = require("../uitils/asyncHandler");
const { validateUser } = require("../validation/user.validation");
const { sendMail } = require("../helpers/helpers");
const { registrationTemplate } = require("../template/template");

//register the user
exports.registration = asyncHandler(async (req, res) => {
  const value = await validateUser(req);
  const { firstName, email, password } = value;
  //save the user info in database
  const user = await new User({
    firstName,
    email,
    password,
  }).save();
  if (!user) {
    throw new customError(500, "Retgistration failed try again!");
  }
  const verificationUrl = `https://dummyjson.com/`;
  const template = registrationTemplate(firstName, verificationUrl);
  await sendMail(email, template);
  apiResponse.sendSuccess(res, 201, "Registration successful", {
    firstName,
    email,
  });
});

//login the user
exports.login = asyncHandler(async (req, res)=>{

})
