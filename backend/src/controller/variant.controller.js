const {
  uploadCloudinaryFile,
  deleteCloudinaryFile,
} = require("../helpers/cloudinary");
const productModel = require("../models/product.model");
const variantModel = require("../models/variant.model");
const { apiResponse } = require("../uitils/apiResponse");
const { asyncHandler } = require("../uitils/asyncHandler");
const { customError } = require("../uitils/customError");
const { validateVariant } = require("../validation/variant.validation");

// create variant
exports.createVariant = asyncHandler(async (req, res) => {
  const data = await validateVariant(req);
  //  upload image
  const imageUrl = await Promise.all(
    data.image.map((img) => uploadCloudinaryFile(img.path))
  );
  // now save the data into database
  const variant = await variantModel.create({ ...data, image: imageUrl });
  if (!variant) throw new customError(500, "variant created failed !!");

  //   find the product model and push new variant id
  const updateProductvariant = await productModel.findOneAndUpdate(
    { _id: data.product },
    { $push: { variant: variant._id } },
    { new: true }
  );
  if (!updateProductvariant)
    throw new customError(500, "variant id pushed failed !!");
  apiResponse.sendSuccess(res, 201, "variant created sucessfully", variant);
});

// get all variant
exports.getAllVariant = asyncHandler(async (req, res) => {
  const variants = await variantModel
    .find()
    .populate("product") // populate product details
    .sort({ createdAt: -1 }); // latest first

  if (!variants || variants.length === 0) {
    throw new customError(404, "No variants found!");
  }

  apiResponse.sendSuccess(res, 200, "Variants fetched successfully", variants);
});

// get single variant
exports.singleVariant = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  if (!slug) throw new customError(401, "slug not found !");
  const variants = await variantModel.findOne({ slug }).populate("product"); // populate product details
  if (!variants) {
    throw new customError(404, "No variants found!");
  }
  apiResponse.sendSuccess(res, 200, "Variants fetched successfully", variants);
});

// upload variant
exports.uploadVariantImage = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  if (!slug) throw new customError(401, "slug not found !");
  const variants = await variantModel.findOne({ slug });
  if (!variants) {
    throw new customError(404, "No variants found!");
  }
  const { image } = req.files;
  const imageUrl = await Promise.all(
    image.map((image) => uploadCloudinaryFile(image.path))
  );
  variants.image = [...variants.image, ...imageUrl];
  await variants.save();
  apiResponse.sendSuccess(
    res,
    200,
    "Variants new image upload sucessfully",
    variants
  );
});

// delete images
exports.deleteVariantImage = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const { publicId } = req.body;
  if (!slug) throw new customError(401, "slug not found !");
  const variant = await variantModel.findOne({ slug });
  if (!variant) {
    throw new customError(404, "No variants found!");
  }
  // delete image form cloudinary
  const resposne = await Promise.all(
    publicId.map((id) => deleteCloudinaryFile(id))
  );
  if (!resposne) throw new customError(404, " variants image delete failed!");

  // remove images from variant.image

  variant.image = variant.image.filter(
    (img) => !publicId.includes(img.publicIP)
  );

  await variant.save();

  apiResponse.sendSuccess(
    res,
    200,
    "Variants new image upload sucessfully",
    variant
  );
});

// update varinatinfo

exports.updateVariantInfo = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  if (!slug) throw new customError(401, "slug not found !");
  const existingVariant = await variantModel.findOne({ slug });
  if (!existingVariant) {
    throw new customError(404, "No variants found!");
  }

  // check product id is matched or not matched
  const isMatched = existingVariant.product.toString() !== req.body.product;
  const updateVariant = await variantModel.findOneAndUpdate(
    { slug },
    req.body,
    { new: true }
  );
  if (!updateVariant) throw new customError(404, "No variants found!");
  if (isMatched) {
    // remove variant id from old product
    await productModel.findOneAndUpdate(
      { _id: existingVariant.product },
      { $pull: { variant: existingVariant._id } }
    );
    // add variant id to new product
    await productModel.findOneAndUpdate(
      { _id: req.body.product },
      { $push: { variant: existingVariant._id } }
    );
  }

  apiResponse.sendSuccess(
    res,
    200,
    "Variants new image upload sucessfully",
    variant
  );
});
