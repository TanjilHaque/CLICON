const express = require("express");
const _ = express.Router();
const couponController = require("../../controller/coupon.controller");
_.route("/create-coupon").post(couponController.createCoupon);
_.route("/get-all-coupon").get(couponController.getAllCoupon);
_.route("/single-coupon/:code").get(couponController.getSingleCoupon);
module.exports = _;
