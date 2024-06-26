import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
/*
  //get user data from frontend
  //validation
  //check if user already exists
  //check for images, avatar
  //if available upload to cloudinary
  //create user object - create entry in db
  //remove password and refresh token field from response
  //check for user creation 
  //return response */

const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, username, password } = req.body;

  if (fullName === "" || email === "" || username === "" || password === "") {
    throw new ApiError(400, "All fields are required");
  } //check validation for emails as well later

  //check if user already exists
  const existedUser = await User.findOne({
    $or: [{ email }, { username }],
  });
  if (existedUser) {
    throw new ApiError(409, "User with email or username already exists");
  }
  const avatarLocalPath = req.files?.avatar[0]?.path;
  //const coverImageLocalPath = req.files?.coverImage[0]?.path;

  let coverImageLocalPath;
  if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar is required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if(!avatar) {
    throw new ApiError(500, "Failed to upload avatar");
  }

  const user =  await User.create({
    fullName,
    email,
    username: username.toLowerCase(),
    password,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
  }); //create user object - create entry in db

  const createdUser = await User.findById(user._id).select("-password -refreshToken");
  if(!createdUser) {  
    throw new ApiError(500, "Failed to create user");
  }

  return res.status(201).json(
    new ApiResponse(200, createdUser, "User registered successfully"));

});

export { registerUser };
