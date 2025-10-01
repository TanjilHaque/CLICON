const express = require("express");
const _ = express.Router();
const brandController = require("../../controller/brand.controller");
const { upload } = require("../../middleware/multer.middleware");

_.route("/create-brand").post(
  upload.fields([{ name: "image", maxCount: 1 }]),
  brandController.createBrand
);
_.route("/get-all-brands").get(brandController.getAllBrands);
_.route("/get-single-brand/:slug").get(brandController.getSingleBrand);
_.route("/update-brand/:slug").put(
  upload.fields([{ name: "image", maxCount: 1 }]),
  brandController.updateBrand
);
_.route("/delete-brand/:slug").delete(brandController.deleteBrand);
module.exports = _;
