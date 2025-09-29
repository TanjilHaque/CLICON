const Joi = require("joi");
const { customError } = require("../uitils/customError");

// subcategory validation schema
const subCategoryValidationSchema = Joi.object({
  name: Joi.string().required().trim().messages({
    "string.base": "SubCategory name must be a string.",
    "string.empty": "SubCategory name is required.",
    "any.required": "SubCategory name is required.",
    "string.trim": "SubCategory name should not contain extra spaces.",
  }),
  category: Joi.string().required().messages({
    "any.required": "Category ID is required.",
  }),
}).options({
  abortEarly: true,
  allowUnknown: true,
});

// validate subcategory function
exports.validateSubCategory = async (req) => {
  try {
    const value = await subCategoryValidationSchema.validateAsync(req.body);
    return value;
  } catch (error) {
    console.log("error from validating subcategory", error.message);
    throw new customError(401, "Validating subcategory falied" + error);
  }
};
