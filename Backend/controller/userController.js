const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const generateToken = require("../config/generateToken");


//api/user?search=jnxjka
const allusers = asyncHandler(async(req, res) => {
  const keyword = req.query.search ? {
    $or : [
      {name: {$regex: req.query.search, $options: '1'}},
      {email: {$regex: req.query.search, $options: '1'}}
    ]
  } : {}
  
  const users = await User.find(keyword).find({_id: {$ne : req.user.id}})

  
  res.send(users)
})




const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, pic } = req.body;


  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please Enter all the Feilds");
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    return res.status(400).json({
      message: 'Email already exist' // <-- I want to pass message here
  })
  }

  const user = await User.create({
    name,
    email,
    password,
    pic,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("User not found");
  }
});


const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    return res.status(400).json({
      message: 'Email or password incorrect' // <-- I want to pass message here
  })
  }
});


module.exports = { registerUser, authUser, allusers };