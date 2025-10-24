const { asyncHandler } = require("../uitils/asyncHandler");
const { customError } = require("../uitils/customError");
const { apiResponse } = require("../uitils/apiResponse");
const couponModel = require("../models/coupon.model");
// create coupon
exports.createCoupon = asyncHandler(async (req, res) => {
  const coupon = await couponModel.create(req.body);
  if (!coupon) throw new customError(500, "Coupon crate failed!!");
  apiResponse.sendSuccess(res, 200, "Coupon created Sucessfully", coupon);
});

// get all coupon
exports.getAllCoupon = asyncHandler(async (_, res) => {
  const coupon = await couponModel.find();
  if (!coupon) throw new customError(500, "Coupon crate failed!!");
  apiResponse.sendSuccess(res, 200, "Coupon get Sucessfully", coupon);
});

// get single coupon
exports.getSingleCoupon = asyncHandler(async (req, res) => {
  const { code } = req.params;
  if (!code) throw new customError(500, "slug not found !!");
  //   upload image into cloudinary
  const coupon = await couponModel.findOne({ code });
  if (!coupon) throw new customError(500, "Coupon crate failed!!");
  apiResponse.sendSuccess(res, 200, "Coupon get Sucessfully", coupon);
});
