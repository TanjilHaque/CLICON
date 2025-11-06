const { uploadCloudinaryFile } = require("../helpers/cloudinary");
const userModel = require("../models/user.model");
const { apiResponse } = require("../uitils/apiResponse");
const { asyncHandler } = require("../uitils/asyncHandler");
const { customError } = require("../uitils/customError");
const {
  validateLogin,
  validateRegistration,
} = require("../validation/user.validation");

// create user
exports.createUser = asyncHandler(async (req, res) => {
  const value = await validateRegistration(req);
  const allowedMimeTypes = [
    "image/jpeg",
    "image/png",
    "image/jpg",
    "image/webp",
  ];
  // Check images (if provided)
  if (req.files?.image?.length > 0) {
    for (let file of req.files.image) {
      if (!allowedMimeTypes.includes(file.mimetype)) {
        throw new customError(
          "Only JPG, JPEG, PNG, and WEBP image files are allowed."
        );
      }
      if (file.size >= 5 * 1024 * 1024) {
        throw new customError(401, "Each image size must be below 5MB");
      }
    }
  }
  console.log(value, req.files.image[0]);
  //   upload image inot cloudinary
  const imageUrl = await uploadCloudinaryFile(req.files.image[0].path);

  const user = await userModel.create({
    ...value,
    createdBy: req?.user?.id || null,
    image: imageUrl,
  });
  if (!user) {
    throw new customError(400, "user not created");
  }
  apiResponse.sendSuccess(res, 200, "User created Sucessfully", user);
});

// get user
exports.getUserByAdmin = asyncHandler(async (req, res) => {
  //   upload image into cloudinary
  const user = await userModel
    .find({ role: { $exists: true, $ne: [] } })
    .populate("role")
    .sort({ createdAt: -1 });

  if (!user) throw new customError(500, "User crate failed!!");
  apiResponse.sendSuccess(res, 200, "User get Sucessfully", user);
});

// add user permisson
exports.addUserPermission = asyncHandler(async (req, res) => {
  const { userId, permissions } = req.body;

  const user = await userModel.findOne({ _id: userId });
  if (!user) throw new customError(500, "User crate failed!!");
  user.permissions = permissions;
  await user.save();
  apiResponse.sendSuccess(res, 200, "User get Sucessfully", user);
});
