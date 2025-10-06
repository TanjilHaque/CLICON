const Joi = require("joi");
const { customError } = require("../uitils/customError");

// define discount validation schema
const discountValidationSchema = Joi.object({
  discountValidFrom: Joi.date().required().messages({
    "date.base": "Discount start date must be a valid date.",
    "any.required": "Discount start date is required.",
  }),
  discountValidTo: Joi.date().required().messages({
    "date.base": "Discount end date must be a valid date.",
    "any.required": "Discount end date is required.",
  }),
  discountName: Joi.string().trim().required().messages({
    "string.base": "Discount name must be a string.",
    "string.empty": "Discount name is required.",
    "any.required": "Discount name is required.",
  }),
  discountType: Joi.string().valid("tk", "percentage").required().messages({
    "any.only": "Discount type must be either 'tk' or 'percentance'.",
    "any.required": "Discount type is required.",
  }),
  discountValueByAmount: Joi.number().min(0).messages({
    "number.base": "Discount amount must be a number.",
    "number.min": "Discount amount cannot be negative.",
  }),
  discountValueByPercentage: Joi.number().min(0).max(100).messages({
    "number.base": "Discount percentage must be a number.",
    "number.min": "Discount percentage cannot be negative.",
    "number.max": "Discount percentage cannot exceed 100.",
  }),
  discountPlan: Joi.string()
    .valid("category", "subCategory", "product", "flat")
    .required()
    .messages({
      "any.only":
        "Discount plan must be 'category', 'subCategory', 'product' or 'flat'.",
      "any.required": "Discount plan is required.",
    }),
  category: Joi.string().allow(null, ""),
  subCategory: Joi.string().allow(null, ""),
  product: Joi.string().allow(null, ""),
  isActive: Joi.boolean().optional(),
}).options({
  abortEarly: true,
  allowUnknown: true,
});

// async function to validate discount
exports.validateDiscount = async (req, res) => {
  try {
    const value = await discountValidationSchema.validateAsync(req.body);
    // check date validity
    if (new Date(value.discountValidFrom) > new Date(value.discountValidTo)) {
      throw new customError(400, "starting date cannot be after end date");
    }
    // at least one value must exist
    if (
      (!value.discountValueByAmount || value.discountValueByAmount < 0) &&
      (!value.discountValueByPercentage || value.discountValueByPercentage < 0)
    ) {
      throw new customError(
        401,
        "You must provide either a valid discount amount or a discount percentage."
      );
    }
    return value;
  } catch (error) {
    throw new customError(401, "discount validation failed " + error);
  }
};
