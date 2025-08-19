const Joi = require("joi");
const { customError } = require("../uitils/customError");

//regex variables
const passwordRegex =
  /^(?=.{8,}$)(?=.*\d|.*\W)(?!.*[.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;

// implementing joi
const userSchema = Joi.object({
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

// user validation function
exports.validateUser = async (req) => {
  try {
    const value = await userSchema.validateAsync(req.body);
    return value;
  } catch (error) {
    console.log("error from validateUser,", error);
    throw new customError(400, "User validation failed,", error);
  }
};
