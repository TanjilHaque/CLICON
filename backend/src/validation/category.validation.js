const Joi = require("joi");
const { customError } = require("../uitils/customError");

// Joi schema for creating a new category
const createCategorySchema = Joi.object({
  name: Joi.string().trim().min(2).max(50).required().messages({
    "string.empty": "Category name is required.",
    "string.min": "Category name must be at least 2 characters long.",
    "string.max": "Category name must be less than 50 characters.",
    "any.required": "Category name is a required field.",
  }),
}).options({
  abortEarly: true,
  allowUnknown: true,
});

// Validation function for category creation
exports.validateCreateCategory = async (req) => {
  try {
    const value = await createCategorySchema.validateAsync(req.body);
    console.log(req.files);

    // make sure files exist before accessing req.files.image[0]
    if (!req.files || !req.files.image || req.files.image.length === 0) {
      throw new customError(400, "ValidationError", "Image not found");
    }

    const file = req.files.image[0];

    // allowed mimetypes (separate entries)
    const allowedMimeTypes = [
      "image/jpeg",
      "image/webp",
      "image/jpg",
      "image/gif",
      "image/png",
      // "image/png" // uncomment if you want to allow PNG
    ];

    // validate mimetype
    if (!allowedMimeTypes.includes(file.mimetype)) {
      console.log("Invalid mimetype:", file.mimetype);
      throw new customError(
        401,
        "ValidationError",
        "Only PNG, JPG, JPEG, and WebP files are allowed"
      );
    }

    // validate size (use file.size)
    if (file.size > 5 * 1024 * 1024) {
      throw new customError(401, "ValidationError", "Image must be under 5 MB");
    }

    return value;
  } catch (error) {
    // Safe logging — don't assume the shape of the error
    console.error(
      "Error from createCategory validation:",
      error?.message ?? error
    );

    // If it's already our customError, rethrow it unchanged
    if (error instanceof customError) {
      throw error;
    }

    // If it's a Joi validation error, convert to customError with Joi message
    if (error?.isJoi || error?.name === "ValidationError") {
      throw new customError(
        400,
        "ValidationError",
        error.message || "Invalid input"
      );
    }

    // Fallback: wrap unknown errors
    throw new customError(
      500,
      "CategoryValidationError",
      error.message ?? "Internal validation error"
    );
  }
  //throw new customError(400, "Category validation for creation failed", error);
};

// Validation function for category update
exports.validateUpdateCategory = async (req) => {
  try {
    const value = await updateCategorySchema.validateAsync(req.body);
    return value;
  } catch (error) {
    console.error("Error from updateCategory validation:", error);
    throw new customError(400, "Category validation for update failed", error);
  }
};
