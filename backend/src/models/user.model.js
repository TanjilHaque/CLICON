const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { customError } = require("../uitils/customError");
const { Schema, Types } = mongoose;
const jwt = require("jsonwebtoken");
const { func } = require("joi");
require("dotenv").config();

const userSchema = new Schema({
  firstName: {
    type: String,
    trim: true,
    required: true,
  },
  lastName: {
    type: String,
    trim: true,
  },
  companyName: {
    type: String,
    trim: true,
  },
  credential: {
    type: String,
    trim: true,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    trim: true,
    required: true,
  },
  image: {
    type: String,
    trim: true,
  },
  address: {
    type: String,
    trim: true,
  },
  isUserVerified: {
    type: Boolean,
    default: false,
  },
  role: {
    type: mongoose.Types.ObjectId,
    ref: "Role",
  },
  permission: {
    type: mongoose.Types.ObjectId,
    ref: "Permission",
  },
  region: {
    type: String,
    trim: true,
  },
  district: {
    type: String,
    trim: true,
  },
  city: {
    type: String,
    trim: true,
  },
  thana: {
    type: String,
    trim: true,
  },
  zipCode: {
    type: Number,
  },
  country: {
    type: String,
    trim: true,
    default: "Bangladesh",
  },
  dateOfBirth: {
    type: Date,
  },
  gender: {
    type: String,
    enum: ["male", "female", "custom"],
  },
  lastLogin: {
    type: Date,
  },
  lastLogout: {
    type: Date,
  },
  cart: [
    {
      type: Types.ObjectId,
      ref: "Product",
    },
  ],
  wishList: [
    {
      type: Types.ObjectId,
      ref: "Product",
    },
  ],
  newsLetterSubscribe: Boolean,
  resetPasswordOtp: Number,
  resetPasswordExpireTime: Date,
  twoFactorEnabled: Boolean,
  isBlocked: Boolean,
  isActive: Boolean,
  refreshToken: {
    type: String,
    trim: true,
  },
});

//schema middleware
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const saltPassword = await bcrypt.hash(this.password, 10);
    this.password = saltPassword;
  }
  next();
});

//check if the user already exists
userSchema.pre("save", async function (next) {
  const findUser = await this.constructor.findOne({ email: this.email });
  if (findUser && findUser._id.toString() !== this._id.toString()) {
    throw new customError(400, "user already exists, try another email");
  }
  next();
});

//generate accessToken method
userSchema.methods.generateAccessToken = function () {
  const accessToken = jwt.sign(
    {
      userId: this._id,
      email: this.email,
      role: this.role,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRE,
    }
  );
  return accessToken;
};

//generate refreshToken method
userSchema.methods.generateRefreshToken = function () {
  const refreshToken = jwt.sign(
    {
      userId: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRE,
    }
  );
  return refreshToken;
};

//verify access token method
userSchema.methods.verifyAccessToken = function (token) {
  return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
};

//verify refresh token method
userSchema.methods.verifyRefreshToken = function (token) {
  return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
};

module.exports = mongoose.model("User", userSchema);
