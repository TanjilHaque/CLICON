const {
  uploadCloudinaryFile,
  deleteCloudinaryFile,
} = require("../helpers/cloudinary");
const bannerModel = require("../models/banner.model");
const { apiResponse } = require("../uitils/apiResponse");
const { asyncHandler } = require("../uitils/asyncHandler");
const { customError } = require("../uitils/customError");
const { validateBanner } = require("../validation/banner.validation");

// create banner
exports.createBanner = asyncHandler(async (req, res) => {
  const value = await validateBanner(req);
  const image = await uploadCloudinaryFile(value.image.path);
  const banner = await bannerModel.create({ ...value, image });
  if (!banner) throw new customError(500, "banner create failed", error);
  apiResponse.sendSuccess(res, 200, "banner created successfully", banner);
});

// get all banner
exports.getAllBanner = asyncHandler(async (req, res) => {
  const allBanner = await bannerModel.find({});
  if (!allBanner) throw new customError(404, "No banner found", error);
  apiResponse.sendSuccess(res, 200, "All banner received", allBanner);
});

//update the banner
exports.updateBanner = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  // ✅ Step 1: Validate request data
  const value = await validateBanner(req);

  // ✅ Step 2: Find existing banner
  const existingBanner = await bannerModel.findOne({ slug });
  if (!existingBanner) {
    throw new customError(404, "Banner not found", error);
  }

  let imageAsset = existingBanner.image; // keep old image if new one not provided

  // ✅ Step 3: If new image uploaded → delete old one & upload new
  if (value.image) {
    try {
      // delete old image from cloudinary if exists
      if (existingBanner?.image?.public_id) {
        await deleteCloudinaryFile(existingBanner.image.public_id);
      }

      // upload new image
      imageAsset = await uploadCloudinaryFile(value.image.path);
    } catch (err) {
      throw new customError(500, "Image upload failed: " + err.message);
    }
  }

  // ✅ Step 4: Update banner data
  const updatedBanner = await bannerModel.findOneAndUpdate(
    { slug },
    {
      ...value,
      image: imageAsset,
    },
    { new: true }
  );

  if (!updatedBanner) {
    throw new customError(500, "Banner update failed!!");
  }

  // ✅ Step 5: Send success response
  apiResponse.sendSuccess(
    res,
    200,
    "Banner updated successfully",
    updatedBanner
  );
});

// delete banner
exports.deleteBanner = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const banner = await bannerModel.findOneAndDelete({ slug });
  if (!banner) throw new customError(500, "banner delete failed", error);
  await deleteCloudinaryFile(banner.image.public_id);
  apiResponse.sendSuccess(res, 200, "banner deleted successfully", banner);
});
