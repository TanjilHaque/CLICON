const categoryModel = require("../models/category.model");
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

// get all sub-category
exports.getAllSubCategory = asyncHandler(async (_, res) => {
  const allSubCategory = await subCategoryModel
    .find({})
    .sort({ createdAt: -1 })
    .populate({
      path: "category",
      select: "-subCategory",
    });
  if (!allSubCategory) {
    throw new customError(401, "getting all subcategory failed!!");
  }
  apiResponse.sendSuccess(
    res,
    201,
    "Getting all subcategory successfull!",
    allSubCategory
  );
});

// get single subcategory
exports.getSingleSubCategory = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  if (!slug) {
    throw new customError(
      401,
      "slug not found from the request while getting single subcategory"
    );
  }
  const singleSubCategory = await subCategoryModel.findOne({ slug }).populate({
    path: "category",
    select: "-subCategory",
  });
  if (!singleSubCategory) {
    throw new customError(401, "single subCategory not found !");
  }
  apiResponse.sendSuccess(
    res,
    201,
    "Single subcategory received successfully",
    singleSubCategory
  );
});

// update subcategory
exports.updateSubCategory = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  if (!slug) {
    throw new customError(401, "slug not found while updating subcategory");
  }
  const subCategory = await subCategoryModel.findOne({ slug });
  if (!subCategory) {
    throw new customError(
      401,
      "subcategory not found while updating subcategory"
    );
  }
  if (req.body.category) {
    await categoryModel.findOneAndUpdate(
      { _id: subCategory.category },
      { $pull: { subCategory: subCategory._id } },
      { new: true }
    );

    await categoryModel.findOneAndUpdate(
      { _id: req.body.category },
      { $push: { subCategory: subCategory._id } },
      { new: true }
    );
  }
  subCategory.name = req.body.name || subCategory.name;
  subCategory.category = req.body.category || subCategory.category;
  await subCategory.save();
  apiResponse.sendSuccess(
    res,
    201,
    "subcategory updated successfully",
    subCategory
  );
});

// delete subcategory
exports.deleteSubCategory = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  if (!slug) {
    throw new customError(401, "Slug not found while deleting subcategory");
  }
  const subCategory = await subCategoryModel.findOne({ slug });
  if (!subCategory) {
    throw new customError(
      401,
      "subcategory not found while deleting subcategory"
    );
  }
  await categoryModel.findOneAndUpdate(
    { _id: subCategory._id },
    { $pull: { subCategory: subCategory._id } },
    { new: true }
  );
  await subCategoryModel.deleteOne({ _id: subCategory._id });
  apiResponse.sendSuccess(res, 201, "Subcategory deleted successfully");
});
