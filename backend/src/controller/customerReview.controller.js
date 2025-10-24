const { apiResponse } = require("../uitils/apiResponse");
const { asyncHandler } = require("../uitils/asyncHandler");
const { customError } = require("../uitils/customError");
const productModel = require("../models/product.model");
const {
  uploadCloudinaryFile,
  deleteCloudinaryFile,
} = require("../helpers/cloudinary");
const { validateReview } = require("../validation/customerReview.validation");

// create customer Review
exports.createCustomerReview = asyncHandler(async (req, res) => {
  const data = await validateReview(req);
  //   upload image into cloudinary
  const imageUrl = await Promise.all(
    data.image.map((img) => uploadCloudinaryFile(img.path))
  );
  //   now save the data into database
  const review = await productModel.findOneAndUpdate(
    { _id: data.product },
    { $push: { reviews: { ...data, image: imageUrl } } },
    { new: true }
  );
  if (!review) throw new customError(500, "Review crate failed!!");
  apiResponse.sendSuccess(res, 200, "Review created Sucessfully", review);
});

// delete product review
exports.deleteProdutReview = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const { reviewId } = req.body;
  if (!slug && reviewId) throw new customError(401, "slug not found !!");
  const review = await productModel.findOneAndUpdate(
    { slug },
    { $pull: { reviews: { _id: reviewId } } },
    { new: true }
  );
  if (!review) throw new customError(404, "Review not found !!");
  apiResponse.sendSuccess(res, 200, "Review deleted Sucessfully", review);
});

// update review
exports.editProdutReview = asyncHandler(async (req, res) => {
  const { reviewId, comment } = req.body;
  if (!reviewId) throw new customError(401, "slug not found !!");
  const review = await productModel.findOneAndUpdate(
    {
      reviews: { $elemMatch: { _id: reviewId } },
    },
    {
      $set: {
        "reviews.$.comment": comment,
      },
    },
    { new: true }
  );
  if (!review) throw new customError(404, "Review not found !!");
  //   const updateReview = review.reviews.map((rev) => {
  //     if (rev._id.toString() === reviewId) {
  //       rev.comment = comment;
  //     }
  //     return rev;
  //   });

  //   review.reviews = updateReview;
  //   await review.save();

  apiResponse.sendSuccess(res, 200, "Review deleted Sucessfully", review);
});
