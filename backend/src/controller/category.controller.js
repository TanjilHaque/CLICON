require("dotenv").config();
const Category = require("../models/category.model");
const { apiResponse } = require("../uitils/apiResponse");
const { customError } = require("../uitils/customError");
const { asyncHandler } = require("../uitils/asyncHandler");
const { validateCreateCategory } = require("../validation/category.validation");
const {
  uploadCloudinaryFile,
  deleteCloudinaryFile,
} = require("../helpers/cloudinary");
const categoryModel = require("../models/category.model");

// create category
exports.createCategory = asyncHandler(async (req, res) => {
  const value = await validateCreateCategory(req);
  const imageFileUrl = await uploadCloudinaryFile(value?.image?.path);

  // save the category into db
  const category = await categoryModel.create({
    name: value.name,
    image: imageFileUrl,
  });

  if (!category) throw new customError(500, "Category creation failed!!");

  apiResponse.sendSuccess(res, 201, "Category created successfully!", category);
});

// get all categroy
exports.getAllCategory = asyncHandler(async (_, res) => {
  const allCategory = await categoryModel.find().sort({ createdAt: -1 });
  if (!allCategory) {
    throw new customError(401, "Failed to get category!");
  }
  apiResponse.sendSuccess(
    res,
    201,
    "Category received successfully",
    allCategory
  );
});

// get single category by slug
exports.getSingleCategory = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  if (!slug) {
    throw new customError(401, "slug not found from the request");
  }
  const category = await categoryModel.findOne({ slug: slug });
  if (!category) throw new customError(401, "Single category retrived failed!");
  apiResponse.sendSuccess(
    res,
    201,
    "single category received successfully",
    category
  );
});

// update category by slug
exports.updateCategory = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  if (!slug) {
    throw new customError(
      401,
      "slug is not given in the request for updateing category"
    );
  }
  const category = await categoryModel.findOne({ slug });
  if (!category) {
    throw new customError(401, "category not found for updating category!");
  }
  if (req.body.name) {
    category.name = req.body.name;
  }
  if (req?.file?.length) {
    const deletedFile = await deleteCloudinaryFile(category.image.publicID);
    if (!deletedFile) {
      throw new customError(
        401,
        "Delete operation failed while deleting file in cloudinary from update category!"
      );
    }
    const image = await uploadCloudinaryFile(req.file.image[0].path);
    category.image = image;
  }
  await category.save();
  apiResponse.sendSuccess(res, 201, "Category updated successfully!", category);
});

// delete category
exports.deleteCategory = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  if (!slug) {
    throw new customError(
      401,
      "slug not found in request while deleting category!"
    );
  }
  const category = await categoryModel.findOneAndDelete({ slug });
  if (!category) {
    throw new customError(401, "Deleting category failed");
  }
  const deletedFileFromCloudinary = await deleteCloudinaryFile(
    category.image.publicID
  );
  if (!deletedFileFromCloudinary) {
    console.log("File did not deleted from cloudinary!");
  }
  apiResponse.sendSuccess(res, 201, "Category deleted successfully!");
});
