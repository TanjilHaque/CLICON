const { asyncHandler } = require("../uitils/asyncHandler");
const { customError } = require("../uitils/customError");
const { apiResponse } = require("../uitils/apiResponse");
const deliveryChargeModel = require("../models/deliveryCharge.model");

// create delivery charge
exports.createDeliveryCharge = asyncHandler(async (req, res) => {
  const { name, charge, decription } = req.body;
  if (!name || !charge)
    throw new customError(401, "name and charge are required !");
  const deliveryCharge = new deliveryChargeModel({
    name,
    charge,
    decription,
  });
  await deliveryCharge.save();
  if (!deliveryCharge)
    throw new customError(501, "unable to create delivery charge !");
  apiResponse.sendSuccess(res, 201, "delivery charge created sucessfully", {
    deliveryCharge,
  });
});

// get all delivery charge
exports.getAllDeliveryCharge = asyncHandler(async (req, res) => {
  const deliveryCharge = await deliveryChargeModel
    .find()
    .sort({ createdAt: -1 });
  if (!deliveryCharge.length) throw new customError(404, "data not found !");
  apiResponse.sendSuccess(res, 200, "all delivery charge list", {
    deliveryCharge,
  });
});

// get single delivery charge
exports.getSingleDeliveryCharge = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) throw new customError(401, "id is required !");
  const deliveryCharge = await deliveryChargeModel.findById(id);
  if (!deliveryCharge) throw new customError(404, "data not found !");
  apiResponse.sendSuccess(res, 200, "single delivery charge data", {
    deliveryCharge,
  });
});

// update delivery charge
exports.updateDeliveryCharge = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) throw new customError(401, "id is required !");
  const deliveryCharge = await deliveryChargeModel.findByIdAndUpdate(
    id,
    { ...req.body },
    { new: true }
  );

  if (!deliveryCharge)
    throw new customError(501, "unable to update delivery charge !");
  apiResponse.sendSuccess(
    res,
    200,
    "delivery charge updated sucessfully",
    deliveryCharge
  );
});

// delivery charge delete
exports.deleteDeliveryCharge = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) throw new customError(401, "id is required !");
  const deliveryCharge = await deliveryChargeModel.findByIdAndDelete(id);
  if (!deliveryCharge) throw new customError(501, "unable to delete data !");
  apiResponse.sendSuccess(
    res,
    200,
    "delivery charge deleted sucessfully",
    deliveryCharge
  );
});
