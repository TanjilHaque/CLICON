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
    return value;
  } catch (error) {
    console.error(
      "Error from createCategory validation:",
      error.details[0].messages
    );
    throw new customError(
      400,
      "Category validation for creation failed",
      error
    );
  }
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
