const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { Schema, Types } = mongoose;

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
  email: {
    type: String,
    trim: true,
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
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  isPhoneVerified: {
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

module.exports = mongoose.model("User", userSchema);
