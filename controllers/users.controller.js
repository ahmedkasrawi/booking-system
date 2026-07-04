const { User } = require("../models/User");
const asyncWrapper = require("../middlewares/asyncWrapper");

const appError = require("../utils/appError");
const { generateToken } = require("../utils/authUtil");

const getAllUsers = asyncWrapper(async (req, res) => {
  const filter = {}; // filter by role
  if (req.query.role) filter.role = req.query.role;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const [users, totalUsers] = await Promise.all([
    User.find(filter)
      .limit(limit)
      .skip(skip),
    User.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(totalUsers / limit);
  res.status(200).json({
    status: "success",
    results: users.length,
    pagination: {
      totalUsers,
      totalPages,
      currentPage: page,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
    data: { users },
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
  registerUser,
  loginUser,
};
