const discountModel = require("../models/discount.model");
const { apiResponse } = require("../uitils/apiResponse");
const { asyncHandler } = require("../uitils/asyncHandler");
const { customError } = require("../uitils/customError");
const { validateDiscount } = require("../validation/discount.validation");
const categoryModel = require("../models/category.model");
const subCategoryModel = require("../models/subCategory.model");
const NodeCache = require("node-cache");
const Cache = new NodeCache();

// create discount
exports.createDiscount = asyncHandler(async (req, res) => {
  const value = await validateDiscount(req);
  const discount = new discountModel(value);
  await discount.save();
  if (!discount) {
    throw new customError(401, "Failed to create discount!!");
  }
  // update category id in category
  if (value.discountPlan === "category" && value.category) {
    await categoryModel.findByIdAndUpdate(value.category, {
      discount: discount._id,
    });
  }
  if (value.discountPlan === "subCategory" && value.subCategory) {
    await subCategoryModel.findByIdAndUpdate(value.subCategory, {
      discount: discount._id,
    });
  }
  apiResponse.sendSuccess(
    res,
    201,
    "Discount created successfully!!",
    discount
  );
});

// get all discounts
exports.getAllDiscounts = asyncHandler(async (_, res) => {
  const value = Cache.get("allDiscounts");
  if (value === undefined) {
    const allDiscounts = await discountModel
      .find({})
      .sort({ createdAt: -1 })
      .populate({
        path: "category subCategory",
      });
    if (!allDiscounts) {
      throw new customError(401, "No discounts found");
    }
    // save the data in cache for 1 hour
    Cache.set("allDiscounts", JSON.stringify(allDiscounts), 3600);
    apiResponse.sendSuccess(
      res,
      201,
      "All Discounts received successfully!!",
      allDiscounts
    );
  }
  apiResponse.sendSuccess(
    res,
    201,
    "All Discounts received successfully!!",
    allDiscounts
  );
});

// get single discount
exports.getSingleDiscount = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  if (!slug) {
    throw new customError(
      401,
      "slug not found from the request while getting single discount"
    );
  }
  const discount = await discountModel.findOne({ slug }).populate({
    path: "category subCategory",
  });
  if (!discount) {
    throw new customError(401, "discount not found");
  }
  apiResponse.sendSuccess(res, 201, "Discount found successfully", discount);
});

// update discount
exports.updateDiscount = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  if (!slug) {
    throw new customError(401, "Invalid request");
  }
  const value = await validateDiscount(req);
  const discount = await discountModel.findOne({ slug });
  if (!discount) {
    throw new customError(401, "No discount found");
  }
  // remove category id
  if (discount.discountPlan === "category" && discount.category) {
    await categoryModel.findByIdAndUpdate(discount.category, {
      discount: null,
    });
  }
  // remove subCategory id
  if (discount.discountPlan === "subCategory" && discount.subCategory) {
    await subCategoryModel.findByIdAndUpdate(discount.subCategory, {
      discount: null,
    });
  }

  // update the category with discount
  if (value.discountPlan === "category" && value.category) {
    await categoryModel.findByIdAndUpdate(value.category, {
      discount: discount._id,
    });
  }
  // update the subCategory with discount
  if (value.discountPlan === "subCategory" && value.subCategory) {
    await subCategoryModel.findByIdAndUpdate(value.subCategory, {
      discount: discount._id,
    });
  }

  // finally update the discount
  const updateDiscount = await discountModel.findOneAndUpdate(
    { _id: discount._id },
    value,
    { new: true }
  );
  if (!updateDiscount) {
    throw new customError(401, "update discount failed");
  }
  apiResponse.sendSuccess(
    res,
    201,
    "update discount successfully",
    updateDiscount
  );
});

// delete discount
exports.deleteDiscount = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  if (!slug) {
    throw new customError(401, "invalid request");
  }
  const discount = await discountModel.findOne({ slug });
  if (!discount) {
    throw new customError(401, "discount not found");
  }
  // remove category id
  if (discount.discountPlan === "category" && discount.category) {
    await categoryModel.findByIdAndUpdate(discount.category, {
      discount: null,
    });
  }
  // remove subCategory id
  if (discount.discountPlan === "subCategory" && discount.subCategory) {
    await subCategoryModel.findByIdAndUpdate(discount.subCategory, {
      discount: null,
    });
  }

  const deletedDiscount = await discountModel.findOneAndDelete({ slug });
  if (!deletedDiscount) {
    throw new customError(401, "failed to delete discount");
  }
  Cache.del("allDiscounts");
  apiResponse.sendSuccess(
    res,
    201,
    "discount deleted successfully",
    deletedDiscount
  );
});
