const mongoose = require("mongoose");
const { Schema, Types } = mongoose;
const slugify = require("slugify");
const { customError } = require("../uitils/customError");

// brand schema
const brandSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
    },
    image: {},
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// generate slug before saving
brandSchema.pre("save", async function (next) {
  if (this.isModified("name")) {
    this.slug = slugify(this.name, {
      replacement: "-",
      strict: true,
      lower: true,
    });
  }
  next();
});

// check if the slug already exists
brandSchema.pre("save", async function (next) {
  const existingBrand = await this.constructor.findOne({ slug: this.slug });
  if (existingBrand && existingBrand._id.toString() !== this._id.toString()) {
    throw new customError(401, "brand alreayd exists, try another name");
  }
  next();
});

module.exports = mongoose.models.Brand || mongoose.model("Brand", brandSchema);
