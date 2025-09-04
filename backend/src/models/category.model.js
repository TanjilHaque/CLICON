const mongoose = require("mongoose");
const { Schema, Types } = mongoose;
const slugify = require("slugify");
const { customError } = require("../uitils/customError");

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    subCategory: [
      {
        type: Types.ObjectId,
        ref: "SubCategory",
      },
    ],
    discount: {
      type: Types.ObjectId,
      ref: "Discount",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

//slugify the name before save
categorySchema.pre("save", async function (next) {
  if (this.isNew || this.isModified("name")) {
    const slug = await slugify(this.name, {
      replacement: "-", // replace spaces with replacement character, defaults to `-`
      lower: true, // convert to lower case, defaults to `false`
      strict: true, // strip special characters except replacement, defaults to `false`
    });
    this.slug = slug;
  }
  next();
});

//checks if any duplicate category exists before save
categorySchema.pre("save", async function (next) {
  const findCategory = await this.constructor.findOne({ slug: this.slug });
  if (findCategory && findCategory._id.toString() !== this._id.toString()) {
    throw new customError(401, "Category already exists, try another name!");
  }
  next();
});

module.exports = mongoose.model("Category", categorySchema);
