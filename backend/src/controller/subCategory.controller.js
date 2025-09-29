const subCategoryModel = require("../models/subCategory.model");
const { apiResponse } = require("../uitils/apiResponse");
const { asyncHandler } = require("../uitils/asyncHandler");
const { customError } = require("../uitils/customError");
const { validateSubCategory } = require("../validation/subCategory.validation");

// create sub category
exports.createSubCategory = asyncHandler(async (req, res) => {
  const value = await validateSubCategory(req);
  if (!value) {
    throw customError(401, "subcategory validation failed");
  }
  const subCategory = await subCategoryModel.create(value);
  if (!subCategory) {
    throw new customError(500, "sub category creation failed");
  }
  apiResponse.sendSuccess(
    res,
    201,
    "Sub-category created successfully",
    subCategory
  );
});
