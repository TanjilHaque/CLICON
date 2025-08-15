const User = require("../models/user.model");
const { apiResponse } = require("../uitils/apiResponse");
const { customError } = require("../uitils/customError");
const { asyncHandler } = require("../uitils/asyncHandler");
const { validateUser } = require("../validation/user.validation");

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
  apiResponse.sendSuccess(res, 201, "Registration successful", user);
});
