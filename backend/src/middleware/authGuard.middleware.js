const { customError } = require("../uitils/customError");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

exports.authGuard = async (req, _, next) => {
  const token = req.headers.authorization || req.body.token;
  if (token) {
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    if (!decodedToken) {
      throw new customError(401, "invalid token!");
    }
    const findUser = await User.findById(decodedToken.userId);
    if (!findUser) {
      throw new customError(401, "User not found!");
    } else {
      req.user = findUser;
      next();
    }
  } else {
    throw new customError(401, "Token not found!");
  }
};
