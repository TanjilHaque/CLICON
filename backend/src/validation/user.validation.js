const Joi = require("joi");
const { customError } = require("../uitils/customError");

//regex variables
const passwordRegex =
  /^(?=.{8,}$)(?=.*\d|.*\W)(?!.*[.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;

// implementing joi for registration
const registrationSchema = Joi.object({
  firstName: Joi.string().trim().empty("").required().messages({
    "string.empty": "Name is required.",
    "any.required": "Name is a required field.",
  }),
  credential: Joi.string().trim().empty("").required().messages({
    "string.empty": "Email or phone number is required.",
    "any.required": "Email or phone number is required.",
  }),
  password: Joi.string()
    .trim()
    .empty("")
    .required()
    .pattern(new RegExp(passwordRegex))
    .messages({
      "string.empty": "Password is required.",
      "any.required": "Password is a required field.",
      "string.pattern.base":
        "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, and at least one number or special character, and cannot start with a period or newline.",
    }),
}).options({
  abortEarly: true,
  allowUnknown: true,
});

//implementing joi for login
const loginSchema = Joi.object({
  credential: Joi.string().trim().empty("").required().messages({
    "string.empty": "Email or phone number is required.",
    "any.required": "Email or phone number is required.",
  }),
  password: Joi.string()
    .trim()
    .empty("")
    .required()
    .pattern(new RegExp(passwordRegex))
    .messages({
      "string.empty": "Password is required.",
      "any.required": "Password is a required field.",
      "string.pattern.base":
        "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, and at least one number or special character, and cannot start with a period or newline.",
    }),
}).options({
  abortEarly: true,
  allowUnknown: true,
});

// user validation function for registration
exports.validateRegistration = async (req) => {
  try {
    const value = await registrationSchema.validateAsync(req.body);
    return value;
  } catch (error) {
    console.log("error from registerUser,", error);
    throw new customError(400, "User validation registration failed,", error);
  }
};

//user validation function for login
exports.validateLogin = async (req) => {
  try {
    const value = await loginSchema.validateAsync(req.body);
    return value;
  } catch (error) {
    console.log("error from loginUser, ", error);
    throw new customError(400, "User validation login failed, ", error);
  }
};
