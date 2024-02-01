const cloudinary = require("cloudinary").v2;
const fs = require("fs");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localfilepath) => {
  try {
    if (!localfilepath) return null;
    // upload file on cloudinary
    const response = await cloudinary.uploader.upload(localfilepath, {
      resource_type: "auto",
    });
    // file has been successfully uploaded
    console.log("file has been successfully uploaded ", response);
    fs.unlinkSync(localfilepath);

    return response;
  } catch (error) {
    fs.unlinkSync(localfilepath); // remove the locally uploaded file as the upload operatin got failed
    return null;
  }
};

module.exports = uploadOnCloudinary;
