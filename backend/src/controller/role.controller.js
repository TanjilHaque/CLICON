const { apiResponse } = require("../uitils/apiResponse");
const { asyncHandler } = require("../uitils/asyncHandler");
const { customError } = require("../uitils/customError");
const roleModel = require("../models/role.model");

// create a role
exports.createRole = asyncHandler(async (req, res) => {
  const role = await roleModel.create(req.body);
  if (!role) throw new customError(500, "Role crate failed!!");
  apiResponse.sendSuccess(res, 200, "Role created Sucessfully", role);
});
