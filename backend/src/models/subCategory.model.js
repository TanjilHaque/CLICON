const { required, ref, boolean } = require("joi");
const mongoose = require("mongoose");
const { Schema, Types } = mongoose;
const slugify = require("slugify");

// sub-category schema
const subCategorySchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    category: {
      type: Types.ObjectId,
      ref: "Category",
      required: true,
    },
    discount: {
      type: Types.ObjectId,
      ref: "Discount",
      default: null,
    },
    slug: {
      type: String,
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

// generate slug before saving
subCategorySchema.pre("save", async function (next) {
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
subCategorySchema.pre("save", async function (next) {
  const existingSubCategory = await this.constructor.findOne({
    slug: this.slug,
  });
  if (
    existingSubCategory &&
    existingSubCategory._id.toString() !== this._id.toString()
  ) {
    throw new Error("Sub-category already exists, try another name!");
  }
  next();
});

module.exports =
  mongoose.models.SubCategory ||
  mongoose.model("SubCategory", subCategorySchema);
