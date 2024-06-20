import fs from "fs";
import { v2 as cloudinary } from "cloudinary";

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if(!localFilePath) return null;
        // Upload file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        });
        //File uploaded successfully
        console.log("File is uploaded on Cloudinary", response.url);
        return response;
    }
    catch (error) {
        console.error(error);
        fs.unlinkSync(localFilePath); //remove the locally saved temp file
        return null;
    }
}

export {uploadOnCloudinary};
