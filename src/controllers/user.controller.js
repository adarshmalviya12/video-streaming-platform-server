const { asyncHandler } = require("../utils/asyncHandler");
const { ApiError } = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const User = require("../models/user.model");
const uploadOnCloudinary = require("../utils/cloudinary");

const registerUser = asyncHandler(async (req, res) => {
  // get user details from frontend
  const { fullName, email, username, password } = req.body;

  // validation check  - not empty
  if (fullName === "") {
    throw new ApiError(400, " fullname is required");
  }
  if (email === "") {
    throw new ApiError(400, " email is required");
  }
  if (password === "") {
    throw new ApiError(400, " password is required");
  }
  if (username === "") {
    throw new ApiError(400, " username is required");
  }

  // check if user exist already
  const existingUser = await User.findOne({ $or: [{ email }, { username }] });

  if (existingUser)
    throw new ApiError(409, "User with email or username already exists");

  // check for images avatar
  const avatarLocalPath = req.files?.avatar[0]?.path;

  let coverImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage[0].length > 0
  ) {
    coverImageLocalPath = req.files?.coverImage[0]?.path;
  }
  if (!avatarLocalPath) throw new ApiError(400, "Avatar file is required");

  // upload images on cloudinary
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) throw new ApiError(400, "Avatar file is required");

  // create user object
  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });

  // remove password and refresh  token
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  // check if user created
  if (!createdUser)
    throw new ApiError(500, "something went wrong while registring user");

  // return response
  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User created successfully"));
});

module.exports = { registerUser };

// to validates fields
// if (
//     [fullName, email, username, password].some((field) => field?.trim() === "")
// ) {
//     throw new ApiError(400, "All fields are required")
// }
