const { User } = require("../models/User");
const asyncWrapper = require("../middlewares/asyncWrapper");

const appError = require("../utils/appError");
const { generateToken } = require("../utils/authUtil");
const getData = require("../utils/getData");


const getMe = asyncWrapper(async (req, res, next) => {
  const data = await User.findById(req.user.id);
  if (!data) {
    return next(new appError("User not found", 404));
  }
  res.status(200).json({
    status: "success",
    data: { user: data },
  });
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
  if (user.status === "blocked") {
    return next(
      new appError("Your account has been blocked by the admin", 403),
    );
  }
  const token = generateToken({
    id: user._id,
    email: user.email,
    role: user.role,
  });

  res.status(200).json({ status: "success", data: { user }, token });
});

const registerUser = asyncWrapper(async (req, res, next) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return next(new appError("Please provide name, email and password", 400));
  }
  const validateEmail = await User.findOne({ email });
  if (validateEmail) {
    return next(new appError("Email already exists", 400));
  }

  const newUser = await User.create({
    name,
    email,
    password,
  });

  const token = generateToken({
    id: newUser._id,
    email: newUser.email,
    role: newUser.role,
  });

  res.status(201).json({ status: "success", data: { user: newUser }, token });
});

const userToProvider = asyncWrapper(async (req, res, next) => {
  const { specialization, bio } = req.body;
  if (!specialization || !bio) {
    return next(new appError("Please provide specialization and bio", 400));
  }
  const user = await User.findById(req.user.id);

  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      specialization,
      bio,
      role: "provider",
      status: "pending",
    },
    { new: true },
  );
  const token = generateToken({
    id: user._id,
    email: user.email,
    role: "provider",
  });

  res
    .status(200)
    .json({ status: "success", data: { user: updatedUser }, token });
});



module.exports = {
  getMe,
  registerUser,
  loginUser,
  userToProvider,
};
