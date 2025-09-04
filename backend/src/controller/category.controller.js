require("dotenv").config();
const Category = require("../models/category.model");
const { apiResponse } = require("../uitils/apiResponse");
const { customError } = require("../uitils/customError");
const { asyncHandler } = require("../uitils/asyncHandler");
const { validateCreateCategory } = require("../validation/category.validation");

exports.createCategory = asyncHandler(async (req, res) => {
  const value = await validateCreateCategory(req);
  console.log(value);
});
