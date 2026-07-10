const { User } = require("../models/User");
const asyncWrapper = require("../middlewares/asyncWrapper");

const appError = require("../utils/appError");
const { generateToken } = require("../utils/authUtil");
const getData = require("../utils/getData");

const getAllUsers = asyncWrapper(async (req, res) => {
  const filter = {}; // filter by role
  if (req.query.role) filter.role = req.query.role;
  const [data, pagination] = await getData(req, filter, User);
  res.status(200).json({
    status: "success",
    results: data.length,
    pagination: pagination,
    data: { users: data },
  });
});
const getMe = asyncWrapper(async (req, res) => {
  const data = await User.findById(req.user.id)
  res.status(200).json({
    status: "success",
    data: { user: data },
  });
});

const registerUser = asyncWrapper(async (req, res, next) => {
  const { name, email, password, role, specialization, bio } = req.body;

  if (!name || !email || !password) {
    return next(new appError("Please provide name, email and password", 400));
  }
  if (role === "admin") {
    return next(new appError("Not allowed to create admin account here", 400));
  }
  const validateEmail = await User.findOne({ email });
  if (validateEmail) {
    return next(new appError("Email already exists", 400));
  }

  const newUser = await User.create({
    name,
    email,
    password,
    role: role || "user",
    specialization: role === "provider" ? specialization : undefined,
    bio: role === "provider" ? bio : undefined,
  });

  const token = generateToken({
    id: newUser._id,
    email: newUser.email,
    role: newUser.role,
  });

  res.status(201).json({ status: "success", data: { user: newUser }, token });
});

const loginUser = asyncWrapper(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    const err = new appError("Please enter email and password", 400);
    return next(err);
  }

  const user = await User.findOne({ email: email.toLowerCase() }).select(
    "+password",
  );

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new appError("Invalid email or password", 401));
  }

  const token = generateToken({
    id: user._id,
    email: user.email,
    role: user.role,
  });

  res.status(200).json({ status: "success", data: { user }, token });
});

module.exports = {
  getAllUsers,
  getMe,
  registerUser,
  loginUser,
};
