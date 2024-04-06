const User = require("../Models/UserModel");
const asyncHandler = require("express-async-handler");
const generateToken = require("../Config/GenerateToken");
const hashPassword = require("../Config/HashPassword");
// const bcrypt = require("bcrypt");
var bcrypt = require('bcryptjs');

const registerUserController = asyncHandler(async (req, res) => {
  const { name, email, password, picture } = req.body;

  if (name == "") {
    return res.status(201).send({
      success: false,
      message: "Name is required",
    });
  } else if (email == "") {
    return res.status(201).send({
      success: false,
      message: "Email is required",
    });
  } else if (password == "") {
    return res.status(201).send({
      success: false,
      message: "Password is required",
    });
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    return res.status(201).send({
      success: false,
      message: "User already exists",
    });
  }

  const hashedPassword = await hashPassword(password);

  const newUser = new User({
    name,
    email,
    password: hashedPassword,
    profilePic: picture,
  });

  await newUser.save();

  res.status(200).send({
    success: true,
    message: "User registered successfully",
    data: newUser,
    token: generateToken(newUser._id),
  });
});

const loginUserController = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (email == "") {
    return res.status(201).send({
      success: false,
      message: "Email is required",
    });
  } else if (password == "") {
    return res.status(201).send({
      success: false,
      message: "Password is required",
    });
  }

  const user = await User.findOne({ email: email });

  if (!user) {
    return res.status(201).send({
      success: false,
      message: "User does not exist! Please register first",
    });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(201).send({
      success: false,
      message: "Password is incorrect",
    });
  }

  res.status(200).send({
    success: true,
    message: "User logged in successfully",
    data: user,
    token: generateToken(user._id),
  });
});

const getUserController = asyncHandler(async (req, res) => {
  const keywords = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const users = await User.find(keywords).find({ _id: { $ne: req.user._id } });

  res.send({
    success: true,
    message: "Users retrieved successfully",
    data: users,
  });
});

module.exports = {
  registerUserController,
  loginUserController,
  getUserController,
};
