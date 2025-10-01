const {
  uploadCloudinaryFile,
  deleteCloudinaryFile,
} = require("../helpers/cloudinary");
const brandModel = require("../models/brand.model");
const { apiResponse } = require("../uitils/apiResponse");
const { asyncHandler } = require("../uitils/asyncHandler");
const { customError } = require("../uitils/customError");
const { validateBrand } = require("../validation/brand.validation");

// create a new brand
exports.createBrand = asyncHandler(async (req, res) => {
  const value = await validateBrand(req);
  // upload image in cloudinary
  const images = await uploadCloudinaryFile(value.image.path);
  const brand = await brandModel.create({
    name: value.name,
    image: images,
  });
  if (!brand) throw new customError(500, "Brand creation failed");
  apiResponse.sendSuccess(res, 201, "Brand Created Successfully", brand);
});

// get all brands
exports.getAllBrands = asyncHandler(async (_, res) => {
  const allBrands = await brandModel.find({});
  if (!allBrands) {
    throw new customError(401, "all brands not received");
  }
  apiResponse.sendSuccess(
    res,
    201,
    "All brand received successfully",
    allBrands
  );
});

// get single brand by slug
exports.getSingleBrand = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  if (!slug) {
    throw new customError(401, "slug not found while getting single brand");
  }
  const brand = await brandModel.findOne({ slug });
  if (!brand) {
    throw new customError(401, "brand not found while getting single brand");
  }
  apiResponse.sendSuccess(
    res,
    201,
    "single brand received successfully",
    brand
  );
});
// update brand
exports.updateBrand = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  if (!slug) {
    throw new customError(401, "slug not found while updating brand");
  }
  const brand = await brandModel.findOne({ slug });
  if (!brand) {
    throw new customError(401, "brand not found while updating brand");
  }
  // update the name
  if (req.body.name) {
    brand.name = req.body.name;
  }
  // update the image
  if (req?.files.length) {
    const deletedFile = await deleteCloudinaryFile(brand.image.publicID);
    if (!deletedFile) {
      throw new customError(
        401,
        "Delete operation failed while deleting file in cloudinary from update brand!"
      );
    }
    const image = await uploadCloudinaryFile(req.files.image[0].path);
    brand.image = image;
  }
  await brand.save();
  apiResponse.sendSuccess(res, 201, "Brand updated successfully", brand);
});
// delete brand
exports.deleteBrand = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  if (!slug) {
    throw new customError(401, "slug not found while deleting brand");
  }
  const brand = await brandModel.findOne({ slug });
  if (!brand) {
    throw new customError(401, "brand not found while deleting brand");
  }
  const deletedFile = await deleteCloudinaryFile(brand.image.publicID);
  if (!deletedFile) {
    throw new customError(
      401,
      "Delete operation failed while deleting file in cloudinary from delete brand!"
    );
  }
  await brandModel.deleteOne({ _id: brand._id });
  apiResponse.sendSuccess(res, 201, "Brand deleted successfully", brand);
});
