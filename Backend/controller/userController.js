const User = require("../models/userModel");
const generateToken = require("../config/generateToken");
const ApiResponse = require("../utils/apiResponse");
const ApiError = require("../utils/apiError");
const asyncHandler = require("../utils/asyncHandler.js");

// Get all users
const allUsers = asyncHandler(async (req, res, next) => {
  const { search } = req.query;
  const keyword = search ? {
    $or: [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } }
    ]
  } : {};

  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } }).select('-password');
  res.status(200).json(new ApiResponse(200, "Users fetched successfully!", users, true));
});

// Register a new user
const registerUser = asyncHandler(async (req, res, next) => {
  const { name, email, password, pic } = req.body;

  if (!name || !email || !password) {
    throw new ApiError(400, "All fields are required");
  }

  let userExists = await User.findOne({ email });

  if (userExists) {
    throw  new ApiError(400, "User already exists");
  }

  const user = await User.create({
    name,
    email,
    password,
    pic,
  });

  if (user) {
    const responseData = {
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      pic: user.pic,
      token: generateToken(user._id),
    };
    res.status(201).json(new ApiResponse(201, "User Created", responseData, true));
  } else {
    return new ApiError(500, "Something went wrong");
  }
});

// Authenticate user
const authUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user || !(await user.matchPassword(password))) {
    throw new ApiError(401, "Email or password incorrect");
  }

  const responseData = {
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
    pic: user.pic,
    token: generateToken(user._id),
  };
  res.status(200).json(new ApiResponse(200, "User data", responseData, true));
});

module.exports = { registerUser, authUser, allUsers };
