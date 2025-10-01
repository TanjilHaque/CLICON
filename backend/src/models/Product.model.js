const mongoose = require("mongoose");
const { Schema, Types } = mongoose;
const slugify = require("slugify");
const { customError } = require("../uitils/customError");

// review schema is created here as it is mostly related with product.
const reviewSchema = new Schema(
  {
    rating: {
      type: Number,
      required: true,
      min: 0,
      max: 5,
    },
    reviewer: {
      type: Types.ObjectId,
      ref: "User",
    },
    comment: {
      type: String,
      trim: true,
      default: "",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    product: {
      type: Types.ObjectId,
      ref: "Product",
      required: true,
    },
    image: [{}],
  },
  {
    timestamps: true,
  }
);

// product schema
const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
    },
    description: {
      type: String,
      default: "",
    },
    image: [],
    rating: {
      type: Number,
      max: 5,
      default: 0,
    },
    wholeSalePrice: {
      type: Number,
    },
    retailPrice: {
      type: Number,
    },
    category: {
      type: Types.ObjectId,
      ref: "Category",
      required: true,
    },
    subCategory: {
      type: Types.ObjectId,
      ref: "SubCategory",
      default: null,
    },
    variant: [
      {
        type: Types.ObjectId,
        ref: "Variant",
        default: null,
      },
    ],
    stock: {
      type: Number,
    },
    tags: [
      {
        type: String,
      },
    ],
    brand: {
      type: Types.ObjectId,
      ref: "Brand",
      default: null,
    },
    sku: {
      type: String,
      trim: true,
    },
    barCode: {
      type: String,
      trim: true,
    },
    qrCode: {
      type: String,
      trim: true,
    },
    warrantyInformation: {
      type: String,
      trim: true,
    },
    shippingInformation: {
      type: String,
      trim: true,
    },
    availabilityStatus: {
      type: Boolean,
      trim: true,
    },
    reviews: [reviewSchema],
    returnPolicy: {
      type: String,
      default: "",
    },
    minimumOrderQuantity: {
      type: Number,
      min: 1,
      default: 1,
    },
    manufactureCountry: {
      type: String,
      default: "",
    },
    size: [
      {
        type: String,
        default: "N/A",
      },
    ],
    color: [
      {
        type: String,
      },
    ],
    groupUnit: {
      type: String,
    },
    groupUnitQuantity: {
      type: Number,
      default: 1,
    },
    unit: {
      type: String,
      enum: ["pcs", "kg", "gram", "custom"],
      default: "pcs",
    },
    variantType: {
      type: String,
      enum: ["singleVariant", "multiVariant"],
      default: "singleVariant",
    },
    warehouseLocation: [
      {
        type: Types.ObjectId,
        ref: "Warehouse",
      },
    ],
    alertQuantity: {
      type: Number,
      min: 4,
      default: 4,
    },
    stockAlert: {
      type: Boolean,
      default: false,
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

// saving the slug from the name middleware
productSchema.pre("save", async function (next) {
  if (this.isModified("name")) {
    this.slug = slugify(this.name, {
      replacement: "-",
      lower: true,
      strict: true,
    });
  }
  next();
});

// preventing duplicate slug middleware
productSchema.pre("save", async function (next) {
  const existingProduct = await this.constructor.findOne({ slug: this.slug });
  if (
    existingProduct &&
    existingProduct._id.toString() !== this._id.toString()
  ) {
    throw new customError(
      401,
      "Product with this name already exists, try another name!"
    );
  }
  next();
});

// update slug on name change
productSchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate();
  if (update.name) {
    update.slug = slugify(update.name, {
      replacement: "-",
      lower: true,
      strict: true,
    });
  }
  this.setUpdate(update);

  // check exisiting slug again...
  const existingProduct = await this.constructor.findOne({ slug: this.slug });
  if (
    existingProduct &&
    existingProduct._id.toString() !== this._id.toString()
  ) {
    throw new customError(
      401,
      "Product with this name already exists, try another name!"
    );
  }
  next();
});
