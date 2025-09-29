const { customError } = require("../uitils/customError");
const fs = require("fs");

require("dotenv").config();
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// upload cloudinary file
exports.uploadCloudinaryFile = async (filePath) => {
  try {
    if (!filePath || !fs.existsSync(filePath)) {
      throw new customError(401, "file path doesn't exist");
    }
    const image = await cloudinary.uploader.upload(filePath, {
      resource_type: "image",
      quality: "auto",
    });
    console.log(image);
    if (image) {
      fs.unlinkSync(filePath);
      return { publicID: image.public_id, url: image.secure_url };
    }
  } catch (error) {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    console.log("Error from cloudinary file upload", error);
    throw new customError(
      500,
      "Error from cloudinary file upload" + error.message
    );
  }
};

// delete cloudinary file
exports.deleteCloudinaryFile = async (path_id) => {
  try {
    const response = await cloudinary.uploader.destroy(path_id, {
      resource_type: "image",
      quality: "auto",
    });
    return response;
  } catch (error) {
    console.log("error from deleting cloudinary file", error);
    throw new customError(
      401,
      "error from deleting cloudinary file",
      error.message
    );
  }
};
