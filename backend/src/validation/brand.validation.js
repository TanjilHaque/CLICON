const Joi = require("joi");
const { customError } = require("../uitils/customError");

// brand validation schema
const brandValidationSchema = Joi.object({
  name: Joi.string().trim().required().messages({
    "string.base": "Brand name must be a string.",
    "string.empty": "Brand name is required.",
    "any.required": "Brand name is required.",
    "string.trim": "Brand name should not contain extra spaces.",
  }),
}).options({
  abortEarly: true,
  allowUnknown: true,
});

// async function to validate brand
exports.validateBrand = async (req, res) => {
  try {
    const value = await brandValidationSchema.validateAsync(req.body);
    const allowedMimeTypes = [
      "image/jpeg",
      "image/png",
      "image/jpg",
      "image/webp",
    ];
    // check if image exists
    if (!req.files?.image || req.files?.image.length === 0) {
      throw new customError(401, "Brand image is required");
    }
    // validate file type
    if (!allowedMimeTypes.includes(req?.files?.image[0]?.mimetype)) {
      throw new customError(
        401,
        "Only JPG, JPEG, PNG, and WEBP image files are allowed."
      );
    }
    // validate file size (max 5 MB)
    if (req?.files?.image[0]?.size >= 5 * 1024 * 1024) {
      throw new customError(401, "Image size must be below 5 MB!");
    }

    return { name: value.name, image: req?.files?.image[0] };
  } catch (error) {
    throw new customError(401, "brand validation failed" + error);
  }
};
