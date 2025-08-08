const User = require("../models/user.model");
const { apiResponse } = require("../uitils/apiResponse");
const { customError } = require("../uitils/customError");
const { asyncHandler } = require("../uitils/asyncHandler");

exports.registration = asyncHandler(async (req, res) => {
  console.log(req.body);
});
